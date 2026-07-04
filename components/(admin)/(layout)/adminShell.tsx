"use client";
import { useState } from "react";
import { AdminSidebarDesktop, AdminSidebarDrawer } from "./adminSidebar";
import AdminTopNav from "./adminTopNav";
import { useSidebar } from "@/lib/context/sidebarContext";
interface AdminShellProps {
  adminEmail: string;
  children: React.ReactNode;
}

export default function AdminShell({ adminEmail, children }: AdminShellProps) {
  const { isCollapsed, hydrated, toggle } = useSidebar();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebarDesktop
        collapsed={isCollapsed}
        onToggleCollapsed={toggle}
        hydrated={hydrated}
      />
      <AdminSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
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
