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
  const cookieStore = await cookies();
  const jwt = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!jwt) {
    return (
      <html lang="en" className={geistSans.variable}>
        <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
      </html>
    );
  }

  let session = null;
  try {
    session = await validateAndRefreshSession(jwt);
  } catch (err) {
    console.error("[AdminLayout] Session validation error:", err);
  }

  if (!session) {
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
