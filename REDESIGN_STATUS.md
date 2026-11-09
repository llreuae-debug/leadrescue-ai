# LeadRescue AI — Complete Redesign Audit, Plan & Route Checklist

**Visual Direction:** Creative-Agency Neo-Minimalism ("Positivus" Aesthetic)  
**Primary Accent:** Electric Lime (`#B7FF3C`)  
**Base Surfaces:** Deep Charcoal (`#17191C`) & Almost Black (`#101113`) alongside Crisp Pure White (`#FFFFFF`) and Soft Grey (`#F3F4F2`)  
**Border & Structure:** Defined 1px–2px solid structural borders (`#DCDDDA` on light, `#2A2E33` / `#101113` on cards) with generous curvature (`rounded-2xl` and `rounded-3xl`)  

---

## 1. Visual Reference Analysis & Translation

| Reference Characteristic | Visual Implementation in LeadRescue AI |
|---|---|
| **Editorial Hero & Bold Headlines** | Oversized headline typography with highlighted pill tags (`<span className="bg-[#B7FF3C] text-[#101113] px-3 py-1 rounded-md font-bold">...</span>`). |
| **High-Contrast Alternating Cards** | Tri-tone card hierarchy across grids: **Card A (Crisp White with dark border & shadow)**, **Card B (Electric Lime with dark typography)**, and **Card C (Deep Charcoal with white typography & lime micro-accents)**. |
| **Signature Action Badges** | Circular action triggers: Dark circles with electric lime 45° arrows (`↗`), or Lime circles with dark arrows, indicating interactive drills. |
| **Accordion Working Modules** | Rounded collapsible numbered panels with clean `(+)` / `(-)` badge toggles on soft grey & lime backplates. |
| **Minimalist Elevated Navigation** | Clean floating header with pill-badge navigation and deep charcoal CTA buttons. |
| **Dark Theme Testimonial / Showcase Blocks** | Deep charcoal curved containers (`rounded-3xl bg-[#17191C] text-white`) with thin lime wireframes and clean pagination dots. |
| **Selective Accent Discipline** | Electric Lime (`#B7FF3C`) reserved strictly for high-impact CTAs, active pills, KPI deltas, and AI generated insights. Not overused. |

---

## 2. Design Token Architecture (`globals.css`)

```css
:root {
  /* Brand Accent */
  --electric-lime: #B7FF3C;
  --electric-lime-hover: #A3EE28;
  --electric-lime-light: #F4FEE4;

  /* Neutrals & Dark Surfaces */
  --deep-charcoal: #17191C;
  --almost-black: #101113;
  --pure-white: #FFFFFF;
  --soft-grey: #F3F4F2;
  --border-grey: #DCDDDA;
  --border-dark: #2A2E33;

  /* Typography */
  --text-dark: #202320;
  --text-muted: #777D77;
  --text-inverted: #FFFFFF;

  /* Semantic State */
  --success: #16A34A;
  --warning: #D97706;
  --danger: #DC2626;

  /* Neo-Minimalist Shadows & Geometry */
  --card-radius: 1.5rem; /* rounded-3xl */
  --card-border: 1.5px solid #101113;
  --card-shadow: 0 4px 0 0 #101113;
}
```

---

## 3. Complete Route Inventory & Redesign Checklist (37 Routes)

### A. Marketing & Public Pages (7 Routes)
- [ ] `/` — High-impact landing page (14 sections: Hero with badge highlight, client proof bar, asymmetric feature grid, AI workflow accordion, product preview, agency ROI comparison, pricing cards, testimonials slider, FAQ, final CTA, footer).
- [ ] `/features` — Detailed feature breakdown with 3 card archetypes (White, Lime, Charcoal) detailing WhatsApp Follow-ups, AI bilingual synthesis, pipeline automation, and multi-tenant sub-accounts.
- [ ] `/pricing` — 3-tier pricing cards with monthly/annual toggle, manual bank transfer (IBFT) notice, feature matrix table, and enterprise quote CTA.
- [ ] `/about` — Editorial story, team cards with lime badges and circular avatars, agency mission, and core values.
- [ ] `/contact` — Clean split-layout contact form, agency support direct line, FAQ quick links.
- [ ] `/privacy` — Clean legal layout, structured headings, policy updates, privacy badges.
- [ ] `/terms` — Clear terms of service, acceptable use policy, subscription and SLA clauses.

### B. Authentication & Onboarding (5 Routes)
- [ ] `/login` — Split layout with deep charcoal brand showcase on the left and crisp white login card with lime accents on the right.
- [ ] `/signup` — Registration flow matching the split layout, plan selection indicator, and secure validation.
- [ ] `/forgot-password` — Minimalist recovery interface with instant email feedback.
- [ ] `/reset-password` — Password update form with strength meter and token validation.
- [ ] `/app/onboarding` — 5-step guided wizard (Agency Profile → Client Setup → Integrations → Sample Lead → Launch) with progress steps in lime.

