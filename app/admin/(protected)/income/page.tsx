import type { Metadata } from "next";
import PlaceholderPage from "@/components/(admin)/(shared)/placeholderPage";

export const metadata: Metadata = {
  title: "Income",
};

export default function IncomePage() {
  return (
    <PlaceholderPage
      title="Income"
      description="Revenue reports, earnings breakdown, and financial summaries will appear here."
    />
  );
}
