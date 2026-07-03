"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function ProductDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[ProductDetailPage]", error);
  }, [error]);

  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col items-center text-center gap-4 max-w-md mx-auto">
        <AlertTriangle size={36} className="text-red-400" aria-hidden="true" />
        <div>
          <h1 className="text-lg font-bold text-gray-900 mb-1">
            Couldn&apos;t load this product
          </h1>
          <p className="text-sm text-gray-500">
            Something went wrong while fetching this product. Please try
            again.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors duration-150"
          >
            Try again
          </button>
          <Link
            href="/products"
            className="px-5 py-2.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors duration-150"
          >
            Back to products
          </Link>
        </div>
      </div>
    </main>
  );
}
