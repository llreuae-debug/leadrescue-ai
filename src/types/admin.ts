export type PlatformRole = "super_admin" | "support_agent" | "none";

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  isSuperAdmin: boolean;
  role: PlatformRole;
}

export interface AdminPlatformMetrics {
  totalAgencies: number;
  activeAgencies: number;
  suspendedAgencies: number;
  activePaidSubscriptions: number;
  trialAccounts: number;
  pendingManualPayments: number;
  platformMonthlyRevenuePKR: number;
  totalLeadsManaged: number;
}

export interface AdminAgencySummary {
  id: string;
  name: string;
  slug: string;
  ownerEmail: string;
  planTier: "starter" | "growth" | "advanced";
  subscriptionStatus: "active" | "trialing" | "past_due" | "canceled";
  accountStatus: "active" | "suspended";
  suspensionReason?: string | null;
  totalClients: number;
  totalLeads: number;
  createdAt: string;
}

export interface AdminPaymentReviewItem {
  id: string;
  agencyId: string;
  agencyName: string;
  planId: "starter" | "growth" | "advanced";
  amountPKR: number;
  bankName: string;
  transactionReference: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  submittedAt: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
}

export interface AdminPlanDefinition {
  id: "starter" | "growth" | "advanced";
  name: string;
  pricePKR: number;
  interval: "month" | "year";
  maxClients: number;
  maxLeadsPerMonth: number;
  maxTeamSeats: number;
  maxAiDraftsPerMonth: number;
  isActive: boolean;
  updatedAt: string;
}

export interface AdminAuditEvent {
  id: string;
  actorId: string;
  actorEmail: string;
  action:
    | "agency_suspended"
    | "agency_reactivated"
    | "payment_approved"
    | "payment_rejected"
    | "plan_updated"
    | "admin_login";
  targetType: "agency" | "subscription" | "plan" | "session";
  targetId: string;
  reason?: string | null;
  metadata?: Record<string, any>;
  timestamp: string;
}
