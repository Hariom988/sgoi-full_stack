import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProductBySlug } from "@/lib/public/productService";
import ProductBreadcrumb from "@/components/(productsPage)/productBreadcrumb";
import ProductGallery from "@/components/(productDetailPage)/productGallery";
import ProductBuyBox from "@/components/(productDetailPage)/productBuyBox";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found | SGOI Pvt. Ltd." };
  }

  return {
    title: `${product.name} | SGOI Pvt. Ltd.`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getPublicProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <ProductBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={product.images} productName={product.name} />
        <ProductBuyBox product={product} />
      </div>
    </main>
  );
}
