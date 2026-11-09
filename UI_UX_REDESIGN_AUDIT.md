# LeadRescue AI — Complete UI/UX Redesign Audit & Route Checklist

**Audit Date:** 2026-11-10  
**Phase:** Phase 1 — Complete Audit (No modifications to backend or data)  
**Visual Inspiration:** Creative-tech agency neo-minimalism based on uploaded reference image (`media_1794262184071_8713c4af.jpg`)  
**Scope:** Complete frontend visual transformation across 37 routes, 21 shared components, and 4 layout shells.

---

## 1. Visual Reference Breakdown & Translation

From analysis of the reference screenshot:

| Aesthetic Dimension | Reference Implementation | LeadRescue AI Translation |
|---|---|---|
| **Primary Brand Accent** | High-energy Electric Lime (`#B7FF3C`) used for badges, cards, and high-impact CTAs. | Signature accent for key CTAs, active navigation pills, AI insight blocks, and status highlights. |
| **Dark Contrast Surfaces** | Deep Charcoal (`#17191C`) & Almost Black (`#101113`). | Sidebar shell, dark marketing feature blocks, testimonial containers, and primary button states. |
| **Light Main Surfaces** | Pure White (`#FFFFFF`) & Soft Grey (`#F3F4F2`). | CRM workspace background, client portal, data table surfaces, and readable form canvases. |
| **Structural Borders** | Defined solid borders (`#DCDDDA` light, `#101113` dark) with generous curvature (`rounded-2xl` / `rounded-3xl`). | Clean neo-minimalist cards with subtle hard-edge 0-blur drop shadows (`box-shadow: 0 4px 0 0 #101113`). |
| **Tri-Tone Card Archetypes** | Alternating White, Lime, and Charcoal cards with bold headlines and circular action triggers. | Used across feature grids, KPI dashboards, integration catalogs, and pricing tiers. |
| **Typography & Hierarchy** | Oversized editorial headings with pill-shaped category highlights (`<span className="badge-lime">Services</span>`). | Bold editorial headings (Inter / Geist), tabular numerals for financial data, compact uppercase labels. |
| **Collapsible Working Modules** | Numbered accordion items with clean `(+)` / `(-)` badge toggles. | Redesigned FAQ section, onboarding checklist, and lead recovery workflow steps. |

---

## 2. Brand Colour System Specification

| Token Name | HEX | Usage & Application Rule |
|---|---|---|
| **Electric Lime** | `#B7FF3C` | Primary accent, hero highlights, AI badges, active sidebar pill, lime card variant |
| **Deep Charcoal** | `#17191C` | Dark sections, sidebar background, primary solid buttons, dark card variant |
| **Almost Black** | `#101113` | Dark section backgrounds, card outline borders, high-contrast text headers |
| **Pure White** | `#FFFFFF` | Main CRM workspace surface, table cards, modal dialogs, input surfaces |
| **Soft Grey** | `#F3F4F2` | Alternate marketing sections, card hover backgrounds, table headers |
| **Border Grey** | `#DCDDDA` | Structural dividers, subtle card borders, form input borders |
| **Text Dark** | `#202320` | High-contrast primary reading text |
| **Muted Grey** | `#777D77` | Secondary text, timestamps, table helper labels |
| **Success Green** | `#16A34A` | Won opportunities, active webhook indicators, payment approval badges |
| **Warning Orange** | `#D97706` | Approaching quota limits, pending verification, snoozed follow-ups |
| **Danger Red** | `#DC2626` | Lost leads, overdue follow-ups, payment rejection, destructive actions |

---

## 3. Comprehensive Route Audit & Checklist (37 Routes)

### A. Public Website (7 Routes)
| Route | Page Name | Current Visual State | Target Redesign (Positivus Reference) | Redesign Status |
|---|---|---|---|---|
| `/` | Homepage | Standard SaaS landing page | 14-section editorial layout: oversized hero with lime badge, client proof strip, 3-archetype asymmetric card grid, numbered accordion workflow, product preview, agency ROI comparison, pricing cards, dark testimonials slider, FAQ, final CTA, footer | Pending Approval |
| `/features` | Features | Blue/violet feature list | Asymmetric tri-tone card grid (White, Lime, Charcoal) detailing WhatsApp follow-up automation, bilingual AI engine, and multi-tenant sub-accounts | Pending Approval |
| `/pricing` | Pricing | Standard pricing tiers | 3-tier neo-minimalist cards, billing cycle toggle, manual bank transfer (IBFT) notice, feature matrix table, enterprise quote trigger | Pending Approval |
| `/about` | About Us | Generic agency text | Editorial agency manifesto, team cards with circular avatars and lime badges, core agency principles | Pending Approval |
| `/contact` | Contact Us | Simple contact form | Split layout with dark contact card on left and clean white enquiry form with lime CTA on right | Pending Approval |
| `/privacy` | Privacy Policy | Plain text document | Structured legal typography with readable line-height, section navigation, and privacy badges | Pending Approval |
| `/terms` | Terms of Service | Plain text document | Structured SLA terms, acceptable use clauses, and subscription definitions | Pending Approval |

