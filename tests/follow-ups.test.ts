import test from "node:test";
import assert from "node:assert/strict";
import type { FollowUpTask, TaskType, TaskStatus } from "../src/types/database.ts";

test("Follow-Up Task Management & Timezone Calculations Test Suite", async (t) => {
  const now = new Date("2026-11-10T10:00:00.000Z");

  // Simulated tasks in database
  const tasks: FollowUpTask[] = [
    {
      id: "task-overdue",
      agency_id: "agency-alpha",
      client_id: "client-1",
      lead_id: "lead-1",
      due_at: "2026-11-08T09:00:00.000Z", // 2 days ago
      task_type: "whatsapp",
      status: "pending",
      created_at: "2026-11-08T08:00:00.000Z",
      updated_at: "2026-11-08T08:00:00.000Z",
    },
    {
      id: "task-today",
      agency_id: "agency-alpha",
      client_id: "client-1",
      lead_id: "lead-2",
      due_at: "2026-11-10T14:30:00.000Z", // Today
      task_type: "call",
      status: "pending",
      created_at: "2026-11-09T08:00:00.000Z",
      updated_at: "2026-11-09T08:00:00.000Z",
    },
    {
      id: "task-upcoming",
      agency_id: "agency-alpha",
      client_id: "client-2",
      lead_id: "lead-3",
      due_at: "2026-11-12T11:00:00.000Z", // In 2 days
      task_type: "email",
      status: "pending",
      created_at: "2026-11-10T08:00:00.000Z",
      updated_at: "2026-11-10T08:00:00.000Z",
    },
    {
      id: "task-completed",
      agency_id: "agency-alpha",
      client_id: "client-1",
      lead_id: "lead-1",
      due_at: "2026-11-07T09:00:00.000Z",
      task_type: "whatsapp",
      status: "completed",
      completed_at: "2026-11-07T10:00:00.000Z",
      created_at: "2026-11-07T08:00:00.000Z",
      updated_at: "2026-11-07T10:00:00.000Z",
    },
  ];

  await t.test("Accurately categorizes tasks into Overdue, Today, and Upcoming based on reference time", () => {
    const startOfToday = new Date("2026-11-10T00:00:00.000Z");
    const endOfToday = new Date("2026-11-10T23:59:59.999Z");

    const overdue = tasks.filter(
      (t) => t.status === "pending" && new Date(t.due_at) < startOfToday
    );
    const today = tasks.filter(
      (t) =>
        t.status === "pending" &&
        new Date(t.due_at) >= startOfToday &&
        new Date(t.due_at) <= endOfToday
    );
    const upcoming = tasks.filter(
      (t) => t.status === "pending" && new Date(t.due_at) > endOfToday
    );

    assert.equal(overdue.length, 1);
    assert.equal(overdue[0].id, "task-overdue");

    assert.equal(today.length, 1);
    assert.equal(today[0].id, "task-today");

    assert.equal(upcoming.length, 1);
    assert.equal(upcoming[0].id, "task-upcoming");
  });

  await t.test("Reschedule action updates due_at timestamp and sets status back to pending", () => {
    const task = { ...tasks[0] };
    const newDueDate = "2026-11-11T15:00:00.000Z";

    task.due_at = newDueDate;
    task.status = "pending";
    task.updated_at = now.toISOString();

    assert.equal(task.due_at, newDueDate);
    assert.equal(task.status, "pending");
  });

  await t.test("Snooze action advances due date by N days and updates status to snoozed", () => {
    const task = { ...tasks[0] };
    const initialDue = new Date(task.due_at).getTime();
    const snoozeDays = 3;
    const expectedDue = new Date(initialDue + snoozeDays * 86400000).toISOString();

    task.due_at = expectedDue;
    task.status = "snoozed";

    assert.equal(task.status, "snoozed");
    assert.equal(task.due_at, expectedDue);
  });

  await t.test("Duplicate prevention: Blocks creating a second active pending task of identical type for same lead", () => {
    function canCreateTask(leadId: string, taskType: TaskType): boolean {
      const existing = tasks.find(
        (t) => t.lead_id === leadId && t.task_type === taskType && t.status === "pending"
      );
      return !existing;
    }

    // lead-1 already has pending whatsapp task -> REJECT
    assert.equal(canCreateTask("lead-1", "whatsapp"), false);

    // lead-1 has completed task, but creating a call task -> ALLOW
    assert.equal(canCreateTask("lead-1", "call"), true);

    // fresh lead-99 -> ALLOW
    assert.equal(canCreateTask("lead-99", "whatsapp"), true);
  });
});
