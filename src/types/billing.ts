export type PaymentStatus = "pending" | "approved" | "rejected" | "expired" | "cancelled";

export type PaymentMethod = "manual_ibft" | "card_gateway";

export type SubscriptionStatus = "active" | "trial" | "past_due" | "cancelled";

export interface PaymentRecord {
  id: string;
  agencyId: string;
  planId: "starter" | "growth" | "advanced";
  planName: string;
  amountPKR: number;
  method: PaymentMethod;
  transactionRef: string;
  bankName: string;
  status: PaymentStatus;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewerName?: string | null;
  notes?: string | null;
  rejectionReason?: string | null;
}

export interface BillingContact {
  fullName: string;
  email: string;
  phone?: string | null;
  companyName: string;
  taxNumberNTN?: string | null;
  billingAddress?: string | null;
}

export interface SubscriptionDetails {
  planId: "starter" | "growth" | "advanced";
  planName: string;
  pricePKR: number;
  status: SubscriptionStatus;
  trialEndsAt?: string | null;
  renewsAt: string;
  billingContact: BillingContact;
}

export interface AgencyUsageMetrics {
  clientWorkspaces: {
    used: number;
    limit: number;
  };
  leadsThisMonth: {
    used: number;
    limit: number;
  };
  teamSeats: {
    used: number;
    limit: number;
  };
  aiDraftsThisMonth: {
    used: number;
    limit: number;
  };
}
