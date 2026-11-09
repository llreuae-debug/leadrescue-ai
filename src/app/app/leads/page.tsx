import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { Users } from "lucide-react";

export default function LeadsPage() {
  return (
    <RoutePlaceholder
      title="Lead Management"
      stageNumber={5}
      stageName="Clients and Lead Management"
      description="Centralised enquiry repository with search, multi-filter criteria, CSV import, duplicate detection, and audit timelines."
      icon={Users}
      plannedFeatures={[
        "Lead CRUD with client, source, campaign, and deal value tracking",
        "Multi-criteria filtering (client, source, status, assignee, date)",
        "Pre-import CSV column mapping and row validation",
        "Lead activity timeline and history logs",
        "Duplicate enquiry detection with merge review",
      ]}
    />
  );
}
