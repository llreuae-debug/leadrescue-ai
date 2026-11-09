"use server";

import { createClient } from "@/lib/supabase/server";
import {
  ClientPortalLead,
  ClientPortalMetrics,
  ClientPortalWorkspace,
} from "@/types/portal";
import {
  RawLeadForPortal,
  filterClientLeads,
  computeClientMetrics,
  sanitizeClientLead,
} from "@/lib/portal/portal-security";

// Realistic demonstration dataset for Horizon Retailers
const DEMO_PORTAL_WORKSPACE: ClientPortalWorkspace = {
  id: "client-1",
  name: "Horizon Retailers",
  industry: "Retail & Apparel",
  agencyName: "Apex Media Pakistan",
  supportEmail: "support@apexmedia.pk",
  supportPhone: "+92 300 1234567",
};

const DEMO_RAW_LEADS: RawLeadForPortal[] = [
  {
    id: "lead-hr-1",
    agencyId: "agency-alpha",
    clientId: "client-1",
    name: "Zubair Ahmed",
    phone: "+92 301 5551234",
    email: "zubair.a@gmail.com",
    company: "Zubair Fabrics Lahore",
    source: "Meta Lead Ads",
    campaign: "Summer Apparel Sale 2026",
    status: "won",
    dealValue: 180000,
    notes: "Approved bulk order for stitched lawn collection",
    internalNotes: "CONFIDENTIAL: Client offered 12% agency commission margin",
    agencyMargin: 21600,
    createdAt: "2026-11-08T10:30:00Z",
  },
  {
    id: "lead-hr-2",
    agencyId: "agency-alpha",
    clientId: "client-1",
    name: "Ayesha Siddiqui",
    phone: "+92 321 8889900",
    email: "ayesha@siddiquitraders.pk",
    company: "Siddiqui Traders",
    source: "Google Ads",
    campaign: "B2B Wholesale Inquiries",
    status: "qualified",
    dealValue: 95000,
    notes: "Requires formal catalog and wholesale pricing",
    internalNotes: "Rep note: Follow up aggressively on Thursday before competitor bids",
    agencyMargin: 11400,
    createdAt: "2026-11-07T14:15:00Z",
  },
  {
    id: "lead-hr-3",
    agencyId: "agency-alpha",
    clientId: "client-1",
    name: "Kamran Khan",
    phone: "+92 333 4445566",
    email: "kamran@khanenterprises.com",
    company: "Khan Enterprises",
    source: "WhatsApp Website Click",
    campaign: "Direct WhatsApp Button",
    status: "proposal_sent",
    dealValue: 240000,
    notes: "Requested customized delivery schedule for Karachi retail outlet",
    internalNotes: "High value deal - agency director personally supervising",
    agencyMargin: 28800,
    createdAt: "2026-11-06T09:00:00Z",
  },
  {
    id: "lead-hr-4",
    agencyId: "agency-alpha",
    clientId: "client-1",
    name: "Bilal Raza",
    phone: "+92 345 7771122",
    email: "bilal.raza@outlook.com",
    company: "Raza Garments",
    source: "Meta Lead Ads",
    campaign: "Summer Apparel Sale 2026",
    status: "contacted",
    dealValue: 65000,
    notes: "First call conducted; sent WhatsApp brochure",
    internalNotes: "Rep evaluation: Lead is price sensitive",
    agencyMargin: 7800,
    createdAt: "2026-11-05T16:45:00Z",
  },
  {
    id: "lead-hr-5",
    agencyId: "agency-alpha",
    clientId: "client-1",
    name: "Sana Mir",
    phone: "+92 312 9993344",
    email: "sana.mir@mirboutique.pk",
    company: "Mir Boutique",
    source: "Google Ads",
    campaign: "Luxury Pret Campaign",
    status: "won",
    dealValue: 310000,
    notes: "Advance payment confirmed via Bank Alfalah IBFT",
    internalNotes: "Margin booked at 15%",
    agencyMargin: 46500,
    createdAt: "2026-11-04T11:20:00Z",
  },
  {
    id: "lead-hr-6",
    agencyId: "agency-alpha",
    clientId: "client-1",
    name: "Farhan Saeed",
    phone: "+92 300 6667788",
    email: "farhan@saeedtex.com",
    company: "Saeed Textiles",
    source: "Direct Referral",
    campaign: null,
    status: "lost",
    dealValue: 120000,
    notes: "Selected competing supplier due to payment terms",
    internalNotes: "Agency loss post-mortem completed",
    agencyMargin: 0,
    createdAt: "2026-11-02T13:10:00Z",
  },
  {
    id: "lead-other-client",
    agencyId: "agency-alpha",
    clientId: "client-2", // DIFFERENT CLIENT! Must be filtered out
    name: "Confidential Competitor Lead",
    phone: "+92 300 0000000",
    email: "secret@competitor.com",
    company: "Competitor Corp",
    source: "Meta Lead Ads",
    status: "won",
    dealValue: 500000,
    notes: "Secret",
    internalNotes: "SECRET",
    createdAt: "2026-11-01T10:00:00Z",
  },
];

