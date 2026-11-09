import type { AgencyRole } from "@/types/database";

export type PermissionAction =
  | "agency:update"
  | "agency:delete"
  | "agency:billing"
  | "team:invite"
  | "team:update_role"
  | "team:remove"
  | "clients:create"
  | "clients:update"
  | "clients:delete"
  | "leads:create"
  | "leads:update"
  | "leads:delete"
  | "leads:assign"
  | "followups:manage"
  | "ai:generate"
  | "reports:view_all"
  | "audit:view";

export const ROLE_PERMISSIONS: Record<AgencyRole, PermissionAction[]> = {
  owner: [
    "agency:update",
    "agency:delete",
    "agency:billing",
    "team:invite",
    "team:update_role",
    "team:remove",
    "clients:create",
    "clients:update",
    "clients:delete",
    "leads:create",
    "leads:update",
    "leads:delete",
    "leads:assign",
    "followups:manage",
    "ai:generate",
    "reports:view_all",
    "audit:view",
  ],
  admin: [
    "agency:update",
    "agency:billing",
    "team:invite",
    "team:update_role",
    "team:remove",
    "clients:create",
    "clients:update",
    "clients:delete",
    "leads:create",
    "leads:update",
    "leads:delete",
    "leads:assign",
    "followups:manage",
    "ai:generate",
    "reports:view_all",
  ],
  manager: [
    "clients:create",
    "clients:update",
    "leads:create",
    "leads:update",
    "leads:delete",
    "leads:assign",
    "followups:manage",
    "ai:generate",
    "reports:view_all",
  ],
  sales_representative: [
    "leads:create",
    "leads:update",
    "followups:manage",
    "ai:generate",
  ],
  viewer: [],
};

/**
 * Pure evaluation function for role permissions
 */
export function hasPermission(role: AgencyRole, action: PermissionAction): boolean {
  return ROLE_PERMISSIONS[role]?.includes(action) ?? false;
}
