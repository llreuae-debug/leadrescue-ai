import type { ClientPortalLead, ClientPortalMetrics } from "../../types/portal.ts";

export interface RawLeadForPortal {
  id: string;
  agencyId: string;
  clientId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  source: string;
  campaign?: string | null;
  status: string;
  dealValue: number;
  notes?: string | null;
  internalNotes?: string | null;
  agencyMargin?: number | null;
  createdAt: string;
}

/**
 * Sanitizes a raw lead record by strictly omitting internal agency fields
 * (e.g. internal agency notes, margin percentages, private rep chatter).
 */
export function sanitizeClientLead(raw: RawLeadForPortal): ClientPortalLead {
  return {
    id: raw.id,
    name: raw.name,
    phone: raw.phone || null,
    email: raw.email || null,
    company: raw.company || null,
    source: raw.source || "Direct / Unknown",
    campaign: raw.campaign || null,
    status: raw.status,
    dealValue: raw.dealValue || 0,
    createdAt: raw.createdAt,
    // Note: raw.notes, raw.internalNotes, and raw.agencyMargin are deliberately excluded!
  };
}

/**
 * Filters a list of leads strictly to the authorized client workspace.
 * Rejects cross-client access attempts.
 */
export function filterClientLeads(
  leads: RawLeadForPortal[],
  authorizedClientId: string
): ClientPortalLead[] {
  return leads
    .filter((l) => l.clientId === authorizedClientId)
    .map(sanitizeClientLead);
}

/**
 * Computes transparent, client-facing metrics strictly from approved records.
 */
export function computeClientMetrics(leads: ClientPortalLead[]): ClientPortalMetrics {
  const totalLeads = leads.length;
  if (totalLeads === 0) {
    return {
      totalLeads: 0,
      contactedLeads: 0,
      qualifiedLeads: 0,
      wonLeads: 0,
      totalWonValuePKR: 0,
      conversionRate: 0,
      sourceBreakdown: [],
    };
  }

  const contactedLeads = leads.filter((l) => l.status !== "new").length;
  const qualifiedLeads = leads.filter((l) => ["qualified", "proposal_sent", "won"].includes(l.status)).length;
  const wonLeadsList = leads.filter((l) => l.status === "won");
  const wonLeads = wonLeadsList.length;
  const totalWonValuePKR = wonLeadsList.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  const conversionRate = Math.round((wonLeads / totalLeads) * 1000) / 10;

  // Source breakdown
  const sourceCountMap: Record<string, number> = {};
  for (const lead of leads) {
    const src = lead.source || "Direct / Inbound";
    sourceCountMap[src] = (sourceCountMap[src] || 0) + 1;
  }

  const sourceBreakdown = Object.entries(sourceCountMap)
    .map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / totalLeads) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    totalLeads,
    contactedLeads,
    qualifiedLeads,
    wonLeads,
    totalWonValuePKR,
    conversionRate,
    sourceBreakdown,
  };
}
