# LeadRescue AI — Architecture & Product Decisions

## ADR-001: Technology Stack Selection
* **Date:** 2026-11-09
* **Decision:** Next.js 15+ App Router, TypeScript, Tailwind CSS v4, Radix UI Primitives, and Supabase PostgreSQL.
* **Context:** The application is a multi-tenant B2B SaaS aimed at digital marketing agencies in Pakistan.
* **Rationale:** Next.js offers unified server actions, fast SSR for public marketing pages, and strict server-side authentication boundaries. Radix UI provides accessible unstyled headless primitives ensuring ADA/WCAG compliance.

## ADR-002: Design Language & Token Foundation
* **Date:** 2026-11-09
* **Decision:** Linear/Stripe-inspired aesthetic with 4px grid spacing, restrained shadows, 12px card radiuses, and explicit brand color tokens:
  - Primary Blue: `#2563EB`
  - Deep Navy: `#101827`
  - AI Violet: `#7C3AED`
  - Success: `#16A34A`
  - Warning: `#D97706`
  - Danger: `#DC2626`
  - Surface: `#FFFFFF`
  - Background: `#F8FAFC`
* **Rationale:** Digital marketing agencies value clean, high-density, professional interfaces over decorative consumer animations.

## ADR-003: Honest Placeholder Architecture for Unfinished Routes
* **Date:** 2026-11-09
* **Decision:** Any application route not yet integrated with live database persistence displays a structured `RoutePlaceholder` explaining its build stage and upcoming roadmap.
* **Rationale:** In accordance with product principles, simulated data or fake interactive screens must never be passed off as functional workflows.

## ADR-004: Centralised Configurable Plan Architecture
* **Date:** 2026-11-09
* **Decision:** All plan names, pricing in PKR (`Starter: 2,999`, `Growth: 6,999`, `Advanced: 14,999`), quotas, and entitlements originate from a single configuration file (`src/config/plans.ts`).
* **Rationale:** Hardcoding plan limits across pricing pages, billing interfaces, and server entitlement checks creates dangerous discrepancy risks and billing bugs.

## ADR-005: Server-Side Authentication & Session Route Protection
* **Date:** 2026-11-09
* **Decision:** Use `@supabase/ssr` cookies and Next.js middleware for server-side route guards. Form submissions execute via Server Actions (`src/app/actions/auth.ts`) validating inputs on the server before dispatching to Supabase Auth.
* **Rationale:** Client-side route hiding is not a security boundary. Deriving sessions server-side prevents unauthorized access to tenant data and eliminates token exposure risks.

## ADR-006: Multi-Tenant PostgreSQL RLS & Agency Memberships
* **Date:** 2026-11-10
* **Decision:** All database queries are scoped to the active agency via database Row-Level Security (RLS) policies relying on `is_agency_member(agency_id)` and `is_agency_admin(agency_id)` functions. Server code verifies identity through `verifyAgencyAccess` rather than trusting client-submitted parameters.
* **Rationale:** Multi-tenancy in B2B agency software cannot rely on application-level filtering alone. Enforcing isolation at the database layer eliminates cross-tenant data leaks.

## ADR-007: Server-Aggregated Dashboard KPIs & Explicit Demo Labeling
* **Date:** 2026-11-10
* **Decision:** Dashboard queries are aggregated on the server scoped by active agency, client workspace, and timeframe filters. When running in preview or unconfigured environments, an explicit "Demo Workspace Mode" badge is surfaced to avoid misrepresenting simulated data as live customer metrics.
* **Rationale:** Agencies require trustworthy metrics to assess lead response velocity. Transparent labeling prevents accidental confusion during pilots.

## ADR-008: Client-Scoped Duplicate Detection & CSV Import Mapping
* **Date:** 2026-11-10
* **Decision:** Lead duplication is evaluated against `(agency_id, client_id)` matching phone and email. When duplicates are detected during manual creation or CSV ingestion, the system halts and presents the collision rather than silently overwriting. CSV imports require row preview and validation before batch writing.
* **Rationale:** Silent merges in performance marketing destroy attribution and lead history. Review-first duplicate handling prevents data corruption.

## ADR-009: Dual-Mode Pipeline Interaction (Kanban & Keyboard Selectors)
* **Date:** 2026-11-10
* **Decision:** The sales pipeline provides both HTML5 drag & drop and card-level stage selectors with optimistic updates and error rollbacks. When a lead is moved to "Lost", a loss reason modal is triggered. Narrow screens feature a dedicated List view.
* **Rationale:** Pure drag & drop fails on touch screens, mobile devices, and screen readers. Providing dual interactions ensures full WCAG/ADA accessibility and zero dead-ends for reps on mobile.

## ADR-010: Timezone-Aware SLA Evaluation & Safe WhatsApp Dispatch
* **Date:** 2026-11-10
* **Decision:** Follow-up SLA due dates and overdue calculations are computed against the `Asia/Karachi` timezone (PKT / UTC+5). Follow-up actions that generate WhatsApp drafts strictly enforce a Human-in-the-Loop review pattern: messages are surfaced in a preview modal where representatives can review or edit the text before triggering a sanitized `https://wa.me/<phone>?text=<encoded_body>` window.
* **Rationale:** Automated outbound messaging without human review risks customer spam penalties, hallucinated commitments, and compliance breaches. Standardizing on PKT prevents midnight alert confusion across Pakistani marketing agencies.
