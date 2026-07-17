"use client";

import Link from "next/link";

interface AuthTabsProps {
  active: "signin" | "register";
}

export default function AuthTabs({ active }: AuthTabsProps) {
  return (
    <div className="grid grid-cols-2 border-b border-gray-200">
      <Link
        href="/login"
        className={`
          py-4 text-center text-sm font-bold tracking-wide uppercase
          border-b-2 transition-colors duration-150
          ${
            active === "signin"
              ? "text-[var(--color-primary)] border-[var(--color-primary)]"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }
        `}
      >
        Sign in
      </Link>
      <Link
        href="/register"
        className={`
          py-4 text-center text-sm font-bold tracking-wide uppercase
          border-b-2 transition-colors duration-150
          ${
            active === "register"
              ? "text-[var(--color-primary)] border-[var(--color-primary)]"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }
        `}
      >
        Create account
      </Link>
    </div>
  );
}
