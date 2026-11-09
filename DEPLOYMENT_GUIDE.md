# LeadRescue AI — Production Deployment & Operations Guide

**System Target:** Next.js 15 App Router on Vercel / Node.js + Supabase PostgreSQL  
**Version:** 1.0.0-rc1 (Pilot Release)  
**Target Region:** Pakistan (PKT / `Asia/Karachi`, UTC+5)  

---

## 1. Production Architecture Overview

LeadRescue AI employs a modern, security-hardened serverless and multi-tenant architecture:
* **Frontend & Server Actions:** Next.js 15 (React 19, Tailwind CSS v4, Radix UI Primitives) hosted with HTTPS enforced.
* **Database & Auth:** Supabase PostgreSQL with strict Row-Level Security (RLS) policies and SSR auth cookie exchange.
* **Integrations & Ingestion:** Inbound Webhooks protected with timing-safe HMAC SHA-256 signatures and idempotency caches.
* **AI Engine:** Grounded bilingual synthesis engine with strict prompt-injection sanitization.

---

## 2. Environment Variables Specification

The production environment strictly segregates browser-accessible public keys from server-only secrets. Never commit actual secret values to source control.

| Variable Name | Exposure | Purpose & Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser & Server | Supabase project REST & GraphQL endpoint (`https://<project-ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser & Server | Supabase anonymous public API key, constrained by Row-Level Security. |
| `NEXT_PUBLIC_APP_URL` | Browser & Server | Authoritative canonical URL (e.g., `https://app.leadrescue.ai` or `https://staging.leadrescue.ai`). |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | High-privilege key reserved strictly for administrative cron tasks or migrations. Never expose to client. |
| `WEBHOOK_SIGNING_SECRET` | Server-Only | Shared secret for generating and verifying HMAC SHA-256 signatures on `/api/webhooks/lead-intake`. |

---

## 3. Database Migration Checklist

Database migrations must be applied sequentially in production using Supabase CLI or the Supabase SQL Editor:

1. **Prerequisite Check:** Ensure PostgreSQL 15+ is running with the `pgcrypto` and `uuid-ossp` extensions enabled.
2. **Apply Migration 1 (`20261109000000_stage3_multitenant_foundation.sql`):**
   * Creates `agency_role`, `membership_status` enums.
   * Creates `profiles`, `agencies`, `agency_members`, and `clients` tables.
   * Installs RLS functions: `user_is_agency_member`, `get_user_agency_role`.
   * Enables RLS on all four tables with strict tenant isolation policies.
3. **Apply Migration 2 (`20261110000000_stage4_leads_and_dashboard.sql`):**
   * Creates `lead_status`, `task_priority`, `task_type` enums.
   * Creates `leads`, `follow_up_tasks`, and `lead_activities` tables.
   * Installs performance indexes on `(agency_id, status)`, `(client_id)`, and `(agency_id, created_at)`.
   * Enables RLS and binds foreign key cascading actions.
4. **Verification Step:** Run test query verifying that unauthenticated sessions query 0 rows across all tables.

---

## 4. Rollback & Disaster Recovery Plan

### Automated Backups
* Daily automated snapshot backups provided by Supabase Pro tier (7 to 30 day point-in-time recovery).
* Manual SQL export before executing any structural DDL updates:
  ```bash
  supabase db dump --data-only > backup_pre_migration_$(date +%Y%m%d).sql
  ```

### Rollback Procedure
If a deployment fails or critical data regression occurs:
1. **Application Rollback:** In the Vercel dashboard, instantly redeploy the previous stable build deployment (one-click instant rollback in < 10 seconds).
2. **Database Rollback:** If a migration requires reversal, execute the corresponding down-migration script or restore the snapshot from the point-in-time recovery console.
3. **Emergency Maintenance Window:** Direct traffic to the static `/maintenance.html` splash page if schema surgery is necessary.

---

## 5. Security & Authentication Configuration

* **Redirect URL Whitelisting:**
  * Site URL: `https://app.leadrescue.ai`
  * Redirect URLs:
    * `https://app.leadrescue.ai/auth/callback`
    * `https://app.leadrescue.ai/reset-password`
    * `http://localhost:3000/auth/callback` (Local Development Only)
* **Cookie Security:** Cookies set by `@supabase/ssr` use `HttpOnly`, `Secure`, and `SameSite=Lax` flags.
* **Super Admin Bootstrap:** Super Admin status can only be granted via database direct update:
  ```sql
  UPDATE public.profiles SET is_super_admin = true WHERE email = 'director@leadrescue.ai';
  ```

---

## 6. Pilot Go / No-Go Decision

* **Automated Regression Suite:** 82 / 82 tests passing across 14 test suites in 250ms.
* **Build Status:** 37 static and dynamic Next.js App Router routes compiled cleanly with 0 TypeScript errors.
* **Security Status:** Zero critical or high vulnerabilities.
* **Recommendation:** **GO FOR CONTROLLED PILOT LAUNCH**.
