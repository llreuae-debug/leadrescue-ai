import { LeadPriority, LeadStatus, TaskType } from "./database";

export type AssistantLanguage = "en" | "ur";

export type AssistantTone = "professional" | "friendly" | "concise";

export type AssistantIntent =
  | "summarize_history"
  | "draft_whatsapp"
  | "draft_email"
  | "suggest_questions"
  | "suggest_next_action"
  | "handle_objection"
  | "custom_prompt";

export type ObjectionCategory =
  | "price_too_high"
  | "send_proposal_first"
  | "already_bought"
  | "need_partner_approval"
  | "follow_up_later";

export interface LeadContextSnapshot {
  id: string;
  agencyId: string;
  clientId: string;
  clientName: string;
  clientIndustry?: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  source: string;
  campaign?: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  dealValue: number;
  notes?: string | null;
  lastContactedAt?: string | null;
  nextFollowUpAt?: string | null;
  activities: {
    action: string;
    details?: string;
    timestamp: string;
  }[];
  pendingTasks: {
    taskType: TaskType;
    dueAt: string;
    notes?: string | null;
  }[];
}

export interface AssistantResponse {
  id: string;
  intent: AssistantIntent;
  language: AssistantLanguage;
  tone: AssistantTone;
  content: string;
  groundedFacts: string[];
  missingFacts: string[];
  suggestedNextSteps: string[];
  requiresHumanReview: boolean;
  generatedAt: string;
  leadId: string;
  leadName: string;
}

export interface AssistantQuota {
  planTier: string;
  requestsUsed: number;
  requestLimit: number;
  resetDate: string;
}
