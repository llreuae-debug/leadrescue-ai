import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { Clock } from "lucide-react";

export default function FollowUpsPage() {
  return (
    <RoutePlaceholder
      title="Follow-up Accountability"
      stageNumber={7}
      stageName="Follow-up Task Management"
      description="Zero neglected leads. Schedule, track, snooze, and execute timely personalised follow-ups across agency reps."
      icon={Clock}
      plannedFeatures={[
        "Date views: Today, Overdue, Upcoming, Completed, Snoozed",
        "Agency timezone-aware due dates and UTC persistence",
        "Quick completion, rescheduling, and audit history",
        "AI follow-up message generation integration",
        "Safe WhatsApp draft opening flow without unofficial scrapers",
      ]}
    />
  );
}
