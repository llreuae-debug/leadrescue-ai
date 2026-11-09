# Changelog

All notable changes to the LeadRescue AI codebase will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.15.0] - 2026-11-10
### Added
- **Urdu Localization & RTL Support:**
  - Complete bilingual translation system (`src/lib/i18n/translations.ts`) with natural, authentic Pakistani phrasing across all navigation, actions, statuses, and metrics.
  - Direction mapping (`document.documentElement.dir = "rtl"` and `lang="ur"`) with persistent user choice saved to `localStorage` (`leadrescue_lang`).
  - Bi-directional formatting helpers:
    - `formatBilingualPhone`: Wraps phone numbers in Unicode Left-to-Right isolates (`\u202A`...`\u202C`) to guarantee phone numbers are never reversed in RTL text.
    - `formatBilingualCurrency`: Handles linguistic order (`PKR 6,999` vs `6,999 روپے`).
  - `LanguageSwitcher` pill component embedded across `AppHeader`, `ClientPortalLayout`, and `MarketingHeader`.
  - Urdu typography fallback stack (`Noto Nastaliq Urdu`, `Jameel Noori Nastaleeq`, `Urdu Typesetting`) in `globals.css`.
- **Accessibility & Responsive QA:**
  - Accessible skip-to-content landmark link (`.skip-link`).
  - Minimum 44px touch targets on mobile interactions.
  - Preserved directional icons (checkmarks, coins, phone icons remain stable while arrows mirror appropriately via `.rtl-mirror`).
- **Automated Tests:**
  - `tests/i18n-accessibility.test.ts` with 6 automated unit tests validating dictionary completeness, natural Urdu phrasing, direction mapping, bidirectional phone isolation, currency formatting, and accessibility landmarks (72/72 tests passing total).

## [0.14.0] - 2026-11-10
### Added
- **Super Admin Console (`/admin/*`):**
  - Dedicated Platform Admin Shell (`/admin/layout.tsx`) with elevated privilege indicators and root operations navigation.
  - Platform Operations Dashboard (`/admin/dashboard`):
    - Platform KPI cards: Total Registered Agencies, Active Paid Subscriptions, Pending IBFT Transfers, Platform MRR Run-rate in PKR, and Total Leads Managed.
    - Pending manual bank transfer alert banner with direct queue link.
    - Recent administrative event audit stream.
  - Platform Agencies Directory (`/admin/agencies`):
    - Searchable directory of agencies with status filter (`Active`, `Suspended`).
    - Customer Lead Privacy Boundary: High-level operational metrics only; raw customer contact coordinates are shielded from platform views.
    - Suspend / Reactivate action modal requiring mandatory documented justification.
  - Manual Payment Reconciliation Queue (`/admin/subscriptions`):
    - Pakistani IBFT bank deposit review interface (Meezan Bank & HBL).
    - Status filtering (`Pending`, `Approved`, `Rejected`), transaction reference matching, and approve/reject actions with documented reason tracking.
  - Platform Plan Tiers & Quota Limits Manager (`/admin/plans`):
    - Authoritative plan configurator for Starter, Growth, and Advanced tiers.
    - Server-side validation enforcing non-negative prices, valid workspace limits, and minimum lead quotas.
    - Edit plan modal requiring change justification reason.
  - Security & Operations Audit Trail (`/admin/audit-logs`):
    - Non-repudiable log recording actor identity, action type, target resource, documented reason, and sanitized metadata.
    - Action filtering across payment reviews, agency suspensions, and plan alterations.
- **Server-Side Security & Privilege Separation (`src/lib/admin/admin-security.ts`):**
  - `verifySuperAdminAccess`: Rejects normal agency Owner/Admin/Manager/Rep sessions; blocks client-side privilege elevation attempts.
  - `sanitizeAuditMetadata`: Redacts passwords, access tokens, API keys, bearer headers, and secrets before log persistence.
  - `validatePlanUpdate`: Guarantees plan pricing and quota integrity.
  - `createAdminAuditEvent`: Generates structured, tamper-resistant audit events.
  - Server actions in `src/app/actions/admin.ts`: `getAdminDashboardAction`, `getAdminAgenciesAction`, `toggleAgencyStatusAction`, `getAdminSubscriptionsAction`, `reviewAdminPaymentAction`, `getAdminPlansAction`, `updateAdminPlanAction`, `getAdminAuditLogsAction`.