/**
 * Resolves the client workspace for the authenticated portal session.
 */
export async function getClientPortalWorkspaceAction(): Promise<{
  success: boolean;
  workspace: ClientPortalWorkspace;
  isDemo?: boolean;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    return {
      success: true,
      workspace: DEMO_PORTAL_WORKSPACE,
      isDemo: true,
    };
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        success: true,
        workspace: DEMO_PORTAL_WORKSPACE,
        isDemo: true,
      };
    }

    // In a live environment with client_portal_members, fetch user's assigned client
    const { data: clientData } = await supabase
      .from("clients")
      .select("id, name, industry, agency_id, agencies(name)")
      .limit(1)
      .single();

    if (clientData) {
      const agencyName = (clientData as any).agencies?.name || "Partner Agency";
      return {
        success: true,
        workspace: {
          id: clientData.id,
          name: clientData.name,
          industry: clientData.industry || "General Business",
          agencyName,
          supportEmail: "support@leadrescue.ai",
          supportPhone: "+92 300 1234567",
        },
      };
    }

    return {
      success: true,
      workspace: DEMO_PORTAL_WORKSPACE,
      isDemo: true,
    };
  } catch {
    return {
      success: true,
      workspace: DEMO_PORTAL_WORKSPACE,
      isDemo: true,
    };
  }
}

/**
 * Returns portal overview KPIs and recent leads.
 */
export async function getClientPortalDashboardAction(): Promise<{
  success: boolean;
  metrics: ClientPortalMetrics;
  recentLeads: ClientPortalLead[];
  workspace: ClientPortalWorkspace;
  isDemo?: boolean;
}> {
  const wsRes = await getClientPortalWorkspaceAction();
  const authorizedClientId = wsRes.workspace.id;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    const filteredLeads = filterClientLeads(DEMO_RAW_LEADS, authorizedClientId);
    const metrics = computeClientMetrics(filteredLeads);
    return {
      success: true,
      metrics,
      recentLeads: filteredLeads.slice(0, 5),
      workspace: wsRes.workspace,
      isDemo: true,
    };
  }

  try {
    const supabase = await createClient();
    const { data: leads, error } = await supabase
      .from("leads")
      .select("id, agency_id, client_id, contact_name, contact_phone, contact_email, company_name, source, campaign_name, status, deal_value, created_at")
      .eq("client_id", authorizedClientId)
      .order("created_at", { ascending: false });

    if (error || !leads) {
      const filteredLeads = filterClientLeads(DEMO_RAW_LEADS, authorizedClientId);
      return {
        success: true,
        metrics: computeClientMetrics(filteredLeads),
        recentLeads: filteredLeads.slice(0, 5),
        workspace: wsRes.workspace,
        isDemo: true,
      };
    }

    const sanitized: ClientPortalLead[] = leads.map((l: any) => ({
      id: l.id,
      name: l.contact_name,
      phone: l.contact_phone,
      email: l.contact_email,
      company: l.company_name,
      source: l.source || "Direct / Inbound",
      campaign: l.campaign_name,
      status: l.status,
      dealValue: Number(l.deal_value || 0),
      createdAt: l.created_at,
    }));

    return {
      success: true,
      metrics: computeClientMetrics(sanitized),
      recentLeads: sanitized.slice(0, 5),
      workspace: wsRes.workspace,
      isDemo: false,
    };
  } catch {
    const filteredLeads = filterClientLeads(DEMO_RAW_LEADS, authorizedClientId);
    return {
      success: true,
      metrics: computeClientMetrics(filteredLeads),
      recentLeads: filteredLeads.slice(0, 5),
      workspace: wsRes.workspace,
      isDemo: true,
    };
  }
}

