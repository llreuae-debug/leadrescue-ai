"use server";

import { createClient } from "@/lib/supabase/server";
import { AgencyRole, MembershipStatus } from "@/types/database";
import {
  TeamAuditLogEntry,
  TeamMemberRecord,
  validateInvitation,
  validateMemberRemoval,
  validateRoleChange,
} from "@/lib/team/team-management";
import { revalidatePath } from "next/cache";

// Demo in-memory state for local preview mode
let demoMembers: TeamMemberRecord[] = [
  {
    id: "tm-1",
    agencyId: "preview-agency",
    userId: "user-1",
    fullName: "Ahmed Khan",
    email: "ahmed@leadrescue.pk",
    phone: "+92 300 1234567",
    role: "owner",
    status: "active",
    joinedAt: "2026-01-01T00:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: "tm-2",
    agencyId: "preview-agency",
    userId: "user-2",
    fullName: "Bilal Tariq",
    email: "bilal@leadrescue.pk",
    phone: "+92 321 7654321",
    role: "admin",
    status: "active",
    joinedAt: "2026-01-15T00:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "tm-3",
    agencyId: "preview-agency",
    userId: "user-3",
    fullName: "Sarah Qureshi",
    email: "sarah.q@leadrescue.pk",
    phone: "+92 333 4567890",
    role: "manager",
    status: "active",
    joinedAt: "2026-02-01T00:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "tm-4",
    agencyId: "preview-agency",
    userId: "user-4",
    fullName: "Zainab Ali",
    email: "zainab@leadrescue.pk",
    phone: "+92 302 9876543",
    role: "sales_representative",
    status: "active",
    joinedAt: "2026-02-10T00:00:00.000Z",
    lastActiveAt: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "tm-5",
    agencyId: "preview-agency",
    userId: "user-5",
    fullName: "Hamza Farooq",
    email: "hamza.f@leadrescue.pk",
    phone: null,
    role: "sales_representative",
    status: "invited",
    joinedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
];

let demoAuditLogs: TeamAuditLogEntry[] = [
  {
    id: "log-1",
    agencyId: "preview-agency",
    actorId: "user-1",
    actorName: "Ahmed Khan (Owner)",
    action: "member_invited",
    targetEmail: "hamza.f@leadrescue.pk",
    targetRole: "sales_representative",
    details: "Invitation dispatched via email",
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: "log-2",
    agencyId: "preview-agency",
    actorId: "user-1",
    actorName: "Ahmed Khan (Owner)",
    action: "role_updated",
    targetEmail: "bilal@leadrescue.pk",
    targetRole: "admin",
    details: "Promoted from manager to admin",
    timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export async function getTeamDataAction(): Promise<{
  success: boolean;
  members: TeamMemberRecord[];
  auditLogs: TeamAuditLogEntry[];
  currentMemberRole: AgencyRole;
  isDemo?: boolean;
  error?: string;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isPlaceholder = !supabaseUrl || supabaseUrl.includes("placeholder-project");

  if (isPlaceholder) {
    return {
      success: true,
      members: [...demoMembers],
      auditLogs: [...demoAuditLogs],
      currentMemberRole: "owner",
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
      return { success: false, members: [], auditLogs: [], currentMemberRole: "viewer", error: "Unauthorized" };
    }

    const { data: currentMember } = await supabase
      .from("agency_members")
      .select("agency_id, role")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (!currentMember) {
      return { success: false, members: [], auditLogs: [], currentMemberRole: "viewer", error: "No active membership" };
    }

    const { data: members, error: membersError } = await supabase
      .from("agency_members")
      .select("id, agency_id, user_id, role, status, created_at, profile:profiles(full_name, email, phone)")
      .eq("agency_id", currentMember.agency_id)
      .order("created_at", { ascending: true });

    if (membersError) throw membersError;

    const formatted: TeamMemberRecord[] = (members || []).map((m: any) => ({
      id: m.id,
      agencyId: m.agency_id,
      userId: m.user_id,
      fullName: m.profile?.full_name || "Invited User",
      email: m.profile?.email || "pending@invitation",
      phone: m.profile?.phone || null,
      role: m.role,
      status: m.status,
      joinedAt: m.created_at,
    }));

    return {
      success: true,
      members: formatted,
      auditLogs: [],
      currentMemberRole: currentMember.role,
    };
  } catch (err: any) {
    return {
      success: false,
      members: [],
      auditLogs: [],
      currentMemberRole: "viewer",
      error: err.message || "Failed to load team data",
    };
  }
}

export async function inviteTeamMemberAction(params: {
  fullName: string;
  email: string;
  role: AgencyRole;
}): Promise<{ success: boolean; error?: string }> {
  const { fullName, email, role } = params;
  const teamData = await getTeamDataAction();

  if (!teamData.success) {
    return { success: false, error: teamData.error || "Failed to authenticate" };
  }

  const validation = validateInvitation(teamData.currentMemberRole, email, role, teamData.members);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  if (teamData.isDemo) {
    const newMember: TeamMemberRecord = {
      id: `tm-${Date.now()}`,
      agencyId: "preview-agency",
      userId: `user-invited-${Date.now()}`,
      fullName: fullName.trim() || "Invited Member",
      email: email.trim().toLowerCase(),
      role,
      status: "invited",
      joinedAt: new Date().toISOString(),
    };

    demoMembers = [...demoMembers, newMember];
    demoAuditLogs = [
      {
        id: `log-${Date.now()}`,
        agencyId: "preview-agency",
        actorId: "user-1",
        actorName: "Ahmed Khan (Owner)",
        action: "member_invited",
        targetEmail: email.trim().toLowerCase(),
        targetRole: role,
        details: `Invitation dispatched for role ${role.toUpperCase()}`,
        timestamp: new Date().toISOString(),
      },
      ...demoAuditLogs,
    ];

    revalidatePath("/app/team");
    return { success: true };
  }

  try {
    const supabase = await createClient();
    // In production with Supabase, trigger auth invite or insert record with 'invited' status
    revalidatePath("/app/team");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to invite member" };
  }
}

export async function resendInvitationAction(memberId: string): Promise<{ success: boolean; error?: string }> {
  const teamData = await getTeamDataAction();
  if (!teamData.success) return { success: false, error: "Unauthorized" };

  const member = teamData.members.find((m) => m.id === memberId);
  if (!member || member.status !== "invited") {
    return { success: false, error: "Only pending invitations can be resent." };
  }

  if (teamData.isDemo) {
    demoAuditLogs = [
      {
        id: `log-${Date.now()}`,
        agencyId: "preview-agency",
        actorId: "user-1",
        actorName: "Ahmed Khan (Owner)",
        action: "invitation_resent",
        targetEmail: member.email,
        targetRole: member.role,
        details: "Invitation notification resent to prospect",
        timestamp: new Date().toISOString(),
      },
      ...demoAuditLogs,
    ];
    revalidatePath("/app/team");
    return { success: true };
  }

  return { success: true };
}

export async function updateMemberRoleAction(params: {
  memberId: string;
  newRole: AgencyRole;
}): Promise<{ success: boolean; error?: string }> {
  const { memberId, newRole } = params;
  const teamData = await getTeamDataAction();

  if (!teamData.success) return { success: false, error: "Unauthorized" };

  const validation = validateRoleChange(teamData.currentMemberRole, memberId, newRole, teamData.members);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const targetMember = teamData.members.find((m) => m.id === memberId);

  if (teamData.isDemo && targetMember) {
    const oldRole = targetMember.role;
    demoMembers = demoMembers.map((m) => (m.id === memberId ? { ...m, role: newRole } : m));

    demoAuditLogs = [
      {
        id: `log-${Date.now()}`,
        agencyId: "preview-agency",
        actorId: "user-1",
        actorName: "Ahmed Khan (Owner)",
        action: "role_updated",
        targetEmail: targetMember.email,
        targetRole: newRole,
        details: `Role updated from ${oldRole.toUpperCase()} to ${newRole.toUpperCase()}`,
        timestamp: new Date().toISOString(),
      },
      ...demoAuditLogs,
    ];

    revalidatePath("/app/team");
    return { success: true };
  }

  return { success: true };
}

export async function updateMemberStatusAction(params: {
  memberId: string;
  newStatus: MembershipStatus;
}): Promise<{ success: boolean; error?: string }> {
  const { memberId, newStatus } = params;
  const teamData = await getTeamDataAction();

  if (!teamData.success) return { success: false, error: "Unauthorized" };

  if (newStatus === "suspended") {
    const removalVal = validateMemberRemoval(teamData.currentMemberRole, memberId, teamData.members);
    if (!removalVal.valid) {
      return { success: false, error: removalVal.error };
    }
  }

  const targetMember = teamData.members.find((m) => m.id === memberId);

  if (teamData.isDemo && targetMember) {
    demoMembers = demoMembers.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m));

    demoAuditLogs = [
      {
        id: `log-${Date.now()}`,
        agencyId: "preview-agency",
        actorId: "user-1",
        actorName: "Ahmed Khan (Owner)",
        action: "member_suspended",
        targetEmail: targetMember.email,
        targetRole: targetMember.role,
        details: `Status shifted to ${newStatus.toUpperCase()}`,
        timestamp: new Date().toISOString(),
      },
      ...demoAuditLogs,
    ];

    revalidatePath("/app/team");
    return { success: true };
  }

  return { success: true };
}

export async function removeMemberAction(memberId: string): Promise<{ success: boolean; error?: string }> {
  const teamData = await getTeamDataAction();
  if (!teamData.success) return { success: false, error: "Unauthorized" };

  const removalVal = validateMemberRemoval(teamData.currentMemberRole, memberId, teamData.members);
  if (!removalVal.valid) {
    return { success: false, error: removalVal.error };
  }

  const targetMember = teamData.members.find((m) => m.id === memberId);

  if (teamData.isDemo && targetMember) {
    demoMembers = demoMembers.filter((m) => m.id !== memberId);

    demoAuditLogs = [
      {
        id: `log-${Date.now()}`,
        agencyId: "preview-agency",
        actorId: "user-1",
        actorName: "Ahmed Khan (Owner)",
        action: "member_removed",
        targetEmail: targetMember.email,
        details: `Removed membership for ${targetMember.fullName}`,
        timestamp: new Date().toISOString(),
      },
      ...demoAuditLogs,
    ];

    revalidatePath("/app/team");
    return { success: true };
  }

  return { success: true };
}
