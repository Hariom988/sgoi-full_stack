"use client";

import { useState, useEffect } from "react";
import { AdminSidebarDesktop, AdminSidebarDrawer } from "./adminSidebar";
import AdminTopNav from "./adminTopNav";

const COLLAPSED_STORAGE_KEY = "admin_sidebar_collapsed";

interface AdminShellProps {
  adminEmail: string;
  children: React.ReactNode;
}

export default function AdminShell({ adminEmail, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  // Suppresses the width transition on first paint until localStorage is read,
  // preventing a visible expand→collapse jump on hydration.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (stored === "true") setCollapsed(true);
    } catch {
      // localStorage unavailable — silently ignore
    }
    setHydrated(true);
  }, []);

  function handleToggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar — width controlled by config via inline style */}
      <AdminSidebarDesktop
        collapsed={collapsed}
        onToggleCollapsed={handleToggleCollapsed}
        hydrated={hydrated}
      />

      {/* Mobile drawer — always full width, unaffected by collapse state */}
      <AdminSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Content area — flex-1 fills the remaining viewport width automatically.
          No manual margin/padding offsets needed; the sidebar's inline width
          drives the flex layout directly. */}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminTopNav
          adminEmail={adminEmail}
          sidebarCollapsed={collapsed}
          onMenuToggle={() => setDrawerOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