/**
 * Returns filtered leads list for the client portal.
 */
export async function getClientPortalLeadsAction(params?: {
  query?: string;
  status?: string;
  source?: string;
}): Promise<{
  success: boolean;
  leads: ClientPortalLead[];
  workspace: ClientPortalWorkspace;
  isDemo?: boolean;
}> {
  const wsRes = await getClientPortalWorkspaceAction();
  const authorizedClientId = wsRes.workspace.id;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  let sanitized: ClientPortalLead[] = [];

  if (isPlaceholder) {
    sanitized = filterClientLeads(DEMO_RAW_LEADS, authorizedClientId);
  } else {
    try {
      const supabase = await createClient();
      let queryBuilder = supabase
        .from("leads")
        .select("id, contact_name, contact_phone, contact_email, company_name, source, campaign_name, status, deal_value, created_at")
        .eq("client_id", authorizedClientId)
        .order("created_at", { ascending: false });

      if (params?.status && params.status !== "all") {
        queryBuilder = queryBuilder.eq("status", params.status);
      }
      if (params?.source && params.source !== "all") {
        queryBuilder = queryBuilder.eq("source", params.source);
      }

      const { data, error } = await queryBuilder;
      if (error || !data) {
        sanitized = filterClientLeads(DEMO_RAW_LEADS, authorizedClientId);
      } else {
        sanitized = data.map((l: any) => ({
          id: l.id,
          name: l.contact_name,
          phone: l.contact_phone,
          email: l.contact_email,
          company: l.company_name,
          source: l.source || "Direct / Inbound",
          campaign: l.campaign_name,
          status: l.status,
          dealValue: Number(l.deal_value || 0),
          createdAt: l.created_at,
        }));
      }
    } catch {
      sanitized = filterClientLeads(DEMO_RAW_LEADS, authorizedClientId);
    }
  }

  // Filter in-memory for query text search and mock fallback
  if (params?.query && params.query.trim()) {
    const q = params.query.toLowerCase().trim();
    sanitized = sanitized.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        (l.phone && l.phone.toLowerCase().includes(q)) ||
        (l.email && l.email.toLowerCase().includes(q)) ||
        (l.company && l.company.toLowerCase().includes(q))
    );
  }

  if (params?.status && params.status !== "all") {
    sanitized = sanitized.filter((l) => l.status === params.status);
  }

  if (params?.source && params.source !== "all") {
    sanitized = sanitized.filter((l) => l.source === params.source);
  }

  return {
    success: true,
    leads: sanitized,
    workspace: wsRes.workspace,
    isDemo: isPlaceholder,
  };
}

/**
 * Returns conversion and acquisition analytics for the client portal.
 */
export async function getClientPortalReportsAction(): Promise<{
  success: boolean;
  metrics: ClientPortalMetrics;
  workspace: ClientPortalWorkspace;
  isDemo?: boolean;
}> {
  const dashRes = await getClientPortalDashboardAction();
  return {
    success: true,
    metrics: dashRes.metrics,
    workspace: dashRes.workspace,
    isDemo: dashRes.isDemo,
  };
}

/**
 * Generates an auditable CSV string containing exclusively approved client lead fields.
 */
export async function exportClientPortalLeadsCsvAction(): Promise<{
  success: boolean;
  csvContent?: string;
  filename?: string;
  error?: string;
}> {
  const result = await getClientPortalLeadsAction();
  if (!result.success || !result.leads) {
    return { success: false, error: "Failed to load client leads for export" };
  }

  const headers = [
    "Lead ID",
    "Customer Name",
    "Phone",
    "Email",
    "Company",
    "Source Channel",
    "Campaign",
    "Status",
    "Deal Value (PKR)",
    "Inquired Date (UTC)",
  ];

  const rows = result.leads.map((l) => [
    `"${l.id}"`,
    `"${l.name.replace(/"/g, '""')}"`,
    `"${l.phone || ""}"`,
    `"${l.email || ""}"`,
    `"${(l.company || "").replace(/"/g, '""')}"`,
    `"${l.source}"`,
    `"${(l.campaign || "").replace(/"/g, '""')}"`,
    `"${l.status.toUpperCase()}"`,
    l.dealValue,
    `"${l.createdAt}"`,
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const filename = `${result.workspace.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-enquiries-${new Date().toISOString().split("T")[0]}.csv`;

  return {
    success: true,
    csvContent,
    filename,
  };
}
