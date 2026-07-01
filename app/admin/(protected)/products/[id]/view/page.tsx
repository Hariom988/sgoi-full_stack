import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Product } from "@/lib/admin/productTypes";
import ProductViewDetail from "@/components/(admin)/(productSection)/productViewDetail";

interface ViewProductPageProps {
  params: Promise<{ id: string }>;
}

// ─── Data fetching ───────────────────────────────────────────────────────────

async function getProduct(id: string): Promise<Product | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    const res = await fetch(`${protocol}://${host}/api/admin/products/${id}`, {
      cache: "no-store",
    });

    if (res.status === 404) return null;
    if (!res.ok) {
      console.error("[ViewProductPage] Failed to fetch product:", res.status);
      return null;
    }

    const data = await res.json();
    return data.product ?? null;
  } catch (err) {
    console.error("[ViewProductPage] Error fetching product:", err);
    return null;
  }
}

// ─── Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: ViewProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product ? `${product.name} — View` : "Product Not Found",
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function ViewProductPage({
  params,
}: ViewProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return <ProductViewDetail product={product} />;
}
