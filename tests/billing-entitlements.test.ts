import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  isResourceQuotaExceeded,
  validatePaymentSubmission,
  processPaymentApproval,
  processPaymentRejection,
  getAuthoritativePlanLimits,
} from "../src/lib/billing/entitlements.ts";
import type { PaymentRecord } from "../src/types/billing.ts";

const mockPendingPayment: PaymentRecord = {
  id: "pay-101",
  agencyId: "agency-alpha",
  planId: "growth",
  planName: "Growth",
  amountPKR: 6999,
  method: "manual_ibft",
  transactionRef: "MEEZAN-FT-99887766",
  bankName: "Meezan Bank Limited",
  status: "pending",
  submittedAt: new Date().toISOString(),
};

describe("Billing & Subscription Entitlements Test Suite", () => {
  test("Authoritative Plan Limits: Pulls exact limits from central config", () => {
    const starter = getAuthoritativePlanLimits("starter");
    assert.equal(starter.pricePKR, 2999);
    assert.equal(starter.limits.clientWorkspaces, 3);
    assert.equal(starter.limits.leadsPerMonth, 300);

    const growth = getAuthoritativePlanLimits("growth");
    assert.equal(growth.pricePKR, 6999);
    assert.equal(growth.limits.clientWorkspaces, 10);
  });

  test("Server-Side Quota Enforcement: Blocks actions when limit is reached", () => {
    // Starter: 3 client workspaces limit
    assert.equal(isResourceQuotaExceeded(2, "starter", "clientWorkspaces"), false);
    assert.equal(isResourceQuotaExceeded(3, "starter", "clientWorkspaces"), true);
    assert.equal(isResourceQuotaExceeded(4, "starter", "clientWorkspaces"), true);

    // Growth: 1,200 leads limit
    assert.equal(isResourceQuotaExceeded(1199, "growth", "leadsPerMonth"), false);
    assert.equal(isResourceQuotaExceeded(1200, "growth", "leadsPerMonth"), true);
  });

  test("Manual Payment Submission: Validates PKR price matching and transaction reference", () => {
    // Valid submission
    const valid = validatePaymentSubmission({
      agencyId: "agency-alpha",
      planId: "growth",
      amountPKR: 6999,
      transactionRef: "HBL-IBFT-11223344",
      bankName: "Habib Bank Limited (HBL)",
    });
    assert.equal(valid.valid, true);
    assert.equal(valid.record?.status, "pending");
    assert.equal(valid.record?.amountPKR, 6999);

    // Discrepant amount
    const invalidAmount = validatePaymentSubmission({
      agencyId: "agency-alpha",
      planId: "growth",
      amountPKR: 2999, // sent Starter amount for Growth
      transactionRef: "HBL-IBFT-11223344",
      bankName: "HBL",
    });
    assert.equal(invalidAmount.valid, false);
    assert.ok(invalidAmount.error?.includes("does not match plan price"));

    // Missing transaction ref
    const missingRef = validatePaymentSubmission({
      agencyId: "agency-alpha",
      planId: "starter",
      amountPKR: 2999,
      transactionRef: "123", // too short
      bankName: "Meezan Bank",
    });
    assert.equal(missingRef.valid, false);
    assert.ok(missingRef.error?.includes("minimum 5 characters"));
  });

  test("Payment Review & Approval: Owner/Admin can approve; Non-admins are blocked", () => {
    // Sales rep attempt -> blocked
    const repApproval = processPaymentApproval(mockPendingPayment, "sales_representative", "user-rep", "Sarah Rep");
    assert.equal(repApproval.success, false);
    assert.ok(repApproval.error?.includes("Unauthorized"));

    // Owner approval -> succeeds and activates subscription
    const ownerApproval = processPaymentApproval(mockPendingPayment, "owner", "user-owner", "Ahmed Founder");
    assert.equal(ownerApproval.success, true);
    assert.equal(ownerApproval.updatedPayment?.status, "approved");
    assert.equal(ownerApproval.updatedPayment?.reviewerName, "Ahmed Founder");
    assert.equal(ownerApproval.updatedSubscription?.status, "active");
    assert.equal(ownerApproval.updatedSubscription?.planId, "growth");

    // Cannot approve an already approved payment
    const reApproval = processPaymentApproval(ownerApproval.updatedPayment!, "owner", "user-owner", "Ahmed Founder");
    assert.equal(reApproval.success, false);
    assert.ok(reApproval.error?.includes("Cannot approve payment in 'approved' status"));
  });

  test("Payment Rejection: Captures reason and maintains audit log", () => {
    const rejection = processPaymentRejection(
      mockPendingPayment,
      "admin",
      "user-admin",
      "Bilal Admin",
      "Transaction ID not found in bank statement."
    );
    assert.equal(rejection.success, true);
    assert.equal(rejection.updatedPayment?.status, "rejected");
    assert.equal(rejection.updatedPayment?.rejectionReason, "Transaction ID not found in bank statement.");
    assert.equal(rejection.updatedPayment?.reviewerName, "Bilal Admin");
  });
});
