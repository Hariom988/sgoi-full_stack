import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { headers } from "next/headers";
import type { ProductSummary } from "@/lib/admin/productTypes";
import ProductGrid from "@/components/(admin)/(productSection)/productGrid";

export const metadata: Metadata = {
  title: "Products",
};

async function getProducts(): Promise<ProductSummary[]> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const cookie = headersList.get("cookie") ?? "";

    const res = await fetch(`${protocol}://${host}/api/admin/products`, {
      cache: "no-store",
      headers: { cookie },
    });

    if (!res.ok) {
      console.error("[ProductsPage] Failed to fetch products:", res.status);
      return [];
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      console.error("[ProductsPage] Unexpected response type:", contentType);
      return [];
    }

    const data = await res.json();
    return data.products ?? [];
  } catch (err) {
    console.error("[ProductsPage] Error fetching products:", err);
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto">
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

      <ProductGrid initialProducts={products} />
    </div>
  );
}
