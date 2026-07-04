import { NextRequest, NextResponse } from "next/server";
import { getPublicProducts, PRODUCTS_PER_PAGE, type ProductSort } from "@/lib/public/productService";

const VALID_SORTS: ProductSort[] = ["featured", "price-asc", "price-desc", "name-asc"];


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const categoryParam = searchParams.get("category");
    const categories = categoryParam
      ? categoryParam.split(",").map((c) => c.trim()).filter(Boolean)
      : undefined;

    const sortParam = searchParams.get("sort");
    const sort = VALID_SORTS.includes(sortParam as ProductSort)
      ? (sortParam as ProductSort)
      : "featured";

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || PRODUCTS_PER_PAGE;

    const result = await getPublicProducts({
      categories,
      search: searchParams.get("search") ?? undefined,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
