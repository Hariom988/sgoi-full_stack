import Link from "next/link";
import { PackageSearch } from "lucide-react";

export default function ProductEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-lg border border-gray-200 bg-white">
      <PackageSearch size={40} className="text-gray-300 mb-4" aria-hidden="true" />
      <h2 className="text-base font-bold text-gray-900 mb-1">
        No products found
      </h2>
      <p className="text-sm text-gray-500 max-w-sm mb-5">
        Try a different category or clear your filters to see all products.
      </p>
      <Link
        href="/products"
        className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
      >
        Clear filters
      </Link>
    </div>
  );
}
