import Link from "next/link";
import {
  LayoutGrid,
  Package,
  BatteryFull,
  Cpu,
  Puzzle,
  Gauge,
  Layers,
  Factory,
  type LucideIcon,
} from "lucide-react";
import type { CategoryCount } from "@/lib/public/productService";
import {
  buildProductsHref,
  type ProductsQuery,
} from "@/lib/public/buildProductsHref";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "battery-packs": Package,
  "battery-cells": BatteryFull,
  bms: Cpu,
  accessories: Puzzle,
  "testing-equipment": Gauge,
  "raw-materials": Layers,
  "assembly-line": Factory,
};

interface CategorySidebarProps {
  total: number;
  categories: CategoryCount[];
  activeCategory: string | null; // null = "All Products"
  currentQuery: ProductsQuery;
}

export default function CategorySidebar({
  total,
  categories,
  activeCategory,
  currentQuery,
}: CategorySidebarProps) {
  return (
    <nav aria-label="Product categories">
      <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
        Product Categories
      </h2>
      <ul className="flex flex-col gap-1" role="list">
        <CategoryRow
          icon={LayoutGrid}
          label="All Products"
          count={total}
          isActive={activeCategory === null}
          href={buildProductsHref(currentQuery, {
            category: undefined,
            page: undefined,
          })}
        />
        {categories.map((cat) => (
          <CategoryRow
            key={cat.value}
            icon={CATEGORY_ICONS[cat.value] ?? Package}
            label={cat.label}
            count={cat.count}
            isActive={activeCategory === cat.value}
            href={buildProductsHref(currentQuery, {
              category: cat.value,
              page: undefined,
            })}
          />
        ))}
      </ul>
    </nav>
  );
}

interface CategoryRowProps {
  icon: LucideIcon;
  label: string;
  count: number;
  isActive: boolean;
  href: string;
}

function CategoryRow({
  icon: Icon,
  label,
  count,
  isActive,
  href,
}: CategoryRowProps) {
  return (
    <li>
      <Link
        href={href}
        aria-current={isActive ? "true" : undefined}
        className={`
          flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150
          ${
            isActive
              ? "bg-green-50 text-[var(--color-primary)] font-semibold"
              : "text-gray-700 hover:bg-gray-50"
          }
        `}
      >
        <Icon
          size={17}
          strokeWidth={1.75}
          className={isActive ? "text-[var(--color-primary)]" : "text-gray-400"}
        />
        <span className="flex-1 truncate">{label}</span>
        <span
          className={`text-xs ${isActive ? "text-[var(--color-primary)] font-semibold" : "text-gray-400"}`}
        >
          {count}
        </span>
      </Link>
    </li>
  );
}
