// lib/public/buildProductsHref.ts
// Builds a /products URL from the current query params plus a set of
// overrides. Any override set to `undefined` removes that param entirely.
// Centralizing this keeps the sidebar, filter panel, sort dropdown, and
// pagination controls consistent without each one hand-rolling URLSearchParams.

export type ProductsQuery = Record<string, string | undefined>;

export function buildProductsHref(
  current: ProductsQuery,
  overrides: ProductsQuery,
): string {
  const merged: ProductsQuery = { ...current, ...overrides };

  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined && value !== "") {
      search.set(key, value);
    }
  }

  const qs = search.toString();
  return qs ? `/products?${qs}` : "/products";
}
