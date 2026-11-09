import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <RoutePlaceholder
      title="Agency Overview"
      stageNumber={4}
      stageName="Agency Dashboard"
      description="Executive command centre showing lead acquisition trends, follow-up accountability, and real-time revenue opportunities."
      icon={LayoutDashboard}
      plannedFeatures={[
        "Total, New, and Qualified lead KPI cards",
        "Overdue and Due Today follow-up alerts",
        "Lead acquisition trends & conversion charts",
        "Quick Action workflows (Add Lead, Import CSV, Add Client)",
        "Client and date-range filters scoped to agency tenant",
      ]}
    />
  );
}
