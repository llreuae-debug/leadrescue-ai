import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  verifySuperAdminAccess,
  sanitizeAuditMetadata,
  createAdminAuditEvent,
  validatePlanUpdate,
} from "../src/lib/admin/admin-security.ts";
import type { SuperAdminUser, AdminPlanDefinition } from "../src/types/admin.ts";

describe("Super Admin Console & Privilege Separation Test Suite", () => {
  const verifiedSuperAdmin: SuperAdminUser = {
    id: "admin-root-01",
    email: "security@leadrescue.ai",
    name: "Platform Super Admin",
    isSuperAdmin: true,
    role: "super_admin",
  };

  test("Privilege Verification: Grants access to verified Super Admin", () => {
    const check = verifySuperAdminAccess(verifiedSuperAdmin);
    assert.strictEqual(check.authorized, true);
    assert.strictEqual(check.error, undefined);
  });

  test("Privilege Separation: Rejects Agency Owner from Super Admin console", () => {
    const agencyOwner = {
      id: "user-agency-owner",
      email: "owner@apexmedia.pk",
      name: "Agency Owner",
      isSuperAdmin: false,
      role: "owner" as any,
    };

    const check = verifySuperAdminAccess(agencyOwner);
    assert.strictEqual(check.authorized, false);
    assert.match(check.error || "", /Super Admin privileges required/);
  });

  test("Privilege Separation: Rejects Agency Admin and Manager roles", () => {
    const agencyAdmin = {
      id: "user-agency-admin",
      email: "admin@apexmedia.pk",
      name: "Agency Admin",
      isSuperAdmin: false,
      role: "admin" as any,
    };
    const check = verifySuperAdminAccess(agencyAdmin);
    assert.strictEqual(check.authorized, false);

    const agencyManager = {
      id: "user-agency-mgr",
      email: "mgr@apexmedia.pk",
      name: "Agency Manager",
      isSuperAdmin: false,
      role: "manager" as any,
    };
    const check2 = verifySuperAdminAccess(agencyManager);
    assert.strictEqual(check2.authorized, false);
  });

  test("Privilege Elevation Defense: Blocks spoofed metadata without server flag", () => {
    // Malicious user pretending to be super admin via custom metadata
    const imposter = {
      id: "user-attacker",
      email: "attacker@external.com",
      name: "Attacker",
      isSuperAdmin: false, // Server says FALSE
      role: "none" as any,
      metadata: { is_admin: true, role: "super_admin" },
    };

    const check = verifySuperAdminAccess(imposter);
    assert.strictEqual(check.authorized, false);
  });

  test("Anonymous Session Rejection: Blocks unauthenticated requests", () => {
    const checkNull = verifySuperAdminAccess(null);
    assert.strictEqual(checkNull.authorized, false);
    assert.match(checkNull.error || "", /Authentication required/);

    const checkUndefined = verifySuperAdminAccess(undefined);
    assert.strictEqual(checkUndefined.authorized, false);
  });

  test("Sensitive Credential Redaction: Purges secrets from audit metadata", () => {
    const rawMetadata = {
      agencyName: "Alpha Media Pakistan",
      planId: "growth",
      amountPKR: 6999,
      password: "secret_db_password_123",
      api_key: "lr_live_998877665544332211",
      authorization: "Bearer eyJhbGciOi...",
      sessionToken: "sess_xyz_private",
      nested: {
        safeField: "OK to log",
        client_secret: "do_not_log_this",
      },
    };

    const sanitized = sanitizeAuditMetadata(rawMetadata);

    assert.strictEqual(sanitized.agencyName, "Alpha Media Pakistan");
    assert.strictEqual(sanitized.planId, "growth");
    assert.strictEqual(sanitized.amountPKR, 6999);
    assert.strictEqual(sanitized.password, "[REDACTED]");
    assert.strictEqual(sanitized.api_key, "[REDACTED]");
    assert.strictEqual(sanitized.authorization, "[REDACTED]");
    assert.strictEqual(sanitized.sessionToken, "[REDACTED]");
    assert.strictEqual(sanitized.nested.safeField, "OK to log");
    assert.strictEqual(sanitized.nested.client_secret, "[REDACTED]");
  });

  test("Audit Event Construction: Produces structured, non-repudiable audit event", () => {
    const event = createAdminAuditEvent({
      actor: verifiedSuperAdmin,
      action: "agency_suspended",
      targetType: "agency",
      targetId: "agency-alpha-123",
      reason: "Terms of Service violation: Unsolicited cold SMS spam detected",
      metadata: {
        previousStatus: "active",
        reportedBy: "compliance-bot",
        internalToken: "token_to_redact",
      },
    });

    assert.ok(event.id.startsWith("audit-"));
    assert.strictEqual(event.actorId, "admin-root-01");
    assert.strictEqual(event.actorEmail, "security@leadrescue.ai");
    assert.strictEqual(event.action, "agency_suspended");
    assert.strictEqual(event.targetType, "agency");
    assert.strictEqual(event.targetId, "agency-alpha-123");
    assert.match(event.reason || "", /Terms of Service violation/);
    assert.strictEqual(event.metadata?.previousStatus, "active");
    assert.strictEqual(event.metadata?.internalToken, "[REDACTED]");
    assert.ok(event.timestamp);
  });

  test("Plan Validation: Rejects negative prices or non-positive workspace limits", () => {
    const currentPlan: AdminPlanDefinition = {
      id: "growth",
      name: "Growth Tier",
      pricePKR: 6999,
      interval: "month",
      maxClients: 10,
      maxLeadsPerMonth: 1200,
      maxTeamSeats: 6,
      maxAiDraftsPerMonth: 1000,
      isActive: true,
      updatedAt: "2026-11-01T00:00:00Z",
    };

    const negativePrice = validatePlanUpdate(currentPlan, { pricePKR: -500 });
    assert.strictEqual(negativePrice.valid, false);
    assert.match(negativePrice.error || "", /price in PKR cannot be negative/);

    const zeroClients = validatePlanUpdate(currentPlan, { maxClients: 0 });
    assert.strictEqual(zeroClients.valid, false);
    assert.match(zeroClients.error || "", /client workspaces must be at least 1/);

    const invalidLeads = validatePlanUpdate(currentPlan, { maxLeadsPerMonth: 5 });
    assert.strictEqual(invalidLeads.valid, false);
    assert.match(invalidLeads.error || "", /leads limit must be at least 10/);

    const validUpdate = validatePlanUpdate(currentPlan, {
      pricePKR: 7499,
      maxLeadsPerMonth: 1500,
    });
    assert.strictEqual(validUpdate.valid, true);
  });
});
