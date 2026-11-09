# Changelog

All notable changes to the LeadRescue AI codebase will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
