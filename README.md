# LeadRescue AI

> **Every Lead Deserves a Follow-Up.**

[![Tests](https://img.shields.io/badge/tests-87%20passed-success)](tests/)
[![Next.js](https://img.shields.io/badge/next.js-15.5-blue)](https://nextjs.org/)
[![React](https://img.shields.io/badge/react-19-cyan)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.8-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-Proprietary-red)]()

LeadRescue AI is a multi-tenant B2B customer inquiry recovery and sales pipeline platform built specifically for **digital marketing agencies in Pakistan**. It organizes inbound leads from paid ad campaigns (Meta Lead Ads, Google Ads, TikTok, website forms), enforces strict follow-up response SLAs, eliminates neglected inquiries, and provides grounded bilingual (English & Urdu) sales assistant copy with human-in-the-loop review safeguards.

---

## 🌟 Core Highlights

* **Multi-Tenant Data Isolation:** Enforced at the database level via PostgreSQL Row-Level Security (RLS) policies on all tables (`profiles`, `agencies`, `agency_members`, `clients`, `leads`, `follow_up_tasks`, `lead_activities`).
* **5-Tier Role-Based Access Control (RBAC):** `Owner`, `Admin`, `Manager`, `Sales Representative`, and `Viewer`. Features the `isSoleAgencyOwner` protection rule preventing organizational lockout.
* **Standardized Sales Pipeline:** 7-stage visual Kanban board (`New`, `Contacted`, `Qualified`, `Follow-up Required`, `Proposal Sent`, `Won`, `Lost`) with accessible keyboard stage switcher and mandatory loss reason categorization.
* **Timezone-Aware Follow-Up SLAs:** Deterministic date calculations anchored strictly to `Asia/Karachi` (PKT / UTC+5) with one-click direct WhatsApp Web outreach (`https://wa.me/<phone>`).
* **Grounded AI Sales Assistant:** Generates responses exclusively from verified database facts. Flags missing context, defuses prompt injection attempts (`[BLOCKED_DIRECTIVE]`), and crafts authentic Pakistani Urdu copy (`السلام علیکم`).
* **Transparent Reports & Attribution:** Mathematically documented formulas for Contact Rate, Qualification Rate, Follow-Up SLA Completion Rate, and Won Conversion Rate with zero-division safety and multi-section CSV exports.
* **Pakistan Localized Commercial Model:**
  * **PKR Pricing:** Starter (PKR 2,999/mo), Growth (PKR 6,999/mo), Advanced (PKR 14,999/mo).
  * **Manual Bank Transfers (IBFT):** Direct account coordinates for Meezan Bank & HBL with deposit reference (UTR/RRN) submission and admin approval lifecycle.
  * **Authoritative Quota Enforcement:** Server-enforced limits for client workspaces, leads/mo, team seats, and AI drafts.
* **White-Label Client Portal (`/portal/*`):** Restricted client view with server-side field redaction stripping private agency profit margins, commission percentages, and confidential internal rep notes.
* **Platform Super Admin Console (`/admin/*`):** Operational console with strict privilege separation (`is_super_admin: true`), manual IBFT review queue, plan configurator, and sanitized immutable audit logging.
* **Native Urdu & Accessibility (WCAG AA):** Full RTL layout support (`dir="rtl"`), Noto Nastaliq typography fallbacks, bidirectional phone number isolation (`\u202A`...`\u202C`), and keyboard skip-links.

---

## 🧭 Application Route Directory

### Public & Marketing
* `/` — Landing page with value proposition, interactive ROI calculator, and Pakistani agency testimonials.
* `/features` — Detailed breakdown of SLA enforcement, AI sales assistant, and pipeline capabilities.
* `/pricing` — Authoritative PKR pricing tiers with 14-day trial details and IBFT payment instructions.
* `/about` — Agency-first mission, leadership, and Pakistan digital growth background.
* `/contact` — Direct support inquiries and local WhatsApp helpline.
* `/privacy` & `/terms` — GDPR & local Pakistan data privacy compliance terms.

### Authentication & Agency Workspace
* `/login`, `/signup`, `/forgot-password`, `/reset-password` — Supabase SSR auth flows with PKT validation.
* `/app/onboarding` — 5-step agency setup wizard (name, slug, timezone, language, business vertical).
* `/app/dashboard` — Executive KPI metrics, lead acquisition trends, and urgent SLA task alerts.
* `/app/pipeline` — 7-stage visual Kanban board with accessible stage switching and loss reasons.
* `/app/follow-ups` — Timezone-aware follow-up task management with direct WhatsApp launching.
* `/app/clients` — Client workspace manager and per-client analytics.
* `/app/leads` — Master lead directory with CSV column mapping, validation, and duplicate detection.
* `/app/ai-assistant` — Grounded bilingual sales synthesis engine with prompt injection defense.
* `/app/reports` — Campaign attribution, channel ROI tables, lost reason Pareto analysis, and CSV export.
* `/app/team` — Member directory, invite modals, role-permission matrix, and security audit log.
* `/app/integrations` — Inbound webhook credentials, HMAC SHA-256 signatures, and Meta Cloud API guides.
* `/app/billing` — Active subscription hero card, usage meters, manual IBFT payment review, and invoices.

### Client Portal
* `/portal/dashboard` — Restricted brand client overview with verified KPIs and recent inquiries.
* `/portal/leads` — Approved lead directory with agency margins and internal rep notes redacted.
* `/portal/reports` — Grounded conversion funnel and acquisition channel ROI tables.

### Platform Super Admin Console
* `/admin/dashboard` — Platform overview metrics (total agencies, MRR run-rate, pending IBFT reviews).
* `/admin/agencies` — Searchable platform agency directory with suspend/reactivate audit modals.
* `/admin/subscriptions` — Manual bank transfer verification queue for Meezan Bank & HBL deposits.
* `/admin/plans` — Authoritative plan tier manager (PKR price, limits, feature quotas).
* `/admin/audit-logs` — Non-repudiable security audit trail with sanitized metadata.

---

## 🛠️ Quick Start & Local Development

### 1. Prerequisites
* **Node.js:** v20+ or v24+
* **pnpm:** v9+

### 2. Installation
```bash
git clone https://github.com/your-org/leadrescue-ai.git
cd leadrescue-ai
pnpm install
```

### 3. Environment Configuration
Copy the template environment file:
```bash
cp .env.example .env.local
```
Provide your Supabase URL and public anonymous key in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Schema Setup
Execute the sequential PostgreSQL migrations found in [`supabase/migrations/`](file:///Users/dilnawaz/LeadRescue%20AI/supabase/migrations):
1. `20261109000000_stage3_multitenant_foundation.sql`
2. `20261110000000_stage4_leads_and_dashboard.sql`

### 5. Running the Application
```bash
# Start development server
pnpm run dev

# Run TypeScript type checking
pnpm run type-check

# Run full automated test suite (87 tests)
pnpm test

# Production build check
pnpm run build
```

---

## 🧪 Automated Test Suite

LeadRescue AI includes **87 automated unit and integration tests** executing natively via Node 24:

```bash
pnpm test
```

```text
▶ AI Sales Assistant & Grounded Engine Test Suite (6 tests)
▶ Billing & Subscription Entitlements Test Suite (5 tests)
▶ Client Portal Security & Data Isolation Test Suite (5 tests)
▶ Dashboard KPI Metrics & Aggregation Test Suite (4 tests)
▶ Follow-Up Task Management & Timezone Calculations Test Suite (6 tests)
▶ Integrations & Webhook Intake Validation Test Suite (4 tests)
▶ Lead Management & CSV Import Test Suite (3 tests)
▶ Multi-Tenant Isolation & RBAC Test Suite (6 tests)
▶ Sales Pipeline & Stage Transitions Test Suite (4 tests)
▶ Reports & Analytics Metric Calculations Test Suite (7 tests)
▶ Super Admin Console & Privilege Separation Test Suite (8 tests)
▶ Agency Team Management & RBAC Enforcement Test Suite (5 tests)
▶ Urdu Localization & Accessibility (a11y) Test Suite (6 tests)
▶ Comprehensive Production-Readiness End-to-End Audit Suite (10 tests)
▶ Deployment & Pilot Launch Readiness Test Suite (5 tests)

ℹ tests 87 | suites 15 | pass 87 | fail 0 | duration_ms 318ms
```

---

## 📚 Governance Documentation

* [`IMPLEMENTATION_STATUS.md`](file:///Users/dilnawaz/LeadRescue%20AI/IMPLEMENTATION_STATUS.md): Complete progress matrix for all 17 build stages.
* [`DECISIONS.md`](file:///Users/dilnawaz/LeadRescue%20AI/DECISIONS.md): 20 Architecture Decision Records (ADRs).
* [`AUDIT_REPORT.md`](file:///Users/dilnawaz/LeadRescue%20AI/AUDIT_REPORT.md): Formal pre-launch security & reliability audit report.
* [`DEPLOYMENT_GUIDE.md`](file:///Users/dilnawaz/LeadRescue%20AI/DEPLOYMENT_GUIDE.md): Operations guide, environment keys, sequential migrations, and disaster recovery.
* [`PILOT_ONBOARDING_GUIDE.md`](file:///Users/dilnawaz/LeadRescue%20AI/PILOT_ONBOARDING_GUIDE.md): 9-step agency onboarding walkthrough for the Pakistani digital market.
* [`CHANGELOG.md`](file:///Users/dilnawaz/LeadRescue%20AI/CHANGELOG.md): Complete SemVer release history from v0.1.0 to v1.0.0-rc1.
