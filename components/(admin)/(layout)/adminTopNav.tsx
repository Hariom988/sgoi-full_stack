"use client";

import { useState } from "react";
import { Menu, Search, Bell, LogOut } from "lucide-react";

// ─── Props ─────────────────────────────────────────────────────────────────────

interface AdminTopNavProps {
  adminEmail: string;
  sidebarCollapsed: boolean;
  onMenuToggle: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(email: string): string {
  const name = email.split("@")[0];
  const parts = name.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

// ─── Logout handler ────────────────────────────────────────────────────────────

async function performLogout() {
  try {
    const csrfRes = await fetch("/api/admin/auth/csrf");
    const csrfData = await csrfRes.json();
    const csrfToken: string = csrfData.csrfToken ?? "";

    await fetch("/api/admin/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
    });
  } catch {
    // still redirect regardless
  } finally {
    window.location.href = "/admin/login";
  }
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AdminTopNav({
  adminEmail,
  sidebarCollapsed,
  onMenuToggle,
}: AdminTopNavProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const initials = getInitials(adminEmail);

  async function handleLogout() {
    setIsLoggingOut(true);
    await performLogout();
  }

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 sm:px-6 gap-4">
      {/* Mobile hamburger — always visible on mobile */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu size={20} />
      </button>

      {/* Search bar — center, fills remaining space */}
      <div className="flex-1 max-w-md ">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search anything......"
            className="
              w-full pl-8 pr-4 py-2 text-sm
              bg-gray-50 border border-gray-200 rounded-lg
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]
              transition-shadow
            "
            aria-label="Global search"
          />
        </div>
      </div>

      {/* Right — bell + user + logout */}
      <div className="flex items-center ml-auto gap-2 sm:gap-3 shrink-0">
        {/* Bell — visual only */}
        <button
          className="relative p-1.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"
            aria-hidden="true"
          />
        </button>

        {/* Avatar + email — hidden on small mobile */}
        <div className="hidden sm:flex items-center gap-2.5 pl-2 border-l border-gray-200">
          <div
            className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <div className="hidden md:flex flex-col leading-tight">
            <span className="text-xs font-semibold text-gray-800">
              Admin User
            </span>
            <span className="text-[11px] text-gray-400 truncate max-w-[140px]">
              {adminEmail}
            </span>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-xs font-medium text-gray-600
            hover:text-gray-900 hover:bg-gray-100
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-colors duration-150
          "
          aria-label="Sign out"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">
            {isLoggingOut ? "Signing out…" : "Sign out"}
          </span>
        </button>
      </div>
    </header>
  );
}
