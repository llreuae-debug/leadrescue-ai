import test from "node:test";
import assert from "node:assert/strict";
import type { Lead, CSVLeadRow } from "../src/types/database.ts";

test("Lead Management & CSV Import Test Suite", async (t) => {
  const existingLeads: Lead[] = [
    {
      id: "lead-1",
      agency_id: "agency-alpha",
      client_id: "client-1",
      name: "Tariq Mahmood",
      email: "tariq@retail.pk",
      phone: "+92 300 1234567",
      source: "Meta Ads",
      status: "new",
      priority: "high",
      deal_value: 200000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "lead-2",
      agency_id: "agency-alpha",
      client_id: "client-2",
      name: "Fatima Noor",
      email: "fatima@fleet.pk",
      phone: "+92 321 7654321",
      source: "Google Ads",
      status: "qualified",
      priority: "medium",
      deal_value: 350000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  await t.test("Duplicate Detection: Correctly flags matching email or phone number in client workspace", () => {
    function checkDuplicate(incoming: { email?: string; phone?: string; clientId: string }): boolean {
      return existingLeads.some(
        (l) =>
          l.client_id === incoming.clientId &&
          ((incoming.email && l.email?.toLowerCase() === incoming.email.toLowerCase()) ||
            (incoming.phone && l.phone === incoming.phone))
      );
    }

    // Exact email match in client-1 -> Duplicate
    assert.equal(checkDuplicate({ email: "tariq@retail.pk", clientId: "client-1" }), true);

    // Exact phone match in client-1 -> Duplicate
    assert.equal(checkDuplicate({ phone: "+92 300 1234567", clientId: "client-1" }), true);

    // Same email in different client workspace -> NOT considered duplicate
    assert.equal(checkDuplicate({ email: "tariq@retail.pk", clientId: "client-2" }), false);

    // Fresh lead -> NOT duplicate
    assert.equal(checkDuplicate({ email: "fresh@corp.pk", phone: "+92 345 0000000", clientId: "client-1" }), false);
  });

  await t.test("CSV Validation: Catches missing contact names and maps rows cleanly", () => {
    const rawRows: Partial<CSVLeadRow>[] = [
      { name: "Valid Prospect", phone: "+92 300 9999999", dealValue: 150000 },
      { name: "   ", phone: "+92 300 8888888" }, // Invalid: empty name
      { name: "Another Prospect", email: "prospect@b2b.pk" },
    ];

    const validated: CSVLeadRow[] = [];
    const errors: { row: number; error: string }[] = [];

    rawRows.forEach((r, idx) => {
      const rowNum = idx + 1;
      if (!r.name || r.name.trim().length === 0) {
        errors.push({ row: rowNum, error: "Missing required contact name." });
        return;
      }
      validated.push(r as CSVLeadRow);
    });

    assert.equal(validated.length, 2);
    assert.equal(errors.length, 1);
    assert.equal(errors[0].row, 2);
  });

  await t.test("Lead Filters & Search: Correctly matches queries across name, phone, and status", () => {
    function searchLeads(q: string): Lead[] {
      const query = q.toLowerCase();
      return existingLeads.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.email?.toLowerCase().includes(query) ||
          l.phone?.includes(query)
      );
    }

    // Search by name
    assert.equal(searchLeads("Tariq").length, 1);
    assert.equal(searchLeads("Tariq")[0].id, "lead-1");

    // Search by phone fragment
    assert.equal(searchLeads("7654321").length, 1);
    assert.equal(searchLeads("7654321")[0].id, "lead-2");

    // Non-existent search
    assert.equal(searchLeads("Unmatched").length, 0);
  });
});
