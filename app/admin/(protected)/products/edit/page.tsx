import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOCK_PRODUCTS } from "@/lib/admin/mockProducts";
import type { Product } from "@/lib/admin/productTypes";
import ProductForm from "@/components/(admin)/(formSection)/productForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

// TODO: replace with real DB/API fetch
async function getProduct(id: string): Promise<Product | null> {
  return MOCK_PRODUCTS.find((p) => p._id === id) ?? null;
}

export async function generateMetadata({
  params,
}: EditProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  return {
    title: product ? `Edit ${product.name}` : "Product Not Found",
  };
}

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
