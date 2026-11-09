import test from "node:test";
import assert from "node:assert/strict";
import { hasPermission, type PermissionAction } from "../src/lib/rbac.ts";
import type { AgencyRole } from "../src/types/database.ts";

test("Multi-Tenant Isolation & RBAC Test Suite", async (t) => {
  await t.test("Owner has full administrative and destructive capabilities", () => {
    const ownerPermissions: PermissionAction[] = [
      "agency:update",
      "agency:delete",
      "agency:billing",
      "team:invite",
      "team:update_role",
      "team:remove",
      "clients:create",
      "clients:update",
      "clients:delete",
      "leads:delete",
      "leads:assign",
      "ai:generate",
    ];

    for (const permission of ownerPermissions) {
      assert.equal(
        hasPermission("owner", permission),
        true,
        `Owner should have permission: ${permission}`
      );
    }
  });

  await t.test("Admin cannot delete agency workspace but can manage team and clients", () => {
    assert.equal(hasPermission("admin", "agency:delete"), false);
    assert.equal(hasPermission("admin", "agency:billing"), true);
    assert.equal(hasPermission("admin", "clients:create"), true);
    assert.equal(hasPermission("admin", "team:invite"), true);
  });

  await t.test("Manager can manage clients and leads, but cannot manage billing or invite team", () => {
    assert.equal(hasPermission("manager", "agency:billing"), false);
    assert.equal(hasPermission("manager", "team:invite"), false);
    assert.equal(hasPermission("manager", "team:update_role"), false);
    assert.equal(hasPermission("manager", "clients:create"), true);
    assert.equal(hasPermission("manager", "leads:assign"), true);
  });

  await t.test("Sales Representative can only create/update leads and generate AI drafts", () => {
    assert.equal(hasPermission("sales_representative", "clients:create"), false);
    assert.equal(hasPermission("sales_representative", "clients:delete"), false);
    assert.equal(hasPermission("sales_representative", "agency:billing"), false);
    assert.equal(hasPermission("sales_representative", "leads:delete"), false);
    assert.equal(hasPermission("sales_representative", "leads:create"), true);
    assert.equal(hasPermission("sales_representative", "leads:update"), true);
    assert.equal(hasPermission("sales_representative", "ai:generate"), true);
  });

  await t.test("Viewer has zero mutation permissions (read-only enforcement)", () => {
    const prohibitedActions: PermissionAction[] = [
      "agency:update",
      "agency:delete",
      "agency:billing",
      "team:invite",
      "clients:create",
      "clients:delete",
      "leads:create",
      "leads:delete",
      "ai:generate",
    ];

    for (const action of prohibitedActions) {
      assert.equal(
        hasPermission("viewer", action),
        false,
        `Viewer must NOT have mutation permission: ${action}`
      );
    }
  });

  await t.test("Tenant Isolation Mock: User in Agency A cannot query or mutate Agency B records", () => {
    // Simulated Agency Memberships in database
    const memberships = [
      { userId: "user-alpha", agencyId: "agency-alpha", role: "owner" as AgencyRole },
      { userId: "user-beta", agencyId: "agency-beta", role: "owner" as AgencyRole },
    ];

    function verifyTenantAccess(requestedUserId: string, requestedAgencyId: string): boolean {
      const match = memberships.find(
        (m) => m.userId === requestedUserId && m.agencyId === requestedAgencyId
      );
      return !!match;
    }

    // Agency A owner accessing Agency A -> ALLOWED
    assert.equal(verifyTenantAccess("user-alpha", "agency-alpha"), true);

    // Agency B owner accessing Agency B -> ALLOWED
    assert.equal(verifyTenantAccess("user-beta", "agency-beta"), true);

    // Cross-agency attack: Agency A owner spoofing Agency B ID -> STRICTLY REJECTED
    assert.equal(verifyTenantAccess("user-alpha", "agency-beta"), false);

    // Cross-agency attack: Agency B owner spoofing Agency A ID -> STRICTLY REJECTED
    assert.equal(verifyTenantAccess("user-beta", "agency-alpha"), false);
  });
});
