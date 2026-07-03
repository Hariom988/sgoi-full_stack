// lib/public/productService.ts
// Server-only data access layer for the public storefront. Keeps Mongo query
// logic in one place so both the /api/products route handlers and the
// server-rendered /products pages stay in sync and avoid a redundant
// self-fetch hop between the page and its own API.

import { connectDB } from "@/lib/db/mongoose";
import ProductModel from "@/lib/models/product";
import { PRODUCT_CATEGORIES } from "@/lib/admin/productCategories";
import type { PublicProduct, PublicProductSummary } from "./productTypes";

export const PRODUCTS_PER_PAGE = 16;

export type ProductSort = "featured" | "price-asc" | "price-desc" | "name-asc";

export interface ProductListParams {
  categories?: string[]; // one or more category values (OR'd together)
  search?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface ProductListResult {
  products: PublicProductSummary[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

const SUMMARY_PROJECTION =
  "name slug sku category description price stockQuantity images";

function buildSortStage(sort: ProductSort | undefined): Record<string, 1 | -1> {
  switch (sort) {
    case "price-asc":
      return { price: 1 };
    case "price-desc":
      return { price: -1 };
    case "name-asc":
      return { name: 1 };
    case "featured":
    default:
      return { createdAt: -1 };
  }
}

// ─── List (with filters, sort, pagination) ─────────────────────────────────

export async function getPublicProducts(
  params: ProductListParams,
): Promise<ProductListResult> {
  await connectDB();

  const limit = params.limit ?? PRODUCTS_PER_PAGE;
  const page = Math.max(1, params.page ?? 1);

  const filter: Record<string, unknown> = { status: "active" };

  if (params.categories && params.categories.length > 0) {
    filter.category = { $in: params.categories };
  }

  if (params.search?.trim()) {
    filter.$or = [
      { name: { $regex: params.search.trim(), $options: "i" } },
      { description: { $regex: params.search.trim(), $options: "i" } },
    ];
  }

  const sortStage = buildSortStage(params.sort);

  const [products, total] = await Promise.all([
    ProductModel.find(filter)
      .select(SUMMARY_PROJECTION)
      .sort(sortStage)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    ProductModel.countDocuments(filter),
  ]);

  return {
    products: products.map(toSummary),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    limit,
  };
}

// ─── Single product by slug ─────────────────────────────────────────────────

export async function getPublicProductBySlug(
  slug: string,
): Promise<PublicProduct | null> {
  await connectDB();

  const product = await ProductModel.findOne({ slug, status: "active" }).lean();
  if (!product) return null;

  return toDetail(product);
}

// ─── Category counts (for the sidebar) ──────────────────────────────────────

export interface CategoryCount {
  value: string;
  label: string;
  count: number;
}

export async function getCategoryCounts(): Promise<{
  total: number;
  categories: CategoryCount[];
}> {
  await connectDB();

  const counts = await ProductModel.aggregate<{ _id: string; count: number }>([
    { $match: { status: "active" } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const countMap = new Map(counts.map((c) => [c._id, c.count]));

  const categories = PRODUCT_CATEGORIES.map((c) => ({
    value: c.value,
    label: c.label,
    count: countMap.get(c.value) ?? 0,
  }));

  const total = categories.reduce((sum, c) => sum + c.count, 0);

  return { total, categories };
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

// Minimal shape returned by the .lean() queries above — avoids importing the
// full Mongoose Document type into the mapping layer.
interface LeanProduct {
  _id: unknown;
  name: string;
  slug: string;
  sku: string;
  category: string;
  description: string;
  minPcs?: number;
  price: number;
  stockQuantity: number;
  images: string[];
  createdAt?: Date;
}

function toSummary(p: LeanProduct): PublicProductSummary {
  return {
    id: String(p._id),
    name: p.name,
    slug: p.slug,
    category: p.category,
    description: p.description,
    price: p.price,
    inStock: p.stockQuantity > 0,
    images: p.images,
  };
}

function toDetail(p: LeanProduct): PublicProduct {
  return {
    ...toSummary(p),
    sku: p.sku,
    minPcs: p.minPcs ?? 1,
  };
}