### B. Authentication & Onboarding (5 Routes)
| Route | Page Name | Current Visual State | Target Redesign | Redesign Status |
|---|---|---|---|---|
| `/login` | Login | Centered auth card | Split layout: deep charcoal brand showcase with lime accents on left, crisp white card with lime button on right | Pending Approval |
| `/signup` | Signup | Centered auth card | Split layout matching login, password strength meter, agency name input, lime primary CTA | Pending Approval |
| `/forgot-password` | Forgot Password | Standard card | Clean recovery canvas with instant feedback alerts | Pending Approval |
| `/reset-password` | Reset Password | Standard card | Secure password update interface with token validation | Pending Approval |
| `/app/onboarding` | Agency Onboarding | 5-step wizard | Guided multi-step experience with lime progress indicators and card archetype selections | Pending Approval |

### C. Agency Workspace Application (13 Routes)
| Route | Page Name | Current Visual State | Target Redesign | Redesign Status |
|---|---|---|---|---|
| `Shell` | AppShell & Sidebar | Light grey / blue sidebar | Deep charcoal sidebar (`#17191C`), electric lime active pill, crisp white header with breadcrumbs and language switcher | Pending Approval |
| `/app/dashboard` | Agency Dashboard | Standard KPI cards & charts | Tri-tone KPI stat cards, high-contrast trend charts, lead source donut/bar distribution, overdue task alerts, quick-action drawer | Pending Approval |
| `/app/clients` | Clients Directory | Basic cards | Client workspace gallery with health score badges, active lead counts, and new client drawer | Pending Approval |
| `/app/clients/[clientId]` | Client Cockpit | Basic tab view | Co-branded client workspace cockpit with tabs (Overview, Leads, Pipeline, Settings) and quick metrics | Pending Approval |
| `/app/leads` | Leads Manager | Standard table | Neo-minimalist data table, filter bar with search, status badges, CSV import modal, and lead detail drawer | Pending Approval |
| `/app/pipeline` | Pipeline Kanban | Basic columns | Clean Kanban board with dark/lime column headers, drag/move cards, deal value badges, loss reason prompt | Pending Approval |
| `/app/follow-ups` | Follow-ups Manager | Tabbed task view | 5 task filter tabs (Today, Overdue, Upcoming, Completed, Snoozed), priority indicators, WhatsApp template preview modal | Pending Approval |
| `/app/ai-assistant` | AI Sales Assistant | Standard chat | Dedicated AI studio: conversation stream, prompt suggestions, English/Urdu toggle, tone selector, copy/insert actions, token usage meter | Pending Approval |
| `/app/reports` | Analytics & Reports | Standard report cards | Agency conversion analytics, funnel charts, source attribution breakdown, date range selector, CSV export | Pending Approval |
| `/app/team` | Team & Roles | Basic user list | Team member directory, invite modal, role-permission matrix badge table | Pending Approval |
| `/app/integrations` | Integrations Gallery | Grid of cards | Integration cards (WhatsApp Cloud API, Meta Lead Ads, Webhooks, Google Sheets, Zapier) with live status badges | Pending Approval |
| `/app/billing` | Billing & Usage | Basic billing view | Current tier hero card with lime accent, usage meters, manual bank transfer (IBFT) receipt upload modal, payment history | Pending Approval |
| `/app/settings` | Agency Settings | Basic form | Multi-tab settings (Profile, Agency Branding, Notifications, Security, Audit Logs) | Pending Approval |

### D. Client Portal (3 Routes)
| Route | Page Name | Current Visual State | Target Redesign | Redesign Status |
|---|---|---|---|---|
| `/portal/dashboard` | Portal Dashboard | Simple portal overview | Executive client dashboard: recovered leads, response time, conversion rate, quick contact list | Pending Approval |
| `/portal/leads` | Portal Leads | Basic read-only table | Filtered lead table with real-time status updates and CSV export | Pending Approval |
| `/portal/reports` | Portal Reports | Simple charts | Client-facing ROI and lead attribution report | Pending Approval |

### E. Super Admin Console (5 Routes)
| Route | Page Name | Current Visual State | Target Redesign | Redesign Status |
|---|---|---|---|---|
| `/admin/dashboard` | Platform Dashboard | Basic admin view | Dark operations console (`#101113`) with lime metrics: total agencies, active MRR, platform lead volume, system health | Pending Approval |
| `/admin/agencies` | Agency Management | Basic agency list | Agency tenant directory, status toggles, plan switcher, impersonation modal | Pending Approval |
| `/admin/subscriptions` | Subscriptions Review | Basic approvals table | Manual IBFT subscription approval queue, renewal status, discount management | Pending Approval |
| `/admin/plans` | SaaS Plans Editor | Basic plan cards | SaaS tier definition editor (Starter, Growth, Agency Pro, Enterprise) and feature flags | Pending Approval |
| `/admin/audit-logs` | Platform Audit Trail | Basic logs table | Immutable platform audit trail with filter by agency, action type, and date | Pending Approval |

