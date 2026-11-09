export interface PlanFeature {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PlanTier {
  id: "starter" | "growth" | "advanced";
  name: string;
  tagline: string;
  pricePKR: number;
  period: "month";
  isPopular?: boolean;
  limits: {
    leadsPerMonth: number;
    clientWorkspaces: number;
    teamSeats: number;
    aiDraftsPerMonth: number;
  };
  features: PlanFeature[];
  ctaLabel: string;
}

export const PRICING_DISCLAIMER =
  "Initial commercial launch pricing for Pakistani digital agencies. All plans include 14-day trial and direct support.";

export const PLANS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "For boutique digital marketing agencies managing up to 3 clients.",
    pricePKR: 2999,
    period: "month",
    limits: {
      leadsPerMonth: 300,
      clientWorkspaces: 3,
      teamSeats: 2,
      aiDraftsPerMonth: 200,
    },
    features: [
      { text: "Up to 3 Client Workspaces", included: true },
      { text: "300 Inbound Leads / month", included: true },
      { text: "2 Team Member Seats", included: true },
      { text: "200 Grounded AI Follow-up Drafts", included: true },
      { text: "Visual Sales Pipeline (Kanban)", included: true },
      { text: "Follow-up Task Scheduling & Reminders", included: true },
      { text: "CSV Lead Import & Duplicate Check", included: true },
      { text: "English & Urdu Message Templates", included: true },
      { text: "White-label Client Portal", included: false },
      { text: "Dedicated WhatsApp Business API", included: false },
    ],
    ctaLabel: "Start 14-Day Free Trial",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "For growing agencies needing team accountability and higher volume.",
    pricePKR: 6999,
    period: "month",
    isPopular: true,
    limits: {
      leadsPerMonth: 1200,
      clientWorkspaces: 10,
      teamSeats: 6,
      aiDraftsPerMonth: 1000,
    },
    features: [
      { text: "Up to 10 Client Workspaces", included: true },
      { text: "1,200 Inbound Leads / month", included: true },
      { text: "6 Team Member Seats with Roles", included: true },
      { text: "1,000 Grounded AI Follow-up Drafts", included: true, highlight: true },
      { text: "Visual Sales Pipeline & Audit Trail", included: true },
      { text: "Agency Overdue Alerts & Sla Tracking", included: true },
      { text: "CSV & Website Lead Form Webhooks", included: true },
      { text: "English & Urdu Tone Selection", included: true },
      { text: "Client Performance Comparison Reports", included: true },
      { text: "Dedicated WhatsApp Business API", included: false },
    ],
    ctaLabel: "Start 14-Day Free Trial",
  },
  {
    id: "advanced",
    name: "Advanced",
    tagline: "For high-volume performance marketing and lead generation firms.",
    pricePKR: 14999,
    period: "month",
    limits: {
      leadsPerMonth: 5000,
      clientWorkspaces: 25,
      teamSeats: 15,
      aiDraftsPerMonth: 5000,
    },
    features: [
      { text: "Up to 25 Client Workspaces", included: true },
      { text: "5,000 Inbound Leads / month", included: true },
      { text: "15 Team Member Seats (Granular RBAC)", included: true },
      { text: "5,000 Grounded AI Follow-up Drafts", included: true, highlight: true },
      { text: "Custom Pipeline Stages per Client", included: true },
      { text: "Full Exportable Audit & Activity Logs", included: true },
      { text: "Direct Webhook & Lead Form Integrations", included: true },
      { text: "Priority Support & Urdu Setup Assistance", included: true },
      { text: "Restricted Client Portal (Early Access)", included: true },
      { text: "Manual Pakistani Bank Transfer Receipts", included: true },
    ],
    ctaLabel: "Start 14-Day Free Trial",
  },
];
