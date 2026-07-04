export interface ProductCategory {
  value: string;
  label: string;
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  { value: "battery-packs",       label: "Battery Packs" },
  { value: "battery-cells",       label: "Battery Cells" },
  { value: "bms",                 label: "BMS" },
  { value: "accessories",         label: "Accessories" },
  { value: "testing-equipment",   label: "Testing Equipment" },
  { value: "raw-materials",       label: "Raw Materials" },
  { value: "assembly-line",       label: "Assembly Line" },
];

export function getCategoryLabel(value: string): string {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}