"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/public/productTypes";
import type { PublicProduct } from "@/lib/public/productTypes";

interface ProductBuyBoxProps {
  product: PublicProduct;
}

export default function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const [qty, setQty] = useState(product.minPcs);

  function decrement() {
    setQty((q) => Math.max(product.minPcs, q - 1));
  }

  function increment() {
    setQty((q) => q + 1);
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
          {product.name}
        </h1>
        <span
          className={`
            shrink-0 mt-1 flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full
            ${product.inStock ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}
          `}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`}
            aria-hidden="true"
          />
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="border-t border-gray-200 mt-4 pt-4">
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {formatPrice(product.price)}
        </p>
        <p className="mt-2 text-sm text-gray-500">{product.description}</p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            type="button"
            onClick={decrement}
            disabled={qty <= product.minPcs}
            aria-label="Decrease quantity"
            className="p-2.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500 transition-colors duration-150"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-semibold text-gray-900" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={increment}
            aria-label="Increase quantity"
            className="p-2.5 text-gray-500 hover:text-gray-900 transition-colors duration-150"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Min Purchase {product.minPcs} PSC
      </p>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          className="
            flex items-center justify-center gap-2 w-full py-3 rounded-lg
            bg-gray-900 text-white text-sm font-semibold
            hover:bg-gray-800 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          "
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
        <button
          type="button"
          className="
            w-full py-3 rounded-lg border border-gray-900
            text-sm font-semibold text-gray-900
            hover:bg-gray-50 transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          "
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
