import type { Metadata } from "next";
import PlaceholderPage from "@/components/(admin)/(shared)/placeholderPage";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <PlaceholderPage
      title="Settings"
      description="Admin configuration, account settings, and preferences will be available here."
    />
  );
}
