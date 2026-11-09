"use server";

import { createClient } from "@/lib/supabase/server";
import {
  SuperAdminUser,
  AdminPlatformMetrics,
  AdminAgencySummary,
  AdminPaymentReviewItem,
  AdminPlanDefinition,
  AdminAuditEvent,
} from "@/types/admin";
import {
  verifySuperAdminAccess,
  createAdminAuditEvent,
  validatePlanUpdate,
} from "@/lib/admin/admin-security";

// Mock Super Admin actor for preview/local environments
const CURRENT_SUPER_ADMIN: SuperAdminUser = {
  id: "admin-root-01",
  email: "security@leadrescue.ai",
  name: "Platform Security Officer",
  isSuperAdmin: true,
  role: "super_admin",
};

// Seed dataset of platform agencies
let MOCK_AGENCIES: AdminAgencySummary[] = [
  {
    id: "agency-alpha",
    name: "Apex Media Pakistan",
    slug: "apex-media-pk",
    ownerEmail: "owner@apexmedia.pk",
    planTier: "growth",
    subscriptionStatus: "active",
    accountStatus: "active",
    totalClients: 8,
    totalLeads: 864,
    createdAt: "2026-10-15T09:00:00Z",
  },
  {
    id: "agency-crescent",
    name: "Crescent Digital Lahore",
    slug: "crescent-digital",
    ownerEmail: "tariq@crescentdigital.pk",
    planTier: "starter",
    subscriptionStatus: "active",
    accountStatus: "active",
    totalClients: 3,
    totalLeads: 215,
    createdAt: "2026-10-28T14:30:00Z",
  },
  {
    id: "agency-karachi-media",
    name: "Indus Growth Partners",
    slug: "indus-growth",
    ownerEmail: "hamza@indusgrowth.com",
    planTier: "advanced",
    subscriptionStatus: "active",
    accountStatus: "active",
    totalClients: 19,
    totalLeads: 3410,
    createdAt: "2026-09-10T11:00:00Z",
  },
  {
    id: "agency-rapid-leads",
    name: "Rapid Lead Generation PK",
    slug: "rapid-leads-pk",
    ownerEmail: "contact@rapidleads.pk",
    planTier: "starter",
    subscriptionStatus: "past_due",
    accountStatus: "suspended",
    suspensionReason: "Terms of Service violation: Unsolicited cold WhatsApp broadcasts without lead opt-in",
    totalClients: 1,
    totalLeads: 45,
    createdAt: "2026-11-01T16:20:00Z",
  },
];

let MOCK_PAYMENTS: AdminPaymentReviewItem[] = [
  {
    id: "pay-rev-101",
    agencyId: "agency-alpha",
    agencyName: "Apex Media Pakistan",
    planId: "growth",
    amountPKR: 6999,
    bankName: "Meezan Bank (IBFT)",
    transactionReference: "MEZN-992819201",
    status: "approved",
    submittedAt: "2026-11-05T12:00:00Z",
    reviewedBy: "security@leadrescue.ai",
    reviewedAt: "2026-11-05T14:30:00Z",
  },
  {
    id: "pay-rev-102",
    agencyId: "agency-crescent",
    agencyName: "Crescent Digital Lahore",
    planId: "starter",
    amountPKR: 2999,
    bankName: "Habib Bank Limited (HBL)",
    transactionReference: "HBL-554433221",
    status: "pending",
    submittedAt: "2026-11-09T18:45:00Z",
  },
  {
    id: "pay-rev-103",
    agencyId: "agency-karachi-media",
    agencyName: "Indus Growth Partners",
    planId: "advanced",
    amountPKR: 14999,
    bankName: "Meezan Bank (IBFT)",
    transactionReference: "MEZN-771122334",
    status: "pending",
    submittedAt: "2026-11-10T00:15:00Z",
  },
];

