import React from "react";
import Link from "next/link";
import { PLANS, PRICING_DISCLAIMER } from "@/config/plans";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Kanban,
  Building2,
  Users,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  FileSpreadsheet,
} from "lucide-react";

export default function HomePage() {
  const faqs = [
    {
      q: "How does LeadRescue AI differ from generic CRMs?",
      a: "Generic CRMs are bloated databases. LeadRescue AI is laser-focused on the neglected lead problem: ensuring every inbound enquiry is assigned, tracked against SLA deadlines, and followed up with grounded, personalized AI drafts.",
    },
    {
      q: "Can we isolate data between different client brands?",
      a: "Yes. Every client workspace is isolated at the database level with PostgreSQL Row-Level Security (RLS). Team members only see the clients and leads they are assigned to.",
    },
    {
      q: "Does the AI send WhatsApp messages automatically?",
      a: "No. In accordance with our safety and consent guidelines, AI drafts messages for human review. Representatives can review, refine, and approve messages before dispatch.",
    },
    {
      q: "How do payments work for agencies in Pakistan?",
      a: "We support direct Pakistani bank transfers, JazzCash/Easypaisa manual slip verification with instant activation upon admin review, as well as recurring monthly billing.",
    },
    {
      q: "Does LeadRescue AI support Urdu follow-ups?",
      a: "Yes. Our AI sales assistant crafts both professional English and natural Urdu follow-up messages tailored to Pakistani buyer nuances.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="pt-16 sm:pt-24 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Designed for Digital Marketing & Performance Agencies</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
          Every Lead Deserves a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Follow-Up.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Stop losing valuable enquiries. Let AI help your agency organise leads,
          follow up faster, and convert more opportunities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/signup"
            className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6 shadow-md shadow-blue-600/20 h-11"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="btn-base bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-semibold px-6 h-11"
          >
            <span>See How It Works</span>
          </a>
        </div>

        <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            14-day free trial
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Pakistani PKR billing
          </span>
        </div>
      </section>

      {/* 2. THE LEAD LEAKAGE PROBLEM */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 text-white">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>The Agency Growth Bottleneck</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
              You spend millions generating ad clicks. 42% of leads are never contacted twice.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              When campaign leads arrive across WhatsApp, Meta Lead Ads, and spreadsheets, agency reps lose track.
              Without accountability and immediate contextual follow-up, client ROI drops and agency churn increases.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-800">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 tabular-nums">71%</div>
              <p className="text-xs text-slate-300 font-medium">Of buyers choose the vendor that responds first</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums">4.8 Days</div>
              <p className="text-xs text-slate-300 font-medium">Average delayed follow-up across manual agency sheets</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 tabular-nums">3.4x</div>
              <p className="text-xs text-slate-300 font-medium">Conversion lift when follow-ups happen within 15 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW LEADRESCUE AI WORKS */}
      <section id="how-it-works" className="px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            How LeadRescue AI Rescues Your Sales Pipeline
          </h2>
          <p className="text-sm text-slate-600">
            Three simple steps to transition your agency from disorganized spreadsheets to disciplined follow-up machines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="linear-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-base font-bold text-slate-900">Centralize & Isolate</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Import leads via CSV or webhooks into dedicated client workspaces. Ensure each client’s data is secure and separated.
            </p>
          </div>

          <div className="linear-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-base font-bold text-slate-900">AI Context & Drafting</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our AI reviews lead details and previous notes to craft grounded, personalized WhatsApp and email drafts in English or Urdu.
            </p>
          </div>

          <div className="linear-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-base font-bold text-slate-900">Enforce Follow-up SLA</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every lead has a mandatory owner and due date. Overdue alerts prevent any enquiry from being forgotten.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CORE FEATURES */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Engineered Specifically for Agency Workflows
          </h2>
          <p className="text-sm text-slate-600">
            Built without bloated CRM gimmicks. Every tool directly drives follow-up accountability and client revenue.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="linear-card p-5 space-y-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Multi-Client Workspaces</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Maintain completely separate lead databases, custom pipelines, and assigned account managers for each brand you manage.
            </p>
          </div>

          <div className="linear-card p-5 space-y-2">
            <Kanban className="w-5 h-5 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">Visual Sales Pipeline</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Linear-inspired Kanban boards with instant stage updates, audit history, and keyboard shortcuts.
            </p>
          </div>

          <div className="linear-card p-5 space-y-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">Follow-Up Accountability</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Track tasks categorized into Today, Overdue, and Snoozed with timezone-aware due calculations.
            </p>
          </div>

          <div className="linear-card p-5 space-y-2">
            <Sparkles className="w-5 h-5 text-violet-600" />
            <h4 className="text-sm font-bold text-slate-900">Grounded AI Drafts</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generates objection-handling responses and personalised follow-ups without hallucinating unverified facts.
            </p>
          </div>

          <div className="linear-card p-5 space-y-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">Smart CSV Import & Mapping</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Map campaign columns effortlessly, review rows before writing, and detect duplicate prospects automatically.
            </p>
          </div>

          <div className="linear-card p-5 space-y-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Role-Based Team Control</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Owners, Admins, Managers, and Sales Reps with strictly enforced database policies and audit trails.
            </p>
          </div>
        </div>
      </section>

      {/* 5. PRICING PREVIEW */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            <span>Transparent Pricing in PKR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Simple, Predictable Agency Subscriptions
          </h2>
          <p className="text-xs text-slate-500">
            {PRICING_DISCLAIMER}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`linear-card p-6 flex flex-col justify-between relative ${
                plan.isPopular ? "border-blue-500 ring-2 ring-blue-500/10 shadow-lg" : ""
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-xs">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[32px]">{plan.tagline}</p>

                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 tabular-nums">
                    {formatCurrencyPKR(plan.pricePKR)}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">/{plan.period}</span>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5 text-xs">
                  {plan.features.slice(0, 6).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className={feat.highlight ? "font-semibold text-slate-900" : "text-slate-600"}>
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <Link
                  href="/signup"
                  className={`btn-base w-full text-xs font-semibold shadow-xs ${
                    plan.isPopular
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-slate-900 hover:bg-slate-800 text-white"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            <span>Compare full plan limits and feature matrices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about LeadRescue AI and Pakistani agency rollout.
          </p>
        </div>

        <div className="divide-y divide-slate-200 border-y border-slate-200">
          {faqs.map((faq, i) => (
            <div key={i} className="py-5 space-y-2">
              <h3 className="text-sm font-semibold text-slate-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-14 text-white shadow-xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Ready to stop losing client leads?
          </h2>
          <p className="text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Join forward-thinking agencies across Pakistan who use LeadRescue AI
            to enforce follow-up accountability and double their sales conversion.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/signup"
              className="btn-base bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold px-6 shadow-md h-11"
            >
              <span>Start Free 14-Day Trial</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
            <Link
              href="/contact"
              className="btn-base bg-blue-700/60 hover:bg-blue-700 text-white border border-blue-400/40 text-xs font-semibold px-6 h-11"
            >
              <span>Schedule Agency Demo</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
