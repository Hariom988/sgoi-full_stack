// app/admin/(protected)/layout.tsx

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
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

  if (!jwt) {
    return (
      <html lang="en" className={geistSans.variable}>
        <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
      </html>
    );
  }

  const session = await validateAndRefreshSession(jwt);

  // Invalid / expired session — same bare shell, middleware will redirect
  if (!session) {
    return (
      <html lang="en" className={geistSans.variable}>
        <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
      </html>
    );
  }

  // Use the email from the validated session token — not a hardcoded string
  const adminEmail = session.email;

  return (
    <html lang="en" className={geistSans.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">
        {/*
          SidebarProvider owns collapse state + localStorage persistence.
          AdminShell consumes it via useSidebar() — no prop drilling needed.
          Every admin page inside this layout automatically gets the sidebar.
        */}
        <SidebarProvider>
          <AdminShell adminEmail={adminEmail}>{children}</AdminShell>
        </SidebarProvider>
      </body>
    </html>
  );
}