- **Automated Tests:**
  - `tests/super-admin.test.ts` with 8 unit tests covering Super Admin verification, privilege elevation defense, role rejection (Owner/Admin/Manager), sensitive credential redaction, audit event construction, and plan update validations (66/66 tests passing total).

## [0.13.0] - 2026-11-10
### Added
- **Restricted Client Portal (`/portal/*`):**
  - Dedicated client layout (`/portal/layout.tsx`) featuring client workspace branding, agency co-branding ("Managed by [Agency Name]"), and support contact coordinates.
  - Client Overview Dashboard (`/portal/dashboard`):
    - Real-time KPI StatCards: Total Enquiries, Contacted Enquiries (% SLA coverage), Qualified Leads, Closed Deals, and Won Deal Value (PKR).
    - Inbound Lead Sources distribution progress bars.
    - Recent inquiries table with status badges and direct WhatsApp chat links (`https://wa.me/`).
  - Customer Enquiries Directory (`/portal/leads`):
    - Search input (customer name, phone, email, company).
    - Status filter dropdown (`New`, `Contacted`, `Qualified`, `Proposal Sent`, `Won`, `Lost`).
    - Marketing channel filter dropdown.
    - Verified lead details table with deal values in PKR.
    - Export My Enquiries (CSV) action streaming only approved fields.
  - Acquisition & Conversion Reports (`/portal/reports`):
    - 4-stage visual conversion funnel (Enquiries -> Contacted -> Qualified -> Won Deals).
    - Channel Attribution & ROI performance table breaking down leads, qualification volume, deals won, revenue won, and channel conversion rate %.
    - Grounded metrics guarantee notice upholding zero synthetic forecasts or vanity projections.
- **Server-Side Security & Field Redaction (`src/lib/portal/portal-security.ts`):**
  - `sanitizeClientLead`: Strictly purges internal agency margin percentages, confidential sales rep notes, and internal pipeline deliberations before delivery.
  - `filterClientLeads`: Enforces workspace scoping, preventing cross-client and cross-agency data leaks.
  - `computeClientMetrics`: Calculates zero-division-safe conversion rates and channel breakdowns.
  - Server actions in `src/app/actions/portal.ts`: `getClientPortalWorkspaceAction`, `getClientPortalDashboardAction`, `getClientPortalLeadsAction`, `getClientPortalReportsAction`, and `exportClientPortalLeadsCsvAction`.
- **Automated Tests:**
  - `tests/client-portal.test.ts` with 5 automated unit tests testing field redaction, client workspace isolation, cross-agency isolation, metric computation, and empty dataset resilience (58/58 tests passing total).

## [0.12.0] - 2026-11-10
### Added
- **Billing & Subscription Entitlements (`/app/billing`):**
  - Authoritative PKR plan tiers: Starter (PKR 2,999), Growth (PKR 6,999), and Advanced (PKR 14,999) originating from `src/config/plans.ts`.
  - Active subscription hero card displaying tier name, renewal date, and trial countdown badge.
  - Server-enforced real-time usage meters for Client Workspaces, Monthly Inbound Leads, Team Seats, and AI Drafts.
  - Pakistan manual IBFT bank transfer review workflow with verified Meezan Bank & HBL corporate account coordinates.
  - Submit Bank Transfer Receipt modal capturing target plan, exact PKR price validation, bank name, and transaction reference (UTR/RRN).
  - Auditable Invoices & Payment History ledger with `Pending`, `Approved`, and `Rejected` statuses and receipt review modal.
  - Plan comparison and tier upgrade modal.
  - Server Actions in `src/app/actions/billing.ts`: `getBillingOverviewAction`, `submitManualPaymentProofAction`, `reviewPaymentProofAction`, `updateBillingContactAction`.
- **Automated Tests:**
  - `tests/billing-entitlements.test.ts` with 5 automated unit tests testing authoritative limits, quota blocking, manual payment submission validation, role-based approval rights, and rejection logging (53/53 tests passing total).

