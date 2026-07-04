"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  BadgeDollarSign,
  ClipboardList,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { SIDEBAR_ITEMS, type SidebarItem } from "@/lib/admin/sidebarConfig";
import { SIDEBAR_WIDTH } from "@/lib/admin/sidebarLayoutConfig";

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Package,
  BadgeDollarSign,
  ClipboardList,
  Settings,
};

interface TooltipState {
  label: string;
  y: number;
}

function FloatingTooltip({ tooltip }: { tooltip: TooltipState | null }) {
  if (!tooltip) return null;

  return (
    <div
      role="tooltip"
      style={{
        position: "fixed",
        left: `calc(${SIDEBAR_WIDTH.collapsed} + 10px)`,
        top: tooltip.y,
        transform: "translateY(-50%)",
        zIndex: 9999,
        pointerEvents: "none",
      }}
      className="flex items-center"
    >
      <span
        className="border-[5px] border-transparent border-r-gray-800"
        aria-hidden="true"
      />
      <span className="whitespace-nowrap rounded-md bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xl">
        {tooltip.label}
      </span>
    </div>
  );
}

function SidebarNavItem({
  item,
  isActive,
  collapsed,
  onClick,
  onTooltipShow,
  onTooltipHide,
}: {
  item: SidebarItem;
  isActive: boolean;
  collapsed: boolean;
  onClick?: () => void;
  onTooltipShow: (label: string, y: number) => void;
  onTooltipHide: () => void;
}) {
  const Icon = ICON_MAP[item.icon] ?? Package;
  const linkRef = useRef<HTMLAnchorElement>(null);

  function handleMouseEnter() {
    if (!collapsed) return;
    const rect = linkRef.current?.getBoundingClientRect();
    if (rect) onTooltipShow(item.label, rect.top + rect.height / 2);
  }

  return (
    <li>
      <Link
        ref={linkRef}
        href={item.href}
        onClick={onClick}
        aria-label={collapsed ? item.label : undefined}
        aria-current={isActive ? "page" : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={onTooltipHide}
        onFocus={handleMouseEnter}
        onBlur={onTooltipHide}
        className={[
          "flex items-center rounded-lg text-sm font-medium",
          "transition-colors duration-150",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]",
          collapsed
            ? "justify-center w-10 h-10 mx-auto"
            : "gap-3 px-3 py-2.5 w-full",
          isActive
            ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        ].join(" ")}
      >
        <Icon
          size={18}
          strokeWidth={isActive ? 2.5 : 1.75}
          className={`shrink-0 ${isActive ? "text-[var(--color-primary)]" : "text-gray-400"}`}
          aria-hidden="true"
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    </li>
  );
}

function ToggleButton({
  collapsed,
  onToggle,
  onTooltipShow,
  onTooltipHide,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onTooltipShow: (label: string, y: number) => void;
  onTooltipHide: () => void;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar";

  function handleMouseEnter() {
    if (!collapsed) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) onTooltipShow(label, rect.top + rect.height / 2);
  }

  return (
    <button
      ref={btnRef}
      onClick={onToggle}
      aria-label={label}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onTooltipHide}
      onFocus={handleMouseEnter}
      onBlur={onTooltipHide}
      className="
        w-8 h-8 rounded-lg flex items-center justify-center
        text-gray-400 hover:text-gray-700 hover:bg-gray-100
        transition-colors duration-150
        cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
      "
    >
      {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
    </button>
  );
}

function SidebarContent({
  pathname,
  collapsed,
  onToggleCollapsed,
  onNavClick,
}: {
  pathname: string;
  collapsed: boolean;
  onToggleCollapsed?: () => void;
  onNavClick?: () => void;
}) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const showTooltip = useCallback((label: string, y: number) => {
    setTooltip({ label, y });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  return (
    <>
      <FloatingTooltip tooltip={tooltip} />

      <div className="fixed flex flex-col h-full">
        {!collapsed ? (
          <div className="px-4 py-5 border-b border-gray-100 shrink-0">
            <Link
              href="/admin/dashboard"
              className="flex flex-col leading-none focus-visible:outline-none"
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
        ) : (
          <div className="h-14 border-b flex justify-center items-center border-gray-100 shrink-0">
            <span
              className={`

          text-xl font-extrabold text-[var(--color-primary)] tracking-tight shrink-0
          transition-all duration-300
          `}
            >
              SGOI
            </span>
          </div>
        )}

        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden py-4 ${collapsed ? "px-1.5" : "px-3"}`}
          aria-label="Admin navigation"
        >
          <ul role="list" className="flex flex-col gap-0.5">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(item.href));

              return (
                <SidebarNavItem
                  key={item.href}
                  item={item}
                  isActive={isActive}
                  collapsed={collapsed}
                  onClick={onNavClick}
                  onTooltipShow={showTooltip}
                  onTooltipHide={hideTooltip}
                />
              );
            })}
          </ul>
        </nav>

        {onToggleCollapsed && (
          <div
            className={`border-t border-gray-100 py-3 shrink-0 ${
              collapsed ? "px-1.5 flex justify-center" : "px-3 flex justify-end"
            }`}
          >
            <ToggleButton
              collapsed={collapsed}
              onToggle={onToggleCollapsed}
              onTooltipShow={showTooltip}
              onTooltipHide={hideTooltip}
            />
          </div>
        )}
      </div>
    </>
  );
}

export function AdminSidebarDesktop({
  collapsed,
  onToggleCollapsed,
  hydrated,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  hydrated: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Sidebar navigation"
      style={{
        width: collapsed ? SIDEBAR_WIDTH.collapsed : SIDEBAR_WIDTH.expanded,
        transition: hydrated ? "width 300ms ease-in-out" : "none",
      }}
      className="hidden lg:flex flex-col shrink-0 bg-white border-r border-gray-200 min-h-screen overflow-hidden"
    >
      <SidebarContent
        pathname={pathname}
        collapsed={collapsed}
        onToggleCollapsed={onToggleCollapsed}
      />
    </aside>
  );
}

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
      <div
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close navigation"
        >
          <X size={18} />
        </button>
        <SidebarContent
          pathname={pathname}
          collapsed={false}
          onNavClick={onClose}
        />
      </aside>
    </>
  );
}
