"use client";

// components/(admin)/(productSection)/productViewDetail.tsx

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Pencil, Package, Box, Calendar } from "lucide-react";
import type { Product } from "@/lib/admin/productTypes";
import {
  formatPrice,
  getMarginPercent,
  isInStock,
  isLowStock,
} from "@/lib/admin/productTypes";
import { getCategoryLabel } from "@/lib/admin/productCategories";
import AdminBreadcrumb from "@/components/(admin)/(shared)/adminBreadcrumb";

interface ProductViewDetailProps {
  product: Product;
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor = "text-gray-500",
  iconBg = "bg-gray-50",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start gap-3">
        <div
          className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon size={15} className={iconColor} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
          <p className="text-lg font-bold text-gray-900 leading-tight">
            {value}
          </p>
          {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-32 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductViewDetail({ product }: ProductViewDetailProps) {
  const [activeImage, setActiveImage] = useState(0);

  const inStock = isInStock(product);
  const lowStock = isLowStock(product);
  const margin = getMarginPercent(product);

  const stockPercent = product.lowStockThreshold
    ? Math.min(
        100,
        Math.round(
          (product.stockQuantity / (product.lowStockThreshold * 3)) * 100,
        ),
      )
    : 50;

  const stockBarColor = !inStock
    ? "bg-red-400"
    : lowStock
      ? "bg-amber-400"
      : "bg-[var(--color-primary)]";

  const stockLabel = !inStock
    ? "Out of Stock"
    : lowStock
      ? "Low Stock"
      : "Healthy";

  const hasImages = product.images && product.images.length > 0;
  const currentImage = hasImages ? product.images[activeImage] : null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/products"
            className="mt-0.5 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
            aria-label="Back to products"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">SKU: {product.sku}</p>
          </div>
        </div>

        <Link
          href={`/admin/products/${product._id}/edit`}
          className="
            inline-flex items-center gap-2 shrink-0
            bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
            text-white text-sm font-semibold
            px-4 py-2 rounded-lg
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          "
        >
          <Pencil size={14} />
          Edit Product
        </Link>
      </div>

      {/* Stat cards — only real derivable data */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={Box}
          label="Stock Level"
          value={String(product.stockQuantity)}
          sub="units available"
          iconColor="text-blue-500"
          iconBg="bg-blue-50"
        />
        <StatCard
          icon={Calendar}
          label="Last Updated"
          value={new Date(product.updatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          sub={`Created ${new Date(product.createdAt).toLocaleDateString(
            "en-IN",
            { day: "2-digit", month: "short", year: "numeric" },
          )}`}
          iconColor="text-rose-500"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Main layout — product card left, sidebar right */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* ── Product detail card ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Image column */}
            <div className="md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r border-gray-100">
              {/* Main image */}
              <div className="relative bg-gray-50 aspect-square">
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 384px"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-300">
                    <Package size={52} aria-hidden="true" />
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </div>

              {/* Thumbnail row — interactive, shown when >1 image */}
              {hasImages && product.images.length > 1 && (
                <div className="flex gap-2 p-3 border-t border-gray-100 flex-wrap">
                  {product.images.slice(0, 4).map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`
                        w-16 h-16 rounded-lg border-2 overflow-hidden relative bg-gray-50 shrink-0
                        transition-colors duration-150 focus-visible:outline-none
                        ${
                          activeImage === i
                            ? "border-[var(--color-primary)]"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                      aria-label={`View image ${i + 1}`}
                      aria-pressed={activeImage === i}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details column */}
            <div className="flex-1 p-6 min-w-0">
              {/* Product name + stock badge */}
              <div className="flex items-start justify-between gap-3 mb-1">
                <h2 className="text-lg font-bold text-gray-900 leading-snug">
                  {product.name}
                </h2>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                {getCategoryLabel(product.category)}
              </p>

              {/* Divider */}
              <div className="border-t border-gray-100 mb-4" />

              {/* Price */}
              <div className="mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.compareAtPrice > product.price && (
                <p className="text-sm text-gray-400 line-through mb-4">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}

              {/* Info rows */}
              <div className="mt-5">
                <InfoRow label="SKU" value={product.sku} />
                <InfoRow
                  label="Category"
                  value={getCategoryLabel(product.category)}
                />
                <InfoRow label="Min Purchase" value={`${product.minPcs} PCS`} />
                {product.color && (
                  <InfoRow label="Color" value={product.color} />
                )}
                {product.weight > 0 && (
                  <InfoRow label="Weight" value={`${product.weight} kg`} />
                )}
                {product.dimensions && (
                  <InfoRow
                    label="Dimensions"
                    value={`${product.dimensions} cm`}
                  />
                )}
                <InfoRow
                  label="Status"
                  value={
                    <span
                      className={`capitalize font-semibold ${
                        product.status === "active"
                          ? "text-green-600"
                          : product.status === "draft"
                            ? "text-amber-600"
                            : "text-gray-500"
                      }`}
                    >
                      {product.status}
                    </span>
                  }
                />
              </div>

              {/* Description */}
              {product.description && (
                <div className="mt-5 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Description
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-600 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Right sidebar ────────────────────────────────────────────────── */}
        <div className="lg:w-64 xl:w-72 shrink-0 flex flex-col gap-4">
          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">Pricing</p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.compareAtPrice > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Compare at</span>
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                </div>
              )}
              {product.costPerItem > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Cost</span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(product.costPerItem)}
                  </span>
                </div>
              )}
              {margin !== null && (
                <>
                  <div className="border-t border-gray-100 my-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Margin</span>
                    <span className="text-sm font-bold text-[var(--color-primary)]">
                      {margin}%
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm font-bold text-gray-900">Inventory</p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Available</span>
                <span className="text-sm font-bold text-gray-900">
                  {product.stockQuantity}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Low Stock at</span>
                <span className="text-sm text-gray-500">
                  {product.lowStockThreshold} units
                </span>
              </div>

              {/* Stock bar */}
              <div className="pt-1">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${stockBarColor}`}
                    style={{ width: `${stockPercent}%` }}
                    role="progressbar"
                    aria-valuenow={product.stockQuantity}
                    aria-valuemin={0}
                    aria-valuemax={product.lowStockThreshold * 3}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  Stock level: {stockLabel}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