## [0.11.0] - 2026-11-10
### Added
- **Integrations Centre (`/app/integrations`):**
  - Verified integration status catalog (`CSV Import`, `Website Webhook & Forms`, `WhatsApp Business Cloud API`, `Meta Lead Ads`, `Google Sheets`, `SMTP Email`).
  - Zero-mock status model: Unconfigured third-party integrations default strictly to `Not Connected` with setup requirements rather than simulated success buttons.
  - Inbound Lead Intake API Route (`/api/webhooks/lead-intake`):
    - Timing-safe HMAC SHA-256 signature verification in `x-leadrescue-signature` header.
    - Idempotency replay defense via `idempotency-key` header to prevent duplicate lead creation on network retries.
    - Payload schema validation ensuring non-empty name, target client ID, and at least one contact coordinate (phone or email).
    - CORS preflight handlers for browser website form submissions.
  - Interactive Webhook Credentials modal with endpoint URL, signing secret reveal toggle, cURL sample, and embeddable HTML lead form snippet.
  - Webhook Self-Test Ping trigger dispatching live signature validation.
  - Official WhatsApp Cloud API setup modal detailing Meta Business Manager, Pakistani phone registration (+92), System User permanent tokens, and ban risk warnings regarding unofficial scrapers.
  - Server Actions in `src/app/actions/integrations.ts`: `getIntegrationsAction`, `getWebhookCredentialsAction`, `testWebhookConnectionAction`.
- **Automated Tests:**
  - `tests/integrations.test.ts` with 4 unit tests covering HMAC SHA-256 signature verification, tamper rejection, payload validation, and idempotency replay defense (48/48 tests passing total).

## [0.10.0] - 2026-11-10
### Added
- **Team Management & Permissions (`/app/team`):**
  - Full agency membership directory with roles, statuses, and joined dates.
  - Interactive Role-Permission Matrix displaying permissions across all 5 roles (`Owner`, `Admin`, `Manager`, `Sales Representative`, `Viewer`).
  - Invite Team Member modal with email and role validation.
  - Resend Invitation action for pending invites.
  - Modify Member Role modal with server-enforced role boundaries.
  - Member access suspension and reactivation toggles.
  - Sole Owner Protection: System strictly blocks demoting or removing the last remaining agency Owner.
  - Hierarchical promotion protection: Non-owners cannot promote members to Owner or modify an Owner.
  - Security Audit Trail: Real-time event log tracking member invitations, role updates, suspensions, and removals.
  - Server Actions in `src/app/actions/team.ts`: `getTeamDataAction`, `inviteTeamMemberAction`, `resendInvitationAction`, `updateMemberRoleAction`, `updateMemberStatusAction`, `removeMemberAction`.
- **Automated Tests:**
  - `tests/team-management.test.ts` with 5 automated unit tests validating Sole Owner demotion prevention, Sole Owner removal prevention, multi-owner flexibility, role invitation boundaries, and email format/duplicate checks (44/44 tests passing total).

## [0.9.0] - 2026-11-10
### Added
- **Reports and Analytics (`/app/reports`):**
  - Transparent agency performance dashboard with visible, documented metric formulas.
  - Key SLA cards: Contact Rate, Qualification Rate, Follow-Up Completion Rate, and Won Conversion Rate with closed deal revenue in PKR.
  - Inbound Channel Attribution: Breakdown by lead source with qualification counts, won deals, and revenue volume.
  - Lost Opportunity Root Cause Analysis: Categorized loss reasons (Price sensitivity, Selected competitor, Unresponsive, Incompatible vertical, Cancelled campaign).
  - Client Workspace Comparison: Cross-client benchmark table.
  - Multi-criteria filter engine: Date ranges (`7d`, `30d`, `90d`, `All Time`), client workspace, and inbound source.
  - Server Actions in `src/app/actions/reports.ts`: `getReportsDataAction` and `exportReportsCsvAction`.
  - Comprehensive CSV report export containing executive KPI summary, channel performance, client breakdown, and lost reasons.
- **Automated Tests:**
  - `tests/reports-analytics.test.ts` with 7 automated tests testing Contact rate, Qualification rate, Task completion SLA math, Won conversion rate, zero division resilience, client workspace filtering, and loss reason ranking (39/39 tests passing total).

## [0.8.0] - 2026-11-10
### Added
- **AI Sales Assistant (`/app/ai-assistant`):**
  - Grounded sales intelligence and multilingual follow-up drafting interface.
  - Pure synthesis engine in `src/lib/ai/assistant-engine.ts` with strict fact extraction and missing context alerts.
  - Prompt injection neutralization (`sanitizeUntrustedInput`) defending against directive overrides in lead notes.
  - Dual-language support: English and authentic Urdu (with Nastaliq typography and Pakistani cultural business etiquette).
  - Dynamic tone adjustment across `Professional`, `Friendly`, and `Concise`.
  - Core sales capabilities: Lead history summary, WhatsApp follow-up draft, email outreach draft, qualification framework questions, next-best action, and Pakistani agency objection handling playbooks.
  - Human-in-the-loop safeguards: In-place editable textarea, copy to clipboard, and direct safe WhatsApp Web launch (`https://wa.me/`).
  - Server Actions in `src/app/actions/ai-assistant.ts`: `getAssistantLeadsAction`, `getLeadContextSnapshotAction`, `generateAiResponseAction`, and `getAssistantQuotaAction`.
  - Quota meter with monthly usage tracking, limit enforcement, and reset date.
