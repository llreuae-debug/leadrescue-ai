"use server";

import { createClient } from "@/lib/supabase/server";
import {
  AssistantIntent,
  AssistantLanguage,
  AssistantQuota,
  AssistantResponse,
  AssistantTone,
  LeadContextSnapshot,
  ObjectionCategory,
} from "@/types/ai-assistant";
import { generateAssistantResponse } from "@/lib/ai/assistant-engine";
import { revalidatePath } from "next/cache";

// In-memory request tracker for preview/demo modes
let demoRequestCount = 14;

export async function getAssistantLeadsAction(clientId?: string): Promise<{
  success: boolean;
  leads: { id: string; name: string; clientName: string; status: string; priority: string; phone?: string | null }[];
  isDemo?: boolean;
  error?: string;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    const demoLeads = [
      {
        id: "lead-1",
        name: "Tariq Mahmood",
        clientName: "Horizon Retailers",
        status: "follow_up_required",
        priority: "urgent",
        phone: "+92 300 8877665",
      },
      {
        id: "lead-2",
        name: "Fatima Noor",
        clientName: "Horizon Retailers",
        status: "proposal_sent",
        priority: "high",
        phone: "+92 321 4455667",
      },
      {
        id: "lead-3",
        name: "Usman Ghani",
        clientName: "Elite Heights Real Estate",
        status: "new",
        priority: "high",
        phone: "+92 333 9988771",
      },
      {
        id: "lead-4",
        name: "Zainab Bibi",
        clientName: "Elite Heights Real Estate",
        status: "contacted",
        priority: "medium",
        phone: "+92 301 5566778",
      },
      {
        id: "lead-5",
        name: "Kamran Siddiqui",
        clientName: "Apex Logistics",
        status: "qualified",
        priority: "urgent",
        phone: "+92 345 1122334",
      },
    ];

    return {
      success: true,
      leads: demoLeads,
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
      return { success: false, leads: [], error: "Unauthorized access" };
    }

    const { data: member } = await supabase
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!member) {
      return { success: false, leads: [], error: "No active agency membership found" };
    }

    let query = supabase
      .from("leads")
      .select("id, name, status, priority, phone, client:clients(name)")
      .eq("agency_id", member.agency_id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (clientId) {
      query = query.eq("client_id", clientId);
    }

    const { data, error } = await query;
    if (error) {
      return { success: false, leads: [], error: error.message };
    }

    const formatted = (data || []).map((l: any) => ({
      id: l.id,
      name: l.name,
      clientName: l.client?.name || "Client Workspace",
      status: l.status,
      priority: l.priority,
      phone: l.phone,
    }));

    return { success: true, leads: formatted };
  } catch (err: any) {
    return { success: false, leads: [], error: err.message || "Failed to load leads" };
  }
}

