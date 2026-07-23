"use client";

import { useRouter, usePathname } from "next/navigation";

export type AuthMode = "login" | "register";

interface AuthTabsProps {
  active: AuthMode;
}

export default function AuthTabs({ active }: AuthTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(mode: AuthMode) {
    if (mode === active) return;
    router.replace(`${pathname}?mode=${mode}`, { scroll: false });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      switchTo(active === "login" ? "register" : "login");
    }
  }

  const tabBaseClasses =
    "py-4 text-center text-sm font-bold tracking-wide uppercase border-b-2 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset";

  return (
    <div
      role="tablist"
      aria-label="Sign in or create an account"
      onKeyDown={handleKeyDown}
      className="grid grid-cols-2 border-b border-gray-200"
    >
      <button
        type="button"
        role="tab"
        id="auth-tab-login"
        aria-selected={active === "login"}
        aria-controls="auth-tabpanel"
        tabIndex={active === "login" ? 0 : -1}
        onClick={() => switchTo("login")}
        className={`${tabBaseClasses} ${
          active === "login"
            ? "text-primary border-primary"
            : "text-gray-400 border-transparent hover:text-gray-600"
        }`}
      >
        Sign in
      </button>
      <button
        type="button"
        role="tab"
        id="auth-tab-register"
        aria-selected={active === "register"}
        aria-controls="auth-tabpanel"
        tabIndex={active === "register" ? 0 : -1}
        onClick={() => switchTo("register")}
        className={`${tabBaseClasses} ${
          active === "register"
            ? "text-primary border-primary"
            : "text-gray-400 border-transparent hover:text-gray-600"
        }`}
      >
        Create account
      </button>
    </div>
  );
}
