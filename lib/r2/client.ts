import { S3Client } from "@aws-sdk/client-s3";

// ─── Cloudflare R2 client (S3-compatible) ───────────────────────────────────
// Shared across every route that reads/writes R2 objects, so account/endpoint
// config lives in exactly one place.

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? "sgoi-products";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

export function isR2Configured(): boolean {
  return Boolean(
    R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_PUBLIC_URL,
  );
}

let cachedClient: S3Client | null = null;

// Lazily constructed so importing this module never throws when env vars
// aren't set — routes check isR2Configured() first and return a clean 503.
export function getR2Client(): S3Client {
  if (cachedClient) return cachedClient;

  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    throw new Error("R2 credentials are not configured.");
  }

  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });

  return cachedClient;
}

/**
 * Given a public R2 URL previously handed to the client
 * (e.g. `${R2_PUBLIC_URL}/products/abc.jpg`), derive the object key
 * (`products/abc.jpg`) needed to delete it.
 * Returns null if the URL doesn't belong to this bucket's public domain.
 */
export function keyFromPublicUrl(url: string): string | null {
  if (!R2_PUBLIC_URL) return null;
  const base = R2_PUBLIC_URL.endsWith("/") ? R2_PUBLIC_URL : `${R2_PUBLIC_URL}/`;
  if (!url.startsWith(base)) return null;
  return url.slice(base.length);
}