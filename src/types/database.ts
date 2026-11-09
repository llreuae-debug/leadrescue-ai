export type AgencyRole =
  | "owner"
  | "admin"
  | "manager"
  | "sales_representative"
  | "viewer";

export type MembershipStatus = "active" | "invited" | "suspended";

export type ClientStatus = "active" | "paused" | "archived";

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "follow_up_required"
  | "proposal_sent"
  | "won"
  | "lost";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export type TaskType = "call" | "whatsapp" | "email" | "meeting";

export type TaskStatus = "pending" | "completed" | "snoozed" | "cancelled";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Agency {
  id: string;
  name: string;
  business_email?: string | null;
  country: string;
  city?: string | null;
  timezone: string;
  preferred_language: "en" | "ur";
  agency_size?: string | null;
  business_type?: string | null;
  plan_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgencyMember {
  id: string;
  agency_id: string;
  user_id: string;
  role: AgencyRole;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface ClientWorkspace {
  id: string;
  agency_id: string;
  name: string;
  industry: string;
  status: ClientStatus;
  account_manager_id?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
  account_manager?: Profile | null;
}

export interface Lead {
  id: string;
  agency_id: string;
  client_id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  source: string;
  campaign?: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  deal_value: number;
  assigned_to?: string | null;
  last_contacted_at?: string | null;
  next_follow_up_at?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  client?: ClientWorkspace;
  assignee?: Profile | null;
}

export interface FollowUpTask {
  id: string;
  agency_id: string;
  client_id: string;
  lead_id: string;
  assigned_to?: string | null;
  due_at: string;
  task_type: TaskType;
  notes?: string | null;
  status: TaskStatus;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  lead?: Lead;
  client?: ClientWorkspace;
}

export interface LeadActivity {
  id: string;
  agency_id: string;
  lead_id: string;
  actor_id?: string | null;
  action: string;
  details: Record<string, any>;
  created_at: string;
  actor?: Profile | null;
}

export interface DashboardMetrics {
  totalLeads: number;
  newLeads: number;
  qualifiedLeads: number;
  followUpsDueToday: number;
  overdueFollowUps: number;
  wonOpportunities: number;
  totalPipelineValue: number;
  acquisitionTrend: {
    period: string;
    count: number;
  }[];
  leadSources: {
    source: string;
    count: number;
    percentage: number;
  }[];
  recentActivities: {
    id: string;
    leadName: string;
    clientName: string;
    action: string;
    timestamp: string;
  }[];
  urgentFollowUps: {
    id: string;
    leadId: string;
    leadName: string;
    clientName: string;
    phone?: string | null;
    dueAt: string;
    isOverdue: boolean;
    taskType: TaskType;
  }[];
  aiRecommendations: {
    id: string;
    title: string;
    description: string;
    leadId?: string;
    actionType: "draft_whatsapp" | "sla_alert" | "qualification";
  }[];
}
