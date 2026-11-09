"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PLANS, PRICING_DISCLAIMER } from "@/config/plans";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  Kanban,
  Building2,
  Users,
  ShieldCheck,
  ChevronRight,
  Plus,
  Minus,
  MessageSquare,
  Bot,
  Zap,
  Target,
  BarChart3,
  Flame,
  Check,
} from "lucide-react";

export default function HomePage() {
  // Accordion state for Lead Recovery Process
  const [openProcess, setOpenProcess] = useState<number | null>(0);

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Testimonials state
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const workflowSteps = [
    {
      num: "01",
      title: "Omnichannel Lead Ingestion & Database Isolation",
      summary: "Connect Meta Lead Ads, WhatsApp Cloud API, and website forms directly into dedicated client sub-accounts.",
      details: "Every inbound enquiry is instantly validated, de-duplicated, and mapped to the assigned client brand with PostgreSQL Row-Level Security isolation. Zero spreadsheet leaks.",
    },
    {
      num: "02",
      title: "Instant SLA Assignment & Accountability Timers",
      summary: "Enforce a strict 15-minute response SLA with automatic rep allocation and escalating overdue alerts.",
      details: "Designate account owners, set custom working hours for Pakistani and MENA timezones, and display clear Today vs Overdue task badges so no lead goes cold.",
    },
    {
      num: "03",
      title: "Grounded AI Sales Drafting (English & Urdu)",
      summary: "AI generates personalized, objection-handling WhatsApp messages for human sales rep approval.",
      details: "Trained on proven high-converting Pakistani sales nuance. The engine synthesizes verified facts only, completely eliminating hallucinations and brand misrepresentations.",
    },
    {
      num: "04",
      title: "Pipeline Drag-and-Drop & Won Deal Attribution",
      summary: "Track prospect stages visually from New to Won with deal values and loss-reason post-mortems.",
      details: "Understand which ad creative and campaigns generate real revenue, not just clicks. Export client-ready attribution reports with a single click.",
    },
    {
      num: "05",
      title: "Client Portal Transparency & Agency Retention",
      summary: "Provide clients with real-time, co-branded dashboards displaying recovered leads and response speed.",
      details: "Stop answering 'where did my leads go?' Prove your agency's ROI every day with client-safe read-only portal access that hides internal agency margins.",
    },
  ];

  const services = [
    {
      archetype: "lime",
      tag: "WhatsApp Automation",
      title: "Automated WhatsApp Follow-Ups",
      desc: "Connect directly to the WhatsApp Cloud API. Send timely follow-up drafts and template notifications with 98% open rates.",
      actionLabel: "Learn more",
      href: "/features",
      icon: MessageSquare,
    },
    {
      archetype: "white",
      tag: "Multi-Tenant CRM",
      title: "Multi-Client Account Cockpits",
      desc: "Isolate client brands into distinct workspaces with dedicated pipelines, custom fields, and separate team permissions.",
      actionLabel: "Explore workspaces",
      href: "/features",
      icon: Building2,
    },
    {
      archetype: "charcoal",
      tag: "Bilingual AI",
      title: "AI Sales Copilot (English & Urdu)",
      desc: "Empower reps with grounded message generation tailored to Pakistani market subtleties, pricing questions, and objections.",
      actionLabel: "Try AI Assistant",
      href: "/app/ai-assistant",
      icon: Bot,
    },
    {
      archetype: "white",
      tag: "Pipeline Kanban",
      title: "Visual Deal Pipeline & SLAs",
      desc: "Track every opportunity from New to Won with mandatory follow-up deadlines, loss reason logging, and weighted deal totals.",
      actionLabel: "View pipeline",
      href: "/app/pipeline",
      icon: Kanban,
    },
    {
      archetype: "lime",
      tag: "Lead Intake",
      title: "Smart Webhook & CSV Importer",
      desc: "Effortlessly ingest Meta Lead Ads, TikTok leads, or bulk CSV sheets with smart column auto-mapping and zero duplicates.",
      actionLabel: "See intake tools",
      href: "/features",
      icon: Zap,
    },
    {
      archetype: "charcoal",
      tag: "Client Portals",
      title: "Co-Branded Client Portals",
      desc: "Provide clients their own branded view of lead volumes and conversion velocity without revealing internal agency margins.",
      actionLabel: "Preview portal",
      href: "/portal/dashboard",
      icon: Target,
    },
  ];

  const testimonials = [
    {
      quote: "LeadRescue AI saved our agency from losing 30-40% of campaign enquiries. Our client close rates jumped by 2.4x in the first month because reps actually follow up within 15 minutes now.",
      author: "Hamza Tariq",
      role: "Managing Director, HyperScale Media (Lahore)",
    },
    {
      quote: "The Urdu AI assistant is genuinely unmatched. Pakistani buyers respond far better to natural Urdu audio-text etiquette than stiff corporate English. Our WhatsApp conversions doubled.",
      author: "Ayesha Malik",
      role: "Head of Growth, Zenith Performance (Karachi)",
    },
    {
      quote: "Giving our e-commerce clients read-only access to their portal eliminated 80% of our weekly update calls. They see real-time pipeline velocity and know we're converting their ad spend.",
      author: "Saad Sheikh",
      role: "Founder, Apex Commerce Agency (Islamabad)",
    },
  ];

  const faqs = [
    {
      q: "How does LeadRescue AI differ from generic CRMs like HubSpot or Salesforce?",
      a: "Generic CRMs are bloated databases designed for enterprise sales reps. LeadRescue AI is laser-engineered for performance agencies managing multiple brands: automated client data isolation, strict 15-minute follow-up SLAs, and grounded bilingual AI message drafts for WhatsApp.",
    },
    {
      q: "Can team members from Client A see leads from Client B?",
      a: "Never. Every client workspace is isolated at the database level with PostgreSQL Row-Level Security (RLS). Team members only see the clients and leads they are explicitly assigned to, guaranteeing confidentiality.",
    },
    {
      q: "Does the AI send messages automatically without my team seeing them?",
      a: "No. LeadRescue AI strictly enforces a human-in-the-loop review principle. The AI analyzes the lead's history and prepares a customized, grounded WhatsApp response; your sales representative reviews and approves it before dispatch.",
    },
    {
      q: "How does local Pakistani billing (PKR) and IBFT payment work?",
      a: "We support direct Pakistani bank transfers (Meezan, HBL, Alfalah) with instant receipt review, as well as recurring monthly billing. You will never get blocked by international card decline issues.",
    },
    {
      q: "How fast can an agency onboard 5 client brands and start receiving leads?",
      a: "Under 10 minutes. Create your agency workspace, add your client brands, connect webhooks or upload a CSV file, and your reps can immediately start working their follow-up queues.",
    },
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      {/* 1. LARGE EDITORIAL HERO SECTION */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div className="inline-flex items-center gap-2.5">
              <span className="badge-lime text-xs font-black uppercase tracking-wider">
                Digital Agency Platform
              </span>
              <span className="text-xs font-bold text-[#777D77]">
                Pakistani & MENA Inbound Recovery
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#101113] leading-[1.06]">
              Every Lead Deserves a{" "}
              <span className="inline-block bg-[#B7FF3C] text-[#101113] px-3 py-1 rounded-2xl transform -rotate-1 border-2 border-[#101113] shadow-[0_4px_0_0_#101113]">
                Follow-Up.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-[#202320] max-w-xl font-medium leading-relaxed">
              Stop losing valuable enquiries. Let AI help your agency organise client leads,
              follow up faster on WhatsApp, and double client conversion rates.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/signup"
                className="btn-base btn-primary h-14 px-8 text-sm font-extrabold shadow-[0_4px_0_0_#101113] hover:shadow-[0_6px_0_0_#101113]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
              </Link>

              <a
                href="#how-it-works"
                className="btn-base btn-secondary h-14 px-8 text-sm font-extrabold border-2 border-[#101113] shadow-[0_3px_0_0_#101113]"
              >
                <span>See How It Works</span>
              </a>
            </div>

            {/* Proof checkmarks */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-[#777D77] font-bold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] stroke-[2.5]" />
                14-Day Free Agency Trial
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] stroke-[2.5]" />
                No Credit Card Required
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] stroke-[2.5]" />
                PKR Bank Transfer (IBFT)
              </span>
            </div>
          </div>

          {/* Right Hero Visual (Neo-minimalist Agency Megaphone Motif) */}
          <div className="lg:col-span-5 relative">
            <div className="card-white p-8 relative overflow-hidden bg-gradient-to-br from-white to-[#F3F4F2]">
              <div className="flex items-center justify-between pb-6 border-b-2 border-[#101113]">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-[#101113]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-[#101113]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#B7FF3C] border border-[#101113]" />
                </div>
                <span className="text-[11px] font-black text-[#101113] uppercase tracking-wider bg-[#B7FF3C] px-2 py-0.5 rounded border border-[#101113]">
                  Live Rescue Feed
                </span>
              </div>

              {/* Floating Hero Metric Cards */}
              <div className="space-y-4 py-6">
                <div className="rounded-2xl border-2 border-[#101113] bg-white p-4 shadow-[0_3px_0_0_#101113] flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-bold uppercase text-[#777D77]">Meta Ad Lead</p>
                    <p className="text-sm font-extrabold text-[#101113]">Zainab Khan • Real Estate</p>
                    <p className="text-xs text-[#16A34A] font-bold mt-0.5">Contacted in 4 mins</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#B7FF3C] border border-[#101113] flex items-center justify-center font-bold text-xs">
                    WON
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#101113] bg-[#17191C] text-white p-4 shadow-[0_3px_0_0_#101113] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="badge-lime text-[10px] py-0 px-1.5">Urdu AI Draft</span>
                      <p className="text-[11px] font-bold text-[#DCDDDA]">WhatsApp Review</p>
                    </div>
                    <p className="text-xs font-medium text-[#DCDDDA] mt-1.5 italic">
                      &quot;السلام علیکم زینب صاحبہ! آپ کا انکوائری نوٹ موصول ہوا...&quot;
                    </p>
                  </div>
                  <div className="circle-badge-lime shrink-0">
                    <ArrowUpRight className="w-5 h-5 text-[#101113]" />
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#101113] bg-[#F3F4F2] p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#101113] text-[#B7FF3C] flex items-center justify-center font-black">
                      3.4x
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-[#101113]">Agency Conversion Lift</p>
                      <p className="text-[10px] text-[#777D77]">Enforced 15-minute follow-up timer</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-[#101113] flex items-center justify-between text-xs font-bold text-[#101113]">
                <span>Active Workspaces: 14 Clients</span>
                <span className="text-[#16A34A]">99.8% SLA Met</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LOGO CLOUD STRIP */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="pt-8 pb-8 border-y-2 border-[#DCDDDA] flex flex-wrap items-center justify-between gap-8 text-[#777D77] font-black text-sm uppercase tracking-widest opacity-80">
          <span className="hover:text-[#101113] transition-colors">Meta Lead Ads</span>
          <span className="hover:text-[#101113] transition-colors">WhatsApp Cloud</span>
          <span className="hover:text-[#101113] transition-colors">Google Ads</span>
          <span className="hover:text-[#101113] transition-colors">TikTok Lead Gen</span>
          <span className="hover:text-[#101113] transition-colors">Zapier Webhooks</span>
          <span className="hover:text-[#101113] transition-colors">HubSpot Bridge</span>
        </div>
      </section>

      {/* 3. THE LEAD LEAKAGE PROBLEM SECTION (HIGH-CONTRAST CHARCOAL) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="card-charcoal p-8 sm:p-14 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block">
                <span className="badge-lime text-xs uppercase tracking-wider">
                  The Agency Revenue Leak
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                You spend millions driving paid traffic. <br />
                <span className="text-[#B7FF3C]">42% of leads are never followed up twice.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#DCDDDA] max-w-xl font-medium leading-relaxed">
                When ad campaign enquiries arrive across fragmented spreadsheets, WhatsApp personal chats,
                and scattered inboxes, agency reps lose track. Without automated SLA accountability and immediate
                contextual messaging, client ad ROI drops and clients cancel their retainers.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-4">
              <div className="bg-[#202327] border-2 border-[#2A2E33] rounded-2xl p-5 shadow-sm">
                <div className="text-3xl sm:text-4xl font-black text-rose-400 tabular-nums">71%</div>
                <p className="text-xs font-bold text-white mt-1">Of buyers choose the agency that replies first</p>
                <p className="text-[11px] text-[#777D77] mt-0.5">Speed-to-lead is the single biggest conversion lever.</p>
              </div>

              <div className="bg-[#202327] border-2 border-[#2A2E33] rounded-2xl p-5 shadow-sm">
                <div className="text-3xl sm:text-4xl font-black text-amber-400 tabular-nums">4.8 Days</div>
                <p className="text-xs font-bold text-white mt-1">Average delayed follow-up on manual agency sheets</p>
                <p className="text-[11px] text-[#777D77] mt-0.5">By then, the prospect has signed with a rival.</p>
              </div>

              <div className="bg-[#202327] border-2 border-[#2A2E33] rounded-2xl p-5 shadow-sm">
                <div className="text-3xl sm:text-4xl font-black text-[#B7FF3C] tabular-nums">+138%</div>
                <p className="text-xs font-bold text-white mt-1">Average conversion increase with LeadRescue AI</p>
                <p className="text-[11px] text-[#777D77] mt-0.5">Enforced accountability transforms agency retainers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SERVICES & FEATURE CARDS (ASYMMETRIC GRID INSPIRATION) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#101113]">
          <div className="space-y-3">
            <span className="badge-lime text-xs uppercase tracking-wider">Services</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101113]">
              Purpose-Built for Agency Operations
            </h2>
          </div>
          <p className="text-sm font-medium text-[#777D77] max-w-md">
            At LeadRescue AI, we offer six focused capabilities to eliminate enquiry leakage and scale client performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            const isLime = srv.archetype === "lime";
            const isCharcoal = srv.archetype === "charcoal";

            return (
              <div
                key={idx}
                className={
                  isLime
                    ? "card-lime p-8 flex flex-col justify-between min-h-[290px]"
                    : isCharcoal
                    ? "card-charcoal p-8 flex flex-col justify-between min-h-[290px]"
                    : "card-white p-8 flex flex-col justify-between min-h-[290px]"
                }
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider border ${
                        isLime
                          ? "bg-white text-[#101113] border-[#101113]"
                          : isCharcoal
                          ? "bg-[#202327] text-[#B7FF3C] border-[#2A2E33]"
                          : "bg-[#F3F4F2] text-[#101113] border-[#DCDDDA]"
                      }`}
                    >
                      {srv.tag}
                    </span>

                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center border-1.5 ${
                        isLime
                          ? "bg-[#101113] text-[#B7FF3C] border-[#101113]"
                          : isCharcoal
                          ? "bg-[#B7FF3C] text-[#101113] border-[#B7FF3C]"
                          : "bg-[#17191C] text-[#B7FF3C] border-[#101113]"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3
                    className={`text-2xl font-black leading-tight mt-2 ${
                      isCharcoal ? "text-white" : "text-[#101113]"
                    }`}
                  >
                    {srv.title}
                  </h3>

                  <p
                    className={`mt-3 text-sm font-medium leading-relaxed ${
                      isLime
                        ? "text-[#101113]/90 font-semibold"
                        : isCharcoal
                        ? "text-[#DCDDDA]"
                        : "text-[#777D77]"
                    }`}
                  >
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-current/15 flex items-center justify-between">
                  <Link
                    href={srv.href}
                    className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider hover:underline ${
                      isCharcoal ? "text-[#B7FF3C]" : "text-[#101113]"
                    }`}
                  >
                    <span>{srv.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <div
                    className={
                      isLime
                        ? "circle-badge-dark"
                        : isCharcoal
                        ? "circle-badge-lime"
                        : "circle-badge-dark"
                    }
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. HOW IT WORKS (COLLAPSIBLE WORKING PROCESS ACCORDION) */}
      <section id="how-it-works" className="px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#101113]">
          <div className="space-y-3">
            <span className="badge-lime text-xs uppercase tracking-wider">Our Working Process</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101113]">
              Step-by-Step Lead Recovery
            </h2>
          </div>
          <p className="text-sm font-medium text-[#777D77] max-w-md">
            Our systematic approach to turning neglected ad clicks into qualified, high-ticket conversions.
          </p>
        </div>

        <div className="space-y-4">
          {workflowSteps.map((step, idx) => {
            const isOpen = openProcess === idx;

            return (
              <div
                key={idx}
                className={`border-2 border-[#101113] rounded-3xl transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "bg-[#B7FF3C] shadow-[0_6px_0_0_#101113]"
                    : "bg-[#F3F4F2] hover:bg-white shadow-[0_3px_0_0_#101113]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenProcess(isOpen ? null : idx)}
                  className="w-full p-6 sm:p-8 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-2xl sm:text-4xl font-black text-[#101113] tabular-nums">
                      {step.num}
                    </span>
                    <span className="text-lg sm:text-2xl font-black text-[#101113]">
                      {step.title}
                    </span>
                  </div>

                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#101113] bg-white flex items-center justify-center shrink-0 text-[#101113] font-black">
                    {isOpen ? <Minus className="w-5 h-5 stroke-[3]" /> : <Plus className="w-5 h-5 stroke-[3]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-8 pt-2 border-t-2 border-[#101113]/30 text-xs sm:text-sm text-[#101113] font-medium space-y-3">
                    <p className="font-extrabold text-base leading-snug">{step.summary}</p>
                    <p className="leading-relaxed text-[#202320]">{step.details}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. AI ASSISTANT SHOWCASE (BILINGUAL ENGLISH / URDU) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="card-white p-8 sm:p-14 bg-gradient-to-br from-white via-white to-[#F3FDE1]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="badge-lime text-xs uppercase tracking-wider">AI Sales Copilot</span>
              <h2 className="text-3xl sm:text-5xl font-black text-[#101113] leading-tight">
                Grounded Follow-Up AI in Both English & Urdu.
              </h2>
              <p className="text-sm sm:text-base text-[#202320] font-medium leading-relaxed">
                Most AI tools hallucinate pricing, fabricate unverified promises, or sound like robotic Western templates.
                LeadRescue AI is trained specifically for Pakistani and Middle Eastern commercial nuance—grounding every draft
                in verified database attributes.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#B7FF3C] border border-[#101113] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#101113] stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#101113]">Zero Hallucination Guarantee</p>
                    <p className="text-xs text-[#777D77] font-medium">Never creates fake discounts or unapproved specs.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#B7FF3C] border border-[#101113] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#101113] stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#101113]">Urdu Nastaliq & Etiquette Engine</p>
                    <p className="text-xs text-[#777D77] font-medium">Authentic, polite Pakistani conversational flows that convert.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#B7FF3C] border border-[#101113] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#101113] stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-[#101113]">Human-in-the-Loop Review</p>
                    <p className="text-xs text-[#777D77] font-medium">Rep reviews, clicks approve, and dispatches via WhatsApp.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/app/ai-assistant"
                  className="btn-base btn-primary text-xs font-extrabold"
                >
                  <span>Test AI Assistant in Live Sandbox</span>
                  <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
                </Link>
              </div>
            </div>

            {/* AI Generator Preview Canvas */}
            <div className="lg:col-span-6">
              <div className="rounded-3xl border-2 border-[#101113] bg-[#17191C] text-white p-6 sm:p-8 shadow-[0_8px_0_0_#101113] space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#2A2E33]">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-[#B7FF3C]" />
                    <span className="text-sm font-extrabold text-white">Grounded Generator</span>
                  </div>
                  <span className="badge-lime text-[11px] py-0.5 px-2">Ready for Review</span>
                </div>

                {/* Lead Context Pill */}
                <div className="bg-[#202327] border border-[#2A2E33] rounded-2xl p-4 text-xs space-y-1">
                  <span className="text-[#777D77] uppercase font-bold text-[10px]">Verified Lead Context</span>
                  <p className="text-white font-bold">Prospect: Bilal Tariq • Brand: Metro Logistics</p>
                  <p className="text-[#DCDDDA]">Budget: PKR 350,000 • Note: Wants 4-week delivery guarantee</p>
                </div>

                {/* AI Draft Bubble */}
                <div className="bg-white text-[#101113] rounded-2xl p-5 border-2 border-[#B7FF3C] space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#777D77]">
                    <span>Suggested WhatsApp Follow-up (Urdu)</span>
                    <span className="text-[#16A34A] font-extrabold">100% Grounded</span>
                  </div>
                  <p className="text-sm font-medium leading-relaxed" dir="rtl">
                    السلام علیکم بلال صاحب! میٹرو لاجسٹکس کے حوالے سے آپ کے انکوائری فارم کا شکریہ۔ آپ کے 4 ہفتوں کے ٹائم فریم اور بجٹ (350,000 روپے) کے مطابق ہم کل آپ کے شیڈول پر بات کر سکتے ہیں؟
                  </p>
                </div>

                {/* Interactive Action Row */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#777D77] font-semibold">One-click WhatsApp dispatch</span>
                  <button
                    type="button"
                    className="btn-base btn-lime text-xs font-black h-10 px-4"
                  >
                    <span>Approve & Send</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SLIDER (DARK CONTAINER FROM REFERENCE) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#101113]">
          <div className="space-y-3">
            <span className="badge-lime text-xs uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101113]">
              What Agency Leaders Say
            </h2>
          </div>
          <p className="text-sm font-medium text-[#777D77] max-w-md">
            Hear from managing directors and media buyers scaling their agencies with LeadRescue AI.
          </p>
        </div>

        <div className="card-charcoal p-8 sm:p-14 relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="relative border-2 border-[#B7FF3C] rounded-3xl p-8 sm:p-12 bg-[#202327]">
              <p className="text-base sm:text-2xl text-white font-bold leading-relaxed">
                &ldquo;{testimonials[testimonialIndex].quote}&rdquo;
              </p>
              <div className="mt-8 pt-6 border-t border-[#2A2E33] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-black text-[#B7FF3C]">
                    {testimonials[testimonialIndex].author}
                  </h4>
                  <p className="text-xs text-[#DCDDDA] font-medium mt-0.5">
                    {testimonials[testimonialIndex].role}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setTestimonialIndex(i)}
                      className={`h-3 rounded-full transition-all ${
                        testimonialIndex === i ? "w-8 bg-[#B7FF3C]" : "w-3 bg-[#777D77]"
                      }`}
                      aria-label={`Go to testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PRICING SECTION (3-TIER NEO-MINIMALIST CARDS) */}
      <section id="pricing" className="px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#101113]">
          <div className="space-y-3">
            <span className="badge-lime text-xs uppercase tracking-wider">Pricing Plans</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101113]">
              Predictable Agency Subscriptions
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-[#101113]">Billed monthly in Pakistani Rupees (PKR)</p>
            <p className="text-xs text-[#777D77] font-medium">{PRICING_DISCLAIMER}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const isHighlight = plan.isPopular;

            return (
              <div
                key={plan.id}
                className={`p-8 rounded-3xl border-2 border-[#101113] flex flex-col justify-between transition-all relative ${
                  isHighlight
                    ? "bg-[#B7FF3C] shadow-[0_8px_0_0_#101113]"
                    : "bg-white shadow-[0_4px_0_0_#101113] hover:shadow-[0_6px_0_0_#101113]"
                }`}
              >
                {isHighlight && (
                  <div className="absolute -top-4 left-8 px-4 py-1 rounded-full bg-[#101113] text-[#B7FF3C] text-xs font-black uppercase tracking-wider border border-[#B7FF3C]">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3 className="text-2xl font-black text-[#101113]">{plan.name}</h3>
                  <p
                    className={`text-xs mt-1.5 font-bold min-h-[36px] ${
                      isHighlight ? "text-[#101113]/80" : "text-[#777D77]"
                    }`}
                  >
                    {plan.tagline}
                  </p>

                  <div className="mt-6 flex items-baseline gap-1.5 pb-6 border-b-2 border-[#101113]/20">
                    <span className="text-4xl sm:text-5xl font-black text-[#101113] tabular-nums">
                      {formatCurrencyPKR(plan.pricePKR)}
                    </span>
                    <span className="text-xs font-bold text-[#101113]">/{plan.period}</span>
                  </div>

                  <div className="mt-6 space-y-3 text-xs font-bold">
                    {plan.features.slice(0, 6).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                            isHighlight
                              ? "bg-[#101113] text-[#B7FF3C] border-[#101113]"
                              : "bg-[#B7FF3C] text-[#101113] border-[#101113]"
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className={feat.highlight ? "text-[#101113] font-black" : "text-[#202320]"}>
                          {feat.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-10 pt-4">
                  <Link
                    href="/signup"
                    className={`btn-base w-full text-xs font-black h-12 shadow-[0_3px_0_0_#101113] ${
                      isHighlight
                        ? "bg-[#101113] text-white hover:bg-[#202327]"
                        : "btn-primary"
                    }`}
                  >
                    {plan.ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm font-black text-[#101113] hover:underline decoration-[#B7FF3C] decoration-4 underline-offset-4"
          >
            <span>Compare full plan limits, add-ons, and client seat matrices</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <section className="px-4 sm:px-8 max-w-5xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-[#101113]">
          <div className="space-y-3">
            <span className="badge-lime text-xs uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#101113]">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-sm font-medium text-[#777D77] max-w-sm">
            Everything you need to know about rollout, WhatsApp setup, and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className={`border-2 border-[#101113] rounded-3xl transition-all duration-150 overflow-hidden ${
                  isOpen
                    ? "bg-[#B7FF3C] shadow-[0_5px_0_0_#101113]"
                    : "bg-white hover:bg-[#F3F4F2] shadow-[0_3px_0_0_#101113]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-6 sm:p-7 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <span className="text-base sm:text-lg font-black text-[#101113]">
                    {faq.q}
                  </span>
                  <div className="w-9 h-9 rounded-full border-2 border-[#101113] bg-white flex items-center justify-center shrink-0 text-[#101113] font-black">
                    {isOpen ? <Minus className="w-4 h-4 stroke-[3]" /> : <Plus className="w-4 h-4 stroke-[3]" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 pt-1 border-t-2 border-[#101113]/20 text-xs sm:text-sm text-[#202320] font-semibold leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. FINAL CTA CONTAINER (LIME + CHARCOAL HIGH IMPACT) */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="card-lime p-8 sm:p-16 relative overflow-hidden bg-gradient-to-r from-[#B7FF3C] to-[#A3EE28]">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="px-3 py-1 rounded-md bg-[#101113] text-[#B7FF3C] font-black text-xs uppercase tracking-wider">
              Launch Within 10 Minutes
            </span>
            <h2 className="text-3xl sm:text-6xl font-black text-[#101113] tracking-tight leading-tight">
              Ready to stop losing high-value agency leads?
            </h2>
            <p className="text-base sm:text-xl text-[#101113]/90 font-bold max-w-xl mx-auto leading-relaxed">
              Join growth agencies across Pakistan & MENA who enforce follow-up accountability
              and recover lost opportunities.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/signup"
                className="btn-base btn-primary h-14 px-8 text-sm font-black shadow-[0_4px_0_0_#101113]"
              >
                <span>Start Free 14-Day Trial</span>
                <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
              </Link>
              <Link
                href="/contact"
                className="btn-base btn-secondary h-14 px-8 text-sm font-black border-2 border-[#101113] shadow-[0_3px_0_0_#101113]"
              >
                <span>Schedule Agency Walkthrough</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
