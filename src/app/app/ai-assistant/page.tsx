import { RoutePlaceholder } from "@/components/shell/RoutePlaceholder";
import { Sparkles } from "lucide-react";

export default function AiAssistantPage() {
  return (
    <RoutePlaceholder
      title="AI Sales Assistant"
      stageNumber={8}
      stageName="AI Sales Assistant"
      description="Grounded AI assistant to summarise lead history, craft objection responses, and draft English or Urdu follow-ups."
      icon={Sparkles}
      plannedFeatures={[
        "Server-side grounded generation using verified database facts only",
        "Dual-language drafts: English and Urdu (Nastaliq/Naskh typography)",
        "Tone selection: Professional, Friendly, Concise",
        "Objection-handling playbooks and qualification questions",
        "Human-in-the-loop review safeguard (no automatic unsanctioned messaging)",
      ]}
    />
  );
}
