import type { AgencyRole } from "../../types/database.ts";
import type { PaymentRecord, PaymentStatus, SubscriptionDetails } from "../../types/billing.ts";

export const PLAN_LIMITS_MAP = {
  starter: {
    name: "Starter",
    pricePKR: 2999,
    limits: {
      leadsPerMonth: 300,
      clientWorkspaces: 3,
      teamSeats: 2,
      aiDraftsPerMonth: 200,
    },
  },
  growth: {
    name: "Growth",
    pricePKR: 6999,
    limits: {
      leadsPerMonth: 1200,
      clientWorkspaces: 10,
      teamSeats: 6,
      aiDraftsPerMonth: 1000,
    },
  },
  advanced: {
    name: "Advanced",
    pricePKR: 14999,
    limits: {
      leadsPerMonth: 10000,
      clientWorkspaces: 999,
      teamSeats: 25,
      aiDraftsPerMonth: 5000,
    },
  },
} as const;

export interface PaymentSubmissionParams {
  agencyId: string;
  planId: "starter" | "growth" | "advanced";
  amountPKR: number;
  transactionRef: string;
  bankName: string;
  notes?: string | null;
}

/**
 * Retrieves authoritative plan limits from central config
 */
export function getAuthoritativePlanLimits(planId: "starter" | "growth" | "advanced") {
  return PLAN_LIMITS_MAP[planId] || PLAN_LIMITS_MAP.starter;
}

/**
 * Server-side quota check
 */
export function isResourceQuotaExceeded(
  currentUsage: number,
  planId: "starter" | "growth" | "advanced",
  resource: "leadsPerMonth" | "clientWorkspaces" | "teamSeats" | "aiDraftsPerMonth"
): boolean {
  const { limits } = getAuthoritativePlanLimits(planId);
  const limit = limits[resource];
  return currentUsage >= limit;
}

/**
 * Validates manual bank transfer submission
 */
export function validatePaymentSubmission(params: PaymentSubmissionParams): {
  valid: boolean;
  error?: string;
  record?: PaymentRecord;
} {
  const { agencyId, planId, amountPKR, transactionRef, bankName, notes } = params;

  if (!agencyId) {
    return { valid: false, error: "Missing agency identifier." };
  }

  const plan = PLAN_LIMITS_MAP[planId];
  if (!plan) {
    return { valid: false, error: "Invalid subscription plan selected." };
  }

  if (amountPKR !== plan.pricePKR) {
    return {
      valid: false,
      error: `Submitted amount (PKR ${amountPKR.toLocaleString()}) does not match plan price (PKR ${plan.pricePKR.toLocaleString()}).`,
    };
  }

  const cleanRef = transactionRef?.trim();
  if (!cleanRef || cleanRef.length < 5) {
    return {
      valid: false,
      error: "Please enter a valid Bank Transaction Reference / UTR / RRN (minimum 5 characters).",
    };
  }

  const cleanBank = bankName?.trim();
  if (!cleanBank) {
    return { valid: false, error: "Please enter or select the receiving bank name." };
  }

  const record: PaymentRecord = {
    id: `pay-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    agencyId,
    planId,
    planName: plan.name,
    amountPKR: plan.pricePKR,
    method: "manual_ibft",
    transactionRef: cleanRef,
    bankName: cleanBank,
    status: "pending",
    submittedAt: new Date().toISOString(),
    notes: notes?.trim() || null,
  };

  return { valid: true, record };
}

/**
 * Processes payment approval with role verification and audit details.
 * Strictly requires 'owner' or 'admin' role.
 */
export function processPaymentApproval(
  paymentRecord: PaymentRecord,
  reviewerRole: AgencyRole,
  reviewerUserId: string,
  reviewerName: string
): { success: boolean; updatedPayment?: PaymentRecord; updatedSubscription?: Partial<SubscriptionDetails>; error?: string } {
  if (reviewerRole !== "owner" && reviewerRole !== "admin") {
    return { success: false, error: "Unauthorized: Only an agency Owner or Admin can review and approve payments." };
  }

  if (paymentRecord.status !== "pending") {
    return { success: false, error: `Cannot approve payment in '${paymentRecord.status}' status.` };
  }

  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const updatedPayment: PaymentRecord = {
    ...paymentRecord,
    status: "approved",
    reviewedAt: now.toISOString(),
    reviewedBy: reviewerUserId,
    reviewerName,
  };

  const updatedSubscription: Partial<SubscriptionDetails> = {
    planId: paymentRecord.planId,
    planName: paymentRecord.planName,
    pricePKR: paymentRecord.amountPKR,
    status: "active",
    trialEndsAt: null,
    renewsAt: nextMonth.toISOString(),
  };

  return { success: true, updatedPayment, updatedSubscription };
}

/**
 * Processes payment rejection with documented reason.
 */
export function processPaymentRejection(
  paymentRecord: PaymentRecord,
  reviewerRole: AgencyRole,
  reviewerUserId: string,
  reviewerName: string,
  reason: string
): { success: boolean; updatedPayment?: PaymentRecord; error?: string } {
  if (reviewerRole !== "owner" && reviewerRole !== "admin") {
    return { success: false, error: "Unauthorized: Only an agency Owner or Admin can reject payments." };
  }

  if (paymentRecord.status !== "pending") {
    return { success: false, error: `Cannot reject payment in '${paymentRecord.status}' status.` };
  }

  const cleanReason = reason?.trim();
  if (!cleanReason) {
    return { success: false, error: "A rejection reason must be provided for agency audit records." };
  }

  const updatedPayment: PaymentRecord = {
    ...paymentRecord,
    status: "rejected",
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerUserId,
    reviewerName,
    rejectionReason: cleanReason,
  };

  return { success: true, updatedPayment };
}
