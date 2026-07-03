import type { Metadata } from "next";
import {
  getPublicProducts,
  getCategoryCounts,
  PRODUCTS_PER_PAGE,
  type ProductSort,
} from "@/lib/public/productService";
import type { ProductsQuery } from "@/lib/public/buildProductsHref";
import ProductsPageHeader from "@/components/(productsPage)/productsPageHeader";
import CategorySidebar from "@/components/(productsPage)/categorySidebar";
import ProductFilterPanel from "@/components/(productsPage)/productFilterPanel";
import ProductToolbar from "@/components/(productsPage)/productToolbar";
import ProductGrid from "@/components/(productsPage)/productGrid";
import ProductEmptyState from "@/components/(productsPage)/productEmptyState";
import ProductPagination from "@/components/(productsPage)/productPagination";

export const metadata: Metadata = {
  title: "All Products | SGOI Pvt. Ltd.",
  description:
    "High-quality battery raw materials, components and accessories for every stage of your battery projects.",
};

const VALID_SORTS: ProductSort[] = [
  "featured",
  "price-asc",
  "price-desc",
  "name-asc",
];

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;

  const categories = params.category
    ? params.category
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];
  const sort: ProductSort = VALID_SORTS.includes(params.sort as ProductSort)
    ? (params.sort as ProductSort)
    : "featured";
  const page = Math.max(1, Number(params.page) || 1);

  const [
    { products, total, totalPages },
    { total: categoryTotal, categories: categoryCounts },
  ] = await Promise.all([
    getPublicProducts({
      categories: categories.length > 0 ? categories : undefined,
      search: params.search,
      sort,
      page,
      limit: PRODUCTS_PER_PAGE,
    }),
    getCategoryCounts(),
  ]);

  const currentQuery: ProductsQuery = {
    category: params.category,
    search: params.search,
    sort: params.sort,
  };

  const rangeStart = total === 0 ? 0 : (page - 1) * PRODUCTS_PER_PAGE + 1;
  const rangeEnd = Math.min(page * PRODUCTS_PER_PAGE, total);

  return (
    <main className="max-w-screen-xl  px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <ProductsPageHeader />

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <CategorySidebar
            total={categoryTotal}
            categories={categoryCounts}
            activeCategory={categories.length === 1 ? categories[0] : null}
            currentQuery={currentQuery}
          />
          <ProductFilterPanel
            categories={categoryCounts}
            selected={categories}
            currentQuery={currentQuery}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <ProductToolbar
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
            total={total}
            sort={sort}
            currentQuery={currentQuery}
          />

          {products.length > 0 ? (
            <>
              <ProductGrid products={products} />
              <ProductPagination
                page={page}
                totalPages={totalPages}
                currentQuery={currentQuery}
              />
            </>
          ) : (
            <ProductEmptyState />
          )}
        </div>
      </div>
    </main>
  );
}
