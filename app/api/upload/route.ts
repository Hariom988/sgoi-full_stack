import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
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
    url: data.result.variants[0] ?? `${data.result.id}/public`,
  };
}


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