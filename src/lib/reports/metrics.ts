export interface RawLeadMetricRecord {
  id: string;
  agencyId: string;
  clientId: string;
  clientName: string;
  source: string;
  status: string;
  dealValue: number;
  lossReason?: string | null;
  assignedTo?: string | null;
  createdAt: string;
}

export interface RawTaskMetricRecord {
  id: string;
  agencyId: string;
  clientId: string;
  status: "pending" | "completed" | "snoozed" | "cancelled";
  dueAt: string;
  completedAt?: string | null;
  assignedTo?: string | null;
}

export interface ReportsFilterOptions {
  dateRange: "7d" | "30d" | "90d" | "all";
  clientId?: string;
  source?: string;
  assignedTo?: string;
}

export interface CalculatedReportSummary {
  totalLeads: number;
  contactedLeads: number;
  contactRate: number; // percentage 0-100
  qualifiedLeads: number;
  qualificationRate: number; // percentage 0-100
  totalTasksDue: number;
  completedTasks: number;
  followUpCompletionRate: number; // percentage 0-100
  wonOpportunities: number;
  lostOpportunities: number;
  wonRate: number; // percentage 0-100
  totalWonValuePKR: number;
  totalPipelineValuePKR: number;
}

export interface SourcePerformanceMetric {
  source: string;
  totalLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  winRate: number;
  wonValuePKR: number;
}

export interface ClientComparisonMetric {
  clientId: string;
  clientName: string;
  totalLeads: number;
  contactRate: number;
  qualificationRate: number;
  wonLeads: number;
  wonValuePKR: number;
}

export interface LostReasonMetric {
  reason: string;
  count: number;
  percentage: number;
}

/**
 * Filter records by timeframe and criteria
 */
