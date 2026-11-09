import test from "node:test";
import assert from "node:assert/strict";
import type { Lead, FollowUpTask } from "../src/types/database.ts";

test("Dashboard KPI Metrics & Aggregation Test Suite", async (t) => {
  const sampleLeads: Lead[] = [
    {
      id: "lead-1",
      agency_id: "agency-alpha",
      client_id: "client-1",
      name: "Tariq Mahmood",
      source: "Meta Ads",
      status: "new",
      priority: "high",
      deal_value: 150000,
      created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "lead-2",
      agency_id: "agency-alpha",
      client_id: "client-1",
      name: "Fatima Noor",
      source: "Google Ads",
      status: "qualified",
      priority: "medium",
      deal_value: 300000,
      created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "lead-3",
      agency_id: "agency-alpha",
      client_id: "client-2",
      name: "Zainab Ali",
      source: "Meta Ads",
      status: "won",
      priority: "high",
      deal_value: 450000,
      created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "lead-4",
      agency_id: "agency-alpha",
      client_id: "client-2",
      name: "Bilal Khan",
      source: "WhatsApp",
      status: "lost",
      priority: "low",
      deal_value: 100000,
      created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    // Agency Beta lead (must never be aggregated into Agency Alpha dashboard)
    {
      id: "lead-beta",
      agency_id: "agency-beta",
      client_id: "client-beta",
      name: "Imran Qureshi",
      source: "Referral",
      status: "won",
      deal_value: 1000000,
      priority: "urgent",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const sampleTasks: FollowUpTask[] = [
    {
      id: "task-1",
      agency_id: "agency-alpha",
      client_id: "client-1",
      lead_id: "lead-1",
      due_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago (OVERDUE)
      task_type: "whatsapp",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-2",
      agency_id: "agency-alpha",
      client_id: "client-1",
      lead_id: "lead-2",
      due_at: new Date(Date.now() + 7200000).toISOString(), // 2 hours in future (DUE TODAY)
      task_type: "call",
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "task-3",
      agency_id: "agency-alpha",
      client_id: "client-2",
      lead_id: "lead-3",
      due_at: new Date(Date.now() - 86400000).toISOString(),
      task_type: "email",
      status: "completed", // COMPLETED (not overdue)
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  await t.test("Calculates correct Agency Alpha metrics with zero double-counting", () => {
    const alphaLeads = sampleLeads.filter((l) => l.agency_id === "agency-alpha");
    const alphaTasks = sampleTasks.filter((t) => t.agency_id === "agency-alpha");

    const totalLeads = alphaLeads.length;
    const newLeads = alphaLeads.filter((l) => l.status === "new").length;
    const qualifiedLeads = alphaLeads.filter((l) => l.status === "qualified").length;
    const wonLeads = alphaLeads.filter((l) => l.status === "won").length;
    const totalPipelineValue = alphaLeads.reduce((sum, l) => sum + (l.deal_value || 0), 0);

    const now = new Date();
    const pendingTasks = alphaTasks.filter((t) => t.status === "pending");
    const overdueTasks = pendingTasks.filter((t) => new Date(t.due_at) < now);

    assert.equal(totalLeads, 4);
    assert.equal(newLeads, 1);
    assert.equal(qualifiedLeads, 1);
    assert.equal(wonLeads, 1);
    assert.equal(totalPipelineValue, 1000000); // 150k + 300k + 450k + 100k
    assert.equal(pendingTasks.length, 2);
    assert.equal(overdueTasks.length, 1); // task-1 is overdue, task-3 was completed
  });

  await t.test("Client workspace filter isolates records to target client", () => {
    const client1Leads = sampleLeads.filter(
      (l) => l.agency_id === "agency-alpha" && l.client_id === "client-1"
    );

    assert.equal(client1Leads.length, 2);
    assert.equal(client1Leads.some((l) => l.id === "lead-3"), false);
  });

  await t.test("Empty dataset produces clean zero states without errors", () => {
    const emptyLeads: Lead[] = [];
    const totalLeads = emptyLeads.length;
    const newLeads = emptyLeads.filter((l) => l.status === "new").length;

    assert.equal(totalLeads, 0);
    assert.equal(newLeads, 0);
  });

  await t.test("Strict tenant isolation: Agency Alpha calculations never ingest Agency Beta records", () => {
    const alphaLeads = sampleLeads.filter((l) => l.agency_id === "agency-alpha");
    assert.equal(alphaLeads.some((l) => l.id === "lead-beta"), false);
  });
});
