// ─── Product domain types ─────────────────────────────────────────────────────
// Flat schema — no colour/size variants for SGOI battery products.
// Shape exactly mirrors the MongoDB document so replacing mock data
// with a real API response requires zero refactoring.

export type ProductStatus = "active" | "draft" | "archived";

export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  minPcs: number;
  color: string;          // e.g. "Black, White"
  tags: string[];
  price: number;          // selling price (₹)
  compareAtPrice: number; // crossed-out / MRP (₹)
  costPerItem: number;    // cost price (₹)
  stockQuantity: number;  // units in stock
  lowStockThreshold: number;
  weight: number;         // kg
  dimensions: string;     // free-text "L x W x H cm"
  status: ProductStatus;
  images: string[];       // ordered list of image URLs
  createdAt: string;      // ISO date string
  updatedAt: string;      // ISO date string
}

// Shape used for the Add / Edit form — _id and timestamps omitted on creation
export type ProductFormData = Omit<Product, "_id" | "createdAt" | "updatedAt">;

// Lightweight shape used in the product listing grid
export type ProductSummary = Pick<
  Product,
  "_id" | "name" | "sku" | "category" | "price" | "stockQuantity" | "status" | "images"
> & { description: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isLowStock(p: Pick<Product, "stockQuantity" | "lowStockThreshold">): boolean {
  return p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;
}

export function isInStock(p: Pick<Product, "stockQuantity">): boolean {
  return p.stockQuantity > 0;
}

export function getMarginPercent(p: Pick<Product, "price" | "costPerItem">): number | null {
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