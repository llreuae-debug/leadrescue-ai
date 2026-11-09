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
