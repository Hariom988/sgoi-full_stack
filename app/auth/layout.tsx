import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "SGOI Pvt Ltd.", template: "%s | SGOI Pvt Ltd." },
  description: "Sign in or create an account with SGOI Pvt Ltd.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.variable}>
      <body className="min-h-screen bg-gray-50 antialiased flex items-center justify-center px-4 py-10">
        {children}
      </body>
    </html>
  );
}
