import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { BarChart3 } from "lucide-react";

export default function ReportsPage() {
  return (
    <RoutePlaceholder
      title="Reports & Analytics"
      stageNumber={9}
      stageName="Reports and Analytics"
      description="Transparent agency analytics with clear definitions for contact rate, qualification rate, and follow-up completion."
      icon={BarChart3}
      plannedFeatures={[
        "Lead acquisition over time and source attribution",
        "Documented metrics: Contact rate, Qualification rate, Completion rate",
        "Cohort analysis and client comparison tables",
        "Filtered exports (CSV) scoped to authenticated agency records",
        "Zero synthetic or misleading charts in production",
      ]}
    />
  );
}
