// app/admin/(protected)/layout.tsx

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  validateAndRefreshSession,
} from "@/lib/auth/session";
import AdminShell from "@/components/(admin)/(layout)/adminShell";
import { SidebarProvider } from "@/lib/context/sidebarContext";
import "@/app/globals.css";

// ─── Font ──────────────────────────────────────────────────────────────────────

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: { default: "Admin | SGOI Pvt Ltd", template: "%s | SGOI Admin" },
  description: "Admin panel",
  robots: { index: false, follow: false },
};

// ─── Layout ────────────────────────────────────────────────────────────────────

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const jwt = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // No cookie at all — send to login
  // The login page is inside (protected) so it renders via the bare-html
  // path below; all other routes redirect.
  if (!jwt) {
    // Allow the login page itself to render without the admin shell
    return (
      <html lang="en" className={geistSans.variable}>
        <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
      </html>
    );
  }

  // ── Validate session with protection against transient DB errors ───────────
  // Free-tier MongoDB Atlas clusters can go to sleep after inactivity.
  // A cold-start connection can take 2–5s and sometimes throws on the first
  // attempt. Without this guard, a momentary DB hiccup returns null from
  // validateAndRefreshSession, which previously caused the layout to silently
  // drop the AdminShell — making the header and sidebar disappear.
  let session = null;
  try {
    session = await validateAndRefreshSession(jwt);
  } catch (err) {
    // Log but do not crash — treat as unauthenticated and redirect cleanly
    console.error("[AdminLayout] Session validation error:", err);
  }

  if (!session) {
    // Session is invalid or expired — redirect to login with callbackUrl
    // so the user lands back where they were after re-authenticating.
    // This replaces the previous bare-shell render that caused the header
    // and sidebar to disappear without explanation.
    redirect("/admin/login");
  }

  const adminEmail = session.email;

  return (
    <html lang="en" className={geistSans.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <SidebarProvider>
          <AdminShell adminEmail={adminEmail}>{children}</AdminShell>
        </SidebarProvider>
      </body>
    </html>
  );
}
