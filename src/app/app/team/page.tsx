import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { UserCheck } from "lucide-react";

export default function TeamPage() {
  return (
    <RoutePlaceholder
      title="Team & Access Control"
      stageNumber={10}
      stageName="Team Management and Permissions"
      description="Role-based access management with server-enforced permissions for Owners, Admins, Managers, Reps, and Viewers."
      icon={UserCheck}
      plannedFeatures={[
        "Granular permission matrix (Owner, Admin, Manager, Sales Rep, Viewer)",
        "Secure invitation lifecycle with server token validation",
        "Last Owner protection and demotion guards",
        "Lead re-assignment workflows and team audit trail",
      ]}
    />
  );
}
