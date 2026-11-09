import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 text-xs text-slate-600 leading-relaxed">
      <div className="space-y-2 pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Terms of Service
        </h1>
        <p className="text-slate-500">
          Last revised: November 2026 • LeadRescue AI
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. Acceptance of Terms
        </h2>
        <p>
          By creating an agency workspace on LeadRescue AI, you agree to comply with and be bound by these Terms of Service. If you are entering into these terms on behalf of a company or agency, you warrant that you have full authority to bind the entity.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          2. Subscription & Pakistani Manual Bank Payments
        </h2>
        <p>
          LeadRescue AI offers monthly subscription tiers priced in Pakistani Rupees (PKR): Starter (PKR 2,999/mo), Growth (PKR 6,999/mo), and Advanced (PKR 14,999/mo).
        </p>
        <p>
          For manual bank transfers (IBFT, Meezan, HBL) or mobile wallet payments (JazzCash/Easypaisa), activation occurs upon administrative receipt and manual verification of your transaction reference and deposit slip.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          3. Prohibited Usage & Anti-Spam
        </h2>
        <p>
          Agencies may only import and process enquiries for which lawful consent has been obtained. The use of LeadRescue AI for automated bulk scraping, unsolicited spamming, deceptive impersonation, or unauthorized robocalling is strictly prohibited and results in immediate account termination.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          4. Service Availability & Limitation of Liability
        </h2>
        <p>
          While we strive for continuous 99.9% availability, LeadRescue AI is provided on an &quot;as-is&quot; and &quot;as-available&quot; basis during pilot phases. We are not liable for lost conversion profits or indirect damages arising from third-party telecommunication or internet outages.
        </p>
      </section>
    </div>
  );
}
