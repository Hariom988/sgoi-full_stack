// lib/public/productTypes.ts
// Public-storefront product shapes. Deliberately narrower than the admin
// Product type (lib/admin/productTypes.ts) — cost, margin, and other
// internal-only fields never reach the client.

export interface PublicProductSummary {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  inStock: boolean;
  images: string[];
}

export interface PublicProduct extends PublicProductSummary {
  sku: string;
  minPcs: number;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
