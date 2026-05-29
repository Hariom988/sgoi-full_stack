import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin — SGOI Pvt Ltd",
  description: "Admin panel",
  robots: {
    index: false, // Tell search engines not to index admin pages
    follow: false,
  },
};

/**
 * Admin layout is fully isolated from the public layout.
 * No public Navbar or Footer is rendered here.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="min-h-screen bg-gray-50 antialiased">{children}</body>
    </html>
  );
}