### C. Agency Workspace Application (12 Routes)
- [ ] `Shell` (`AppSidebar`, `AppHeader`, `AppShell`) — Deep charcoal sidebar (`#17191C`), electric lime active pill indicators, dark status badges, clean breadcrumbs.
- [ ] `/app/dashboard` — Redesigned KPI cards (Total, New, Qualified, Due, Won), lead acquisition trend chart, source donut/bar chart, overdue follow-up alerts, quick actions.
- [ ] `/app/pipeline` — Modern Kanban board with distinct stage headers, column cards with hover states, drag/move actions, lead value indicators.
- [ ] `/app/follow-ups` — 5 task tabs (Today, Overdue, Upcoming, Completed, Snoozed), priority indicators, WhatsApp template preview modal.
- [ ] `/app/leads` — Data table with filter bar, search, status badges, CSV import modal, and lead detail drawer.
- [ ] `/app/clients` — Client workspace gallery cards with health scores, active lead counts, and "Add Client" drawer.
- [ ] `/app/clients/[clientId]` — Client detail cockpit with tabs (Overview, Leads, Pipeline, Settings), client contact card, and activity stream.
- [ ] `/app/ai-assistant` — Dedicated AI synthesis workspace: conversation stream, prompt suggestions, English/Urdu toggle, tone selector, copy/insert actions, token meter.
- [ ] `/app/reports` — Agency performance analytics, conversion funnel, source attribution table, date picker, and CSV export.
- [ ] `/app/team` — Team member roster, invite modal, role-permission matrix badge display.
- [ ] `/app/integrations` — Integration cards (WhatsApp Cloud API, Meta Lead Ads, Webhooks, Google Sheets, Zapier) with connection status badges.
- [ ] `/app/billing` — Current plan card with lime accent, usage meters, upgrade options, payment receipt history, and manual bank transfer modal.
- [ ] `/app/settings` — Agency profile settings, notification preferences, security tokens, audit log preferences.

### D. Client Portal (3 Routes)
- [ ] `Portal Shell` (`/portal/layout.tsx`) — Co-branded minimalist portal shell with agency logo and clean navigation.
- [ ] `/portal/dashboard` — Executive client dashboard: recovered leads, response time, conversion rate, quick contact list.
- [ ] `/portal/leads` — Read-only / filtered lead list for the client with real-time status updates and export.
- [ ] `/portal/reports` — Client-facing ROI and lead attribution report.

### E. Super Admin Console (5 Routes)
- [ ] `Admin Shell` (`/admin/layout.tsx`) — Dark operations console (`#101113`) with subtle lime status highlights.
- [ ] `/admin/dashboard` — Platform overview: total agencies, active MRR, platform lead volume, system health.
- [ ] `/admin/agencies` — Agency tenant directory, status toggles, plan switcher, impersonation modal.
- [ ] `/admin/subscriptions` — Manual IBFT subscription approval queue, renewal status, discount management.
- [ ] `/admin/plans` — SaaS tier definition editor (Starter, Growth, Agency Pro, Enterprise) and feature flags.
- [ ] `/admin/audit-logs` — Immutable platform audit trail with filter by agency, action type, and date.

### F. System & Utility Routes (2 Routes)
- [ ] `/design-system` — Living style guide showcasing all color swatches, button states, card archetypes, badges, tables, and typography.
- [ ] `/_not-found` — Branded 404 error page with quick return action.

---

## 4. Execution Phasing Plan

1. **Phase 1: Audit & Foundation (Done)**
   - Lock visual reference tokens in `src/app/globals.css`.
   - Update shared component archetypes (`StatCard`, `StatusBadge`, `DataTable`, `FilterBar`, `UsageMeter`, `LanguageSwitcher`, `EmptyState`).
   - Validate `/design-system` preview.
2. **Phase 2: Navigation Shells & Layouts**
   - Redesign `AppSidebar`, `AppHeader`, `AppShell` with deep charcoal and electric lime pills.
   - Redesign `MarketingHeader` and `MarketingFooter`.
   - Redesign `PortalHeader` and `AdminHeader`.
3. **Phase 3: Public Marketing Pages**
   - Complete `/` homepage overhaul (14 sections, Positivus layout, asymmetric cards, accordion workflow).
   - Redesign `/features`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`.
4. **Phase 4: Core Agency Workspace**
   - Overhaul `/app/dashboard`, `/app/pipeline`, `/app/follow-ups`, `/app/leads`, `/app/clients`, `/app/ai-assistant`, `/app/reports`, `/app/team`, `/app/integrations`, `/app/billing`, `/app/settings`.
5. **Phase 5: Client Portal & Super Admin**
   - Redesign `/portal/*` (3 routes) and `/admin/*` (5 routes).
6. **Phase 6: Auth & Onboarding**
   - Redesign `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/app/onboarding`.
7. **Phase 7: Verification & Testing**
   - Run full unit & integration tests (`pnpm test`) — maintain 100% pass rate (87/87 tests).
   - Run type checks (`pnpm run type-check`) and Next.js production build (`pnpm run build`).
8. **Phase 8: Deployment & Push**
   - Git commit all changes, push to GitHub, and deploy to Vercel production.

---

## 5. Non-Negotiable Constraints & Safety Guardrails
- **Zero Functionality Removal:** All 37 routes, Supabase client/server calls, Row Level Security policies, Server Actions, and database migrations remain 100% untouched.
- **Bilingual & Urdu RTL Support:** Urdu copy generation, RTL bidirectional typography, and WhatsApp message formatting remain fully intact.
- **Test Integrity:** All 87 unit tests across 15 test files must pass on every stage.
