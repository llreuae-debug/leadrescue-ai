import React from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Kanban,
  Clock,
  Sparkles,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Users,
      title: "Lead Organisation & Duplicate Detection",
      subtitle: "Capture, clean, and enrich every enquiry",
      description:
        "Every lead is stored with comprehensive context: source campaign, phone, email, assigned representative, status, deal value, and full interaction timeline. Automated duplicate detection flags repeated enquiries so your team can review before merging.",
      highlights: [
        "Searchable lead index by name, phone, or email",
        "Source attribution (Meta Ads, Google, Website, CSV)",
        "Pre-import CSV mapping and row-level validation",
        "Chronological activity and note timeline",
      ],
    },
    {
      icon: Building2,
      title: "Dedicated Client Workspaces",
      subtitle: "Database-level multi-tenant isolation",
      description:
        "Digital marketing agencies manage multiple clients simultaneously. LeadRescue AI establishes secure boundaries for each client brand so campaigns, pipelines, and leads never leak across client accounts.",
      highlights: [
        "PostgreSQL Row-Level Security (RLS) data isolation",
        "Assigned account managers and reps per client",
        "Client-specific follow-up SLAs and settings",
        "Isolated analytics and export capabilities",
      ],
    },
    {
      icon: Kanban,
      title: "Visual Sales Pipeline",
      subtitle: "Track progress from New to Won",
      description:
        "An intuitive, Linear-style Kanban board gives your account team instant visual clarity over deal velocity. Move leads across standardized stages: New, Contacted, Qualified, Follow-up Required, Proposal Sent, Won, and Lost.",
      highlights: [
        "Accessible keyboard controls alongside drag-and-drop",
        "Configurable loss reasons to diagnose leakage",
        "Audit trail recording who modified lead stages",
        "Real-time pipeline value and conversion metrics",
      ],
    },
    {
      icon: Clock,
      title: "Follow-Up Task Accountability",
      subtitle: "Zero neglected opportunities",
      description:
        "Enquiries slip through the cracks when follow-up dates are not assigned. LeadRescue AI creates strict follow-up accountability with views for Today, Overdue, and Snoozed, calculated against the agency's local timezone.",
      highlights: [
        "Timezone-accurate due date and SLA calculations",
        "Quick completion, reschedule, and snooze triggers",
        "Overdue warnings highlighted on executive dashboards",
        "History log tracking follow-up attempts and notes",
      ],
    },
    {
      icon: Sparkles,
      title: "Grounded AI Message Drafting",
      subtitle: "Contextual WhatsApp & Email assistance",
      description:
        "Our AI sales assistant reviews recorded lead notes and previous exchanges to craft personalized, objection-handling follow-up drafts. Operates in professional English or natural Urdu with strict human-in-the-loop review.",
      highlights: [
        "Strictly grounded in database facts (no hallucinations)",
        "English and Urdu (Nastaliq/Naskh) output support",
        "Tone selection: Professional, Friendly, or Concise",
        "Human review required before message dispatch",
      ],
    },
    {
      icon: BarChart3,
      title: "Agency & Team Reporting",
      subtitle: "Transparent conversion metrics",
      description:
        "Understand exactly how effectively your agency handles leads. Documented metrics define contact rate, qualification rate, and follow-up completion percentages, allowing agencies to prove ROI to clients with verifiable data.",
      highlights: [
        "Documented calculation formulas for all KPIs",
        "Lead source performance and conversion rates",
        "Rep activity and follow-up SLA adherence",
        "One-click CSV exports scoped to authorized records",
      ],
    },
  ];

  return (
    <div className="space-y-20 py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <span>Complete Feature Guide</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          The Purpose-Built Operating System for Agency Lead Recovery
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Every capability in LeadRescue AI is designed to solve a single problem:
          preventing client enquiries from being forgotten, neglected, or lost.
        </p>
      </div>

      {/* Feature Sections */}
      <div className="space-y-12">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          return (
            <div
              key={index}
              className="linear-card p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
            >
              <div className="md:col-span-5 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {feat.subtitle}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {feat.title}
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>

              <div className="md:col-span-7 bg-slate-50/75 rounded-xl border border-slate-200/80 p-6 space-y-3">
                <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
                  Key Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {feat.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box */}
      <div className="rounded-2xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-5">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Experience LeadRescue AI in your agency today
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Start your 14-day trial with full access to client workspaces, pipeline tracking,
          and grounded AI follow-up drafting.
        </p>
        <div className="pt-2">
          <Link
            href="/signup"
            className="btn-base bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-6 shadow-md h-10"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
