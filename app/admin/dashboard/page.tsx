import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  validateAndRefreshSession,
} from "@/lib/auth/session";
import LogoutButton from "../logoutButton";
import { ShieldCheck } from "lucide-react";

/**
 * Admin Dashboard — Server Component
 *
 * Performs the full DB-level session validation (not just JWT check).
 * If the session is invalid or expired, redirects to login.
 */
export default async function AdminDashboardPage() {
  // Full server-side session validation
  const cookieStore = await cookies();
  const jwt = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!jwt) {
    redirect("/admin/login");
  }

  const session = await validateAndRefreshSession(jwt);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className="text-[var(--color-primary)]" />
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              SGOI Admin
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back. You are securely logged in.
          </p>
        </div>

        {/* Placeholder cards — replace with real dashboard content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {["Products", "Orders", "Content"].map((section) => (
            <div
              key={section}
              className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-2"
            >
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                {section}
              </h2>
              <p className="text-3xl font-bold text-gray-900">—</p>
              <p className="text-xs text-gray-400">Coming soon</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
