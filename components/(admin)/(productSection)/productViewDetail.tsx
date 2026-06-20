import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Pencil,
  Package,
  TrendingUp,
  Box,
  IndianRupee,
  Calendar,
} from "lucide-react";
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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon size={16} className={iconColor} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
          <p className="text-xl font-bold text-gray-900 leading-tight">
            {value}
          </p>
          {sub && (
            <p className="text-xs text-green-600 font-medium mt-0.5">{sub}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide sm:w-36 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm text-gray-900 font-medium">{value}</span>
    </div>
  );
}

export default function ProductViewDetail({ product }: ProductViewDetailProps) {
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

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <AdminBreadcrumb
          items={[
            { label: "Admin", href: "/admin/dashboard" },
            { label: "Products", href: "/admin/products" },
            { label: product.name },
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="flex items-start gap-3">
          <Link
            href="/admin/products"
            className="mt-1 p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
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
            inline-flex items-center gap-2 self-start
            bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
            text-white text-sm font-semibold
            px-4 py-2.5 rounded-lg
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
            whitespace-nowrap
          "
        >
          <Pencil size={15} />
          Edit Product
        </Link>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard
          icon={TrendingUp}
          label="Total Sales"
          value="—"
          sub="No data yet"
          iconColor="text-emerald-500"
          iconBg="bg-emerald-50"
        />
        <StatCard
          icon={Box}
          label="Stock Level"
          value={String(product.stockQuantity)}
          sub="units available"
          iconColor="text-blue-500"
          iconBg="bg-blue-50"
        />
        <StatCard
          icon={IndianRupee}
          label="Revenue"
          value="—"
          sub="No data yet"
          iconColor="text-violet-500"
          iconBg="bg-violet-50"
        />
        <StatCard
          icon={Calendar}
          label="Last Updated"
          value={new Date(product.updatedAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
          sub={`Created ${new Date(product.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`}
          iconColor="text-rose-500"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Main two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left: product detail card ────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex flex-col md:flex-row gap-0">
              {/* Image */}
              <div className="md:w-64 lg:w-72 shrink-0 border-b md:border-b-0 md:border-r border-gray-100">
                <div className="aspect-square md:aspect-auto md:h-full min-h-[200px] relative bg-gray-50 flex items-center justify-center p-6">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 300px"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-300">
                      <Package size={48} aria-hidden="true" />
                      <span className="text-xs text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                {/* Thumbnail row */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 p-3 flex-wrap border-t border-gray-100">
                    {product.images.slice(0, 4).map((img, i) => (
                      <div
                        key={i}
                        className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden relative bg-gray-50 shrink-0"
                      >
                        <Image
                          src={img}
                          alt={`${product.name} ${i + 1}`}
                          fill
                          className="object-contain p-1"
                          sizes="56px"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">
                      {product.name}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {getCategoryLabel(product.category)}
                    </p>
                  </div>
                  <span
                    className={`
                      flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full shrink-0
                      ${inStock ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}
                    `}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-500" : "bg-red-400"}`}
                      aria-hidden="true"
                    />
                    {inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {formatPrice(product.price)}
                </p>
                {product.compareAtPrice > product.price && (
                  <p className="text-sm text-gray-400 line-through mb-4">
                    {formatPrice(product.compareAtPrice)}
                  </p>
                )}

                <div className="flex flex-col gap-3 mt-5 pt-5 border-t border-gray-100">
                  <InfoRow label="SKU" value={product.sku} />
                  <InfoRow
                    label="Category"
                    value={getCategoryLabel(product.category)}
                  />
                  <InfoRow
                    label="Min Purchase"
                    value={`${product.minPcs} PCS`}
                  />
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

                {product.description && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                      Description
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}

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
        </div>

        {/* ── Right sidebar ─────────────────────────────────────────────────── */}
        <div className="lg:w-72 xl:w-80 shrink-0 flex flex-col gap-5">
          {/* Product Status */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Product Status
              </p>
            </div>
            <div className="p-5">
              <div
                className={`
                flex items-center gap-2 px-4 py-3 rounded-lg
                ${
                  product.status === "active"
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50 border border-gray-200"
                }
              `}
              >
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${product.status === "active" ? "bg-green-500" : "bg-gray-400"}`}
                  aria-hidden="true"
                />
                <span
                  className={`text-sm font-semibold capitalize ${product.status === "active" ? "text-green-700" : "text-gray-600"}`}
                >
                  {product.status === "active"
                    ? "Active — visible to customers"
                    : product.status === "draft"
                      ? "Draft — not published"
                      : "Archived"}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Pricing
              </p>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Price</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPrice(product.price)}
                </span>
              </div>
              {product.compareAtPrice > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Compare at</span>
                  <span className="text-sm font-semibold text-gray-500 line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                </div>
              )}
              {product.costPerItem > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Cost</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPrice(product.costPerItem)}
                  </span>
                </div>
              )}
              {margin !== null && (
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Margin</span>
                  <span className="text-sm font-bold text-[var(--color-primary)]">
                    {margin}%
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                Inventory
              </p>
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
                <span className="text-sm font-semibold text-gray-900">
                  {product.lowStockThreshold} units
                </span>
              </div>
              {/* Stock level bar */}
              <div className="pt-2">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
