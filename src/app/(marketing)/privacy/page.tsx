import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-16 px-4 sm:px-8 max-w-4xl mx-auto space-y-12">
      <div className="space-y-3 pb-8 border-b-2 border-[#101113]">
        <div className="inline-flex items-center gap-2">
          <span className="badge-lime text-xs font-black uppercase tracking-wider">
            Legal & Security
          </span>
          <span className="text-xs font-bold text-[#777D77]">Data Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[#101113] tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#777D77] font-semibold">
          Last revised: November 2026 • LeadRescue AI Platform
        </p>
      </div>

      <div className="card-white p-8 sm:p-12 space-y-8 text-sm text-[#202320] leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-black text-[#101113] uppercase tracking-wide">
            1. Data Ownership & Multi-Tenant Isolation
          </h2>
          <p className="font-medium text-[#777D77]">
            LeadRescue AI acts strictly as a data processor on behalf of our subscriber agencies. You retain complete ownership of all client records, lead names, phone numbers, campaign metrics, and interaction histories submitted to our platform.
          </p>
          <p className="font-medium text-[#777D77]">
            All subscriber data is isolated at the database layer using PostgreSQL Row-Level Security (RLS). No agency or unauthorized client can view or query data outside their explicit tenant boundaries.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t-2 border-[#DCDDDA]">
          <h2 className="text-lg font-black text-[#101113] uppercase tracking-wide">
            2. Grounded AI & Anti-Hallucination Guardrails
          </h2>
          <p className="font-medium text-[#777D77]">
            LeadRescue AI utilizes fine-tuned large language models to assist agency users with draft summaries and personalised follow-ups. In accordance with our principles:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs font-bold text-[#202320]">
            <li>Your proprietary lead notes and client conversations are never sold to third parties or used to train public foundation models.</li>
            <li>All generation runs through secured server-side endpoints with ephemeral context injection.</li>
            <li>AI will never dispatch autonomous communications without explicit human review and approval.</li>
          </ul>
        </section>

        <section className="space-y-3 pt-6 border-t-2 border-[#DCDDDA]">
          <h2 className="text-lg font-black text-[#101113] uppercase tracking-wide">
            3. Information We Collect
          </h2>
          <p className="font-medium text-[#777D77]">
            We collect agency account details (agency name, admin email, password hash), payment transaction references for manual Pakistani bank reviews, and technical logs required for system security, rate limiting, and audit trails.
          </p>
        </section>

        <section className="space-y-3 pt-6 border-t-2 border-[#DCDDDA]">
          <h2 className="text-lg font-black text-[#101113] uppercase tracking-wide">
            4. Contact & Compliance
          </h2>
          <p className="font-medium text-[#777D77]">
            For data privacy inquiries, sub-processor lists, or right-to-be-forgotten requests, please contact privacy@leadrescue.ai.
          </p>
        </section>
      </div>
    </div>
  );
}
