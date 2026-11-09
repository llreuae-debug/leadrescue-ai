import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { Building2 } from "lucide-react";

export default function ClientsPage() {
  return (
    <RoutePlaceholder
      title="Client Workspaces"
      stageNumber={5}
      stageName="Clients and Lead Management"
      description="Organise client brands, manage client permissions, and isolate inbound leads per client account."
      icon={Building2}
      plannedFeatures={[
        "Client directory with lead counts and account manager assignment",
        "Client detail views (Overview, Leads, Pipeline, Reports, Settings)",
        "Client tenant isolation and access controls",
        "Client branding and communication settings",
      ]}
    />
  );
}
