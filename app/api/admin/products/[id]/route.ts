import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Product from "@/lib/models/product";
import type { ProductFormData } from "@/lib/admin/productTypes";
import { getR2Client, isR2Configured, keyFromPublicUrl, R2_BUCKET_NAME } from "@/lib/r2/client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

interface RouteParams {
  params: Promise<{ id: string }>;  
}


export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/admin/products/:id]", err);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}


export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();

    const body: Partial<ProductFormData> = await request.json();
    const errors: Record<string, string> = {};

    if (body.name !== undefined && !body.name.trim())
      errors.name = "Product name is required";
    if (body.sku !== undefined && !body.sku.trim())
      errors.sku = "SKU is required";
    if (body.price !== undefined && body.price <= 0)
      errors.price = "Price must be greater than 0";
    if (body.compareAtPrice !== undefined && body.compareAtPrice <= 0)
      errors.compareAtPrice = "Compare at price is required";
    if (body.stockQuantity !== undefined && body.stockQuantity < 0)
      errors.stockQuantity = "Stock quantity cannot be negative";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", fields: errors }, { status: 400 });
    }

    if (body.sku) {
      const existing = await Product.findOne({
        sku: body.sku.toUpperCase(),
        _id: { $ne: id },
      }).lean();
      if (existing) {
        return NextResponse.json(
          { error: "Validation failed", fields: { sku: "SKU already exists" } },
          { status: 409 },
        );
      }
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    ).lean(); 

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (err) {
    console.error("[PATCH /api/admin/products/:id]", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}


export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    await connectDB();

    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (isR2Configured() && product.images?.length) {
      const client = getR2Client();
      await Promise.all(
        product.images.map(async (url) => {
          const key = keyFromPublicUrl(url);
          if (!key) return;
          try {
            await client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
          } catch (err) {
            console.error(`[DELETE /api/admin/products/:id] Failed to delete R2 object ${key}`, err);
          }
        }),
      );
    }

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/admin/products/:id]", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}