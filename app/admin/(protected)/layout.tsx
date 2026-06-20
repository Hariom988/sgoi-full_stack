import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  validateAndRefreshSession,
} from "@/lib/auth/session";
import AdminShell from "@/components/(admin)/(layout)/adminShell";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Admin | SGOI Pvt Ltd", template: "%s | SGOI Admin" },
  description: "Admin panel",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // NOTE: Auth is already handled by proxy.ts (middleware).
  // Unauthenticated requests never reach here — proxy.ts redirects them to /admin/login.
  // The only unauthenticated route that reaches this layout is /admin/login itself,
  // which is why we must NOT redirect here — doing so causes an infinite 307 loop.
  //
  // This layout only provides the shell UI (sidebar + topnav) for authenticated pages.
  // For the login page, children renders directly without the shell.

  const cookieStore = await cookies();
  const jwt = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  // No session = this is the login page coming through.
  // Render children directly — no shell, no redirect.
  if (!jwt) {
    return (
      <html lang="en" className={geistSans.variable}>
        <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
      </html>
    );
  }

  const session = await validateAndRefreshSession(jwt);

  // Invalid session = also render without shell.
  // proxy.ts will handle the redirect on the next navigation.
  if (!session) {
    return (
      <html lang="en" className={geistSans.variable}>
        <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
      </html>
    );
  }

  // TODO: fetch real admin email from DB using session.adminId
  const adminEmail = "admin@sgoi.in";

  return (
    <html lang="en" className={geistSans.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <AdminShell adminEmail={adminEmail}>{children}</AdminShell>
      </body>
    </html>
  );
}
