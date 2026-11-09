import type {
  SuperAdminUser,
  AdminAuditEvent,
  AdminPlanDefinition,
} from "../../types/admin.ts";

/**
 * Validates whether the given user session possesses verified Super Admin privileges.
 * Strictly checks trusted server-side flags and roles.
 * Never trusts editable user metadata, browser headers, or URL queries.
 */
export function verifySuperAdminAccess(user?: Partial<SuperAdminUser> | null): {
  authorized: boolean;
  error?: string;
} {
  if (!user) {
    return {
      authorized: false,
      error: "Authentication required. No active session found.",
    };
  }

  // Must have isSuperAdmin explicitly true AND role must be super_admin
  if (!user.isSuperAdmin || user.role !== "super_admin") {
    return {
      authorized: false,
      error: "Access denied: Platform Super Admin privileges required.",
    };
  }

  return { authorized: true };
}

/**
 * Strips sensitive keys such as passwords, access tokens, auth headers, and secrets
 * from metadata before persisting to the platform audit log.
 */
export function sanitizeAuditMetadata(
  meta?: Record<string, any> | null
): Record<string, any> {
  if (!meta) return {};

  const forbiddenKeys = [
    "password",
    "token",
    "access_token",
    "refresh_token",
    "secret",
    "authorization",
    "apiKey",
    "api_key",
    "cookie",
  ];

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(meta)) {
    const lowerKey = key.toLowerCase();
    if (forbiddenKeys.some((f) => lowerKey.includes(f))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeAuditMetadata(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Constructs an immutable, sanitized audit event record for administrative operations.
 */
export function createAdminAuditEvent(params: {
  actor: SuperAdminUser;
  action: AdminAuditEvent["action"];
  targetType: AdminAuditEvent["targetType"];
  targetId: string;
  reason?: string | null;
  metadata?: Record<string, any>;
}): AdminAuditEvent {
  return {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    actorId: params.actor.id,
    actorEmail: params.actor.email,
    action: params.action,
    targetType: params.targetType,
    targetId: params.targetId,
    reason: params.reason || null,
    metadata: sanitizeAuditMetadata(params.metadata),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validates plan modifications (e.g. price and limits cannot be negative).
 */
export function validatePlanUpdate(
  current: AdminPlanDefinition,
  updates: Partial<AdminPlanDefinition>
): { valid: boolean; error?: string } {
  if (updates.pricePKR !== undefined && updates.pricePKR < 0) {
    return { valid: false, error: "Plan price in PKR cannot be negative" };
  }
  if (updates.maxClients !== undefined && updates.maxClients < 1) {
    return { valid: false, error: "Maximum client workspaces must be at least 1" };
  }
  if (updates.maxLeadsPerMonth !== undefined && updates.maxLeadsPerMonth < 10) {
    return { valid: false, error: "Monthly leads limit must be at least 10" };
  }
  if (updates.maxTeamSeats !== undefined && updates.maxTeamSeats < 1) {
    return { valid: false, error: "Team seats must be at least 1" };
  }
  if (updates.maxAiDraftsPerMonth !== undefined && updates.maxAiDraftsPerMonth < 0) {
    return { valid: false, error: "AI drafts quota cannot be negative" };
  }

  return { valid: true };
}
