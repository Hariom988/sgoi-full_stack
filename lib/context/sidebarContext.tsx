"use client";

// lib/context/sidebarContext.tsx

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

// ─── Constants ─────────────────────────────────────────────────────────────────

const COLLAPSED_STORAGE_KEY = "admin_sidebar_collapsed";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SidebarContextType {
  isCollapsed: boolean;
  hydrated: boolean;
  toggle: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────

const SidebarContext = createContext<SidebarContextType | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // hydrated = false until localStorage has been read on the client.
  // AdminSidebarDesktop uses this to suppress the width-transition on first
  // paint, preventing a flash-of-wrong-width when the stored value differs
  // from the SSR default (false).
  const [hydrated, setHydrated] = useState(false);

  // Read persisted state once on mount (client only)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COLLAPSED_STORAGE_KEY);
      if (stored === "true") setIsCollapsed(true);
    } catch {
      // localStorage unavailable (private browsing, etc.) — use default
    }
    setHydrated(true);
  }, []);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_STORAGE_KEY, String(next));
      } catch {
        // ignore write failures
      }
      return next;
    });
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, hydrated, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useSidebar(): SidebarContextType {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used inside <SidebarProvider>");
  }
  return ctx;
}
