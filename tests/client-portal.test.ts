import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  sanitizeClientLead,
  filterClientLeads,
  computeClientMetrics,
  type RawLeadForPortal,
} from "../src/lib/portal/portal-security.ts";

const mockRawLeads: RawLeadForPortal[] = [
  {
    id: "lead-1",
    agencyId: "agency-alpha",
    clientId: "client-retail",
    name: "Tariq Mahmood",
    phone: "+92 300 8877665",
    email: "tariq@retail.pk",
    company: "Apex Retailers",
    source: "Meta Ads",
    campaign: "Summer Sale 2026",
    status: "won",
    dealValue: 240000,
    notes: "PRIVATE AGENCY NOTE: Client agreed to 20% margin markup. High priority account.",
    internalNotes: "Internal commission to be paid to Sarah.",
    agencyMargin: 20.0,
    createdAt: "2026-11-01T10:00:00.000Z",
  },
  {
    id: "lead-2",
    agencyId: "agency-alpha",
    clientId: "client-retail",
    name: "Fatima Noor",
    phone: "+92 321 4455667",
    email: "fatima@designer.pk",
    company: "Designer Closet",
    source: "WhatsApp Inbound",
    status: "qualified",
    dealValue: 180000,
    notes: "INTERNAL: Rep thinks prospect is price sensitive.",
    createdAt: "2026-11-03T14:00:00.000Z",
  },
  {
    id: "lead-3",
    agencyId: "agency-alpha",
    clientId: "client-realestate", // Different client in same agency!
    name: "Usman Ghani",
    phone: "+92 333 9988771",
    source: "Google Ads",
    status: "new",
    dealValue: 1250000,
    notes: "Commercial unit inquiry.",
    createdAt: "2026-11-05T12:00:00.000Z",
  },
  {
    id: "lead-4",
    agencyId: "agency-beta", // Different agency entirely!
    clientId: "client-competitor",
    name: "Zubair Ahmed",
    phone: "+92 301 2233445",
    source: "Meta Ads",
    status: "won",
    dealValue: 500000,
    notes: "Agency Beta private deal.",
    createdAt: "2026-11-06T12:00:00.000Z",
  },
];

describe("Client Portal Security & Data Isolation Test Suite", () => {
  test("Field Redaction: Strips internal agency notes and private margins from client output", () => {
    const raw = mockRawLeads[0];
    const sanitized = sanitizeClientLead(raw);

    // Verify approved fields exist
    assert.equal(sanitized.id, "lead-1");
    assert.equal(sanitized.name, "Tariq Mahmood");
    assert.equal(sanitized.phone, "+92 300 8877665");
    assert.equal(sanitized.dealValue, 240000);
    assert.equal(sanitized.status, "won");

    // Strictly verify private agency fields are absent
    assert.equal((sanitized as any).notes, undefined);
    assert.equal((sanitized as any).internalNotes, undefined);
    assert.equal((sanitized as any).agencyMargin, undefined);
  });

  test("Client Workspace Isolation: Only returns leads belonging to authorized client", () => {
    // Request leads for 'client-retail'
    const retailLeads = filterClientLeads(mockRawLeads, "client-retail");

    assert.equal(retailLeads.length, 2);
    assert.equal(retailLeads[0].name, "Tariq Mahmood");
    assert.equal(retailLeads[1].name, "Fatima Noor");

    // Must NOT contain lead-3 (client-realestate) or lead-4 (agency-beta)
    assert.ok(!retailLeads.some((l) => l.name === "Usman Ghani"));
    assert.ok(!retailLeads.some((l) => l.name === "Zubair Ahmed"));
  });

  test("Cross-Agency Isolation: Records from Agency B are blocked from Client A", () => {
    const isolated = filterClientLeads(mockRawLeads, "client-competitor");
    assert.equal(isolated.length, 1);
    assert.equal(isolated[0].name, "Zubair Ahmed");

    // Client retail cannot see competitor
    const retailLeads = filterClientLeads(mockRawLeads, "client-retail");
    assert.ok(!retailLeads.some((l) => l.id === "lead-4"));
  });

  test("Client Metric Computation: Accurately calculates conversion and source breakdown", () => {
    const retailLeads = filterClientLeads(mockRawLeads, "client-retail");
    const metrics = computeClientMetrics(retailLeads);

    assert.equal(metrics.totalLeads, 2);
    assert.equal(metrics.contactedLeads, 2);
    assert.equal(metrics.qualifiedLeads, 2);
    assert.equal(metrics.wonLeads, 1);
    assert.equal(metrics.totalWonValuePKR, 240000);
    assert.equal(metrics.conversionRate, 50.0); // 1 won of 2 total = 50.0%

    // Source breakdown verification
    assert.equal(metrics.sourceBreakdown.length, 2);
    assert.ok(metrics.sourceBreakdown.some((s) => s.source === "Meta Ads" && s.count === 1));
    assert.ok(metrics.sourceBreakdown.some((s) => s.source === "WhatsApp Inbound" && s.count === 1));
  });

  test("Empty Dataset Resilience: 0 leads returns clean zero metrics without NaN", () => {
    const emptyMetrics = computeClientMetrics([]);
    assert.equal(emptyMetrics.totalLeads, 0);
    assert.equal(emptyMetrics.conversionRate, 0);
    assert.equal(emptyMetrics.totalWonValuePKR, 0);
    assert.deepEqual(emptyMetrics.sourceBreakdown, []);
  });
});
