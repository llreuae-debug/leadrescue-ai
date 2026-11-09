import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { Kanban } from "lucide-react";

export default function PipelinePage() {
  return (
    <RoutePlaceholder
      title="Sales Pipeline"
      stageNumber={6}
      stageName="Sales Pipeline"
      description="Visual Kanban board tracking lead progression from initial enquiry to closed won opportunities."
      icon={Kanban}
      plannedFeatures={[
        "Responsive Kanban board (New, Contacted, Qualified, Follow-up, Proposal, Won, Lost)",
        "Database-backed stage updates with optimistic UI and error recovery",
        "Keyboard-accessible stage selector for full accessibility compliance",
        "Loss reason capture and conversion analytics",
        "Narrow-screen and mobile-responsive list view",
      ]}
    />
  );
}