let MOCK_PLANS: AdminPlanDefinition[] = [
  {
    id: "starter",
    name: "Starter Tier",
    pricePKR: 2999,
    interval: "month",
    maxClients: 3,
    maxLeadsPerMonth: 300,
    maxTeamSeats: 2,
    maxAiDraftsPerMonth: 200,
    isActive: true,
    updatedAt: "2026-11-01T00:00:00Z",
  },
  {
    id: "growth",
    name: "Growth Tier",
    pricePKR: 6999,
    interval: "month",
    maxClients: 10,
    maxLeadsPerMonth: 1200,
    maxTeamSeats: 6,
    maxAiDraftsPerMonth: 1000,
    isActive: true,
    updatedAt: "2026-11-01T00:00:00Z",
  },
  {
    id: "advanced",
    name: "Advanced Tier",
    pricePKR: 14999,
    interval: "month",
    maxClients: 999,
    maxLeadsPerMonth: 10000,
    maxTeamSeats: 25,
    maxAiDraftsPerMonth: 5000,
    isActive: true,
    updatedAt: "2026-11-01T00:00:00Z",
  },
];

let MOCK_AUDIT_LOGS: AdminAuditEvent[] = [
  {
    id: "audit-01",
    actorId: CURRENT_SUPER_ADMIN.id,
    actorEmail: CURRENT_SUPER_ADMIN.email,
    action: "payment_approved",
    targetType: "subscription",
    targetId: "pay-rev-101",
    reason: "Verified Meezan Bank deposit slip UTR MEZN-992819201 for PKR 6,999",
    metadata: { planId: "growth", agencyId: "agency-alpha" },
    timestamp: "2026-11-05T14:30:00Z",
  },
  {
    id: "audit-02",
    actorId: CURRENT_SUPER_ADMIN.id,
    actorEmail: CURRENT_SUPER_ADMIN.email,
    action: "agency_suspended",
    targetType: "agency",
    targetId: "agency-rapid-leads",
    reason: "Terms of Service violation: Unsolicited cold WhatsApp broadcasts without lead opt-in",
    metadata: { previousStatus: "active" },
    timestamp: "2026-11-07T10:15:00Z",
  },
];

/**
 * Resolves current Super Admin session and verifies permissions.
 */
async function resolveAndVerifyAdmin(): Promise<{ authorized: boolean; user: SuperAdminUser; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    return { authorized: true, user: CURRENT_SUPER_ADMIN };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return { authorized: false, user: CURRENT_SUPER_ADMIN, error: "Authentication required" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, full_name, is_super_admin")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.is_super_admin) {
      return {
        authorized: false,
        user: CURRENT_SUPER_ADMIN,
        error: "Access denied: Platform Super Admin privileges required.",
      };
    }

    const adminUser: SuperAdminUser = {
      id: profile.id,
      email: profile.email,
      name: profile.full_name || "Super Admin",
      isSuperAdmin: true,
      role: "super_admin",
    };

    return { authorized: true, user: adminUser };
  } catch {
    return { authorized: false, user: CURRENT_SUPER_ADMIN, error: "Failed to verify admin credentials" };
  }
}

/**
 * Platform overview metrics for Super Admin dashboard.
 */
