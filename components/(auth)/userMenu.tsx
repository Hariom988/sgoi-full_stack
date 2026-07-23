"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { LogOut, User as UserIcon } from "lucide-react";

export interface NavUser {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface UserMenuProps {
  user: NavUser;
}

function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("csrf_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [supportsHover, setSupportsHover] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : false,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Subscribe to pointer/hover capability changes (e.g. a laptop with a
  // touchscreen switching input modes) after the initial render above.
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const handleChange = (e: MediaQueryListEvent) =>
      setSupportsHover(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function handleMouseEnter() {
    if (!supportsHover) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleMouseLeave() {
    if (!supportsHover) return;
    closeTimer.current = setTimeout(() => setOpen(false), 150);
  }

  function handleTriggerClick() {
    setOpen((v) => !v);
  }

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const csrfRes = await fetch("/api/auth/csrf");
      const csrfData = await csrfRes.json();
      const csrfToken: string =
        csrfData.csrfToken ?? getCsrfTokenFromCookie() ?? "";

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
      });
    } catch {
      // Even on network failure, fall through and force a reload below —
      // worst case the cookie is still present and the next request re-auths.
    } finally {
      window.location.href = "/";
    }
  }, []);

  const initial = user.name.trim().charAt(0).toUpperCase() || "?";

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        type="button"
        onClick={handleTriggerClick}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user.name}`}
        className="
          flex items-center justify-center w-8 h-8 shrink-0
          rounded-full overflow-hidden
          bg-primary text-white text-sm font-semibold
          hover:opacity-90 transition-opacity duration-150
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
        "
      >
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{initial}</span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="
            absolute right-0 mt-2 w-56
            rounded-lg border border-gray-200 bg-white shadow-lg
            py-2 z-50
          "
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            href="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="
              flex items-center gap-2 px-4 py-2
              text-sm text-gray-700 hover:bg-gray-50
              transition-colors duration-150
            "
          >
            <UserIcon size={16} />
            My Profile
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="
              w-full flex items-center gap-2 px-4 py-2
              text-sm text-red-600 hover:bg-red-50
              transition-colors duration-150
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            <LogOut size={16} />
            {isLoggingOut ? "Signing out…" : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
