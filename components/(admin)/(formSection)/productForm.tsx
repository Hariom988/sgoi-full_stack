"use client";

// components/(admin)/(formSection)/productForm.tsx

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, Upload, AlertCircle, Loader2 } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/admin/productCategories";
import type { Product, ProductFormData, ProductStatus } from "@/lib/admin/productTypes";

interface ProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  initialData?: Product;
}

const EMPTY_FORM: ProductFormData = {
  name: "",
  sku: "",
  category: "",
  description: "",
  minPcs: 1,
  color: "",
  tags: [],
  price: 0,
  compareAtPrice: 0,
  costPerItem: 0,
  stockQuantity: 0,
  lowStockThreshold: 10,
  weight: 0,
  dimensions: "",
  status: "draft",
  images: [],
};

const inputCls = `
  w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white
  text-gray-900 placeholder:text-gray-400
  focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]
  transition-shadow duration-150
  disabled:opacity-60 disabled:cursor-not-allowed
`.trim();

const labelCls = "block text-xs font-medium text-gray-700 mb-1.5";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <h2 className="text-sm font-bold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className={labelCls}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px] text-red-500 flex items-center gap-1">
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}

function TagInput({
  tags,
  onChange,
  disabled,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  disabled: boolean;
}) {
  const [input, setInput] = useState("");

  function addTag() {
    const val = input.trim().toLowerCase();
    if (!val || tags.includes(val)) {
      setInput("");
      return;
    }
    onChange([...tags, val]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  }

  return (
    <div
      className={`
        flex flex-wrap gap-1.5 px-3 py-2 rounded-md border border-gray-300 bg-white
        focus-within:ring-2 focus-within:ring-[var(--color-primary)]/40 focus-within:border-[var(--color-primary)]
        transition-shadow duration-150 min-h-[38px]
        ${disabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold"
        >
          {tag}
          {!disabled && (
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-500 transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <X size={11} />
            </button>
          )}
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        disabled={disabled}
        placeholder={tags.length === 0 ? "Add tags…" : ""}
        className="flex-1 min-w-[100px] text-sm bg-transparent outline-none placeholder:text-gray-400 text-gray-900"
        aria-label="Add tag"
      />
    </div>
  );
}

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  disabled: boolean;
}

function ImageUpload({ images, onChange, disabled }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      Array.from(fileList).forEach((file) => formData.append("files", file));

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      const newUrls: string[] = data.images.map(
        (img: { id: string; url: string }) => img.url,
      );
      onChange([...images, ...newUrls]);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Image upload failed. Try again.",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    onChange(images.filter((img) => img !== url));
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
        disabled={disabled || uploading}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className="
          w-full rounded-lg border-2 border-dashed border-gray-200 py-8 px-4
          flex flex-col items-center justify-center gap-2
          text-center hover:border-[var(--color-primary)]/40 hover:bg-gray-50
          transition-colors duration-150
          disabled:opacity-60 disabled:cursor-not-allowed
        "
      >
        {uploading ? (
          <Loader2 size={22} className="text-gray-400 animate-spin" />
        ) : (
          <Upload size={22} className="text-[var(--color-primary)]/60" />
        )}
        <span className="text-sm text-gray-600">
          {uploading ? "Uploading…" : "Click to Upload images"}
        </span>
        <span className="text-[11px] text-gray-400">PNG, JPG up to 5MB each</span>
      </button>

      {uploadError && (
        <p className="mt-2 text-[11px] text-red-500 flex items-center gap-1">
          <AlertCircle size={11} />
          {uploadError}
        </p>
      )}

      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-4 gap-2">
          {images.map((url) => (
            <div
              key={url}
              className="relative aspect-square rounded-md border border-gray-200 overflow-hidden bg-gray-50 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Product"
                className="w-full h-full object-contain p-1"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeImage(url)}
                  className="
                    absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white
                    flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                  "
                  aria-label="Remove image"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: ProductStatus;
  onChange: (v: ProductStatus) => void;
  disabled: boolean;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ProductStatus)}
      disabled={disabled}
      className={inputCls}
    >
      <option value="active">Active</option>
      <option value="draft">Draft</option>
      <option value="archived">Archived</option>
    </select>
  );
}

type FormErrors = Partial<Record<keyof ProductFormData, string>>;

function validate(data: ProductFormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Product name is required";
  if (!data.sku.trim()) errors.sku = "SKU is required";
  if (!data.category) errors.category = "Select a category";
  if (data.price <= 0) errors.price = "Price must be greater than ₹0";
  if (data.compareAtPrice <= 0) errors.compareAtPrice = "Compare at price is required";
  if (data.stockQuantity < 0) errors.stockQuantity = "Stock cannot be negative";
  return errors;
}

export default function ProductForm({ mode, productId, initialData }: ProductFormProps) {
  const router = useRouter();

  const [form, setForm] = useState<ProductFormData>(() => {
    if (mode === "edit" && initialData) {
      const { _id, createdAt, updatedAt, ...formFields } = initialData;
      return formFields;
    }
    return EMPTY_FORM;
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const set = useCallback(
    <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => {
        if (!prev[key]) return prev;
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    [],
  );

  function numericChange(
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof ProductFormData,
    integer = false,
  ) {
    const raw = e.target.value;
    const parsed = integer ? parseInt(raw, 10) : parseFloat(raw);
    set(key, isNaN(parsed) ? 0 : (parsed as ProductFormData[typeof key]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const errs = validate(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);

    try {
      const endpoint =
        mode === "create"
          ? "/api/admin/products"
          : `/api/admin/products/${productId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.fields) {
          setErrors(data.fields);
          const firstKey = Object.keys(data.fields)[0];
          document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        throw new Error(data.error ?? "Something went wrong");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const isDisabled = submitting;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Go back"
        >
          ←
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {mode === "create"
              ? "Create a new product for your store"
              : "Update the product details below"}
          </p>
        </div>
      </div>

      {serverError && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Left column */}
        <div className="space-y-5">
          <Section title="Basic Information">
            <Field label="Product Name" htmlFor="name" required error={errors.name}>
              <input
                id="name"
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                disabled={isDisabled}
                className={inputCls}
                maxLength={120}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="SKU" htmlFor="sku" required error={errors.sku}>
                <input
                  id="sku"
                  type="text"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value.toUpperCase())}
                  disabled={isDisabled}
                  className={`${inputCls} font-mono`}
                  maxLength={60}
                />
              </Field>

              <Field label="Category" htmlFor="category" required error={errors.category}>
                <select
                  id="category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  disabled={isDisabled}
                  className={inputCls}
                >
                  <option value="">Select Category</option>
                  {PRODUCT_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Description" htmlFor="description">
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                disabled={isDisabled}
                rows={4}
                className={`${inputCls} resize-y`}
                maxLength={1000}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Min PCS" htmlFor="minPcs">
                <input
                  id="minPcs"
                  type="number"
                  min={1}
                  step={1}
                  value={form.minPcs || ""}
                  onChange={(e) => numericChange(e, "minPcs", true)}
                  disabled={isDisabled}
                  placeholder="Min No. of PCS"
                  className={inputCls}
                />
              </Field>

              <Field label="Color" htmlFor="color">
                <input
                  id="color"
                  type="text"
                  value={form.color}
                  onChange={(e) => set("color", e.target.value)}
                  disabled={isDisabled}
                  placeholder="e.g., Black, White"
                  className={inputCls}
                  maxLength={80}
                />
              </Field>
            </div>

            <Field label="Tags">
              <TagInput
                tags={form.tags}
                onChange={(tags) => set("tags", tags)}
                disabled={isDisabled}
              />
            </Field>
          </Section>

          <Section title="Pricing">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Price" htmlFor="price" required error={errors.price}>
                <input
                  id="price"
                  type="number"
                  min={0}
                  step={1}
                  value={form.price || ""}
                  onChange={(e) => numericChange(e, "price")}
                  disabled={isDisabled}
                  placeholder="₹0.00"
                  className={inputCls}
                />
              </Field>

              <Field label="Compare at Price" htmlFor="compareAtPrice" required error={errors.compareAtPrice}>
                <input
                  id="compareAtPrice"
                  type="number"
                  min={0}
                  step={1}
                  value={form.compareAtPrice || ""}
                  onChange={(e) => numericChange(e, "compareAtPrice")}
                  disabled={isDisabled}
                  placeholder="₹0.00"
                  className={inputCls}
                />
              </Field>

              <Field label="Cost per item" htmlFor="costPerItem">
                <input
                  id="costPerItem"
                  type="number"
                  min={0}
                  step={1}
                  value={form.costPerItem || ""}
                  onChange={(e) => numericChange(e, "costPerItem")}
                  disabled={isDisabled}
                  placeholder="₹0.00"
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section title="Inventory">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Stock Quantity" htmlFor="stockQuantity" required error={errors.stockQuantity}>
                <input
                  id="stockQuantity"
                  type="number"
                  min={0}
                  step={1}
                  value={form.stockQuantity || ""}
                  onChange={(e) => numericChange(e, "stockQuantity", true)}
                  disabled={isDisabled}
                  placeholder="0"
                  className={inputCls}
                />
              </Field>

              <Field label="Low Stock Threshold" htmlFor="lowStockThreshold">
                <input
                  id="lowStockThreshold"
                  type="number"
                  min={0}
                  step={1}
                  value={form.lowStockThreshold || ""}
                  onChange={(e) => numericChange(e, "lowStockThreshold", true)}
                  disabled={isDisabled}
                  placeholder="10"
                  className={inputCls}
                />
              </Field>
            </div>
          </Section>

          <Section title="Shipping">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Weight (kg)" htmlFor="weight">
                <input
                  id="weight"
                  type="number"
                  min={0}
                  step={0.01}
                  value={form.weight || ""}
                  onChange={(e) => numericChange(e, "weight")}
                  disabled={isDisabled}
                  placeholder="0.00"
                  className={inputCls}
                />
              </Field>

              <Field label="Dimensions (L x W x H cm)" htmlFor="dimensions">
                <input
                  id="dimensions"
                  type="text"
                  value={form.dimensions}
                  onChange={(e) => set("dimensions", e.target.value)}
                  disabled={isDisabled}
                  placeholder="e.g., 30 x 20 x 15"
                  className={inputCls}
                  maxLength={40}
                />
              </Field>
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <Section title="Product Images">
            <ImageUpload
              images={form.images}
              onChange={(images) => set("images", images)}
              disabled={isDisabled}
            />
          </Section>

          <Section title="Product Status">
            <StatusSelect
              value={form.status}
              onChange={(v) => set("status", v)}
              disabled={isDisabled}
            />
          </Section>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              disabled={isDisabled}
              className="
                w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-md
                bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)]
                text-white text-sm font-bold transition-colors duration-150
                disabled:opacity-70 disabled:cursor-not-allowed
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
              "
            >
              {submitting && <Loader2 size={15} className="animate-spin" />}
              {submitting
                ? "Saving…"
                : mode === "create"
                  ? "Add Product"
                  : "Save Changes"}
            </button>
            <button
              type="button"
              disabled={isDisabled}
              onClick={() => router.back()}
              className="
                w-full py-2.5 rounded-md border border-gray-300
                text-sm font-semibold text-gray-700 hover:bg-gray-50
                transition-colors disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}