import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/product";
import type { ProductFormData } from "@/lib/admin/productTypes";

// ─── GET /api/admin/products ────────────────────────────────────────────────
// Returns the product list for the listing page. Supports optional ?search=
// and ?category= query params so the existing search/filter UI can eventually
// move server-side without changing this route's shape.

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category");

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/admin/products]", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

// ─── POST /api/admin/products ───────────────────────────────────────────────
// Creates a new product. Expects ProductFormData shape in the request body.
// Validation here mirrors productForm.tsx client-side validation as a
// server-side safety net — never trust client validation alone.

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: ProductFormData = await request.json();

    // ── Server-side validation (mirrors client-side rules) ──────────────────
    const errors: Record<string, string> = {};

    if (!body.name?.trim()) errors.name = "Product name is required";
    if (!body.sku?.trim()) errors.sku = "SKU is required";
    if (!body.category) errors.category = "Category is required";
    if (typeof body.price !== "number" || body.price <= 0)
      errors.price = "Price must be greater than 0";
    if (typeof body.compareAtPrice !== "number" || body.compareAtPrice <= 0)
      errors.compareAtPrice = "Compare at price is required";
    if (typeof body.stockQuantity !== "number" || body.stockQuantity < 0)
      errors.stockQuantity = "Stock quantity cannot be negative";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
    }

    // ── Duplicate SKU check ──────────────────────────────────────────────────
    const existing = await Product.findOne({ sku: body.sku.toUpperCase() }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "Validation failed", fields: { sku: "SKU already exists" } },
        { status: 409 },
      );
    }

    const product = await Product.create(body);

    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/products]", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}