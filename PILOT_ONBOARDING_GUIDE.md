# LeadRescue AI — Pilot Agency Onboarding Guide

**Tagline:** Every Lead Deserves a Follow-Up.  
**Target Audience:** Pakistani Digital Marketing Agencies Managing Multi-Client Lead Recovery  
**Deployment Stage:** Stage 17 Controlled Pilot  

---

## 1. Welcome to the LeadRescue AI Pilot

LeadRescue AI is designed specifically to eliminate neglected prospect inquiries, enforce strict follow-up response SLAs, and maximize lead conversion for digital marketing agencies running paid campaigns (Meta Lead Ads, Google Ads, TikTok, Website Forms) across Pakistan.

This guide provides a structured, 9-step onboarding runbook for your pilot launch.

---

## 2. Step-by-Step Pilot Onboarding Runbook

```mermaid
flowchart LR
    A["1. Create Agency Workspace"] --> B["2. Add Brand Client"]
    B --> C["3. Import Leads via CSV"]
    C --> D["4. Invite Team & Assign Roles"]
    D --> E["5. Follow-Up SLAs & WhatsApp"]
    E --> F["6. AI Grounded Follow-Ups"]
    F --> G["7. Share Client Portal"]
    G --> H["8. Track ROI & Reports"]
    H --> I["9. Submit Feedback"]
```

### Step 1: Create Your Agency Workspace
1. Navigate to `/signup` and create your account with your professional agency email.
2. Complete the 5-step onboarding wizard at `/app/onboarding`:
   * **Agency Name:** e.g., *Apex Media Pakistan*
   * **Workspace Slug:** Unique identifier (e.g., `apex-media-pk`)
   * **Timezone:** Standardized on `Asia/Karachi` (PKT, UTC+5) to eliminate nighttime reminder mistakes.
   * **Language Preference:** Select English or Urdu (RTL).

### Step 2: Add Your First Brand Client Workspace
1. In the sidebar, select **Clients** (`/app/clients`).
2. Click **Add Client Workspace** and enter your client's details (e.g., *Horizon Retailers*).
3. Set their commercial industry (e.g., *Retail & Apparel*, *Real Estate*, *Healthcare*).

### Step 3: Ingest a Small, Consent-Appropriate Lead Dataset
1. Open the created client workspace and click **Import Leads (CSV)**.
2. Upload a sample CSV file containing recent inquiries.
3. Map columns to verified database fields:
   * **Contact Name** *(Required)*
   * **Phone Number** *(Required for WhatsApp follow-ups, formatted with +92)*
   * **Email Address**
   * **Marketing Source** (e.g., `Meta Lead Ads`, `Google Ads`)
   * **Expected Deal Value in PKR**
4. Review duplicate detection: identical phone numbers or emails within the same client workspace are flagged automatically.

### Step 4: Invite Team Members & Configure RBAC
1. Go to **Team Members** (`/app/team`).
2. Invite your campaign managers and sales representatives using their corporate emails.
3. Assign appropriate least-privilege roles:
   * **Manager:** Manages client workspaces, assigns leads, and tracks follow-up SLAs.
   * **Sales Representative:** Claims leads, conducts phone/WhatsApp outreach, and generates AI follow-up drafts.
   * **Viewer:** Read-only access for external audit or junior interns.

### Step 5: Enforce Follow-Up SLAs & WhatsApp Outreach
1. Navigate to **Follow-Up Tasks** (`/app/follow-ups`).
2. Review categorized tabs: `Overdue`, `Due Today`, `Upcoming`, `Completed`, `Snoozed`.
3. Open an inquiry card and click **Open WhatsApp**.
4. The system launches the verified WhatsApp Web link (`https://wa.me/<phone>`), allowing your sales representative to review the message before hitting send.

### Step 6: Generate Grounded Bilingual AI Sales Drafts
1. Go to **AI Sales Assistant** (`/app/ai-assistant`).
2. Select an inquiry and your desired tone (*Professional*, *Friendly*, *Concise*).
3. Choose the output language:
   * **English:** For corporate B2B inquiries.
   * **Urdu:** For domestic retail and direct consumer inquiries (`السلام علیکم`).
4. Review the grounded synthesis:
   * The AI uses **only** verified database attributes.
   * Any missing information (e.g., unconfirmed budget) is flagged in the *Missing Context* warning block.
   * Prompt injections in customer notes are neutralized automatically.

### Step 7: Grant Client Access via the Client Portal
1. Direct your brand client's marketing manager to `/portal/dashboard`.
2. Clients see **only** their verified inquiries and conversion statistics.
3. Internal agency profit margins and private sales notes are permanently stripped server-side.

### Step 8: Review Attribution & Export Auditable Reports
1. Navigate to **Reports & Analytics** (`/app/reports`).
2. Review the four core KPI formulas: Contact Rate, Qualification Rate, Follow-Up SLA Completion Rate, and Won Conversion Rate.
3. Click **Export All Reports (CSV)** to generate an executive spreadsheet for monthly client meetings.

### Step 9: Collect Pilot Feedback
Submit observations, edge cases, and feature requests directly to the engineering team via `/contact` or WhatsApp support at `+92 300 1234567`.

---

## 3. Pakistan Manual Bank Transfer (IBFT) Workflow

To accommodate Pakistani business banking practices, LeadRescue AI supports direct manual Inter-Bank Fund Transfers:
* **Meezan Bank Limited:** Corporate Account Title: `LeadRescue AI Pakistan Pvt Ltd` &bull; IBAN: `PK36MEZN00012345678901`
* **Habib Bank Limited (HBL):** Corporate Account Title: `LeadRescue AI Pakistan Pvt Ltd` &bull; IBAN: `PK82HABB00098765432101`

After initiating the IBFT transfer, submit your deposit reference (UTR/RRN) at `/app/billing`. A platform administrator will reconcile the bank statement and activate your tier entitlements within 2 business hours.

---

## 4. Known Limitations During Pilot Phase

1. **WhatsApp Official Cloud API:** Fully self-service Cloud API requires a Meta Business Manager account with business verification. Until completed, the native WhatsApp click-to-chat action (`https://wa.me/`) is the recommended path.
2. **Bank Transfer Reconciliation:** IBFT submissions require manual confirmation against bank portal statements.
3. **AI Grounded Limits:** The AI assistant will decline to fabricate pricing commitments or discounts if they are not explicitly recorded in the lead snapshot.
