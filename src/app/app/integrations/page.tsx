import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { Blocks } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <RoutePlaceholder
      title="Integrations Centre"
      stageNumber={11}
      stageName="Integrations"
      description="Connect inbound lead sources including website forms, CSV feeds, Meta Lead Ads, Google Sheets, and WhatsApp."
      icon={Blocks}
      plannedFeatures={[
        "Real-time connection states: Not Connected, Pending, Connected, Error",
        "Secure webhook signature verification and idempotency handling",
        "Website embedded lead capture form endpoints",
        "Official WhatsApp Business Cloud API integration",
        "Strict verification check before displaying 'Connected' status",
      ]}
    />
  );
}
