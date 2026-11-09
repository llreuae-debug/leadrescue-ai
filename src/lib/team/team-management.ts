import type { AgencyRole, MembershipStatus } from "../../types/database.ts";

export interface TeamMemberRecord {
  id: string;
  agencyId: string;
  userId: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: AgencyRole;
  status: MembershipStatus;
  joinedAt: string;
  lastActiveAt?: string | null;
}

export interface TeamAuditLogEntry {
  id: string;
  agencyId: string;
  actorId: string;
  actorName: string;
  action: "member_invited" | "invitation_resent" | "role_updated" | "member_suspended" | "member_removed";
  targetEmail: string;
  targetRole?: AgencyRole;
  details?: string;
  timestamp: string;
}

/**
 * Evaluates whether an agency role has team administrative authority.
 * (Only Owners and Admins have invite/update/remove permissions)
 */
export function canManageTeam(role: AgencyRole): boolean {
  return role === "owner" || role === "admin";
}

/**
 * Checks if the target member is the sole active owner in the agency.
 */
export function isSoleAgencyOwner(members: TeamMemberRecord[], targetMemberId: string): boolean {
  const activeOwners = members.filter(
    (m) => m.role === "owner" && (m.status === "active" || m.status === "invited")
  );
  return activeOwners.length === 1 && activeOwners[0].id === targetMemberId;
}

/**
 * Validates an invitation request.
 */
export function validateInvitation(
  actorRole: AgencyRole,
  email: string,
  targetRole: AgencyRole,
  existingMembers: TeamMemberRecord[]
): { valid: boolean; error?: string } {
  if (!canManageTeam(actorRole)) {
    return { valid: false, error: "Unauthorized: You do not have permission to invite team members." };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  const existing = existingMembers.find((m) => m.email.toLowerCase() === cleanEmail);
  if (existing) {
    if (existing.status === "active") {
      return { valid: false, error: `A member with email "${cleanEmail}" is already active in this agency.` };
    }
    if (existing.status === "invited") {
      return { valid: false, error: `An invitation for "${cleanEmail}" is already pending.` };
    }
  }

  // Admins cannot invite Owners (only Owners can create another Owner)
  if (actorRole !== "owner" && targetRole === "owner") {
    return { valid: false, error: "Only an agency Owner can invite another Owner." };
  }

  return { valid: true };
}

/**
 * Validates a role change request, strictly protecting the last Owner.
 */
export function validateRoleChange(
  actorRole: AgencyRole,
  targetMemberId: string,
  newRole: AgencyRole,
  existingMembers: TeamMemberRecord[]
): { valid: boolean; error?: string } {
  if (!canManageTeam(actorRole)) {
    return { valid: false, error: "Unauthorized: You do not have permission to change team member roles." };
  }

  const targetMember = existingMembers.find((m) => m.id === targetMemberId);
  if (!targetMember) {
    return { valid: false, error: "Target team member not found." };
  }

  // Non-owners cannot promote someone to Owner or modify an Owner
  if (actorRole !== "owner" && (newRole === "owner" || targetMember.role === "owner")) {
    return { valid: false, error: "Only an agency Owner can assign or modify the Owner role." };
  }

  // Protect the last Owner
  if (targetMember.role === "owner" && newRole !== "owner" && isSoleAgencyOwner(existingMembers, targetMemberId)) {
    return { valid: false, error: "Protection Rule: Cannot demote the last agency Owner." };
  }

  return { valid: true };
}

/**
 * Validates a member removal or suspension, strictly protecting the last Owner.
 */
export function validateMemberRemoval(
  actorRole: AgencyRole,
  targetMemberId: string,
  existingMembers: TeamMemberRecord[]
): { valid: boolean; error?: string } {
  if (!canManageTeam(actorRole)) {
    return { valid: false, error: "Unauthorized: You do not have permission to remove team members." };
  }

  const targetMember = existingMembers.find((m) => m.id === targetMemberId);
  if (!targetMember) {
    return { valid: false, error: "Target team member not found." };
  }

  // Protect the last Owner
  if (targetMember.role === "owner" && isSoleAgencyOwner(existingMembers, targetMemberId)) {
    return { valid: false, error: "Protection Rule: Cannot remove the last agency Owner." };
  }

  // Non-owners cannot remove an Owner
  if (actorRole !== "owner" && targetMember.role === "owner") {
    return { valid: false, error: "Only an agency Owner can remove another Owner." };
  }

  return { valid: true };
}

