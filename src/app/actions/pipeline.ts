"use server";

import { createClient } from "@/lib/supabase/server";
import { LeadStatus } from "@/types/database";
import { PIPELINE_STAGES } from "@/config/pipeline";
import { revalidatePath } from "next/cache";

export { PIPELINE_STAGES };

export async function updateLeadStageAction(
  leadId: string,
  newStage: LeadStatus,
  lossReason?: string
): Promise<{ success: boolean; error?: string }> {
  const validStages = PIPELINE_STAGES.map((s) => s.id);
  if (!validStages.includes(newStage)) {
    return { success: false, error: "Invalid pipeline stage transition." };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    revalidatePath("/app/pipeline");
    revalidatePath("/app/leads");
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

    const updates: Record<string, any> = {
      status: newStage,
      updated_at: new Date().toISOString(),
    };

    if (newStage === "lost" && lossReason) {
      updates.notes = lossReason;
    }

    const { error } = await supabase.from("leads").update(updates).eq("id", leadId);

    if (error) {
      return { success: false, error: error.message };
    }

    // Insert activity log
    await supabase.from("lead_activities").insert({
      lead_id: leadId,
      actor_id: user.id,
      action: `Moved stage to ${newStage}`,
      details: { newStage, lossReason: lossReason || null },
    });

    revalidatePath("/app/pipeline");
    revalidatePath("/app/leads");
    revalidatePath("/app/dashboard");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
