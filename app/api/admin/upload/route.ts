import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import {
  getR2Client,
  isR2Configured,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
  keyFromPublicUrl,
} from "@/lib/r2/client";


const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

interface R2UploadResult {
  key: string;
  url: string;
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return file.type.split("/")[1] ?? "bin";
}

async function uploadToR2(file: File): Promise<R2UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `products/${randomUUID()}.${extensionFor(file)}`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    }),
  );

  return { key, url: `${R2_PUBLIC_URL}/${key}` };
}


export async function POST(request: NextRequest) {
  if (!isR2Configured()) {
    return NextResponse.json(
      {
        error:
          "R2 storage is not configured yet. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, " +
          "R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_URL to .env.local.",
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

    const results: R2UploadResult[] = [];
    for (const file of files) {
      results.push(await uploadToR2(file));
    }

    return NextResponse.json({ images: results }, { status: 200 });
  } catch (err) {
    console.error("[POST /api/admin/upload]", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest) {
  if (!isR2Configured()) {
    return NextResponse.json({ error: "R2 storage is not configured yet." }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing image url" }, { status: 400 });
  }

  const key = keyFromPublicUrl(url);
  if (!key) {
    return NextResponse.json(
      { error: "URL does not belong to the configured R2 bucket" },
      { status: 400 },
    );
  }

  try {
    await getR2Client().send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/admin/upload]", err);
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}