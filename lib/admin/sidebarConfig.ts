// Sidebar is driven entirely by this config — no items hardcoded in the component.
// Add, remove, or reorder menu items here without touching AdminSidebar.tsx.

export interface SidebarItem {
  label: string;
  href: string;
  // Icon name from lucide-react — rendered dynamically in AdminSidebar
  icon: string;
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Product",   href: "/admin/products",  icon: "Package" },
  { label: "Income",    href: "/admin/income",    icon: "BadgeDollarSign" },
  { label: "Orders",    href: "/admin/orders",    icon: "ClipboardList" },
  { label: "Settings",  href: "/admin/settings",  icon: "Settings" },
];