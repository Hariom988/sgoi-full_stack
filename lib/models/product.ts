import mongoose, { Schema, Document, Model } from "mongoose";
import { slugify } from "@/lib/utils/slugify";

export type ProductStatus = "active" | "draft" | "archived";

export interface Product extends Document {
  name: string;
  sku: string;
  slug: string;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 60,
      index: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
      maxlength: 160,
      index: true,
    },
    category: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },
    minPcs: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    color: {
      type: String,
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    costPerItem: {
      type: Number,
      default: 0,
      min: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    weight: {
      type: Number,
      default: 0,
      min: 0,
    },
    dimensions: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
      index: true,
    },
    images: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "inventory",
  },
);
ProductSchema.index({ name: "text", sku: "text" });

export async function generateUniqueProductSlug(
  name: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(name) || "product";
  let candidate = base;
  let suffix = 1;

  while (
    await Product.exists({
      slug: candidate,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  return candidate;
}

ProductSchema.pre("save", async function () {
  if (!this.isModified("name") && this.slug) {
    return;
  }

  this.slug = await generateUniqueProductSlug(this.name, String(this._id));
});

const productsConnection = mongoose.connection.useDb("products", {
  useCache: true,
});

const Product: Model<Product> =
  productsConnection.models.Product ??
  productsConnection.model<Product>("Product", ProductSchema);

export default Product;