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

// ─── Slug generation ─────────────────────────────────────────────────────────
// Auto-derives a URL-safe slug from the product name whenever it's new or the
// name changes. Falls back to appending a short suffix on collision so two
// products with the same name never clash on /products/[slug].
ProductSchema.pre("save", async function () {
  if (!this.isModified("name") && this.slug) {
    return;
  }

  const base = slugify(this.name) || "product";
  let candidate = base;
  let suffix = 1;

  const ProductModel = this.constructor as Model<Product>;
  while (
    await ProductModel.exists({ slug: candidate, _id: { $ne: this._id } })
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`;
  }

  this.slug = candidate;
});

const productsConnection = mongoose.connection.useDb("products", {
  useCache: true,
});

const Product: Model<Product> =
  productsConnection.models.Product ??
  productsConnection.model<Product>("Product", ProductSchema);

export default Product;