- **Automated Tests:**
  - `tests/ai-assistant.test.ts` with 6 automated tests testing fact extraction, missing data detection, prompt injection defense, tone switching, Urdu Unicode script generation, and objection handling (32/32 tests passing total).

## [0.7.0] - 2026-11-10
### Added
- **Follow-Up Task Management (`/app/follow-ups`):**
  - Follow-up queue with 5 views (`All`, `Overdue`, `Today`, `Upcoming`, `Completed`) and dynamic overdue count badge.
  - Pakistan Standard Time (`Asia/Karachi`) due date/time formatting.
  - Task completion, reschedule modal, and +1d snooze action.
  - Schedule Follow-up modal with duplicate pending task guard.
  - Contextual WhatsApp draft modal with click-to-chat `https://wa.me/` launching and human-in-the-loop review safeguard.
  - Server Actions in `src/app/actions/followups.ts`: `getFollowUpsAction`, `createFollowUpTaskAction`, `completeFollowUpTaskAction`, `rescheduleFollowUpTaskAction`, `snoozeFollowUpTaskAction`.
- **Automated Tests:**
  - `tests/follow-ups.test.ts` verifying overdue/today/upcoming logic, status transitions, snooze date math, and duplicate prevention (26/26 tests passing).

## [0.6.0] - 2026-11-10
### Added
- **Sales Pipeline (`/app/pipeline`):**
  - Responsive visual Kanban board across 7 standardized stages (`New`, `Contacted`, `Qualified`, `Follow-up Required`, `Proposal Sent`, `Won`, `Lost`).
  - Stage configuration in `src/config/pipeline.ts`.
  - Drag & drop card movements with optimistic state updates and error rollback.
  - Keyboard-accessible stage selector on each card.
  - Loss reason confirmation dialog when moving leads to "Lost".
  - One-click Kanban / Mobile List View toggle.
  - Real-time active pipeline volume calculation in PKR (excluding lost deals).
  - Search and client workspace filters.
  - Server Action `updateLeadStageAction` in `src/app/actions/pipeline.ts`.
- **Automated Tests:**
  - `tests/pipeline-stages.test.ts` testing stage transitions, invalid stage rejection, loss reasons, and active pipeline volume (21/21 tests passing across all test suites).

## [0.5.0] - 2026-11-10
### Added
- **Client Workspace Management (`/app/clients` & `/app/clients/[clientId]`):**
  - Client directory displaying total leads, active pipeline leads, won opportunities, account manager assignment, and active/archived status.
  - "Add Client Workspace" modal with industry vertical selector.
  - Client detail view with 5 tabs: Overview, Leads, Pipeline, Reports, and Settings.
  - Server Actions `getClientsAction`, `getClientByIdAction`, and `createClientAction`.
- **Lead Management (`/app/leads`):**
  - Search by name, phone, email, and company.
  - Multi-criteria filter bar (Client, Status, Priority, Source).
  - "Add Lead" modal with client-scoped duplicate detection check.
  - Slide-out Lead Detail Drawer with direct WhatsApp click-to-chat link, status switcher, and activity logs.
  - CSV Import modal with column mapping, parsed row preview table, row validation, and batch write.
  - CSV Export of filtered leads.
  - Server Actions `getLeadsAction`, `createLeadAction`, `updateLeadStatusAction`, and `importLeadsCSVAction`.
- **Automated Tests:**
  - `tests/leads-and-csv.test.ts` testing duplicate detection, CSV mapping/validation, and search/filtering.

## [0.4.0] - 2026-11-10
### Added
- **Agency Dashboard (`/app/dashboard`):**
  - KPI Cards: Total Leads, New Enquiries, Qualified Leads, Follow-ups Due (with Overdue indicator), and Won Opportunities (with total pipeline value in PKR).
  - Lead Acquisition Trend visualizer across timeframes.
  - Multi-channel Enquiry Source Breakdown (Meta Ads, Google Ads, WhatsApp, CSV).
  - Urgent Follow-ups card with direct WhatsApp link and quick completion trigger.
  - Grounded AI Recommendations card for SLA breach recovery.
  - Recent Activity audit timeline.
  - Client workspace filter dropdown and date-range toggles (7d, 30d, 90d, All Time).
  - Transparent "Demo Workspace Mode" labeling for evaluation environments.
