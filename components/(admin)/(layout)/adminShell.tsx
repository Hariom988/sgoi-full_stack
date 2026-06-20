"use client";

import { useState } from "react";
import { AdminSidebarDesktop, AdminSidebarDrawer } from "./adminSidebar";
import AdminTopNav from "./adminTopNav";

interface AdminShellProps {
  adminEmail: string;
  children: React.ReactNode;
}

export default function AdminShell({ adminEmail, children }: AdminShellProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop sidebar — always visible lg+ */}
      <AdminSidebarDesktop />

      {/* Mobile drawer */}
      <AdminSidebarDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        <AdminTopNav
          adminEmail={adminEmail}
          onMenuToggle={() => setDrawerOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
