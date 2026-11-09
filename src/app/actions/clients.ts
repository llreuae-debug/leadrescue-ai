"use server";

import { createClient } from "@/lib/supabase/server";
import { ClientWorkspace, ClientStatus } from "@/types/database";
import { revalidatePath } from "next/cache";

export interface ClientWithMetrics extends ClientWorkspace {
  totalLeads: number;
  activeLeads: number;
  wonOpportunities: number;
}

export async function getClientsAction(): Promise<{
  success: boolean;
  data: ClientWithMetrics[];
  isDemo?: boolean;
  error?: string;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    return {
      success: true,
      isDemo: true,
      data: [
        {
          id: "client-1",
          agency_id: "preview-agency",
          name: "Horizon Retailers",
          industry: "E-commerce & Fashion",
          status: "active",
          account_manager_id: "user-1",
          created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
          updated_at: new Date().toISOString(),
          totalLeads: 68,
          activeLeads: 42,
          wonOpportunities: 12,
          account_manager: {
            id: "user-1",
            full_name: "Tariq Mahmood",
            email: "tariq@primedigital.pk",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          id: "client-2",
          agency_id: "preview-agency",
          name: "Metro Logistics PK",
          industry: "Logistics & Transport",
          status: "active",
          account_manager_id: "user-2",
          created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
          updated_at: new Date().toISOString(),
          totalLeads: 34,
          activeLeads: 18,
          wonOpportunities: 5,
          account_manager: {
            id: "user-2",
            full_name: "Fatima Noor",
            email: "fatima@primedigital.pk",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
        {
          id: "client-3",
          agency_id: "preview-agency",
          name: "Skyline Ventures",
          industry: "Real Estate & Commercial",
          status: "active",
          account_manager_id: "user-1",
          created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
          updated_at: new Date().toISOString(),
          totalLeads: 22,
          activeLeads: 14,
          wonOpportunities: 1,
          account_manager: {
            id: "user-1",
            full_name: "Tariq Mahmood",
            email: "tariq@primedigital.pk",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        },
      ],
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Authentication required", data: [] };
    }

    const { data: member } = await supabase
      .from("agency_members")
      .select("agency_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!member) {
      return { success: true, data: [] };
    }

    const { data: clients, error: clientError } = await supabase
      .from("clients")
      .select("*, profiles:account_manager_id(*)")
      .eq("agency_id", member.agency_id)
      .order("created_at", { ascending: false });

    if (clientError) {
      return { success: false, error: clientError.message, data: [] };
    }

    // Fetch lead counts for each client
    const { data: leads } = await supabase
      .from("leads")
      .select("client_id, status")
      .eq("agency_id", member.agency_id);

    const clientMetrics: ClientWithMetrics[] = (clients || []).map((c: any) => {
      const clientLeads = leads?.filter((l) => l.client_id === c.id) || [];
      const totalLeads = clientLeads.length;
      const activeLeads = clientLeads.filter(
        (l) => l.status !== "won" && l.status !== "lost"
      ).length;
      const wonOpportunities = clientLeads.filter((l) => l.status === "won").length;

      return {
        ...c,
        account_manager: c.profiles || null,
        totalLeads,
        activeLeads,
        wonOpportunities,
      };
    });

    return { success: true, data: clientMetrics };
  } catch (err: any) {
    return { success: false, error: err.message, data: [] };
  }
}

export async function getClientByIdAction(
  clientId: string
): Promise<{ success: boolean; data?: ClientWithMetrics; isDemo?: boolean; error?: string }> {
  const allRes = await getClientsAction();
  if (!allRes.success) {
    return { success: false, error: allRes.error };
  }

  const client = allRes.data.find((c) => c.id === clientId);
  if (!client) {
    return { success: false, error: "Client workspace not found" };
  }

  return { success: true, data: client, isDemo: allRes.isDemo };
}

export async function createClientAction(formData: {
  name: string;
  industry: string;
  status?: ClientStatus;
}): Promise<{ success: boolean; error?: string; client?: ClientWorkspace }> {
  if (!formData.name.trim()) {
    return { success: false, error: "Client name is required." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/clients");
    return {
      success: true,
      client: {
        id: `client-${Date.now()}`,
        agency_id: "preview-agency",
        name: formData.name.trim(),
        industry: formData.industry || "General",
        status: formData.status || "active",
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
      .select("agency_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!member || (member.role !== "owner" && member.role !== "admin" && member.role !== "manager")) {
      return { success: false, error: "Unauthorized: Insufficient role permissions." };
    }

    const { data: newClient, error } = await supabase
      .from("clients")
      .insert({
        agency_id: member.agency_id,
        name: formData.name.trim(),
        industry: formData.industry || "General",
        status: formData.status || "active",
        account_manager_id: user.id,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/app/clients");
    return { success: true, client: newClient };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
