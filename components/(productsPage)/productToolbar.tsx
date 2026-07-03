"use client";

import { LayoutGrid, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ProductSort } from "@/lib/public/productService";
import { buildProductsHref, type ProductsQuery } from "@/lib/public/buildProductsHref";

const SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
];

interface ProductToolbarProps {
  rangeStart: number;
  rangeEnd: number;
  total: number;
  sort: ProductSort;
  currentQuery: ProductsQuery;
}

export default function ProductToolbar({
  rangeStart,
  rangeEnd,
  total,
  sort,
  currentQuery,
}: ProductToolbarProps) {
  const router = useRouter();

  function handleSortChange(value: string) {
    router.push(
      buildProductsHref(currentQuery, {
        sort: value === "featured" ? undefined : value,
        page: undefined,
      }),
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white px-4 py-3 mb-6">
      <span
        className="flex items-center justify-center h-9 w-9 rounded-md bg-green-50 text-[var(--color-primary)] shrink-0"
        aria-hidden="true"
      >
        <LayoutGrid size={18} strokeWidth={1.75} />
      </span>

      <p className="hidden sm:block text-sm text-gray-500 flex-1 text-center">
        {total > 0
          ? `Showing ${rangeStart}-${rangeEnd} of ${total} results`
          : "No results"}
      </p>

      <div className="relative shrink-0">
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          aria-label="Sort products"
          className="
            appearance-none rounded-md border border-gray-200 bg-white
            pl-3 pr-8 py-2 text-sm font-medium text-gray-700
            hover:border-gray-300 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          "
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              Sort by: {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
}
