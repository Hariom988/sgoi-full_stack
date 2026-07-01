"use client";

// components/(admin)/(layout)/adminShell.tsx

import { useState } from "react";
import { AdminSidebarDesktop, AdminSidebarDrawer } from "./adminSidebar";
import AdminTopNav from "./adminTopNav";
import { useSidebar } from "@/lib/context/sidebarContext";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface AdminShellProps {
  adminEmail: string;
  children: React.ReactNode;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AdminShell({ adminEmail, children }: AdminShellProps) {
  // All collapse state + localStorage persistence now lives in SidebarContext.
  // AdminShell is only responsible for the mobile drawer (local UI state only).
  const { isCollapsed, hydrated, toggle } = useSidebar();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar — collapses/expands via context toggle */}
      <AdminSidebarDesktop
        collapsed={isCollapsed}
        onToggleCollapsed={toggle}
        hydrated={hydrated}
      />

      {/* Mobile drawer — always fully expanded, separate from collapse state */}
      <AdminSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Content area — flex-1 fills remaining width automatically.
          The sidebar's inline width drives the layout; no manual offsets needed. */}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminTopNav
          adminEmail={adminEmail}
          sidebarCollapsed={isCollapsed}
          onMenuToggle={() => setDrawerOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
