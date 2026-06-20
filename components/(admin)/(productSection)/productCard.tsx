"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pencil, Trash2, Package } from "lucide-react";
import type { ProductSummary } from "@/lib/admin/productTypes";
import { isInStock, formatPrice } from "@/lib/admin/productTypes";
import { getCategoryLabel } from "@/lib/admin/productCategories";
import DeleteConfirmModal from "./deleteConfirmModal";

interface ProductCardProps {
  product: ProductSummary;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const inStock = isInStock({ stockQuantity: product.stockQuantity });
  const hasImage = product.images && product.images.length > 0;

  async function handleConfirmDelete() {
    setIsDeleting(true);
    // TODO: replace with real API call — DELETE /api/admin/products/:id
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    onDelete(product._id);
    setIsDeleting(false);
    setShowDeleteModal(false);
  }

  return (
    <>
      <article className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-200">
        {/* Product image */}
        <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package size={40} className="text-gray-200" aria-hidden="true" />
            </div>
          )}

          {/* Status badge */}
          {product.status !== "active" && (
            <span
              className={`
                absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide
                ${product.status === "draft" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}
              `}
            >
              {product.status}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-4">
          {/* Category */}
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
            {getCategoryLabel(product.category)}
          </p>

          {/* Name */}
          <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3 flex-1">
            {product.description}
          </p>

          {/* Price + stock */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            <span
              className={`
                flex items-center gap-1.5 text-xs font-medium
                ${inStock ? "text-green-600" : "text-red-500"}
              `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-400"}`}
                aria-hidden="true"
              />
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
            <Link
              href={`/admin/products/${product._id}/view`}
              className="
                flex-1 py-2 px-3 rounded-lg border border-gray-200
                text-xs font-semibold text-gray-700 text-center
                hover:bg-gray-50 hover:border-gray-300 transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              "
            >
              View Details
            </Link>

            <Link
              href={`/admin/products/${product._id}/edit`}
              className="
                p-2 rounded-lg border border-gray-200 text-gray-500
                hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/40 hover:bg-green-50
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              "
              aria-label={`Edit ${product.name}`}
            >
              <Pencil size={15} />
            </Link>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="
                p-2 rounded-lg border border-gray-200 text-gray-500
                hover:text-red-600 hover:border-red-200 hover:bg-red-50
                transition-colors duration-150
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400
              "
              aria-label={`Delete ${product.name}`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </article>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        productName={product.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
}
