"use server";

import { createClient } from "@/lib/supabase/server";
import { FollowUpTask, TaskType, TaskStatus } from "@/types/database";
import { revalidatePath } from "next/cache";

export type FollowUpView = "today" | "overdue" | "upcoming" | "completed" | "snoozed";

export async function getFollowUpsAction(
  view: FollowUpView = "today",
  clientId?: string
): Promise<{ success: boolean; data: FollowUpTask[]; count: number; overdueCount: number; isDemo?: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    const now = new Date();
    let mockTasks: FollowUpTask[] = [
      {
        id: "task-1",
        agency_id: "preview-agency",
        client_id: "client-1",
        lead_id: "lead-1",
        assigned_to: "user-1",
        due_at: new Date(now.getTime() - 4 * 3600000).toISOString(), // Overdue 4h
        task_type: "whatsapp",
        notes: "Follow up on bulk wholesale quotation sent 2 days ago.",
        status: "pending",
        created_at: new Date(now.getTime() - 24 * 3600000).toISOString(),
        updated_at: new Date().toISOString(),
        lead: {
          id: "lead-1",
          agency_id: "preview-agency",
          client_id: "client-1",
          name: "Tariq Mahmood",
          phone: "+92 300 8877665",
          email: "tariq.m@apexretailers.pk",
          company: "Apex Retailers",
          source: "Meta Ads",
          status: "follow_up_required",
          priority: "urgent",
          deal_value: 240000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
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
        id: "task-2",
        agency_id: "preview-agency",
        client_id: "client-1",
        lead_id: "lead-2",
        assigned_to: "user-1",
        due_at: new Date(now.getTime() + 2 * 3600000).toISOString(), // Due Today
        task_type: "call",
        notes: "Call to confirm delivery location and order specifications.",
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        lead: {
          id: "lead-2",
          agency_id: "preview-agency",
          client_id: "client-1",
          name: "Fatima Noor",
          phone: "+92 321 4455667",
          email: "fatima@metro.pk",
          company: "Metro Fleet",
          source: "Google Ads",
          status: "qualified",
          priority: "high",
          deal_value: 480000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
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
        id: "task-3",
        agency_id: "preview-agency",
        client_id: "client-2",
        lead_id: "lead-3",
        assigned_to: "user-2",
        due_at: new Date(now.getTime() + 26 * 3600000).toISOString(), // Upcoming (Tomorrow)
        task_type: "whatsapp",
        notes: "Send updated product catalog and pricing sheet via WhatsApp.",
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        lead: {
          id: "lead-3",
          agency_id: "preview-agency",
          client_id: "client-2",
          name: "Kamran Siddiqui",
          phone: "+92 333 1122334",
          email: "ksiddiqui@paklog.com",
          company: "PakLogistics",
          source: "Website Form",
          status: "new",
          priority: "medium",
          deal_value: 180000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
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
        id: "task-4",
        agency_id: "preview-agency",
        client_id: "client-3",
        lead_id: "lead-4",
        assigned_to: "user-1",
        due_at: new Date(now.getTime() - 24 * 3600000).toISOString(),
        task_type: "call",
        notes: "Introductory discovery discussion completed. Deal won.",
        status: "completed",
        completed_at: new Date().toISOString(),
        created_at: new Date(now.getTime() - 48 * 3600000).toISOString(),
        updated_at: new Date().toISOString(),
        lead: {
          id: "lead-4",
          agency_id: "preview-agency",
          client_id: "client-3",
          name: "Zainab Ali",
          phone: "+92 345 9988776",
          source: "WhatsApp Click",
          status: "won",
          priority: "high",
          deal_value: 850000,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
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
    ];

    if (clientId && clientId !== "all") {
      mockTasks = mockTasks.filter((t) => t.client_id === clientId);
    }

    const overdueCount = mockTasks.filter(
      (t) => t.status === "pending" && new Date(t.due_at) < now
    ).length;

    // Filter by view
    let filtered = mockTasks;
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (view === "overdue") {
      filtered = mockTasks.filter((t) => t.status === "pending" && new Date(t.due_at) < startOfToday);
    } else if (view === "today") {
      filtered = mockTasks.filter(
        (t) =>
          t.status === "pending" &&
          new Date(t.due_at) >= startOfToday &&
          new Date(t.due_at) <= endOfToday
      );
    } else if (view === "upcoming") {
      filtered = mockTasks.filter((t) => t.status === "pending" && new Date(t.due_at) > endOfToday);
    } else if (view === "completed") {
      filtered = mockTasks.filter((t) => t.status === "completed");
    } else if (view === "snoozed") {
      filtered = mockTasks.filter((t) => t.status === "snoozed");
    }

    return {
      success: true,
      data: filtered,
      count: filtered.length,
      overdueCount,
      isDemo: true,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required", data: [], count: 0, overdueCount: 0 };
    }

    const { data: member } = await supabase
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!member) {
      return { success: true, data: [], count: 0, overdueCount: 0 };
    }

    let query = supabase
      .from("follow_up_tasks")
      .select("*, leads(*), clients(name, industry)")
      .eq("agency_id", member.agency_id);

    if (clientId && clientId !== "all") {
      query = query.eq("client_id", clientId);
    }

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

    if (view === "overdue") {
      query = query.eq("status", "pending").lt("due_at", startOfToday);
    } else if (view === "today") {
      query = query.eq("status", "pending").gte("due_at", startOfToday).lte("due_at", endOfToday);
    } else if (view === "upcoming") {
      query = query.eq("status", "pending").gt("due_at", endOfToday);
    } else if (view === "completed") {
      query = query.eq("status", "completed");
    } else if (view === "snoozed") {
      query = query.eq("status", "snoozed");
    }

    const { data: tasks, error } = await query.order("due_at", { ascending: true });

    if (error) {
      return { success: false, error: error.message, data: [], count: 0, overdueCount: 0 };
    }

    // Overdue count query
    const { count: overdueTotal } = await supabase
      .from("follow_up_tasks")
      .select("*", { count: "exact", head: true })
      .eq("agency_id", member.agency_id)
      .eq("status", "pending")
      .lt("due_at", startOfToday);

    const formattedTasks: FollowUpTask[] = (tasks || []).map((t: any) => ({
      ...t,
      lead: t.leads || undefined,
      client: t.clients || undefined,
    }));

    return {
      success: true,
      data: formattedTasks,
      count: formattedTasks.length,
      overdueCount: overdueTotal || 0,
    };
  } catch (err: any) {
    return { success: false, error: err.message, data: [], count: 0, overdueCount: 0 };
  }
}

export async function createFollowUpTaskAction(data: {
  leadId: string;
  clientId: string;
  dueAt: string;
  taskType: TaskType;
  notes?: string;
}): Promise<{ success: boolean; task?: FollowUpTask; error?: string }> {
  if (!data.leadId || !data.clientId || !data.dueAt) {
    return { success: false, error: "Lead, client workspace, and due date are required." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/follow-ups");
    revalidatePath("/app/dashboard");
    return {
      success: true,
      task: {
        id: `task-${Date.now()}`,
        agency_id: "preview-agency",
        client_id: data.clientId,
        lead_id: data.leadId,
        due_at: data.dueAt,
        task_type: data.taskType,
        notes: data.notes || null,
        status: "pending",
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
      return { success: false, error: "Agency membership required." };
    }

    // Check for duplicate pending task for this lead
    const { data: existing } = await supabase
      .from("follow_up_tasks")
      .select("id")
      .eq("agency_id", member.agency_id)
      .eq("lead_id", data.leadId)
      .eq("task_type", data.taskType)
      .eq("status", "pending")
      .limit(1);

    if (existing && existing.length > 0) {
      return {
        success: false,
        error: "An active pending follow-up task of this type already exists for this enquiry.",
      };
    }

    const { data: newTask, error } = await supabase
      .from("follow_up_tasks")
      .insert({
        agency_id: member.agency_id,
        client_id: data.clientId,
        lead_id: data.leadId,
        assigned_to: user.id,
        due_at: data.dueAt,
        task_type: data.taskType,
        notes: data.notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    // Update lead's next_follow_up_at
    await supabase
      .from("leads")
      .update({ next_follow_up_at: data.dueAt })
      .eq("id", data.leadId);

    // Activity log
    await supabase.from("lead_activities").insert({
      lead_id: data.leadId,
      actor_id: user.id,
      action: `Scheduled ${data.taskType} follow-up`,
      details: { dueAt: data.dueAt },
    });

    revalidatePath("/app/follow-ups");
    revalidatePath("/app/dashboard");
    return { success: true, task: newTask };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function completeFollowUpTaskAction(
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/follow-ups");
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

    const { data: task, error: fetchError } = await supabase
      .from("follow_up_tasks")
      .select("lead_id")
      .eq("id", taskId)
      .single();

    if (fetchError || !task) {
      return { success: false, error: "Task not found." };
    }

    const { error } = await supabase
      .from("follow_up_tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Update lead's last_contacted_at
    await supabase
      .from("leads")
      .update({ last_contacted_at: new Date().toISOString() })
      .eq("id", task.lead_id);

    // Record activity
    await supabase.from("lead_activities").insert({
      lead_id: task.lead_id,
      actor_id: user.id,
      action: "Completed follow-up task",
    });

    revalidatePath("/app/follow-ups");
    revalidatePath("/app/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function rescheduleFollowUpTaskAction(
  taskId: string,
  newDueAt: string,
  notes?: string
): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/follow-ups");
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

    const { data: task, error: fetchError } = await supabase
      .from("follow_up_tasks")
      .select("lead_id")
      .eq("id", taskId)
      .single();

    if (fetchError || !task) {
      return { success: false, error: "Task not found." };
    }

    const updates: Record<string, any> = {
      due_at: newDueAt,
      status: "pending",
      updated_at: new Date().toISOString(),
    };
    if (notes) updates.notes = notes;

    const { error } = await supabase
      .from("follow_up_tasks")
      .update(updates)
      .eq("id", taskId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Update lead's next_follow_up_at
    await supabase
      .from("leads")
      .update({ next_follow_up_at: newDueAt })
      .eq("id", task.lead_id);

    // Record activity
    await supabase.from("lead_activities").insert({
      lead_id: task.lead_id,
      actor_id: user.id,
      action: "Rescheduled follow-up task",
      details: { newDueAt },
    });

    revalidatePath("/app/follow-ups");
    revalidatePath("/app/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function snoozeFollowUpTaskAction(
  taskId: string,
  days: number = 1
): Promise<{ success: boolean; error?: string }> {
  const newDue = new Date(Date.now() + days * 86400000).toISOString();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/follow-ups");
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
      .from("follow_up_tasks")
      .update({
        due_at: newDue,
        status: "snoozed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/app/follow-ups");
    revalidatePath("/app/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
