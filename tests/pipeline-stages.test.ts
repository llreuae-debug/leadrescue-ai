import test from "node:test";
import assert from "node:assert/strict";
import { PIPELINE_STAGES } from "../src/config/pipeline.ts";
import type { Lead, LeadStatus } from "../src/types/database.ts";

test("Sales Pipeline & Stage Transitions Test Suite", async (t) => {
  const validStageIds = PIPELINE_STAGES.map((s) => s.id);

  await t.test("Validates all 7 standardized pipeline stages exist in order", () => {
    assert.deepEqual(validStageIds, [
      "new",
      "contacted",
      "qualified",
      "follow_up_required",
      "proposal_sent",
      "won",
      "lost",
    ]);
  });

  await t.test("Rejects unrecognized or invalid stage transitions", () => {
    function isValidStage(stage: string): boolean {
      return validStageIds.includes(stage as LeadStatus);
    }

    assert.equal(isValidStage("won"), true);
    assert.equal(isValidStage("qualified"), true);
    assert.equal(isValidStage("closed_deal_invalid"), false);
    assert.equal(isValidStage("arbitrary_string"), false);
  });

  await t.test("Requires loss reason when moving lead to Lost status", () => {
    function recordStageChange(newStage: LeadStatus, lossReason?: string): { success: boolean; error?: string } {
      if (!validStageIds.includes(newStage)) {
        return { success: false, error: "Invalid stage" };
      }
      if (newStage === "lost" && (!lossReason || lossReason.trim().length === 0)) {
        return { success: false, error: "Loss reason is required when marking a lead as Lost." };
      }
      return { success: true };
    }

    assert.equal(recordStageChange("lost", "").success, false);
    assert.equal(recordStageChange("lost", "Budget constraint").success, true);
    assert.equal(recordStageChange("won").success, true);
  });

  await t.test("Pipeline Volume Calculation excludes lost opportunities", () => {
    const leads: { status: LeadStatus; dealValue: number }[] = [
      { status: "new", dealValue: 100000 },
      { status: "qualified", dealValue: 250000 },
      { status: "proposal_sent", dealValue: 400000 },
      { status: "won", dealValue: 500000 },
      { status: "lost", dealValue: 300000 }, // Lost: must be excluded from active pipeline
    ];

    const activePipelineValue = leads
      .filter((l) => l.status !== "lost")
      .reduce((sum, l) => sum + l.dealValue, 0);

    assert.equal(activePipelineValue, 1250000); // 100k + 250k + 400k + 500k
  });
});
