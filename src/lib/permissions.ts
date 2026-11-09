import type { AgencyRole } from "@/types/database";
import { createClient } from "./supabase/server";
import { hasPermission, type PermissionAction } from "./rbac";

export * from "./rbac";

/**
 * Server-side helper to verify that the currently authenticated user
 * is an active member of the specified agency, and optionally has the required permission.
 * Returns { userId, role } on success, or null on rejection.
 */
export async function verifyAgencyAccess(
  agencyId: string,
  requiredPermission?: PermissionAction
): Promise<{ userId: string; role: AgencyRole } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Query trusted membership record
  const { data: member, error } = await supabase
    .from("agency_members")
    .select("role, status")
    .eq("agency_id", agencyId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (error || !member) {
    return null;
  }

  const role = member.role as AgencyRole;

  if (requiredPermission && !hasPermission(role, requiredPermission)) {
    return null;
  }

  return { userId: user.id, role };
}
