import test, { describe } from "node:test";
import assert from "node:assert/strict";
import {
  calculateContactRate,
  calculateQualificationRate,
  calculateTaskCompletionRate,
  calculateWonRate,
  calculateReportSummary,
  calculateSourcePerformance,
  calculateClientComparison,
  calculateLostReasons,
  filterRecordsByCriteria,
  type RawLeadMetricRecord,
  type RawTaskMetricRecord,
} from "../src/lib/reports/metrics.ts";

const mockLeads: RawLeadMetricRecord[] = [
  {
    id: "lead-1",
    agencyId: "agency-alpha",
    clientId: "client-1",
    clientName: "Horizon Retailers",
    source: "Meta Ads",
    status: "new",
    dealValue: 100000,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-2",
    agencyId: "agency-alpha",
    clientId: "client-1",
    clientName: "Horizon Retailers",
    source: "Meta Ads",
    status: "contacted",
    dealValue: 150000,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-3",
    agencyId: "agency-alpha",
    clientId: "client-1",
    clientName: "Horizon Retailers",
    source: "Google Ads",
    status: "qualified",
    dealValue: 200000,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-4",
    agencyId: "agency-alpha",
    clientId: "client-2",
    clientName: "Elite Heights",
    source: "WhatsApp Inbound",
    status: "won",
    dealValue: 500000,
    createdAt: new Date().toISOString(),
  },
  {
    id: "lead-5",
    agencyId: "agency-alpha",
    clientId: "client-2",
    clientName: "Elite Heights",
    source: "Google Ads",
    status: "lost",
    lossReason: "Price sensitivity",
    dealValue: 300000,
    createdAt: new Date().toISOString(),
  },
];

const mockTasks: RawTaskMetricRecord[] = [
  {
    id: "task-1",
    agencyId: "agency-alpha",
    clientId: "client-1",
    status: "completed",
    dueAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    agencyId: "agency-alpha",
    clientId: "client-1",
    status: "completed",
    dueAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    agencyId: "agency-alpha",
    clientId: "client-1",
    status: "pending",
    dueAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    agencyId: "agency-alpha",
    clientId: "client-2",
    status: "cancelled",
    dueAt: new Date().toISOString(),
  },
];

describe("Reports & Analytics Metric Calculations Test Suite", () => {
  test("Contact Rate: Accurately computes percentage of leads moved beyond 'new'", () => {
    // 5 leads total: 1 new, 4 contacted or later -> 4/5 = 80.0%
    const result = calculateContactRate(mockLeads);
    assert.equal(result.count, 4);
    assert.equal(result.rate, 80.0);
  });

  test("Qualification Rate: Accurately computes qualified+ leads ratio", () => {
    // 5 leads total: qualified(1), won(1) -> 2/5 = 40.0%
    const result = calculateQualificationRate(mockLeads);
    assert.equal(result.count, 2);
    assert.equal(result.rate, 40.0);
  });

  test("Task Completion Rate: Correctly excludes cancelled tasks from denominator", () => {
    // 4 tasks: 2 completed, 1 pending, 1 cancelled -> 2 eligible completed out of 3 = 66.7%
    const result = calculateTaskCompletionRate(mockTasks);
    assert.equal(result.totalDue, 3);
    assert.equal(result.completed, 2);
    assert.equal(result.rate, 66.7);
  });

  test("Won Conversion Rate: Measures won deals against closed opportunities (won + lost)", () => {
    // 1 won, 1 lost -> 1 / (1 + 1) = 50.0%
    const result = calculateWonRate(mockLeads);
    assert.equal(result.wonCount, 1);
    assert.equal(result.lostCount, 1);
    assert.equal(result.rate, 50.0);
    assert.equal(result.wonValue, 500000);
  });

  test("Zero Division Safety: Empty arrays return zero values without NaN or runtime exceptions", () => {
    const emptySummary = calculateReportSummary([], []);
    assert.equal(emptySummary.totalLeads, 0);
    assert.equal(emptySummary.contactRate, 0);
    assert.equal(emptySummary.qualificationRate, 0);
    assert.equal(emptySummary.followUpCompletionRate, 0);
    assert.equal(emptySummary.wonRate, 0);
    assert.equal(emptySummary.totalWonValuePKR, 0);
  });

  test("Client Filter Isolation: Filters metrics strictly to target client workspace", () => {
    const client1Leads = filterRecordsByCriteria(mockLeads, { dateRange: "all", clientId: "client-1" });
    assert.equal(client1Leads.length, 3);
    assert.ok(client1Leads.every((l) => l.clientId === "client-1"));

    const summary = calculateReportSummary(client1Leads, mockTasks.filter((t) => t.clientId === "client-1"));
    assert.equal(summary.totalLeads, 3);
    assert.equal(summary.wonOpportunities, 0);
  });

  test("Lost Reasons Aggregation: Groups and ranks reasons correctly", () => {
    const reasons = calculateLostReasons(mockLeads);
    assert.equal(reasons.length, 1);
    assert.equal(reasons[0].reason, "Price sensitivity");
    assert.equal(reasons[0].count, 1);
    assert.equal(reasons[0].percentage, 100.0);
  });
});
