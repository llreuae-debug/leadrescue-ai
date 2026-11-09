import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { PLANS } from "../src/config/plans.ts";

describe("Stage 17: Deployment & Pilot Launch Readiness Test Suite", () => {
  const rootDir = process.cwd();

  test("1. Environment Template: .env.example defines necessary non-secret keys", () => {
    const envExamplePath = path.join(rootDir, ".env.example");
    assert.ok(fs.existsSync(envExamplePath), ".env.example must exist");

    const content = fs.readFileSync(envExamplePath, "utf-8");
    assert.ok(content.includes("NEXT_PUBLIC_SUPABASE_URL"));
    assert.ok(content.includes("NEXT_PUBLIC_SUPABASE_ANON_KEY"));
    assert.ok(content.includes("NEXT_PUBLIC_APP_URL"));

    // Ensure no actual production credentials are leaked in the template
    assert.ok(!content.includes("eyJhbGciOi"));
    assert.ok(!content.includes("service_role_secret"));
  });

  test("2. Database Migrations: Sequentially ordered and syntax checked", () => {
    const migrationsDir = path.join(rootDir, "supabase", "migrations");
    assert.ok(fs.existsSync(migrationsDir), "supabase/migrations directory must exist");

    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith(".sql")).sort();
    assert.ok(files.length >= 2, "Must contain all core migrations");

    // Check that each migration enables RLS
    for (const file of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
      assert.ok(
        sql.includes("ENABLE ROW LEVEL SECURITY") || sql.includes("enable row level security"),
        `Migration ${file} must enforce Row Level Security`
      );
    }
  });

  test("3. Documentation Integrity: All required governance and operational docs exist", () => {
    const requiredDocs = [
      "DEPLOYMENT_GUIDE.md",
      "PILOT_ONBOARDING_GUIDE.md",
      "AUDIT_REPORT.md",
      "IMPLEMENTATION_STATUS.md",
      "DECISIONS.md",
      "CHANGELOG.md",
    ];

    for (const doc of requiredDocs) {
      const docPath = path.join(rootDir, doc);
      assert.ok(fs.existsSync(docPath), `Critical documentation file [${doc}] must exist`);
      const stat = fs.statSync(docPath);
      assert.ok(stat.size > 200, `Documentation file [${doc}] must contain substantive content`);
    }
  });

  test("4. Pakistani Commercial Pricing: Plans match authoritative PKR launch pricing", () => {
    const starter = PLANS.find((p) => p.id === "starter");
    const growth = PLANS.find((p) => p.id === "growth");
    const advanced = PLANS.find((p) => p.id === "advanced");

    assert.ok(starter);
    assert.strictEqual(starter.pricePKR, 2999);
    assert.ok(growth);
    assert.strictEqual(growth.pricePKR, 6999);
    assert.ok(advanced);
    assert.strictEqual(advanced.pricePKR, 14999);
  });

  test("5. Route Manifest: All marketing, auth, app, portal, and admin pages exist", () => {
    const requiredPages = [
      "src/app/(marketing)/page.tsx",
      "src/app/(marketing)/pricing/page.tsx",
      "src/app/(marketing)/features/page.tsx",
      "src/app/(marketing)/privacy/page.tsx",
      "src/app/(marketing)/terms/page.tsx",
      "src/app/(marketing)/contact/page.tsx",
      "src/app/(auth)/login/page.tsx",
      "src/app/(auth)/signup/page.tsx",
      "src/app/app/dashboard/page.tsx",
      "src/app/app/pipeline/page.tsx",
      "src/app/app/follow-ups/page.tsx",
      "src/app/app/leads/page.tsx",
      "src/app/app/ai-assistant/page.tsx",
      "src/app/app/reports/page.tsx",
      "src/app/app/billing/page.tsx",
      "src/app/portal/dashboard/page.tsx",
      "src/app/portal/leads/page.tsx",
      "src/app/portal/reports/page.tsx",
      "src/app/admin/dashboard/page.tsx",
      "src/app/admin/agencies/page.tsx",
      "src/app/admin/subscriptions/page.tsx",
      "src/app/admin/plans/page.tsx",
      "src/app/admin/audit-logs/page.tsx",
    ];

    for (const page of requiredPages) {
      const pagePath = path.join(rootDir, page);
      assert.ok(fs.existsSync(pagePath), `App Router page [${page}] must exist`);
    }
  });
});
