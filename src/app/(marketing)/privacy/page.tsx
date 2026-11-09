import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-16 px-4 sm:px-6 max-w-3xl mx-auto space-y-8 text-xs text-slate-600 leading-relaxed">
      <div className="space-y-2 pb-6 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-slate-500">
          Last revised: November 2026 • LeadRescue AI
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          1. Data Ownership & Multi-Tenant Isolation
        </h2>
        <p>
          LeadRescue AI acts strictly as a data processor on behalf of our subscriber agencies. You retain complete ownership of all client records, lead names, phone numbers, campaign metrics, and interaction histories submitted to our platform.
        </p>
        <p>
          All subscriber data is isolated at the database layer using PostgreSQL Row-Level Security (RLS). No agency or unauthorized client can view or query data outside their explicit tenant boundaries.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          2. Grounded AI & Data Usage
        </h2>
        <p>
          LeadRescue AI utilizes large language models to assist agency users with draft summaries and personalised follow-ups. In accordance with our principles:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your proprietary lead notes and conversations are never sold to third parties or used to train public foundation models.</li>
          <li>All generation runs through secured server-side endpoints with ephemeral context injection.</li>
          <li>AI will never dispatch autonomous communications without explicit human review and approval.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          3. Information We Collect
        </h2>
        <p>
          We collect agency account details (agency name, admin email, password hash), payment transaction references for manual Pakistani bank reviews, and technical logs required for system security, rate limiting, and audit trails.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          4. Data Retention & Deletion
        </h2>
        <p>
          Agencies may request complete export or permanent deletion of their workspaces and client databases at any time by contacting support@leadrescue.ai.
        </p>
      </section>
    </div>
  );
}
