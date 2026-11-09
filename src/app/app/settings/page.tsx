import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <RoutePlaceholder
      title="Agency Settings"
      stageNumber={3}
      stageName="Agency Workspace & Multi-Tenant Foundations"
      description="Agency profile, default timezone, currency (PKR), notification preferences, and team configuration."
      icon={Settings}
      plannedFeatures={[
        "Agency business details (Name, Email, Phone, Country, City)",
        "Timezone configuration for accurate follow-up due calculations",
        "Language & direction preference (English LTR / Urdu RTL)",
        "Security, session logs, and tenant data export",
      ]}
    />
  );
}