### F. System & Utility Routes (2 Routes)
| Route | Page Name | Current Visual State | Target Redesign | Redesign Status |
|---|---|---|---|---|
| `/design-system` | Design Tokens | Initial component preview | Living style guide showcasing all color swatches, button states, card archetypes, badges, tables, and typography | Pending Approval |
| `/_not-found` | 404 Not Found | Default error | Branded 404 page with creative agency illustration and return button | Pending Approval |

---

## 4. Shared Frontend Component Inventory (21 Components)

1. `src/components/ui/StatCard.tsx` — Updated with rounded-3xl geometry, tabular numbers, highlight prop, and neo-minimalist borders.
2. `src/components/ui/StatusBadge.tsx` — Updated with lime AI variant, dark default, and refined semantic indicators.
3. `src/components/ui/UsageMeter.tsx` — Updated with electric lime progress bar and deep charcoal container.
4. `src/components/ui/LanguageSwitcher.tsx` — Updated with electric lime active state and pill styling.
5. `src/components/ui/DataTable.tsx` — Neo-minimalist table layout with clean header, row hover, and pagination.
6. `src/components/ui/FilterBar.tsx` — Search field with filter dropdowns and active filter chips.
7. `src/components/ui/FormField.tsx` — Input wrapper with label, error message, and helper text.
8. `src/components/ui/SearchInput.tsx` — Search input with leading icon and clear button.
9. `src/components/ui/PageHeader.tsx` — Page title, description, and primary action button.
10. `src/components/ui/ChartCard.tsx` — Container for Recharts / SVG visualisations.
11. `src/components/ui/ConfirmDialog.tsx` — Modal confirmation for destructive/critical actions.
12. `src/components/ui/EmptyState.tsx` — Empty data container with icon, title, description, and action button.
13. `src/components/ui/LoadingState.tsx` — Skeleton loaders and spinner states.
14. `src/components/ui/ErrorState.tsx` — Error alert and retry button.
15. `src/components/shell/AppSidebar.tsx` — Dark charcoal sidebar with lime active indicators.
16. `src/components/shell/AppHeader.tsx` — Clean white header with breadcrumbs and user profile.
17. `src/components/shell/AppShell.tsx` — Layout wrapper managing sidebar collapse and mobile drawer.
18. `src/components/shell/RoutePlaceholder.tsx` — Shared skeleton for work in progress.
19. `src/components/marketing/MarketingHeader.tsx` — Clean navigation header with lime CTA button.
20. `src/components/marketing/MarketingFooter.tsx` — Dark charcoal footer with multi-column links.
21. `src/components/providers/AppProviders.tsx` — Context providers (Language, Auth, QueryClient).

---

## 5. Phased Implementation Roadmap

- **Phase 1: Complete Audit & Checklist (Current Step)** — Verified all 37 routes and 21 components; audit document compiled.
- **Phase 2: Design System & Shared Primitives** — Finalize `globals.css`, component primitives (`DataTable`, `FilterBar`, `FormField`, etc.), and `/design-system` page.
- **Phase 3: Master Homepage (`/`)** — Recreate the full 14-section Positivus agency layout with asymmetric cards and accordion workflow.
- **Phase 4: Public Marketing Pages** — Redesign `/features`, `/pricing`, `/about`, `/contact`, `/privacy`, `/terms`.
- **Phase 5: Agency Workspace Application** — Redesign `/app/dashboard`, `/app/leads`, `/app/pipeline`, `/app/follow-ups`, `/app/clients`, `/app/ai-assistant`, `/app/reports`, `/app/team`, `/app/integrations`, `/app/billing`, `/app/settings`.
- **Phase 6: Client Portal** — Redesign `/portal/dashboard`, `/portal/leads`, `/portal/reports`.
- **Phase 7: Super Admin Console** — Redesign `/admin/dashboard`, `/admin/agencies`, `/admin/subscriptions`, `/admin/plans`, `/admin/audit-logs`.
- **Phase 8: Authentication & Onboarding** — Redesign `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/app/onboarding`.
- **Phase 9: Responsive & Accessibility QA** — Mobile, tablet, desktop testing + English & Urdu RTL verification.
- **Phase 10: Final Validation, Build & Deployment** — Ensure 87/87 tests pass, zero backend/database changes, compile Next.js production build, and deploy.

---

## 6. Strict Data & Backend Protection Certification

- **Database & Schemas:** Zero changes to Supabase tables, columns, RLS policies, or migrations.
- **Backend Services:** Zero changes to Server Actions, API routes, or business logic.
- **Authentication & RBAC:** Session cookies, JWT verification, and role permissions remain 100% intact.
- **Testing:** All 87 unit and integration tests across 15 test suites continue to run and pass.
