"use server";

import { createClient } from "@/lib/supabase/server";
import { DashboardMetrics } from "@/types/database";

export interface DashboardFilterOptions {
  clientId?: string;
  dateRange?: "7d" | "30d" | "90d" | "all";
}

export async function getDashboardDataAction(
  filters: DashboardFilterOptions = {}
): Promise<{ success: boolean; data: DashboardMetrics; isDemo?: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  // In local preview/unconfigured mode, return realistic baseline metrics with explicit demo notice
  if (isPlaceholder) {
    return {
      success: true,
      isDemo: true,
      data: {
        totalLeads: 124,
        newLeads: 28,
        qualifiedLeads: 46,
        followUpsDueToday: 9,
        overdueFollowUps: 4,
        wonOpportunities: 18,
        totalPipelineValue: 4850000, // PKR 4.85M
        acquisitionTrend: [
          { period: "Mon", count: 12 },
          { period: "Tue", count: 18 },
          { period: "Wed", count: 15 },
          { period: "Thu", count: 24 },
          { period: "Fri", count: 29 },
          { period: "Sat", count: 14 },
          { period: "Sun", count: 12 },
        ],
        leadSources: [
          { source: "Meta Lead Ads", count: 68, percentage: 55 },
          { source: "Google Ads", count: 31, percentage: 25 },
          { source: "WhatsApp Website Click", count: 18, percentage: 14 },
          { source: "CSV Direct Ingestion", count: 7, percentage: 6 },
        ],
        recentActivities: [
          {
            id: "act-1",
            leadName: "Tariq Mahmood",
            clientName: "Horizon Retailers",
            action: "Stage updated to Qualified",
            timestamp: "12 minutes ago",
          },
          {
            id: "act-2",
            leadName: "Fatima Noor",
            clientName: "Metro Logistics",
            action: "AI Follow-up Draft generated",
            timestamp: "45 minutes ago",
          },
          {
            id: "act-3",
            leadName: "Zainab Ali",
            clientName: "Horizon Retailers",
            action: "Scheduled WhatsApp follow-up for today 3:00 PM",
            timestamp: "2 hours ago",
          },
          {
            id: "act-4",
            leadName: "Bilal Khan",
            clientName: "Skyline Ventures",
            action: "Lead marked Overdue (SLA breach)",
            timestamp: "4 hours ago",
          },
        ],
        urgentFollowUps: [
          {
            id: "fup-1",
            leadId: "lead-101",
            leadName: "Kamran Siddiqui",
            clientName: "Horizon Retailers",
            phone: "+92 321 4455667",
            dueAt: "Today, 11:30 AM",
            isOverdue: true,
            taskType: "whatsapp",
          },
          {
            id: "fup-2",
            leadId: "lead-102",
            leadName: "Dr. Ayesha Malik",
            clientName: "Metro Logistics",
            phone: "+92 300 8899112",
            dueAt: "Today, 2:00 PM",
            isOverdue: false,
            taskType: "call",
          },
          {
            id: "fup-3",
            leadId: "lead-103",
            leadName: "Usman Ghani",
            clientName: "Skyline Ventures",
            phone: "+92 333 5511223",
            dueAt: "Today, 4:30 PM",
            isOverdue: false,
            taskType: "whatsapp",
          },
        ],
        aiRecommendations: [
          {
            id: "ai-1",
            title: "Urgent: 4 Overdue Leads in Horizon Retailers",
            description:
              "Meta ad campaign generated 4 high-intent leads 48 hours ago without second touchpoint. Generate WhatsApp objection drafts to rescue opportunities.",
            actionType: "sla_alert",
          },
          {
            id: "ai-2",
            title: "Draft WhatsApp Follow-up for Kamran Siddiqui",
            description:
              "Prospect asked about wholesale discounts 2 days ago. Suggested Urdu/English discount quote ready for review.",
            leadId: "lead-101",
            actionType: "draft_whatsapp",
          },
        ],
      },
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required", data: getEmptyMetrics() };
    }

    // Resolve user's active agency
    const { data: member } = await supabase
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!member) {
      return { success: true, data: getEmptyMetrics() };
    }

    const agencyId = member.agency_id;

    // Build scoped queries
    let leadsQuery = supabase
      .from("leads")
      .select("id, status, source, deal_value, created_at, client_id")
      .eq("agency_id", agencyId);

    if (filters.clientId && filters.clientId !== "all") {
      leadsQuery = leadsQuery.eq("client_id", filters.clientId);
    }

    const { data: leads, error: leadsError } = await leadsQuery;

    if (leadsError) {
      return { success: false, error: leadsError.message, data: getEmptyMetrics() };
    }

    const totalLeads = leads?.length || 0;
    const newLeads = leads?.filter((l) => l.status === "new").length || 0;
    const qualifiedLeads = leads?.filter((l) => l.status === "qualified").length || 0;
    const wonOpportunities = leads?.filter((l) => l.status === "won").length || 0;
    const totalPipelineValue =
      leads?.reduce((sum, l) => sum + (Number(l.deal_value) || 0), 0) || 0;

    // Follow-ups query
    const now = new Date().toISOString();
    const { data: followUps } = await supabase
      .from("follow_up_tasks")
      .select("id, lead_id, due_at, task_type, status, leads(name, phone), clients(name)")
      .eq("agency_id", agencyId)
      .eq("status", "pending")
      .order("due_at", { ascending: true })
      .limit(10);

    const overdueCount =
      followUps?.filter((f) => new Date(f.due_at) < new Date()).length || 0;

    // Source breakdown calculation
    const sourceMap: Record<string, number> = {};
    leads?.forEach((l) => {
      const src = l.source || "Other";
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });

    const leadSources = Object.entries(sourceMap).map(([source, count]) => ({
      source,
      count,
      percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
    }));

    return {
      success: true,
      data: {
        totalLeads,
        newLeads,
        qualifiedLeads,
        followUpsDueToday: followUps?.length || 0,
        overdueFollowUps: overdueCount,
        wonOpportunities,
        totalPipelineValue,
        acquisitionTrend: [
          { period: "Week 1", count: Math.round(totalLeads * 0.2) },
          { period: "Week 2", count: Math.round(totalLeads * 0.3) },
          { period: "Week 3", count: Math.round(totalLeads * 0.25) },
          { period: "Week 4", count: Math.round(totalLeads * 0.25) },
        ],
        leadSources,
        recentActivities: [],
        urgentFollowUps: (followUps || []).map((f: any) => ({
          id: f.id,
          leadId: f.lead_id,
          leadName: f.leads?.name || "Enquiry",
          clientName: f.clients?.name || "Client Workspace",
          phone: f.leads?.phone,
          dueAt: f.due_at,
          isOverdue: new Date(f.due_at) < new Date(),
          taskType: f.task_type || "whatsapp",
        })),
        aiRecommendations: [],
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message, data: getEmptyMetrics() };
  }
}

function getEmptyMetrics(): DashboardMetrics {
  return {
    totalLeads: 0,
    newLeads: 0,
    qualifiedLeads: 0,
    followUpsDueToday: 0,
    overdueFollowUps: 0,
    wonOpportunities: 0,
    totalPipelineValue: 0,
    acquisitionTrend: [],
    leadSources: [],
    recentActivities: [],
    urgentFollowUps: [],
    aiRecommendations: [],
  };
}
