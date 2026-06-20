import type { Metadata } from "next";
import PlaceholderPage from "@/components/(admin)/(shared)/placeholderPage";

export const metadata: Metadata = {
  title: "Orders",
};

export default function OrdersPage() {
  return (
    <PlaceholderPage
      title="Orders"
      description="Order management, fulfilment tracking, and status updates will be available here."
    />
  );
}
