import Link from "next/link";
import { PackageOpen, Plus } from "lucide-react";

interface ProductEmptyStateProps {
  isFiltered: boolean; // true = search/filter returned nothing; false = no products at all
}

export default function ProductEmptyState({
  isFiltered,
}: ProductEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
        <PackageOpen size={28} className="text-gray-400" aria-hidden="true" />
      </div>

      {isFiltered ? (
        <>
          <h2 className="text-base font-bold text-gray-900 mb-1">
            No products found
          </h2>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            No products match your current search or filter. Try a different
            name or category.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-base font-bold text-gray-900 mb-1">
            No products yet
          </h2>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-6">
            Add your first product to get started. It will appear here once
            created.
          </p>
          <Link
            href="/admin/products/new"
            className="
              inline-flex items-center gap-2
              bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
              text-white text-sm font-semibold
              px-5 py-2.5 rounded-lg
              transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
            "
          >
            <Plus size={16} />
            Add Product
          </Link>
        </>
      )}
    </div>
  );
}
