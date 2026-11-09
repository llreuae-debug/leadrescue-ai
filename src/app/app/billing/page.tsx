import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { CreditCard } from "lucide-react";

export default function BillingPage() {
  return (
    <RoutePlaceholder
      title="Subscription & Billing"
      stageNumber={12}
      stageName="Billing and Subscription Entitlements"
      description="Manage agency subscriptions, pilot manual payment reviews (PKR), usage limits, and receipts."
      icon={CreditCard}
      plannedFeatures={[
        "Configurable tiers: Starter (PKR 2,999), Growth (PKR 6,999), Advanced (PKR 14,999)",
        "Manual Pakistan payment review workflow (slip upload, transaction ID)",
        "Server-enforced quota limits on leads, team seats, and AI generation",
        "Auditable payment status lifecycle (Pending, Approved, Rejected, Active)",
      ]}
    />
  );
}
