"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

function getCsrfTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("csrf_token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      // Fetch a fresh CSRF token first (the cookie may have expired)
      const csrfRes = await fetch("/api/admin/auth/csrf");
      const csrfData = await csrfRes.json();
      const csrfToken: string =
        csrfData.csrfToken ?? getCsrfTokenFromCookie() ?? "";

      await fetch("/api/admin/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
      });

      router.push("/admin/login");
      router.refresh();
    } catch {
      // Even if the request fails, redirect to login
      router.push("/admin/login");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="
        inline-flex items-center gap-2
        text-sm font-medium text-gray-600 hover:text-gray-900
        px-3 py-1.5 rounded-lg
        hover:bg-gray-100
        transition-colors duration-150
        disabled:opacity-60 disabled:cursor-not-allowed
      "
      aria-label="Sign out of admin panel"
    >
      <LogOut size={16} />
      {isLoggingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
