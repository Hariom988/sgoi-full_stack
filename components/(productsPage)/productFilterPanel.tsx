"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import type { CategoryCount } from "@/lib/public/productService";
import { buildProductsHref, type ProductsQuery } from "@/lib/public/buildProductsHref";

const VISIBLE_COUNT = 5;

interface ProductFilterPanelProps {
  categories: CategoryCount[];
  selected: string[]; // currently active category values
  currentQuery: ProductsQuery;
}

export default function ProductFilterPanel({
  categories,
  selected,
  currentQuery,
}: ProductFilterPanelProps) {
  const [showAll, setShowAll] = useState(false);
  const router = useRouter();

  const visibleCategories = showAll
    ? categories
    : categories.slice(0, VISIBLE_COUNT);
  const hasMore = categories.length > VISIBLE_COUNT;
  const hasActiveFilters = selected.length > 0;

  function applyCategories(next: string[]) {
    router.push(
      buildProductsHref(currentQuery, {
        category: next.length > 0 ? next.join(",") : undefined,
        page: undefined,
      }),
    );
  }

  function toggleCategory(value: string) {
    const next = selected.includes(value)
      ? selected.filter((c) => c !== value)
      : [...selected, value];
    applyCategories(next);
  }

  function clearAll() {
    applyCategories([]);
  }

  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500">
          Filter By
        </h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-semibold text-gray-900 mb-3">
          Product Type
        </legend>
        <ul className="flex flex-col gap-2.5" role="list">
          {visibleCategories.map((cat) => (
            <li key={cat.value}>
              <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(cat.value)}
                  onChange={() => toggleCategory(cat.value)}
                  className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                {cat.label}
              </label>
            </li>
          ))}
        </ul>
      </fieldset>

      {hasMore && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-3 flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
        >
          {showAll ? "Show Less" : "Show More"}
          <ChevronDown
            size={14}
            className={`transition-transform duration-150 ${showAll ? "rotate-180" : ""}`}
          />
        </button>
      )}
    </div>
  );
}