export async function getAdminDashboardAction(): Promise<{
  success: boolean;
  metrics: AdminPlatformMetrics;
  recentAuditLogs: AdminAuditEvent[];
  pendingPayments: AdminPaymentReviewItem[];
  error?: string;
}> {
  const auth = await resolveAndVerifyAdmin();
  if (!auth.authorized) {
    return {
      success: false,
      metrics: {
        totalAgencies: 0,
        activeAgencies: 0,
        suspendedAgencies: 0,
        activePaidSubscriptions: 0,
        trialAccounts: 0,
        pendingManualPayments: 0,
        platformMonthlyRevenuePKR: 0,
        totalLeadsManaged: 0,
      },
      recentAuditLogs: [],
      pendingPayments: [],
      error: auth.error,
    };
  }

  const activeAgencies = MOCK_AGENCIES.filter((a) => a.accountStatus === "active").length;
  const suspendedAgencies = MOCK_AGENCIES.filter((a) => a.accountStatus === "suspended").length;
  const activePaidSubscriptions = MOCK_AGENCIES.filter((a) => a.subscriptionStatus === "active").length;
  const trialAccounts = MOCK_AGENCIES.filter((a) => a.subscriptionStatus === "trialing").length;
  const pendingPayments = MOCK_PAYMENTS.filter((p) => p.status === "pending");

  // Sum monthly revenue for active paid tiers
  const priceMap: Record<string, number> = {
    starter: 2999,
    growth: 6999,
    advanced: 14999,
  };
  const platformMonthlyRevenuePKR = MOCK_AGENCIES.filter((a) => a.subscriptionStatus === "active").reduce(
    (acc, a) => acc + (priceMap[a.planTier] || 0),
    0
  );
  const totalLeadsManaged = MOCK_AGENCIES.reduce((acc, a) => acc + a.totalLeads, 0);

  return {
    success: true,
    metrics: {
      totalAgencies: MOCK_AGENCIES.length,
      activeAgencies,
      suspendedAgencies,
      activePaidSubscriptions,
      trialAccounts,
      pendingManualPayments: pendingPayments.length,
      platformMonthlyRevenuePKR,
      totalLeadsManaged,
    },
    recentAuditLogs: MOCK_AUDIT_LOGS.slice(0, 5),
    pendingPayments,
  };
}

/**
 * Lists registered agencies with status filtering and text search.
 */
export async function getAdminAgenciesAction(params?: {
  query?: string;
  status?: string;
}): Promise<{
  success: boolean;
  agencies: AdminAgencySummary[];
  error?: string;
}> {
  const auth = await resolveAndVerifyAdmin();
  if (!auth.authorized) {
    return { success: false, agencies: [], error: auth.error };
  }

  let list = [...MOCK_AGENCIES];

  if (params?.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    list = list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.ownerEmail.toLowerCase().includes(q)
    );
  }

  if (params?.status && params.status !== "all") {
    list = list.filter((a) => a.accountStatus === params.status);
  }

  return { success: true, agencies: list };
}

/**
 * Suspends or reactivates an agency workspace with mandatory reason and audit event.
 */
export async function toggleAgencyStatusAction(
  agencyId: string,
  newStatus: "active" | "suspended",
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await resolveAndVerifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  if (!reason || reason.trim().length < 5) {
    return { success: false, error: "A valid reason (min 5 characters) is required for audit compliance." };
  }

  const agencyIndex = MOCK_AGENCIES.findIndex((a) => a.id === agencyId);
  if (agencyIndex === -1) {
    return { success: false, error: "Target agency not found." };
  }

  const prevStatus = MOCK_AGENCIES[agencyIndex].accountStatus;
  MOCK_AGENCIES[agencyIndex].accountStatus = newStatus;
  if (newStatus === "suspended") {
    MOCK_AGENCIES[agencyIndex].suspensionReason = reason.trim();
  } else {
    MOCK_AGENCIES[agencyIndex].suspensionReason = null;
  }

  // Record audit log
  const auditEvent = createAdminAuditEvent({
    actor: auth.user,
    action: newStatus === "suspended" ? "agency_suspended" : "agency_reactivated",
    targetType: "agency",
    targetId: agencyId,
    reason: reason.trim(),
    metadata: {
      agencyName: MOCK_AGENCIES[agencyIndex].name,
      previousStatus: prevStatus,
      newStatus,
    },
  });

  MOCK_AUDIT_LOGS.unshift(auditEvent);

  return { success: true };
}

/**
 * Lists manual bank transfer payments for review.
 */
export async function getAdminSubscriptionsAction(params?: {
  status?: string;
}): Promise<{
  success: boolean;
  payments: AdminPaymentReviewItem[];
  error?: string;
}> {
  const auth = await resolveAndVerifyAdmin();
  if (!auth.authorized) {
    return { success: false, payments: [], error: auth.error };
  }

  let list = [...MOCK_PAYMENTS];
  if (params?.status && params.status !== "all") {
    list = list.filter((p) => p.status === params.status);
  }

  return { success: true, payments: list };
}

/**
 * Approves or rejects a pending manual payment with reason and audit log.
 */
