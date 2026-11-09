# Changelog

All notable changes to the LeadRescue AI codebase will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-09
### Added
- Initial project scaffolding with Next.js 15, TypeScript, Tailwind CSS v4, and pnpm.
- Core design token definitions and styling rules in `src/app/globals.css`.
- 15 shared UI components: `PageHeader`, `StatCard`, `StatusBadge`, `DataTable`, `EmptyState`, `LoadingState`, `ErrorState`, `ConfirmDialog`, `FormField`, `SearchInput`, `FilterBar`, `ChartCard`, `UsageMeter`.
- Application Shell (`AppShell`, `AppSidebar`, `AppHeader`, mobile navigation drawer).
- Design system interactive preview at `/design-system`.
- 11 application routes with `RoutePlaceholder` explaining upcoming stage roadmaps:
  - Overview (`/app/dashboard`)
  - Clients (`/app/clients`)
  - Leads (`/app/leads`)
  - Pipeline (`/app/pipeline`)
  - Follow-ups (`/app/follow-ups`)
  - AI Assistant (`/app/ai-assistant`)
  - Reports (`/app/reports`)
  - Team (`/app/team`)
  - Integrations (`/app/integrations`)
  - Billing (`/app/billing`)
  - Settings (`/app/settings`)
- Project governance documentation: `IMPLEMENTATION_STATUS.md`, `DECISIONS.md`, `CHANGELOG.md`.