export function filterRecordsByCriteria<T extends { createdAt?: string; dueAt?: string; clientId: string; source?: string; assignedTo?: string | null }>(
  records: T[],
  filters: ReportsFilterOptions,
  now: Date = new Date()
): T[] {
  let cutoff: number | null = null;
  if (filters.dateRange === "7d") {
    cutoff = now.getTime() - 7 * 86400000;
  } else if (filters.dateRange === "30d") {
    cutoff = now.getTime() - 30 * 86400000;
  } else if (filters.dateRange === "90d") {
    cutoff = now.getTime() - 90 * 86400000;
  }

  return records.filter((r) => {
    // Client filter
    if (filters.clientId && filters.clientId !== "all" && r.clientId !== filters.clientId) {
      return false;
    }

    // Source filter
    if (filters.source && filters.source !== "all" && r.source && r.source !== filters.source) {
      return false;
    }

    // Assigned representative filter
    if (filters.assignedTo && filters.assignedTo !== "all" && r.assignedTo !== filters.assignedTo) {
      return false;
    }

    // Date range filter
    if (cutoff !== null) {
      const recordDate = r.createdAt ? new Date(r.createdAt).getTime() : r.dueAt ? new Date(r.dueAt).getTime() : null;
      if (recordDate !== null && recordDate < cutoff) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Strict Formula:
 * Contact Rate = (Leads at 'contacted', 'qualified', 'follow_up_required', 'proposal_sent', 'won', or 'lost' / Total Leads) * 100
 */
export function calculateContactRate(leads: RawLeadMetricRecord[]): { count: number; rate: number } {
  if (leads.length === 0) return { count: 0, rate: 0 };
  const contacted = leads.filter((l) => l.status !== "new");
  const rate = Math.round((contacted.length / leads.length) * 1000) / 10;
  return { count: contacted.length, rate };
}

/**
 * Strict Formula:
 * Qualification Rate = (Leads at 'qualified', 'proposal_sent', or 'won' / Total Leads) * 100
 */
export function calculateQualificationRate(leads: RawLeadMetricRecord[]): { count: number; rate: number } {
  if (leads.length === 0) return { count: 0, rate: 0 };
  const qualified = leads.filter((l) => ["qualified", "proposal_sent", "won"].includes(l.status));
  const rate = Math.round((qualified.length / leads.length) * 1000) / 10;
  return { count: qualified.length, rate };
}

/**
 * Strict Formula:
 * Follow-up Completion Rate = (Completed Tasks / Tasks Due in Period) * 100
 * Note: Cancelled tasks are excluded from the denominator.
 */
export function calculateTaskCompletionRate(tasks: RawTaskMetricRecord[]): { totalDue: number; completed: number; rate: number } {
  const eligibleTasks = tasks.filter((t) => t.status !== "cancelled");
  if (eligibleTasks.length === 0) return { totalDue: 0, completed: 0, rate: 0 };

  const completed = eligibleTasks.filter((t) => t.status === "completed").length;
  const rate = Math.round((completed / eligibleTasks.length) * 1000) / 10;
  return { totalDue: eligibleTasks.length, completed, rate };
}

/**
 * Strict Formula:
 * Won Rate = (Won Leads / (Won Leads + Lost Leads)) * 100
 */
export function calculateWonRate(leads: RawLeadMetricRecord[]): { wonCount: number; lostCount: number; rate: number; wonValue: number } {
  const won = leads.filter((l) => l.status === "won");
  const lost = leads.filter((l) => l.status === "lost");
  const closedCount = won.length + lost.length;

  const rate = closedCount > 0 ? Math.round((won.length / closedCount) * 1000) / 10 : 0;
  const wonValue = won.reduce((sum, l) => sum + (l.dealValue || 0), 0);

  return { wonCount: won.length, lostCount: lost.length, rate, wonValue };
}

/**
 * Generates overall summary
 */
export function calculateReportSummary(
  leads: RawLeadMetricRecord[],
  tasks: RawTaskMetricRecord[]
): CalculatedReportSummary {
  const contact = calculateContactRate(leads);
  const qual = calculateQualificationRate(leads);
  const taskMetric = calculateTaskCompletionRate(tasks);
  const wonMetric = calculateWonRate(leads);

  const totalPipelineValuePKR = leads
    .filter((l) => l.status !== "lost")
    .reduce((sum, l) => sum + (l.dealValue || 0), 0);

  return {
    totalLeads: leads.length,
    contactedLeads: contact.count,
    contactRate: contact.rate,
    qualifiedLeads: qual.count,
    qualificationRate: qual.rate,
    totalTasksDue: taskMetric.totalDue,
    completedTasks: taskMetric.completed,
    followUpCompletionRate: taskMetric.rate,
    wonOpportunities: wonMetric.wonCount,
    lostOpportunities: wonMetric.lostCount,
    wonRate: wonMetric.rate,
    totalWonValuePKR: wonMetric.wonValue,
    totalPipelineValuePKR,
  };
}

/**
 * Channel source performance breakdown
 */
export function calculateSourcePerformance(leads: RawLeadMetricRecord[]): SourcePerformanceMetric[] {
  const map: Record<string, { total: number; qualified: number; won: number; wonValue: number }> = {};

  for (const lead of leads) {
    const src = lead.source || "Direct / Unknown";
    if (!map[src]) {
      map[src] = { total: 0, qualified: 0, won: 0, wonValue: 0 };
    }
    map[src].total += 1;
    if (["qualified", "proposal_sent", "won"].includes(lead.status)) {
      map[src].qualified += 1;
    }
    if (lead.status === "won") {
      map[src].won += 1;
      map[src].wonValue += lead.dealValue || 0;
    }
  }

  return Object.entries(map).map(([source, data]) => ({
    source,
    totalLeads: data.total,
    qualifiedLeads: data.qualified,
    wonLeads: data.won,
    winRate: data.total > 0 ? Math.round((data.won / data.total) * 1000) / 10 : 0,
    wonValuePKR: data.wonValue,
  })).sort((a, b) => b.totalLeads - a.totalLeads);
}

/**
 * Client workspace performance comparison
 */
export function calculateClientComparison(leads: RawLeadMetricRecord[]): ClientComparisonMetric[] {
  const map: Record<string, { clientName: string; total: number; contacted: number; qualified: number; won: number; wonValue: number }> = {};

  for (const lead of leads) {
    const cid = lead.clientId;
    if (!map[cid]) {
      map[cid] = {
        clientName: lead.clientName || "Client Workspace",
        total: 0,
        contacted: 0,
        qualified: 0,
        won: 0,
        wonValue: 0,
      };
    }
    map[cid].total += 1;
    if (lead.status !== "new") map[cid].contacted += 1;
    if (["qualified", "proposal_sent", "won"].includes(lead.status)) map[cid].qualified += 1;
    if (lead.status === "won") {
      map[cid].won += 1;
      map[cid].wonValue += lead.dealValue || 0;
    }
  }

  return Object.entries(map).map(([clientId, data]) => ({
    clientId,
    clientName: data.clientName,
    totalLeads: data.total,
    contactRate: data.total > 0 ? Math.round((data.contacted / data.total) * 1000) / 10 : 0,
    qualificationRate: data.total > 0 ? Math.round((data.qualified / data.total) * 1000) / 10 : 0,
    wonLeads: data.won,
    wonValuePKR: data.wonValue,
  })).sort((a, b) => b.totalLeads - a.totalLeads);
}

/**
 * Categorized lost lead breakdown
 */
export function calculateLostReasons(leads: RawLeadMetricRecord[]): LostReasonMetric[] {
  const lostLeads = leads.filter((l) => l.status === "lost");
  if (lostLeads.length === 0) return [];

  const map: Record<string, number> = {};
  for (const lead of lostLeads) {
    const reason = lead.lossReason || "Unspecified / No response";
    map[reason] = (map[reason] || 0) + 1;
  }

  return Object.entries(map)
    .map(([reason, count]) => ({
      reason,
      count,
      percentage: Math.round((count / lostLeads.length) * 1000) / 10,
    }))
    .sort((a, b) => b.count - a.count);
}
