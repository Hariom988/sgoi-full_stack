import { NextRequest, NextResponse } from "next/server";

// ─── Cloudflare Images upload route ─────────────────────────────────────────
//
// SECURITY: This route runs entirely server-side. The Cloudflare API token is
// read from process.env and NEVER sent to or exposed in the client bundle.
// The client only ever talks to THIS route, never to Cloudflare directly.
//
// SETUP REQUIRED (see chat for full step-by-step):
//   CLOUDFLARE_ACCOUNT_ID            — Cloudflare dashboard → Account ID
//   CLOUDFLARE_API_TOKEN             — API token with Images:Edit permission
//   CLOUDFLARE_IMAGES_ACCOUNT_HASH   — used client-side to build delivery URLs
//
// Until these are set, this route returns a clear 503 instead of crashing,
// so the rest of the app (product form, etc.) can be built and tested now,
// with image upload simply disabled until credentials are added.

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches the UI copy "up to 5MB each"
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

interface CloudflareUploadResult {
  id: string;
  url: string;
}

function getCloudflareConfig() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const accountHash = process.env.CLOUDFLARE_IMAGES_ACCOUNT_HASH;

  if (!accountId || !apiToken || !accountHash) {
    return null;
  }

  return { accountId, apiToken, accountHash };
}

async function uploadToCloudflare(
  file: File,
  config: { accountId: string; apiToken: string },
): Promise<CloudflareUploadResult> {
  const cfFormData = new FormData();
  cfFormData.append("file", file);

  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiToken}`,
      },
      body: cfFormData,
    },
  );

  const data = await res.json();

  if (!res.ok || !data.success) {
    const message =
      data?.errors?.[0]?.message ?? "Cloudflare Images upload failed";
    throw new Error(message);
  }

  return {
    id: data.result.id,
    // "public" is Cloudflare's default variant — created automatically for
    // every account. Custom named variants can be added later in the
    // Cloudflare dashboard (Images → Variants) without changing this code.
    url: data.result.variants[0] ?? `${data.result.id}/public`,
  };
}

// ─── POST /api/admin/upload ─────────────────────────────────────────────────
// Accepts multipart/form-data with one or more files under the "files" field.
// Returns { images: [{ id, url }] } on success.

export async function POST(request: NextRequest) {
  const config = getCloudflareConfig();

  if (!config) {
    return NextResponse.json(
      {
        error:
          "Cloudflare Images is not configured yet. Add CLOUDFLARE_ACCOUNT_ID, " +
          "CLOUDFLARE_API_TOKEN, and CLOUDFLARE_IMAGES_ACCOUNT_HASH to .env.local.",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // ── Validate every file before uploading any of them ───────────────────
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${file.type}. Use PNG, JPG, or WEBP.` },
          { status: 400 },
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `${file.name} exceeds the 5MB limit.` },
          { status: 400 },
        );
      }
    }

    // ── Upload sequentially to keep error attribution simple. Cloudflare's
    // per-account rate limits make parallel batches risky for larger sets;
    // sequential is safer and still fast for typical 1-6 product images. ──
    const results: CloudflareUploadResult[] = [];
    for (const file of files) {
      const result = await uploadToCloudflare(file, config);
      results.push(result);
    }

    return NextResponse.json({ images: results }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ─── DELETE /api/admin/upload?id=xxx ────────────────────────────────────────
// Prepares for future image replacement/deletion (mentioned as a future need).
// Deletes a single image from Cloudflare by its image ID.

export async function DELETE(request: NextRequest) {
  const config = getCloudflareConfig();

  if (!config) {
    return NextResponse.json(
      { error: "Cloudflare Images is not configured yet." },
      { status: 503 },
    );
  }

  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("id");

  if (!imageId) {
    return NextResponse.json({ error: "Missing image id" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/images/v1/${imageId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${config.apiToken}` },
      },
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      const message = data?.errors?.[0]?.message ?? "Failed to delete image";
      throw new Error(message);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/admin/upload]", err);
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}