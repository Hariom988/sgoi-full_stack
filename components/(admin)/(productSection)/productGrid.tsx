"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { ProductSummary } from "@/lib/admin/productTypes";
import ProductCard from "./productCard";
import ProductEmptyState from "./productEmptyState";
import ProductSearch from "./productSearch";

interface ProductGridProps {
  initialProducts: ProductSummary[];
}

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products, setProducts] = useState<ProductSummary[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryOpen, setCategoryOpen] = useState(false);

  // ── Filter logic ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let result = products;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    return result;
  }, [products, searchQuery, selectedCategory]);

  const isFiltered =
    searchQuery.trim().length > 0 || selectedCategory !== "all";

  // ── Delete handler (passed down to cards) ─────────────────────────────────
  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div>
      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <ProductSearch
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          categoryOpen={categoryOpen}
          onSearchChange={setSearchQuery}
          onCategoryChange={setSelectedCategory}
          onCategoryToggle={() => setCategoryOpen((v) => !v)}
          onCategoryClose={() => setCategoryOpen(false)}
        />
      </div>

      {/* ── Results count ────────────────────────────────────────────────────── */}
      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mb-4">
          Showing {filtered.length} of {products.length} product
          {products.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* ── Grid / Empty state ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <ProductEmptyState isFiltered={isFiltered} />
      ) : (
        <ul
          role="list"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          aria-label="Product list"
        >
          {filtered.map((product) => (
            <li key={product._id}>
              <ProductCard product={product} onDelete={handleDelete} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
