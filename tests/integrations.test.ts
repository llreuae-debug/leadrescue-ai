import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  computeSignature,
  verifyWebhookSignature,
  validateInboundLeadPayload,
  checkIdempotency,
  recordIdempotency,
  clearIdempotencyStore,
} from "../src/lib/integrations/webhook-validator.ts";
import type { IntegrationDefinition } from "../src/types/integrations.ts";

describe("Integrations & Webhook Intake Validation Test Suite", () => {
  test("Signature Verification: Verifies HMAC SHA-256 and rejects forged signatures", () => {
    const rawPayload = JSON.stringify({ name: "Farhan Saeed", phone: "+92 300 1122334", clientId: "client-1" });
    const secret = "super-secret-hmac-key-2026";

    const validSig = computeSignature(rawPayload, secret);
    assert.equal(verifyWebhookSignature(rawPayload, validSig, secret), true);

    // Tampered payload
    const tamperedPayload = JSON.stringify({ name: "Farhan Saeed", phone: "+92 300 9999999", clientId: "client-1" });
    assert.equal(verifyWebhookSignature(tamperedPayload, validSig, secret), false);

    // Tampered signature
    assert.equal(verifyWebhookSignature(rawPayload, "invalid_signature_hex", secret), false);

    // Missing signature
    assert.equal(verifyWebhookSignature(rawPayload, null, secret), false);
  });

  test("Inbound Payload Validation: Enforces required name and client workspace", () => {
    // Missing name
    const resNoName = validateInboundLeadPayload({ clientId: "client-1", phone: "+92 300 1234567" });
    assert.equal(resNoName.valid, false);
    assert.ok(resNoName.errors.some((e) => e.includes("'name' is required")));

    // Missing clientId
    const resNoClient = validateInboundLeadPayload({ name: "Ali Raza", phone: "+92 300 1234567" });
    assert.equal(resNoClient.valid, false);
    assert.ok(resNoClient.errors.some((e) => e.includes("'clientId' is required")));

    // Missing both phone and email
    const resNoContact = validateInboundLeadPayload({ name: "Ali Raza", clientId: "client-1" });
    assert.equal(resNoContact.valid, false);
    assert.ok(resNoContact.errors.some((e) => e.includes("contact method")));

    // Valid with phone
    const validWithPhone = validateInboundLeadPayload({
      name: "Ali Raza",
      clientId: "client-1",
      phone: "+92 300 1234567",
      dealValue: 150000,
    });
    assert.equal(validWithPhone.valid, true);
    assert.equal(validWithPhone.data?.name, "Ali Raza");
    assert.equal(validWithPhone.data?.dealValue, 150000);

    // Valid with email
    const validWithEmail = validateInboundLeadPayload({
      name: "Ayesha Malik",
      clientId: "client-1",
      email: "ayesha@enterprise.pk",
    });
    assert.equal(validWithEmail.valid, true);
    assert.equal(validWithEmail.data?.email, "ayesha@enterprise.pk");
  });

  test("Idempotency Replay Defense: Prevents duplicate lead creation on network retry", () => {
    clearIdempotencyStore();
    const testKey = "idemp-req-unique-998877";

    // Initial check: not a replay
    const initialCheck = checkIdempotency(testKey);
    assert.equal(initialCheck.isReplay, false);

    // Record the completed intake
    recordIdempotency(testKey, "lead-wh-1001");

    // Second check: recognized as replay
    const replayCheck = checkIdempotency(testKey);
    assert.equal(replayCheck.isReplay, true);
    assert.equal(replayCheck.leadId, "lead-wh-1001");
  });

  test("Integration Status Integrity: Unconfigured integrations strictly report not_connected", () => {
    const unconfiguredWhatsApp: IntegrationDefinition = {
      id: "whatsapp_cloud",
      name: "WhatsApp Business Cloud API",
      category: "Messaging",
      description: "Official Meta Cloud API for automated lead messaging and notifications.",
      status: "not_connected",
      features: ["Verified Sender ID", "Template Messages", "Direct Webhooks"],
      setupRequirements: ["Meta Business Manager ID", "System User Access Token", "Registered Phone Number ID"],
    };

    assert.equal(unconfiguredWhatsApp.status, "not_connected");
    assert.notEqual(unconfiguredWhatsApp.status, "connected");
  });
});
