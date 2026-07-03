import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingCart } from "lucide-react";
import type { PublicProductSummary } from "@/lib/public/productTypes";

interface ProductCardProps {
  product: PublicProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasImage = product.images.length > 0;

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
      <Link
        href={`/products/${product.slug}`}
        className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-t-xl"
      >
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={40} className="text-gray-200" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1 px-4 pt-4">
          <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {product.description}
          </p>
          <span className="flex items-center gap-1.5 text-xs font-medium mt-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`}
              aria-hidden="true"
            />
            <span className={product.inStock ? "text-green-600" : "text-red-500"}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2 px-4 pb-4 pt-3">
        <Link
          href={`/products/${product.slug}`}
          className="
            flex-1 py-2 px-3 rounded-lg border border-gray-200
            text-xs font-semibold text-gray-900 text-center
            hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          "
        >
          View Details
        </Link>
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          className="
            p-2 rounded-lg border border-gray-200 text-[var(--color-primary)]
            hover:bg-green-50 hover:border-green-200 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          "
        >
          <ShoppingCart size={15} />
        </button>
      </div>
    </article>
  );
}
