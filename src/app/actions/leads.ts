"use server";

import { createClient } from "@/lib/supabase/server";
import { Lead, LeadStatus, LeadPriority } from "@/types/database";
import { revalidatePath } from "next/cache";

export interface LeadFilterParams {
  clientId?: string;
  source?: string;
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: "created_at" | "next_follow_up_at" | "deal_value";
  sortOrder?: "asc" | "desc";
}

export interface CSVLeadRow {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  campaign?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  dealValue?: number;
  notes?: string;
}

export async function getLeadsAction(
  params: LeadFilterParams = {}
): Promise<{ success: boolean; data: Lead[]; total: number; isDemo?: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    let mockLeads: Lead[] = [
      {
        id: "lead-1",
        agency_id: "preview-agency",
        client_id: "client-1",
        name: "Tariq Mahmood",
        email: "tariq.m@apexretailers.pk",
        phone: "+92 300 8877665",
        company: "Apex Retailers",
        source: "Meta Ads",
        campaign: "Summer Sale Conversions",
        status: "follow_up_required",
        priority: "urgent",
        deal_value: 240000,
        assigned_to: "user-1",
        last_contacted_at: new Date(Date.now() - 36 * 3600000).toISOString(),
        next_follow_up_at: new Date(Date.now() - 4 * 3600000).toISOString(), // Overdue
        notes: "Requested quotation for bulk wholesale ordering. Interested in credit terms.",
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        client: {
          id: "client-1",
          agency_id: "preview-agency",
          name: "Horizon Retailers",
          industry: "E-commerce & Fashion",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: "lead-2",
        agency_id: "preview-agency",
        client_id: "client-1",
        name: "Fatima Noor",
        email: "fatima.noor@metro.pk",
        phone: "+92 321 4455667",
        company: "Metro Fleet",
        source: "Google Ads",
        campaign: "Commercial Logistics",
        status: "qualified",
        priority: "high",
        deal_value: 480000,
        assigned_to: "user-1",
        last_contacted_at: new Date(Date.now() - 24 * 3600000).toISOString(),
        next_follow_up_at: new Date(Date.now() + 6 * 3600000).toISOString(), // Due today
        notes: "Completed qualification call. Budget approved for regional delivery expansion.",
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        client: {
          id: "client-1",
          agency_id: "preview-agency",
          name: "Horizon Retailers",
          industry: "E-commerce & Fashion",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: "lead-3",
        agency_id: "preview-agency",
        client_id: "client-2",
        name: "Kamran Siddiqui",
        email: "ksiddiqui@paklog.com",
        phone: "+92 333 1122334",
        company: "PakLogistics",
        source: "Website Form",
        campaign: "Inbound Quote Request",
        status: "new",
        priority: "medium",
        deal_value: 180000,
        assigned_to: null,
        created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
        updated_at: new Date().toISOString(),
        client: {
          id: "client-2",
          agency_id: "preview-agency",
          name: "Metro Logistics PK",
          industry: "Logistics & Transport",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: "lead-4",
        agency_id: "preview-agency",
        client_id: "client-3",
        name: "Zainab Ali",
        email: "zainab@skyline.pk",
        phone: "+92 345 9988776",
        company: "Skyline Properties",
        source: "WhatsApp Click",
        campaign: "DHA Commercial Launch",
        status: "won",
        priority: "high",
        deal_value: 850000,
        assigned_to: "user-1",
        last_contacted_at: new Date(Date.now() - 2 * 86400000).toISOString(),
        created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        client: {
          id: "client-3",
          agency_id: "preview-agency",
          name: "Skyline Ventures",
          industry: "Real Estate & Commercial",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
      {
        id: "lead-5",
        agency_id: "preview-agency",
        client_id: "client-1",
        name: "Bilal Khan",
        email: "bilal@northtextile.pk",
        phone: "+92 312 6677889",
        company: "North Textiles",
        source: "CSV Direct Ingestion",
        campaign: "Expo 2026 Batch",
        status: "proposal_sent",
        priority: "medium",
        deal_value: 320000,
        assigned_to: "user-1",
        last_contacted_at: new Date(Date.now() - 18 * 3600000).toISOString(),
        next_follow_up_at: new Date(Date.now() + 24 * 3600000).toISOString(),
        created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
        updated_at: new Date().toISOString(),
        client: {
          id: "client-1",
          agency_id: "preview-agency",
          name: "Horizon Retailers",
          industry: "E-commerce & Fashion",
          status: "active",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      },
    ];

    // Filter mocks
    if (params.clientId && params.clientId !== "all") {
      mockLeads = mockLeads.filter((l) => l.client_id === params.clientId);
    }
    if (params.status && params.status !== "all") {
      mockLeads = mockLeads.filter((l) => l.status === params.status);
    }
    if (params.priority && params.priority !== "all") {
      mockLeads = mockLeads.filter((l) => l.priority === params.priority);
    }
    if (params.source && params.source !== "all") {
      mockLeads = mockLeads.filter((l) => l.source === params.source);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      mockLeads = mockLeads.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.company?.toLowerCase().includes(q)
      );
    }

    return { success: true, data: mockLeads, total: mockLeads.length, isDemo: true };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required", data: [], total: 0 };
    }

    const { data: member } = await supabase
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!member) {
      return { success: true, data: [], total: 0 };
    }

    let query = supabase
      .from("leads")
      .select("*, clients(name, industry), profiles:assigned_to(full_name, email)")
      .eq("agency_id", member.agency_id);

    if (params.clientId && params.clientId !== "all") {
      query = query.eq("client_id", params.clientId);
    }
    if (params.status && params.status !== "all") {
      query = query.eq("status", params.status);
    }
    if (params.priority && params.priority !== "all") {
      query = query.eq("priority", params.priority);
    }
    if (params.source && params.source !== "all") {
      query = query.eq("source", params.source);
    }
    if (params.search) {
      query = query.or(
        `name.ilike.%${params.search}%,email.ilike.%${params.search}%,phone.ilike.%${params.search}%,company.ilike.%${params.search}%`
      );
    }

    const sortCol = params.sortBy || "created_at";
    const sortAsc = params.sortOrder === "asc";
    query = query.order(sortCol, { ascending: sortAsc });

    const { data: leads, error } = await query;

    if (error) {
      return { success: false, error: error.message, data: [], total: 0 };
    }

    const formattedLeads: Lead[] = (leads || []).map((l: any) => ({
      ...l,
      client: l.clients || undefined,
      assignee: l.profiles || undefined,
    }));

    return { success: true, data: formattedLeads, total: formattedLeads.length };
  } catch (err: any) {
    return { success: false, error: err.message, data: [], total: 0 };
  }
}

export async function createLeadAction(data: {
  clientId: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  source?: string;
  campaign?: string;
  status?: LeadStatus;
  priority?: LeadPriority;
  dealValue?: number;
  notes?: string;
}): Promise<{ success: boolean; lead?: Lead; duplicateFound?: boolean; error?: string }> {
  if (!data.name?.trim()) {
    return { success: false, error: "Lead name is required." };
  }
  if (!data.clientId) {
    return { success: false, error: "Client workspace is required." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/leads");
    revalidatePath("/app/dashboard");
    return {
      success: true,
      lead: {
        id: `lead-${Date.now()}`,
        agency_id: "preview-agency",
        client_id: data.clientId,
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        company: data.company?.trim() || null,
        source: data.source || "Manual Entry",
        campaign: data.campaign || null,
        status: data.status || "new",
        priority: data.priority || "medium",
        deal_value: Number(data.dealValue) || 0,
        notes: data.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const { data: member } = await supabase
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!member) {
      return { success: false, error: "Active agency membership required." };
    }

    // Duplicate enquiry check
    if (data.email || data.phone) {
      let dupQuery = supabase
        .from("leads")
        .select("id, name, email, phone")
        .eq("agency_id", member.agency_id)
        .eq("client_id", data.clientId);

      const conditions: string[] = [];
      if (data.email) conditions.push(`email.eq.${data.email.trim()}`);
      if (data.phone) conditions.push(`phone.eq.${data.phone.trim()}`);
      dupQuery = dupQuery.or(conditions.join(","));

      const { data: duplicates } = await dupQuery;
      if (duplicates && duplicates.length > 0) {
        return {
          success: false,
          duplicateFound: true,
          error: `Potential duplicate enquiry: Record exists with same ${
            duplicates[0].email === data.email ? "email" : "phone"
          } (${duplicates[0].name}).`,
        };
      }
    }

    const { data: newLead, error } = await supabase
      .from("leads")
      .insert({
        agency_id: member.agency_id,
        client_id: data.clientId,
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
        company: data.company?.trim() || null,
        source: data.source || "Manual Entry",
        campaign: data.campaign || null,
        status: data.status || "new",
        priority: data.priority || "medium",
        deal_value: Number(data.dealValue) || 0,
        notes: data.notes || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Insert activity log
    await supabase.from("lead_activities").insert({
      agency_id: member.agency_id,
      lead_id: newLead.id,
      actor_id: user.id,
      action: "Lead Created",
      details: { source: newLead.source },
    });

    revalidatePath("/app/leads");
    revalidatePath("/app/dashboard");
    return { success: true, lead: newLead };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function updateLeadStatusAction(
  leadId: string,
  newStatus: LeadStatus
): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/leads");
    revalidatePath("/app/pipeline");
    revalidatePath("/app/dashboard");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required." };
    }

    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", leadId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Activity log
    await supabase.from("lead_activities").insert({
      lead_id: leadId,
      actor_id: user.id,
      action: `Status Changed to ${newStatus}`,
      details: { newStatus },
    });

    revalidatePath("/app/leads");
    revalidatePath("/app/pipeline");
    revalidatePath("/app/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function importLeadsCSVAction(
  clientId: string,
  rows: CSVLeadRow[]
): Promise<{
  success: boolean;
  importedCount: number;
  duplicateCount: number;
  errors: { row: number; error: string }[];
}> {
  if (!clientId) {
    return {
      success: false,
      importedCount: 0,
      duplicateCount: 0,
      errors: [{ row: 0, error: "Target client workspace is required." }],
    };
  }

  const errors: { row: number; error: string }[] = [];
  const validRows: CSVLeadRow[] = [];
  let duplicates = 0;

  // Row-level validation
  rows.forEach((r, idx) => {
    const rowNum = idx + 1;
    if (!r.name || r.name.trim().length === 0) {
      errors.push({ row: rowNum, error: "Missing required contact name." });
      return;
    }
    validRows.push(r);
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/leads");
    revalidatePath("/app/dashboard");
    return {
      success: true,
      importedCount: validRows.length,
      duplicateCount: duplicates,
      errors,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        success: false,
        importedCount: 0,
        duplicateCount: 0,
        errors: [{ row: 0, error: "Authentication required." }],
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
        importedCount: 0,
        duplicateCount: 0,
        errors: [{ row: 0, error: "Agency membership required." }],
      };
    }

    const inserts = validRows.map((r) => ({
      agency_id: member.agency_id,
      client_id: clientId,
      name: r.name.trim(),
      email: r.email?.trim() || null,
      phone: r.phone?.trim() || null,
      company: r.company?.trim() || null,
      source: r.source || "CSV Import",
      campaign: r.campaign || null,
      status: r.status || "new",
      priority: r.priority || "medium",
      deal_value: Number(r.dealValue) || 0,
      notes: r.notes || null,
    }));

    const { data, error } = await supabase.from("leads").insert(inserts).select();

    if (error) {
      return {
        success: false,
        importedCount: 0,
        duplicateCount: 0,
        errors: [{ row: 0, error: error.message }],
      };
    }

    revalidatePath("/app/leads");
    revalidatePath("/app/dashboard");
    return {
      success: true,
      importedCount: data?.length || 0,
      duplicateCount: duplicates,
      errors,
    };
  } catch (err: any) {
    return {
      success: false,
      importedCount: 0,
      duplicateCount: 0,
      errors: [{ row: 0, error: err.message }],
    };
  }
}
