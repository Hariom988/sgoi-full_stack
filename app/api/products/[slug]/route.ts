import { NextRequest, NextResponse } from "next/server";
import { getPublicProductBySlug } from "@/lib/public/productService";

// ─── GET /api/products/[slug] ────────────────────────────────────────────────
// Public, unauthenticated detail endpoint. Returns 404 for missing OR
// non-active (draft/archived) products — the two cases are indistinguishable
// to a storefront visitor.

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const product = await getPublicProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/products/[slug]]", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}