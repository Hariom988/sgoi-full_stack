import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { MOCK_PRODUCTS } from "@/lib/admin/mockProducts";
import type { ProductSummary } from "@/lib/admin/productTypes";
import ProductGrid from "@/components/(admin)/(productSection)/productGrid";

export const metadata: Metadata = {
  title: "Products",
};

// TODO: replace with real DB/API fetch
async function getProducts(): Promise<ProductSummary[]> {
  // Simulate the shape of a real API response — only summary fields needed for the grid
  return MOCK_PRODUCTS.map((p) => ({
    _id: p._id,
    name: p.name,
    sku: p.sku,
    category: p.category,
    description: p.description,
    price: p.price,
    stockQuantity: p.stockQuantity,
    status: p.status,
    images: p.images,
  }));
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Manage your product inventory
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="
            inline-flex items-center gap-2 shrink-0
            bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
            text-white text-sm font-bold
            px-4 sm:px-5 py-2.5 rounded-lg
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
            whitespace-nowrap
          "
        >
          <Plus size={16} aria-hidden="true" />
          <span className="hidden xs:inline">+ Add Products</span>
          <span className="xs:hidden">Add</span>
        </Link>
      </div>

      {/* Product grid with search/filter toolbar */}
      <ProductGrid initialProducts={products} />
    </div>
  );
}
