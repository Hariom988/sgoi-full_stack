"use client";

import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/admin/productCategories";

interface ProductSearchProps {
  searchQuery: string;
  selectedCategory: string;
  categoryOpen: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCategoryToggle: () => void;
  onCategoryClose: () => void;
}

export default function ProductSearch({
  searchQuery,
  selectedCategory,
  categoryOpen,
  onSearchChange,
  onCategoryChange,
  onCategoryToggle,
  onCategoryClose,
}: ProductSearchProps) {
  const activeCategoryLabel =
    selectedCategory === "all"
      ? "All Categories"
      : (PRODUCT_CATEGORIES.find((c) => c.value === selectedCategory)?.label ??
        "All Categories");

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search by name */}
      <div className="relative flex-1">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Product By Name......"
          className="
            w-full pl-9 pr-4 py-2.5
            border border-gray-200 rounded-lg bg-white
            text-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]
            transition-shadow
          "
          aria-label="Search products by name"
        />
      </div>

      {/* Category dropdown */}
      <div className="relative">
        <button
          onClick={onCategoryToggle}
          className="
            flex items-center gap-2 px-4 py-2.5
            border border-gray-200 rounded-lg bg-white
            text-sm font-medium text-gray-700
            hover:border-gray-300 hover:bg-gray-50
            transition-colors duration-150 whitespace-nowrap
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          "
          aria-haspopup="listbox"
          aria-expanded={categoryOpen}
        >
          {activeCategoryLabel}
          <ChevronDown
            size={15}
            className={`text-gray-400 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {categoryOpen && (
          <>
            {/* Click-outside close */}
            <div
              className="fixed inset-0 z-10"
              onClick={onCategoryClose}
              aria-hidden="true"
            />
            <ul
              role="listbox"
              aria-label="Select category"
              className="
                absolute right-0 top-full mt-1.5 z-20
                w-52 bg-white border border-gray-200 rounded-xl shadow-lg
                py-1 overflow-hidden
              "
            >
              <li>
                <button
                  role="option"
                  aria-selected={selectedCategory === "all"}
                  onClick={() => {
                    onCategoryChange("all");
                    onCategoryClose();
                  }}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm transition-colors
                    ${
                      selectedCategory === "all"
                        ? "text-[var(--color-primary)] font-semibold bg-green-50"
                        : "text-gray-700 hover:bg-gray-50"
                    }
                  `}
                >
                  All Categories
                </button>
              </li>
              {PRODUCT_CATEGORIES.map((cat) => (
                <li key={cat.value}>
                  <button
                    role="option"
                    aria-selected={selectedCategory === cat.value}
                    onClick={() => {
                      onCategoryChange(cat.value);
                      onCategoryClose();
                    }}
                    className={`
                      w-full text-left px-4 py-2.5 text-sm transition-colors
                      ${
                        selectedCategory === cat.value
                          ? "text-[var(--color-primary)] font-semibold bg-green-50"
                          : "text-gray-700 hover:bg-gray-50"
                      }
                    `}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* Filters — visual placeholder */}
      <button
        className="
          flex items-center gap-2 px-4 py-2.5
          border border-gray-200 rounded-lg bg-white
          text-sm font-medium text-gray-700
          hover:border-gray-300 hover:bg-gray-50
          transition-colors duration-150 whitespace-nowrap
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
        "
        aria-label="Open filters"
      >
        <SlidersHorizontal
          size={15}
          className="text-gray-400"
          aria-hidden="true"
        />
        Filters
      </button>
    </div>
  );
}
