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
