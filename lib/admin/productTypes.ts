// lib/admin/productTypes.ts

export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  minPcs: number;
  color: string;
  tags: string[];
  price: number;
  compareAtPrice: number;
  costPerItem: number;
  stockQuantity: number;
  lowStockThreshold: number;
  weight: number;
  dimensions: string;
  status: ProductStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

// Shape used for the Add / Edit form — _id and timestamps omitted on creation
export type ProductFormData = Omit<Product, "_id" | "createdAt" | "updatedAt">;

// Lightweight shape used in the product listing grid
export type ProductSummary = Pick<
  Product,
  "_id" | "name" | "sku" | "category" | "price" | "stockQuantity" | "status" | "images"
> & { description: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isLowStock(
  p: Pick<Product, "stockQuantity" | "lowStockThreshold">,
): boolean {
  return p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;
}

export function isInStock(p: Pick<Product, "stockQuantity">): boolean {
  return p.stockQuantity > 0;
}

export function getMarginPercent(
  p: Pick<Product, "price" | "costPerItem">,
): number | null {
  if (!p.price || !p.costPerItem) return null;
  return Math.round(((p.price - p.costPerItem) / p.price) * 100);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}