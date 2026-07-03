// app/admin/(protected)/products/[id]/edit/page.tsx

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Product } from "@/lib/admin/productTypes";
import ProductForm from "@/components/(admin)/(formSection)/productForm";
import AdminBreadcrumb from "@/components/(admin)/(shared)/adminBreadcrumb";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

// ─── Data fetching ───────────────────────────────────────────────────────────
// Same pattern as products/[id]/view/page.tsx — including forwarding the
// session cookie. A server-side fetch() to our own /api/admin/* routes does
// NOT carry it automatically, and without it the middleware redirects to
// /admin/login, which breaks the JSON parse below.

async function getProduct(id: string): Promise<Product | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const cookie = headersList.get("cookie") ?? "";

    const res = await fetch(`${protocol}://${host}/api/admin/products/${id}`, {
      cache: "no-store",
      headers: { cookie },
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.error("[EditProductPage] Failed to fetch product:", res.status);
      return null;
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.error("[EditProductPage] Unexpected response type:", contentType);
      return null;
    }

    const data = await res.json();
    return data.product ?? null;
  } catch (err) {
    console.error("[EditProductPage] Error fetching product:", err);
    return null;
  }
}

// ─── Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product ? `${product.name} — Edit` : "Product Not Found",
  };
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6 p-6">
      <AdminBreadcrumb
        items={[
          { label: "Products", href: "/admin/products" },
          { label: product.name, href: `/admin/products/${id}/view` },
          { label: "Edit" },
        ]}
      />

      <ProductForm mode="edit" productId={id} initialData={product} />
    </div>
  );
}
