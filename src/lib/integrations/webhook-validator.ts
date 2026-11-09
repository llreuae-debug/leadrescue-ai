import { createHmac, timingSafeEqual } from "node:crypto";
import type { InboundLeadPayload, WebhookIntakeResult } from "../../types/integrations.ts";

// In-memory idempotency cache (TTL: 24 hours in production database)
const idempotencyStore = new Map<string, { leadId: string; timestamp: number }>();

/**
 * Computes an HMAC SHA-256 signature for payload verification.
 */
export function computeSignature(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verifies an incoming webhook signature using timing-safe comparison
 * to eliminate timing attack vulnerabilities.
 */
export function verifyWebhookSignature(payload: string, signature: string | null | undefined, secret: string): boolean {
  if (!signature || !secret) return false;

  const expected = computeSignature(payload, secret);
  const expectedBuffer = Buffer.from(expected, "utf8");
  const providedBuffer = Buffer.from(signature, "utf8");

  if (expectedBuffer.length !== providedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, providedBuffer);
}

/**
 * Validates the inbound JSON payload against required lead capture schema.
 */
export function validateInboundLeadPayload(payload: any): { valid: boolean; data?: InboundLeadPayload; errors: string[] } {
  const errors: string[] = [];

  if (!payload || typeof payload !== "object") {
    return { valid: false, errors: ["Missing or invalid JSON body"] };
  }

  if (!payload.name || typeof payload.name !== "string" || payload.name.trim().length === 0) {
    errors.push("Field 'name' is required and must not be empty.");
  }

  if (!payload.clientId || typeof payload.clientId !== "string" || payload.clientId.trim().length === 0) {
    errors.push("Field 'clientId' is required to scope the lead to an agency client.");
  }

  const hasPhone = payload.phone && typeof payload.phone === "string" && payload.phone.trim().length > 0;
  const hasEmail = payload.email && typeof payload.email === "string" && payload.email.trim().length > 0;

  if (!hasPhone && !hasEmail) {
    errors.push("At least one contact method ('phone' or 'email') must be provided.");
  }

  if (payload.dealValue !== undefined && (typeof payload.dealValue !== "number" || payload.dealValue < 0)) {
    errors.push("Field 'dealValue' must be a non-negative number.");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const sanitized: InboundLeadPayload = {
    clientId: payload.clientId.trim(),
    name: payload.name.trim(),
    phone: hasPhone ? payload.phone.trim() : null,
    email: hasEmail ? payload.email.trim().toLowerCase() : null,
    company: payload.company ? String(payload.company).trim() : null,
    source: payload.source ? String(payload.source).trim() : "Website Lead Form",
    campaign: payload.campaign ? String(payload.campaign).trim() : null,
    dealValue: typeof payload.dealValue === "number" ? payload.dealValue : 0,
    notes: payload.notes ? String(payload.notes).trim() : null,
  };

  return { valid: true, data: sanitized, errors: [] };
}

/**
 * Checks if a webhook request with this idempotency key was already ingested.
 */
export function checkIdempotency(key?: string | null): { isReplay: boolean; leadId?: string } {
  if (!key) return { isReplay: false };
  const existing = idempotencyStore.get(key);
  if (existing) {
    return { isReplay: true, leadId: existing.leadId };
  }
  return { isReplay: false };
}

/**
 * Records an idempotency key to prevent double-processing on network retries.
 */
export function recordIdempotency(key: string, leadId: string): void {
  idempotencyStore.set(key, { leadId, timestamp: Date.now() });
}

/**
 * Clears idempotency store (used in test resets).
 */
export function clearIdempotencyStore(): void {
  idempotencyStore.clear();
}
