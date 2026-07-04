
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
