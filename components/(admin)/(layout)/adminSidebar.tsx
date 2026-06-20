"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BadgeDollarSign,
  ClipboardList,
  Settings,
  X,
  type LucideIcon,
} from "lucide-react";
import { SIDEBAR_ITEMS, type SidebarItem } from "@/lib/admin/sidebarConfig";

// ─── Icon registry ─────────────────────────────────────────────────────────────
// Maps string names from sidebarConfig to actual Lucide components.
// Add new icons here when extending the sidebar config.

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  BadgeDollarSign,
  ClipboardList,
  Settings,
};

// ─── Single nav item ───────────────────────────────────────────────────────────

function SidebarNavItem({
  item,
  isActive,
  onClick,
}: {
  item: SidebarItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = ICON_MAP[item.icon] ?? Package;

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        className={`
          flex items-center gap-3 px-3 py-2.5 rounded-lg
          text-sm font-medium transition-colors duration-150
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
          ${
            isActive
              ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon
          size={18}
          strokeWidth={isActive ? 2.5 : 1.75}
          className={isActive ? "text-[var(--color-primary)]" : "text-gray-400"}
          aria-hidden="true"
        />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}

// ─── Sidebar inner content (shared between desktop + drawer) ───────────────────

function SidebarContent({
  pathname,
  onNavClick,
}: {
  pathname: string;
  onNavClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-4 py-5 border-b border-gray-100">
        <Link
          href="/admin/dashboard"
          className="flex flex-col leading-none"
          onClick={onNavClick}
        >
          <span className="text-2xl font-extrabold text-[var(--color-primary)] tracking-tight">
            SGOI
          </span>
          <span className="text-[11px] font-medium text-gray-400 tracking-wide -mt-0.5">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 px-3 py-4 overflow-y-auto"
        aria-label="Admin navigation"
      >
        <ul role="list" className="flex flex-col gap-0.5">
          {SIDEBAR_ITEMS.map((item) => {
            // Active if exact match, or if current path starts with item href
            // (so /admin/products/new still highlights Product)
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin/dashboard" &&
                pathname.startsWith(item.href));

            return (
              <SidebarNavItem
                key={item.href}
                item={item}
                isActive={isActive}
                onClick={onNavClick}
              />
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

// ─── Desktop sidebar ───────────────────────────────────────────────────────────

export function AdminSidebarDesktop() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden lg:flex flex-col w-56 shrink-0 bg-white border-r border-gray-200 min-h-screen"
      aria-label="Sidebar navigation"
    >
      <SidebarContent pathname={pathname} />
    </aside>
  );
}

// ─── Mobile drawer ─────────────────────────────────────────────────────────────

export function AdminSidebarDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>

        <SidebarContent pathname={pathname} onNavClick={onClose} />
      </aside>
    </>
  );
}
