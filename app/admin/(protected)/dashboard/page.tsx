import type { Metadata } from "next";
import PlaceholderPage from "@/components/(admin)/(shared)/placeholderPage";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <PlaceholderPage
      title="Dashboard"
      description="Overview analytics, sales trend, and recent orders will appear here."
    />
  );
}
