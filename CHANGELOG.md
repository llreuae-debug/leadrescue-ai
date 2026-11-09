# Changelog

All notable changes to the LeadRescue AI codebase will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
  - `tests/leads-and-csv.test.ts` testing duplicate detection, CSV mapping/validation, and search/filtering (16/16 tests passing across all test suites).

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
  - Automated test suite in `tests/dashboard-metrics.test.ts` verifying calculations, client isolation, empty states, and tenant protection (12/12 tests passing).

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
  - Automated test suite in `tests/multi-tenant-isolation.test.ts` (7/7 tests passed).
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
