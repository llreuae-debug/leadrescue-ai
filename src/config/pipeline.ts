import type { LeadStatus } from "@/types/database";

export interface PipelineStageConfig {
  id: LeadStatus;
  label: string;
  color: string;
  description: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  { id: "new", label: "New", color: "bg-blue-500", description: "Fresh inbound enquiries" },
  { id: "contacted", label: "Contacted", color: "bg-slate-500", description: "Initial outreach attempted" },
  { id: "qualified", label: "Qualified", color: "bg-indigo-500", description: "Budget & intent confirmed" },
  { id: "follow_up_required", label: "Follow-up Required", color: "bg-amber-500", description: "Follow-up scheduled or overdue" },
  { id: "proposal_sent", label: "Proposal Sent", color: "bg-purple-500", description: "Formal quotation delivered" },
  { id: "won", label: "Won", color: "bg-emerald-500", description: "Closed and revenue credited" },
  { id: "lost", label: "Lost", color: "bg-rose-500", description: "Lost to competitor or budget constraint" },
];
