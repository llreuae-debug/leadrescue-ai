"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface OnboardingState {
  fullName: string;
  phone?: string;
  agencyName: string;
  businessEmail: string;
  country: string;
  city?: string;
  timezone: string;
  preferredLanguage: "en" | "ur";
  agencySize: string;
  businessType: string;
  firstClientName?: string;
  firstClientIndustry?: string;
}

export interface OnboardingActionResult {
  success: boolean;
  error?: string;
  agencyId?: string;
}

export async function completeOnboardingAction(
  data: OnboardingState
): Promise<OnboardingActionResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  // In local preview/unconfigured mode, simulate successful onboarding and redirect
  if (isPlaceholder) {
    return {
      success: true,
      agencyId: "preview-agency-id",
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Authentication required to complete onboarding." };
  }

  // 1. Update or create user profile
  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: data.fullName,
    email: user.email || data.businessEmail,
    phone: data.phone || null,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    return { success: false, error: `Profile update failed: ${profileError.message}` };
  }

  // 2. Create Agency Workspace
  const { data: agency, error: agencyError } = await supabase
    .from("agencies")
    .insert({
      name: data.agencyName,
      business_email: data.businessEmail,
      country: data.country || "Pakistan",
      city: data.city || null,
      timezone: data.timezone || "Asia/Karachi",
      preferred_language: data.preferredLanguage || "en",
      agency_size: data.agencySize || "1-10",
      business_type: data.businessType || "Digital Marketing",
      plan_id: "starter",
      is_active: true,
    })
    .select("id")
    .single();

  if (agencyError || !agency) {
    return { success: false, error: `Agency creation failed: ${agencyError?.message}` };
  }

  // 3. Add authenticated user as Agency Owner
  const { error: memberError } = await supabase.from("agency_members").insert({
    agency_id: agency.id,
    user_id: user.id,
    role: "owner",
    status: "active",
  });

  if (memberError) {
    return { success: false, error: `Membership assignment failed: ${memberError.message}` };
  }

  // 4. Create First Client Workspace if provided
  if (data.firstClientName && data.firstClientName.trim().length > 0) {
    const { error: clientError } = await supabase.from("clients").insert({
      agency_id: agency.id,
      name: data.firstClientName.trim(),
      industry: data.firstClientIndustry || "General",
      status: "active",
      account_manager_id: user.id,
    });

    if (clientError) {
      console.error("Initial client creation warning:", clientError.message);
    }
  }

  return {
    success: true,
    agencyId: agency.id,
  };
}