export async function getLeadContextSnapshotAction(leadId: string): Promise<{
  success: boolean;
  lead?: LeadContextSnapshot;
  isDemo?: boolean;
  error?: string;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    const mockContexts: Record<string, LeadContextSnapshot> = {
      "lead-1": {
        id: "lead-1",
        agencyId: "preview-agency",
        clientId: "client-1",
        clientName: "Horizon Retailers",
        clientIndustry: "E-commerce & Retail",
        name: "Tariq Mahmood",
        phone: "+92 300 8877665",
        email: "tariq.m@apexretailers.pk",
        company: "Apex Retailers",
        source: "Meta Ads",
        campaign: "Summer Apparel Wholesale 2026",
        status: "follow_up_required",
        priority: "urgent",
        dealValue: 240000,
        notes: "Interested in 500 unit wholesale order. Requested volume discount tier. Said budget is tight due to upcoming sales cycle.",
        lastContactedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
        nextFollowUpAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        activities: [
          { action: "Sent wholesale catalog on WhatsApp", timestamp: new Date(Date.now() - 48 * 3600000).toISOString() },
          { action: "Phone call - Discussed SKU minimums", timestamp: new Date(Date.now() - 72 * 3600000).toISOString() },
        ],
        pendingTasks: [
          {
            taskType: "whatsapp",
            dueAt: new Date(Date.now() - 4 * 3600000).toISOString(),
            notes: "Follow up on bulk wholesale quotation sent 2 days ago.",
          },
        ],
      },
      "lead-2": {
        id: "lead-2",
        agencyId: "preview-agency",
        clientId: "client-1",
        clientName: "Horizon Retailers",
        clientIndustry: "E-commerce & Retail",
        name: "Fatima Noor",
        phone: "+92 321 4455667",
        email: "f.noor@designercloset.com",
        company: "Designer Closet",
        source: "WhatsApp Inbound",
        campaign: "Direct WhatsApp Inbound",
        status: "proposal_sent",
        priority: "high",
        dealValue: 180000,
        notes: "Custom branding proposal delivered. Waiting for management review.",
        lastContactedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
        nextFollowUpAt: new Date(Date.now() + 24 * 3600000).toISOString(),
        activities: [
          { action: "Proposal PDF delivered via email", timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
        ],
        pendingTasks: [
          {
            taskType: "call",
            dueAt: new Date(Date.now() + 24 * 3600000).toISOString(),
            notes: "Proposal review touchpoint call",
          },
        ],
      },
      "lead-3": {
        id: "lead-3",
        agencyId: "preview-agency",
        clientId: "client-2",
        clientName: "Elite Heights Real Estate",
        clientIndustry: "Real Estate & Construction",
        name: "Usman Ghani",
        phone: "+92 333 9988771",
        email: "usman.ghani@lahorebuilders.com",
        company: "Lahore Builders",
        source: "Google Ads",
        campaign: "Commercial Plaza Gulberg III",
        status: "new",
        priority: "high",
        dealValue: 1250000,
        notes: "Inquired about 2-bedroom executive apartment on installment schedule.",
        lastContactedAt: null,
        nextFollowUpAt: new Date(Date.now() + 2 * 3600000).toISOString(),
        activities: [],
        pendingTasks: [
          {
            taskType: "call",
            dueAt: new Date(Date.now() + 2 * 3600000).toISOString(),
            notes: "First discovery call for commercial unit",
          },
        ],
      },
    };

    const lead = mockContexts[leadId] || {
      id: leadId,
      agencyId: "preview-agency",
      clientId: "client-1",
      clientName: "Horizon Retailers",
      clientIndustry: "E-commerce & Retail",
      name: "Prospective Customer",
      phone: "+92 300 1234567",
      email: "contact@prospect.pk",
      company: "Private Enterprise",
      source: "Meta Ads",
      status: "new",
      priority: "medium",
      dealValue: 0,
      notes: "",
      lastContactedAt: null,
      activities: [],
      pendingTasks: [],
    };

    return { success: true, lead, isDemo: true };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Unauthorized access" };
    }

    const { data: member } = await supabase
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!member) {
      return { success: false, error: "No active agency membership found" };
    }

    const { data: leadRecord, error: leadError } = await supabase
      .from("leads")
      .select("*, client:clients(name, industry)")
      .eq("id", leadId)
      .eq("agency_id", member.agency_id)
      .single();

    if (leadError || !leadRecord) {
      return { success: false, error: "Lead not found or access denied" };
    }

    const { data: activities } = await supabase
      .from("lead_activities")
      .select("action, details, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false })
      .limit(5);

    const { data: tasks } = await supabase
      .from("follow_up_tasks")
      .select("task_type, due_at, notes")
      .eq("lead_id", leadId)
      .eq("status", "pending")
      .order("due_at", { ascending: true });

    const snapshot: LeadContextSnapshot = {
      id: leadRecord.id,
      agencyId: leadRecord.agency_id,
      clientId: leadRecord.client_id,
      clientName: leadRecord.client?.name || "Client Workspace",
      clientIndustry: leadRecord.client?.industry,
      name: leadRecord.name,
      phone: leadRecord.phone,
      email: leadRecord.email,
      company: leadRecord.company,
      source: leadRecord.source,
      campaign: leadRecord.campaign,
      status: leadRecord.status,
      priority: leadRecord.priority,
      dealValue: leadRecord.deal_value || 0,
      notes: leadRecord.notes,
      lastContactedAt: leadRecord.last_contacted_at,
      nextFollowUpAt: leadRecord.next_follow_up_at,
      activities: (activities || []).map((a: any) => ({
        action: a.action,
        details: JSON.stringify(a.details),
        timestamp: a.created_at,
      })),
      pendingTasks: (tasks || []).map((t: any) => ({
        taskType: t.task_type,
        dueAt: t.due_at,
        notes: t.notes,
      })),
    };

    return { success: true, lead: snapshot };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to load lead context" };
  }
}

export async function generateAiResponseAction(params: {
  leadId: string;
  intent: AssistantIntent;
  language: AssistantLanguage;
  tone: AssistantTone;
  customPrompt?: string;
  objectionType?: ObjectionCategory;
}): Promise<{
  success: boolean;
  data?: AssistantResponse;
  quota?: AssistantQuota;
  isDemo?: boolean;
  error?: string;
}> {
  const { leadId, intent, language, tone, customPrompt, objectionType } = params;

  // Retrieve lead context
  const contextRes = await getLeadContextSnapshotAction(leadId);
  if (!contextRes.success || !contextRes.lead) {
    return { success: false, error: contextRes.error || "Failed to retrieve lead context" };
  }

  // Quota check
  const quota = await getAssistantQuotaAction();
  if (quota.requestsUsed >= quota.requestLimit) {
    return {
      success: false,
      error: "Monthly AI Assistant quota limit reached for your current plan. Please upgrade to continue.",
    };
  }

  // Generate grounded response
  const response = generateAssistantResponse({
    lead: contextRes.lead,
    intent,
    language,
    tone,
    customPrompt,
    objectionType,
  });

  // Increment demo counter or database log
  if (contextRes.isDemo) {
    demoRequestCount += 1;
  }

  // Revalidate assistant route
  revalidatePath("/app/ai-assistant");

  return {
    success: true,
    data: response,
    quota: {
      ...quota,
      requestsUsed: quota.requestsUsed + 1,
    },
    isDemo: contextRes.isDemo,
  };
}

export async function getAssistantQuotaAction(): Promise<AssistantQuota> {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);

  return {
    planTier: "Growth Plan",
    requestsUsed: demoRequestCount,
    requestLimit: 250,
    resetDate: nextMonth.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };
}
