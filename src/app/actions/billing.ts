"use server";

import { createClient } from "@/lib/supabase/server";
import { PLANS } from "@/config/plans";
import {
  AgencyUsageMetrics,
  BillingContact,
  PaymentRecord,
  SubscriptionDetails,
} from "@/types/billing";
import {
  getAuthoritativePlanLimits,
  processPaymentApproval,
  processPaymentRejection,
  validatePaymentSubmission,
} from "@/lib/billing/entitlements";
import { revalidatePath } from "next/cache";

// In-memory demo billing state for preview mode
let demoSubscription: SubscriptionDetails = {
  planId: "growth",
  planName: "Growth",
  pricePKR: 6999,
  status: "active",
  trialEndsAt: null,
  renewsAt: new Date(Date.now() + 22 * 86400000).toISOString(),
  billingContact: {
    fullName: "Ahmed Khan",
    email: "billing@alphamedia.pk",
    phone: "+92 300 1234567",
    companyName: "Alpha Media Pakistan (Pvt) Ltd",
    taxNumberNTN: "7864321-9",
    billingAddress: "Suite 402, Al-Hafeez Heights, Gulberg III, Lahore, Pakistan",
  },
};

let demoUsage: AgencyUsageMetrics = {
  clientWorkspaces: { used: 3, limit: 10 },
  leadsThisMonth: { used: 412, limit: 1200 },
  teamSeats: { used: 4, limit: 6 },
  aiDraftsThisMonth: { used: 168, limit: 1000 },
};

let demoPaymentHistory: PaymentRecord[] = [
  {
    id: "inv-2026-003",
    agencyId: "preview-agency",
    planId: "growth",
    planName: "Growth",
    amountPKR: 6999,
    method: "manual_ibft",
    transactionRef: "MEEZAN-FT-99441122",
    bankName: "Meezan Bank Limited",
    status: "approved",
    submittedAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    reviewerName: "Finance Ops (Automated Review)",
    notes: "Monthly subscription renewal for Growth Tier",
  },
  {
    id: "inv-2026-002",
    agencyId: "preview-agency",
    planId: "growth",
    planName: "Growth",
    amountPKR: 6999,
    method: "manual_ibft",
    transactionRef: "HBL-IBFT-77665544",
    bankName: "Habib Bank Limited (HBL)",
    status: "approved",
    submittedAt: new Date(Date.now() - 38 * 86400000).toISOString(),
    reviewedAt: new Date(Date.now() - 37 * 86400000).toISOString(),
    reviewerName: "Finance Ops",
    notes: "Pilot paid month 1 activation",
  },
];

export async function getBillingOverviewAction(): Promise<{
  success: boolean;
  subscription: SubscriptionDetails;
  usage: AgencyUsageMetrics;
  payments: PaymentRecord[];
  plans: typeof PLANS;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    iban: string;
    accountNumber: string;
    branchCode: string;
  };
  isDemo?: boolean;
  error?: string;
}> {
  const bankDetails = {
    bankName: "Meezan Bank Limited (Corporate Branch)",
    accountTitle: "LeadRescue AI Technologies (Pvt) Ltd",
    iban: "PK42MEZN0001000987654321",
    accountNumber: "01000987654321",
    branchCode: "0100 (Main Boulevard Gulberg, Lahore)",
  };

  return {
    success: true,
    subscription: demoSubscription,
    usage: demoUsage,
    payments: demoPaymentHistory,
    plans: PLANS,
    bankDetails,
    isDemo: true,
  };
}

export async function submitManualPaymentProofAction(params: {
  planId: "starter" | "growth" | "advanced";
  amountPKR: number;
  transactionRef: string;
  bankName: string;
  notes?: string | null;
}): Promise<{ success: boolean; record?: PaymentRecord; error?: string }> {
  const validation = validatePaymentSubmission({
    agencyId: "preview-agency",
    planId: params.planId,
    amountPKR: params.amountPKR,
    transactionRef: params.transactionRef,
    bankName: params.bankName,
    notes: params.notes,
  });

  if (!validation.valid || !validation.record) {
    return { success: false, error: validation.error || "Validation error" };
  }

  demoPaymentHistory = [validation.record, ...demoPaymentHistory];
  revalidatePath("/app/billing");

  return { success: true, record: validation.record };
}

export async function reviewPaymentProofAction(params: {
  paymentId: string;
  action: "approve" | "reject";
  reason?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { paymentId, action, reason } = params;
  const payment = demoPaymentHistory.find((p) => p.id === paymentId);

  if (!payment) {
    return { success: false, error: "Payment record not found." };
  }

  if (action === "approve") {
    const res = processPaymentApproval(payment, "owner", "user-1", "Ahmed Khan (Owner)");
    if (!res.success || !res.updatedPayment) {
      return { success: false, error: res.error };
    }
    demoPaymentHistory = demoPaymentHistory.map((p) => (p.id === paymentId ? res.updatedPayment! : p));
    if (res.updatedSubscription) {
      demoSubscription = { ...demoSubscription, ...res.updatedSubscription };
      const limits = getAuthoritativePlanLimits(res.updatedPayment.planId);
      demoUsage = {
        ...demoUsage,
        clientWorkspaces: { ...demoUsage.clientWorkspaces, limit: limits.limits.clientWorkspaces },
        leadsThisMonth: { ...demoUsage.leadsThisMonth, limit: limits.limits.leadsPerMonth },
        teamSeats: { ...demoUsage.teamSeats, limit: limits.limits.teamSeats },
        aiDraftsThisMonth: { ...demoUsage.aiDraftsThisMonth, limit: limits.limits.aiDraftsPerMonth },
      };
    }
    revalidatePath("/app/billing");
    return { success: true };
  } else {
    const res = processPaymentRejection(payment, "owner", "user-1", "Ahmed Khan (Owner)", reason || "Manual review failed");
    if (!res.success || !res.updatedPayment) {
      return { success: false, error: res.error };
    }
    demoPaymentHistory = demoPaymentHistory.map((p) => (p.id === paymentId ? res.updatedPayment! : p));
    revalidatePath("/app/billing");
    return { success: true };
  }
}

export async function updateBillingContactAction(params: BillingContact): Promise<{
  success: boolean;
  error?: string;
}> {
  demoSubscription.billingContact = params;
  revalidatePath("/app/billing");
  return { success: true };
}
