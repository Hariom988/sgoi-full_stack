import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Product } from "@/lib/admin/productTypes";
import ProductForm from "@/components/(admin)/(formSection)/productForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

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
      console.error("[EditProductPage] Failed to fetch product:", res.status);
      return null;
    }

    const data = await res.json();
    return data.product ?? null;
  } catch (err) {
    console.error("[EditProductPage] Error fetching product:", err);
    return null;
  }
}

// ─── Metadata

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product ? `Edit ${product.name}` : "Product Not Found",
  };
}

// ─── Page

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <ProductForm mode="edit" productId={product._id} initialData={product} />
  );
}
