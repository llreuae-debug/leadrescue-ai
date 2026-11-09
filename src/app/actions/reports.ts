"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CalculatedReportSummary,
  calculateClientComparison,
  calculateLostReasons,
  calculateReportSummary,
  calculateSourcePerformance,
  ClientComparisonMetric,
  filterRecordsByCriteria,
  LostReasonMetric,
  RawLeadMetricRecord,
  RawTaskMetricRecord,
  ReportsFilterOptions,
  SourcePerformanceMetric,
} from "@/lib/reports/metrics";

export interface ReportsDataResult {
  success: boolean;
  summary: CalculatedReportSummary;
  sources: SourcePerformanceMetric[];
  clients: ClientComparisonMetric[];
  lostReasons: LostReasonMetric[];
  clientOptions: { id: string; name: string }[];
  sourceOptions: string[];
  isDemo?: boolean;
  error?: string;
}

export async function getReportsDataAction(
  filters: ReportsFilterOptions = { dateRange: "30d" }
): Promise<ReportsDataResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    const now = new Date();

    const mockClients = [
      { id: "client-1", name: "Horizon Retailers" },
      { id: "client-2", name: "Elite Heights Real Estate" },
      { id: "client-3", name: "Apex Logistics" },
    ];

    const mockSources = ["Meta Ads", "Google Ads", "WhatsApp Inbound", "CSV Import", "Website Form"];

    const mockLeads: RawLeadMetricRecord[] = [
      {
        id: "l-1",
        agencyId: "preview-agency",
        clientId: "client-1",
        clientName: "Horizon Retailers",
        source: "Meta Ads",
        status: "won",
        dealValue: 240000,
        createdAt: new Date(now.getTime() - 2 * 86400000).toISOString(),
      },
      {
        id: "l-2",
        agencyId: "preview-agency",
        clientId: "client-1",
        clientName: "Horizon Retailers",
        source: "Meta Ads",
        status: "qualified",
        dealValue: 180000,
        createdAt: new Date(now.getTime() - 4 * 86400000).toISOString(),
      },
      {
        id: "l-3",
        agencyId: "preview-agency",
        clientId: "client-1",
        clientName: "Horizon Retailers",
        source: "WhatsApp Inbound",
        status: "contacted",
        dealValue: 95000,
        createdAt: new Date(now.getTime() - 8 * 86400000).toISOString(),
      },
      {
        id: "l-4",
        agencyId: "preview-agency",
        clientId: "client-1",
        clientName: "Horizon Retailers",
        source: "Google Ads",
        status: "lost",
        lossReason: "Price sensitivity",
        dealValue: 320000,
        createdAt: new Date(now.getTime() - 12 * 86400000).toISOString(),
      },
      {
        id: "l-5",
        agencyId: "preview-agency",
        clientId: "client-2",
        clientName: "Elite Heights Real Estate",
        source: "Google Ads",
        status: "won",
        dealValue: 1250000,
        createdAt: new Date(now.getTime() - 6 * 86400000).toISOString(),
      },
      {
        id: "l-6",
        agencyId: "preview-agency",
        clientId: "client-2",
        clientName: "Elite Heights Real Estate",
        source: "Meta Ads",
        status: "proposal_sent",
        dealValue: 850000,
        createdAt: new Date(now.getTime() - 10 * 86400000).toISOString(),
      },
      {
        id: "l-7",
        agencyId: "preview-agency",
        clientId: "client-2",
        clientName: "Elite Heights Real Estate",
        source: "Website Form",
        status: "lost",
        lossReason: "Selected competitor",
        dealValue: 600000,
        createdAt: new Date(now.getTime() - 18 * 86400000).toISOString(),
      },
      {
        id: "l-8",
        agencyId: "preview-agency",
        clientId: "client-3",
        clientName: "Apex Logistics",
        source: "CSV Import",
        status: "qualified",
        dealValue: 450000,
        createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
      },
      {
        id: "l-9",
        agencyId: "preview-agency",
        clientId: "client-3",
        clientName: "Apex Logistics",
        source: "WhatsApp Inbound",
        status: "new",
        dealValue: 150000,
        createdAt: new Date(now.getTime() - 1 * 86400000).toISOString(),
      },
      {
        id: "l-10",
        agencyId: "preview-agency",
        clientId: "client-3",
        clientName: "Apex Logistics",
        source: "Meta Ads",
        status: "lost",
        lossReason: "Unresponsive",
        dealValue: 200000,
        createdAt: new Date(now.getTime() - 25 * 86400000).toISOString(),
      },
    ];

    const mockTasks: RawTaskMetricRecord[] = [
      { id: "t-1", agencyId: "preview-agency", clientId: "client-1", status: "completed", dueAt: new Date(now.getTime() - 3 * 86400000).toISOString() },
      { id: "t-2", agencyId: "preview-agency", clientId: "client-1", status: "completed", dueAt: new Date(now.getTime() - 5 * 86400000).toISOString() },
      { id: "t-3", agencyId: "preview-agency", clientId: "client-1", status: "pending", dueAt: new Date(now.getTime() - 1 * 86400000).toISOString() },
      { id: "t-4", agencyId: "preview-agency", clientId: "client-2", status: "completed", dueAt: new Date(now.getTime() - 7 * 86400000).toISOString() },
      { id: "t-5", agencyId: "preview-agency", clientId: "client-2", status: "pending", dueAt: new Date(now.getTime() - 2 * 86400000).toISOString() },
      { id: "t-6", agencyId: "preview-agency", clientId: "client-3", status: "completed", dueAt: new Date(now.getTime() - 4 * 86400000).toISOString() },
      { id: "t-7", agencyId: "preview-agency", clientId: "client-3", status: "cancelled", dueAt: new Date(now.getTime() - 6 * 86400000).toISOString() },
    ];

    const filteredLeads = filterRecordsByCriteria(mockLeads, filters, now);
    const filteredTasks = filterRecordsByCriteria(mockTasks, filters, now);

    return {
      success: true,
      summary: calculateReportSummary(filteredLeads, filteredTasks),
      sources: calculateSourcePerformance(filteredLeads),
      clients: calculateClientComparison(filteredLeads),
      lostReasons: calculateLostReasons(filteredLeads),
      clientOptions: mockClients,
      sourceOptions: mockSources,
      isDemo: true,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        summary: calculateReportSummary([], []),
        sources: [],
        clients: [],
        lostReasons: [],
        clientOptions: [],
        sourceOptions: [],
        error: "Unauthorized",
      };
    }

    const { data: member } = await supabase
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!member) {
      return {
        success: false,
        summary: calculateReportSummary([], []),
        sources: [],
        clients: [],
        lostReasons: [],
        clientOptions: [],
        sourceOptions: [],
        error: "No active agency membership",
      };
    }

    // Fetch clients
    const { data: clientRecords } = await supabase
      .from("clients")
      .select("id, name")
      .eq("agency_id", member.agency_id)
      .eq("status", "active");

    const clientOptions = (clientRecords || []).map((c) => ({ id: c.id, name: c.name }));

    // Fetch leads
    let leadsQuery = supabase
      .from("leads")
      .select("id, agency_id, client_id, source, status, deal_value, notes, created_at, client:clients(name)")
      .eq("agency_id", member.agency_id);

    if (filters.clientId && filters.clientId !== "all") {
      leadsQuery = leadsQuery.eq("client_id", filters.clientId);
    }
    if (filters.source && filters.source !== "all") {
      leadsQuery = leadsQuery.eq("source", filters.source);
    }

    const { data: leadData, error: leadError } = await leadsQuery;
    if (leadError) throw leadError;

    // Fetch follow-up tasks
    let tasksQuery = supabase
      .from("follow_up_tasks")
      .select("id, agency_id, client_id, status, due_at, completed_at")
      .eq("agency_id", member.agency_id);

    if (filters.clientId && filters.clientId !== "all") {
      tasksQuery = tasksQuery.eq("client_id", filters.clientId);
    }

    const { data: taskData, error: taskError } = await tasksQuery;
    if (taskError) throw taskError;

    const rawLeads: RawLeadMetricRecord[] = (leadData || []).map((l: any) => ({
      id: l.id,
      agencyId: l.agency_id,
      clientId: l.client_id,
      clientName: l.client?.name || "Client Workspace",
      source: l.source,
      status: l.status,
      dealValue: l.deal_value || 0,
      createdAt: l.created_at,
    }));

    const rawTasks: RawTaskMetricRecord[] = (taskData || []).map((t: any) => ({
      id: t.id,
      agencyId: t.agency_id,
      clientId: t.client_id,
      status: t.status,
      dueAt: t.due_at,
      completedAt: t.completed_at,
    }));

    const now = new Date();
    const filteredLeads = filterRecordsByCriteria(rawLeads, filters, now);
    const filteredTasks = filterRecordsByCriteria(rawTasks, filters, now);

    const sourceSet = new Set<string>();
    rawLeads.forEach((l) => {
      if (l.source) sourceSet.add(l.source);
    });

    return {
      success: true,
      summary: calculateReportSummary(filteredLeads, filteredTasks),
      sources: calculateSourcePerformance(filteredLeads),
      clients: calculateClientComparison(filteredLeads),
      lostReasons: calculateLostReasons(filteredLeads),
      clientOptions,
      sourceOptions: Array.from(sourceSet),
    };
  } catch (err: any) {
    return {
      success: false,
      summary: calculateReportSummary([], []),
      sources: [],
      clients: [],
      lostReasons: [],
      clientOptions: [],
      sourceOptions: [],
      error: err.message || "Failed to load reports",
    };
  }
}

