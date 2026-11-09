import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  isSoleAgencyOwner,
  validateInvitation,
  validateRoleChange,
  validateMemberRemoval,
  type TeamMemberRecord,
} from "../src/lib/team/team-management.ts";

const mockMembersSingleOwner: TeamMemberRecord[] = [
  {
    id: "member-1",
    agencyId: "agency-alpha",
    userId: "user-1",
    fullName: "Ahmed Khan (Founder)",
    email: "ahmed@alphamedia.pk",
    role: "owner",
    status: "active",
    joinedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: "member-2",
    agencyId: "agency-alpha",
    userId: "user-2",
    fullName: "Bilal Tariq",
    email: "bilal@alphamedia.pk",
    role: "admin",
    status: "active",
    joinedAt: "2026-01-15T00:00:00.000Z",
  },
  {
    id: "member-3",
    agencyId: "agency-alpha",
    userId: "user-3",
    fullName: "Sarah Qureshi",
    email: "sarah@alphamedia.pk",
    role: "sales_representative",
    status: "active",
    joinedAt: "2026-02-01T00:00:00.000Z",
  },
];

const mockMembersDualOwners: TeamMemberRecord[] = [
  ...mockMembersSingleOwner,
  {
    id: "member-4",
    agencyId: "agency-alpha",
    userId: "user-4",
    fullName: "Hamza Malik (Co-Founder)",
    email: "hamza@alphamedia.pk",
    role: "owner",
    status: "active",
    joinedAt: "2026-01-01T00:00:00.000Z",
  },
];

describe("Agency Team Management & RBAC Enforcement Test Suite", () => {
  test("Last Owner Protection: Blocks demoting the sole agency owner", () => {
    assert.equal(isSoleAgencyOwner(mockMembersSingleOwner, "member-1"), true);

    const result = validateRoleChange(
      "owner",
      "member-1",
      "admin",
      mockMembersSingleOwner
    );

    assert.equal(result.valid, false);
    assert.ok(result.error?.includes("Cannot demote the last agency Owner"));
  });

  test("Last Owner Protection: Blocks removing the sole agency owner", () => {
    const result = validateMemberRemoval(
      "owner",
      "member-1",
      mockMembersSingleOwner
    );

    assert.equal(result.valid, false);
    assert.ok(result.error?.includes("Cannot remove the last agency Owner"));
  });

  test("Multi-Owner Support: Allows demoting an owner when a second owner exists", () => {
    assert.equal(isSoleAgencyOwner(mockMembersDualOwners, "member-1"), false);

    const result = validateRoleChange(
      "owner",
      "member-1",
      "admin",
      mockMembersDualOwners
    );

    assert.equal(result.valid, true);
    assert.equal(result.error, undefined);
  });

  test("Invitation Enforcement: Owner and Admin can invite; Manager/Rep/Viewer are blocked", () => {
    // Owner can invite
    const ownerInvite = validateInvitation("owner", "newhire@alphamedia.pk", "manager", mockMembersSingleOwner);
    assert.equal(ownerInvite.valid, true);

    // Admin can invite a sales rep
    const adminInvite = validateInvitation("admin", "rep@alphamedia.pk", "sales_representative", mockMembersSingleOwner);
    assert.equal(adminInvite.valid, true);

    // Admin cannot invite an Owner
    const adminInviteOwner = validateInvitation("admin", "newowner@alphamedia.pk", "owner", mockMembersSingleOwner);
    assert.equal(adminInviteOwner.valid, false);
    assert.ok(adminInviteOwner.error?.includes("Only an agency Owner can invite another Owner"));

    // Sales Rep cannot invite
    const repInvite = validateInvitation("sales_representative", "test@alphamedia.pk", "viewer", mockMembersSingleOwner);
    assert.equal(repInvite.valid, false);
    assert.ok(repInvite.error?.includes("Unauthorized"));
  });

  test("Duplicate & Format Validation: Rejects invalid emails or already active members", () => {
    // Malformed email
    const invalidEmail = validateInvitation("owner", "not-an-email", "manager", mockMembersSingleOwner);
    assert.equal(invalidEmail.valid, false);
    assert.ok(invalidEmail.error?.includes("valid email address"));

    // Already active member
    const duplicate = validateInvitation("owner", "bilal@alphamedia.pk", "sales_representative", mockMembersSingleOwner);
    assert.equal(duplicate.valid, false);
    assert.ok(duplicate.error?.includes("already active"));
  });
});