export async function reviewAdminPaymentAction(
  paymentId: string,
  decision: "approved" | "rejected",
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await resolveAndVerifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const payIndex = MOCK_PAYMENTS.findIndex((p) => p.id === paymentId);
  if (payIndex === -1) {
    return { success: false, error: "Payment record not found." };
  }

  const target = MOCK_PAYMENTS[payIndex];
  if (target.status !== "pending") {
    return { success: false, error: `Payment already ${target.status}.` };
  }

  if (decision === "rejected" && (!reason || reason.trim().length < 5)) {
    return { success: false, error: "Rejection requires a documented reason for audit compliance." };
  }

  target.status = decision;
  target.reviewedBy = auth.user.email;
  target.reviewedAt = new Date().toISOString();
  if (decision === "rejected") {
    target.rejectionReason = reason?.trim();
  }

  // If approved, update agency's subscription status
  if (decision === "approved") {
    const agIndex = MOCK_AGENCIES.findIndex((a) => a.id === target.agencyId);
    if (agIndex !== -1) {
      MOCK_AGENCIES[agIndex].subscriptionStatus = "active";
      MOCK_AGENCIES[agIndex].planTier = target.planId;
    }
  }

  // Audit event
  const auditEvent = createAdminAuditEvent({
    actor: auth.user,
    action: decision === "approved" ? "payment_approved" : "payment_rejected",
    targetType: "subscription",
    targetId: paymentId,
    reason: reason || `Payment ${decision} by ${auth.user.email}`,
    metadata: {
      agencyId: target.agencyId,
      agencyName: target.agencyName,
      amountPKR: target.amountPKR,
      bankName: target.bankName,
      transactionRef: target.transactionReference,
    },
  });

  MOCK_AUDIT_LOGS.unshift(auditEvent);

  return { success: true };
}

/**
 * Lists platform plan definitions.
 */
export async function getAdminPlansAction(): Promise<{
  success: boolean;
  plans: AdminPlanDefinition[];
  error?: string;
}> {
  const auth = await resolveAndVerifyAdmin();
  if (!auth.authorized) {
    return { success: false, plans: [], error: auth.error };
  }

  return { success: true, plans: MOCK_PLANS };
}

/**
 * Updates plan pricing and limits with validation and audit log.
 */
export async function updateAdminPlanAction(
  planId: "starter" | "growth" | "advanced",
  updates: Partial<AdminPlanDefinition>,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  const auth = await resolveAndVerifyAdmin();
  if (!auth.authorized) {
    return { success: false, error: auth.error };
  }

  const pIndex = MOCK_PLANS.findIndex((p) => p.id === planId);
  if (pIndex === -1) {
    return { success: false, error: "Target plan not found." };
  }

  const current = MOCK_PLANS[pIndex];
  const validation = validatePlanUpdate(current, updates);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  if (!reason || reason.trim().length < 5) {
    return { success: false, error: "Mandatory justification reason required for plan changes." };
  }

  MOCK_PLANS[pIndex] = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  // Audit log
  const auditEvent = createAdminAuditEvent({
    actor: auth.user,
    action: "plan_updated",
    targetType: "plan",
    targetId: planId,
    reason: reason.trim(),
    metadata: {
      previousPrice: current.pricePKR,
      newPrice: updates.pricePKR ?? current.pricePKR,
      updates,
    },
  });

  MOCK_AUDIT_LOGS.unshift(auditEvent);

  return { success: true };
}

/**
 * Lists platform administrative audit events.
 */
export async function getAdminAuditLogsAction(params?: {
  action?: string;
}): Promise<{
  success: boolean;
  logs: AdminAuditEvent[];
  error?: string;
}> {
  const auth = await resolveAndVerifyAdmin();
  if (!auth.authorized) {
    return { success: false, logs: [], error: auth.error };
  }

  let list = [...MOCK_AUDIT_LOGS];
  if (params?.action && params.action !== "all") {
    list = list.filter((l) => l.action === params.action);
  }

  return { success: true, logs: list };
}