- **Database Schema for Leads & Follow-ups:**
  - `supabase/migrations/20261110000000_stage4_leads_and_dashboard.sql`.
  - Tables: `leads`, `follow_up_tasks`, `lead_activities`.
  - Comprehensive indexes on `agency_id`, `client_id`, `status`, `due_at`, `created_at`.
  - PostgreSQL Row-Level Security (RLS) policies for tenant isolation.
- **Server Actions & Tests:**
  - Server Action `getDashboardDataAction` in `src/app/actions/dashboard.ts`.
  - Automated test suite in `tests/dashboard-metrics.test.ts`.

## [0.3.0] - 2026-11-10
### Added
- **Multi-Tenant Foundation & Database Migrations:**
  - PostgreSQL schema and RLS policies in `supabase/migrations/20261109000000_stage3_multitenant_foundation.sql`.
  - Tables: `profiles`, `agencies`, `agency_members`, `clients`.
  - Automatic `on_auth_user_created` trigger for `profiles`.
  - RLS security functions `is_agency_member(agency_id)` and `is_agency_admin(agency_id)`.
- **Role-Based Access Control (RBAC):**
  - Database types in `src/types/database.ts` supporting 5 roles: `owner`, `admin`, `manager`, `sales_representative`, `viewer`.
  - Central permission evaluator in `src/lib/rbac.ts` (`hasPermission`).
  - Server-side trusted membership verification in `src/lib/permissions.ts` (`verifyAgencyAccess`).
  - Automated test suite in `tests/multi-tenant-isolation.test.ts`.
- **Agency Onboarding Flow:**
  - Interactive 5-step wizard at `/app/onboarding` capturing profile, agency identity, regional settings (PKT, Urdu/English), client workspace, and optional CSV import.
  - Server Action `completeOnboardingAction` in `src/app/actions/onboarding.ts`.

## [0.2.0] - 2026-11-09
### Added
- **Marketing Pages:**
  - Complete homepage (`/`) with 9 specified sections: Hero, Problem statement, How it works, Core features, Agency workflow, Configurable pricing preview, FAQ, Final CTA, and Footer.
  - `/features` with comprehensive capability breakdown.
  - `/pricing` with configurable Pakistani tiers (`Starter: PKR 2,999`, `Growth: PKR 6,999`, `Advanced: PKR 14,999`) and category comparison matrix.
  - `/about` detailing the agency follow-up leakage problem and mission.
  - `/contact` with office locations and enquiry submission form.
  - `/privacy` with multi-tenant data isolation and AI privacy protections.
  - `/terms` with subscription guidelines, manual Pakistani bank transfer rules, and anti-spam terms.
- **Authentication System:**
  - Supabase SSR integration (`@supabase/ssr`, `@supabase/supabase-js`).
  - Next.js server-side route guard in `src/middleware.ts`.
  - Server Actions (`src/app/actions/auth.ts`) for `loginAction`, `signupAction`, `logoutAction`, `forgotPasswordAction`, and `resetPasswordAction`.
  - Auth routes with error and loading states: `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/auth/callback`.
  - Single source of truth for plan configuration in `src/config/plans.ts`.
  - Account dropdown menu in `AppHeader` wired to `logoutAction`.

## [0.1.0] - 2026-11-09
### Added
- Initial project scaffolding with Next.js 15, TypeScript, Tailwind CSS v4, and pnpm.
- Core design token definitions and styling rules in `src/app/globals.css`.
- 15 shared UI components: `PageHeader`, `StatCard`, `StatusBadge`, `DataTable`, `EmptyState`, `LoadingState`, `ErrorState`, `ConfirmDialog`, `FormField`, `SearchInput`, `FilterBar`, `ChartCard`, `UsageMeter`.
- Application Shell (`AppShell`, `AppSidebar`, `AppHeader`, mobile navigation drawer).
- Design system interactive preview at `/design-system`.
- 11 application routes with `RoutePlaceholder` explaining upcoming stage roadmaps.
- Project governance documentation: `IMPLEMENTATION_STATUS.md`, `DECISIONS.md`, `CHANGELOG.md`.
