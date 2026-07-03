import Link from "next/link";
import { PackageX } from "lucide-react";

export default function ProductNotFound() {
  return (
    <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex flex-col items-center text-center gap-4 max-w-md mx-auto">
        <PackageX size={40} className="text-gray-300" aria-hidden="true" />
        <div>
          <h1 className="text-lg font-bold text-gray-900 mb-1">
            Product not found
          </h1>
          <p className="text-sm text-gray-500">
            This product may have been removed or is no longer available.
          </p>
        </div>
        <Link
          href="/products"
          className="px-5 py-2.5 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors duration-150"
        >
          Browse all products
        </Link>
      </div>
    </main>
  );
}