export async function exportReportsCsvAction(filters: ReportsFilterOptions): Promise<{
  success: boolean;
  csvContent?: string;
  filename?: string;
  error?: string;
}> {
  const result = await getReportsDataAction(filters);
  if (!result.success) {
    return { success: false, error: result.error || "Failed to generate CSV export" };
  }

  const { summary, sources, clients, lostReasons } = result;
  const lines: string[] = [];

  // 1. Header & Metadata
  lines.push(`"LeadRescue AI — Agency Performance Report"`);
  lines.push(`"Generated At","${new Date().toISOString()}"`);
  lines.push(`"Timeframe","${filters.dateRange.toUpperCase()}"`);
  lines.push(`"Client Scope","${filters.clientId === "all" || !filters.clientId ? "All Workspaces" : filters.clientId}"`);
  lines.push("");

  // 2. Executive Summary KPIs
  lines.push(`"EXECUTIVE METRICS SUMMARY"`);
  lines.push(`"Metric","Value","Definition"`);
  lines.push(`"Total Enquiries","${summary.totalLeads}","Total leads registered in cohort"`);
  lines.push(`"Contact Rate","${summary.contactRate}%","Leads reached stage Contacted or later / Total leads"`);
  lines.push(`"Qualification Rate","${summary.qualificationRate}%","Leads marked Qualified, Proposal Sent, or Won / Total leads"`);
  lines.push(`"Follow-up SLA Completion Rate","${summary.followUpCompletionRate}%","Completed follow-up tasks / Due tasks (cancelled excluded)"`);
  lines.push(`"Won Deals Count","${summary.wonOpportunities}","Closed won opportunities in period"`);
  lines.push(`"Won Conversion Rate","${summary.wonRate}%","Won leads / (Won leads + Lost leads)"`);
  lines.push(`"Total Revenue Won (PKR)","PKR ${summary.totalWonValuePKR.toLocaleString()}","Aggregate deal value of closed-won leads"`);
  lines.push(`"Active Pipeline Volume (PKR)","PKR ${summary.totalPipelineValuePKR.toLocaleString()}","Open unclosed opportunities"`);
  lines.push("");

  // 3. Source Breakdown
  lines.push(`"INBOUND SOURCE PERFORMANCE"`);
  lines.push(`"Channel Source","Total Inquiries","Qualified Leads","Won Opportunities","Win Rate %","Revenue Won (PKR)"`);
  for (const src of sources) {
    lines.push(
      `"${src.source}","${src.totalLeads}","${src.qualifiedLeads}","${src.wonLeads}","${src.winRate}%","PKR ${src.wonValuePKR.toLocaleString()}"`
    );
  }
  lines.push("");

  // 4. Client Comparison
  lines.push(`"CLIENT WORKSPACE COMPARISON"`);
  lines.push(`"Client Name","Total Leads","Contact Rate %","Qualification Rate %","Won Deals","Revenue Won (PKR)"`);
  for (const cl of clients) {
    lines.push(
      `"${cl.clientName}","${cl.totalLeads}","${cl.contactRate}%","${cl.qualificationRate}%","${cl.wonLeads}","PKR ${cl.wonValuePKR.toLocaleString()}"`
    );
  }
  lines.push("");

  // 5. Lost Reason Analysis
  lines.push(`"LOST OPPORTUNITY ROOT CAUSE ANALYSIS"`);
  lines.push(`"Loss Reason","Lost Lead Count","Percentage of Lost"` );
  for (const lr of lostReasons) {
    lines.push(`"${lr.reason}","${lr.count}","${lr.percentage}%"`);
  }

  const csvContent = lines.join("\n");
  const filename = `leadrescue-report-${filters.dateRange}-${Date.now()}.csv`;

  return { success: true, csvContent, filename };
}
