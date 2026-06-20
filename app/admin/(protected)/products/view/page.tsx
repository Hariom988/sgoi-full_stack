import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/admin/mockProducts";
import type { Product } from "@/lib/admin/productTypes";
import ProductViewDetail from "@/components/(admin)/(productSection)/productViewDetail";

interface ViewProductPageProps {
  params: Promise<{ id: string }>;
}

// TODO: replace with real DB/API fetch
async function getProduct(id: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p._id === id) ?? null;
}

export async function generateMetadata({
  params,
}: ViewProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product ? `${product.name} — View` : "Product Not Found",
  };
}

export default async function ViewProductPage({
  params,
}: ViewProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return <ProductViewDetail product={product} />;
}
