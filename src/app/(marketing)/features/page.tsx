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
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      archetype: "white",
      icon: Users,
      badge: "Lead Intelligence",
      title: "Lead Organisation & Duplicate Detection",
      subtitle: "Capture, clean, and enrich every client enquiry",
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
      archetype: "lime",
      icon: Building2,
      badge: "Multi-Tenancy",
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
      archetype: "charcoal",
      icon: Kanban,
      badge: "Sales Pipeline",
      title: "Visual Deal Pipeline & Stages",
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
      archetype: "white",
      icon: Clock,
      badge: "SLA Accountability",
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
      archetype: "lime",
      icon: Sparkles,
      badge: "Grounded AI",
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
      archetype: "charcoal",
      icon: BarChart3,
      badge: "Analytics & ROI",
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
    <div className="space-y-24 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2">
          <span className="badge-lime text-xs font-black uppercase tracking-wider">
            Features & Capabilities
          </span>
          <span className="text-xs font-bold text-[#777D77]">Purpose-Built Agency CRM</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#101113] leading-tight">
          The Operating System for Agency Lead Recovery
        </h1>
        <p className="text-base sm:text-lg text-[#202320] font-medium leading-relaxed">
          Every capability in LeadRescue AI is engineered to solve a single problem:
          preventing high-value client enquiries from being forgotten, neglected, or lost.
        </p>
      </div>

      {/* Feature Sections in Tri-Tone Cards */}
      <div className="space-y-10">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          const isLime = feat.archetype === "lime";
          const isCharcoal = feat.archetype === "charcoal";

          return (
            <div
              key={index}
              className={`p-8 sm:p-12 rounded-3xl border-2 border-[#101113] grid grid-cols-1 md:grid-cols-12 gap-10 items-start transition-all ${
                isLime
                  ? "bg-[#B7FF3C] text-[#101113] shadow-[0_6px_0_0_#101113]"
                  : isCharcoal
                  ? "bg-[#17191C] text-white shadow-[0_6px_0_0_#101113]"
                  : "bg-white text-[#202320] shadow-[0_6px_0_0_#101113]"
              }`}
            >
              <div className="md:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${
                      isLime
                        ? "bg-white text-[#101113] border-[#101113]"
                        : isCharcoal
                        ? "bg-[#202327] text-[#B7FF3C] border-[#2A2E33]"
                        : "bg-[#F3F4F2] text-[#101113] border-[#DCDDDA]"
                    }`}
                  >
                    {feat.badge}
                  </span>

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-[#101113] ${
                      isLime
                        ? "bg-[#101113] text-[#B7FF3C]"
                        : isCharcoal
                        ? "bg-[#B7FF3C] text-[#101113]"
                        : "bg-[#17191C] text-[#B7FF3C]"
                    }`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                </div>

                <div>
                  <p
                    className={`text-xs font-extrabold uppercase tracking-wider ${
                      isLime ? "text-[#101113]/80" : isCharcoal ? "text-[#B7FF3C]" : "text-[#777D77]"
                    }`}
                  >
                    {feat.subtitle}
                  </p>
                  <h2
                    className={`text-2xl sm:text-3xl font-black mt-1 leading-snug ${
                      isCharcoal ? "text-white" : "text-[#101113]"
                    }`}
                  >
                    {feat.title}
                  </h2>
                </div>

                <p
                  className={`text-sm leading-relaxed font-medium ${
                    isLime ? "text-[#101113]/90 font-semibold" : isCharcoal ? "text-[#DCDDDA]" : "text-[#777D77]"
                  }`}
                >
                  {feat.description}
                </p>
              </div>

              <div
                className={`md:col-span-6 p-6 sm:p-8 rounded-2xl border-2 border-[#101113] ${
                  isLime
                    ? "bg-white text-[#101113]"
                    : isCharcoal
                    ? "bg-[#202327] text-white border-[#2A2E33]"
                    : "bg-[#F3F4F2] text-[#202320]"
                }`}
              >
                <h4
                  className={`text-xs font-black uppercase tracking-wider pb-3 border-b border-current/15 ${
                    isCharcoal ? "text-[#B7FF3C]" : "text-[#101113]"
                  }`}
                >
                  Key Capabilities
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
                  {feat.highlights.map((highlight, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2.5 text-xs font-bold leading-snug">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 border ${
                          isCharcoal
                            ? "bg-[#B7FF3C] text-[#101113] border-[#B7FF3C]"
                            : "bg-[#101113] text-[#B7FF3C] border-[#101113]"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Box in Lime */}
      <div className="card-lime p-8 sm:p-14 text-center space-y-6">
        <span className="badge-dark text-xs uppercase tracking-wider">
          Ready to scale client conversions?
        </span>
        <h2 className="text-3xl sm:text-5xl font-black text-[#101113] tracking-tight">
          Experience LeadRescue AI in your agency today
        </h2>
        <p className="text-sm sm:text-base text-[#101113]/90 font-bold max-w-xl mx-auto">
          Start your 14-day free trial with full access to client workspaces, pipeline tracking,
          and grounded AI follow-up drafting.
        </p>
        <div className="pt-2 flex justify-center">
          <Link
            href="/signup"
            className="btn-base btn-primary text-xs font-black px-8 h-12 shadow-[0_4px_0_0_#101113]"
          >
            <span>Start Free 14-Day Trial</span>
            <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
