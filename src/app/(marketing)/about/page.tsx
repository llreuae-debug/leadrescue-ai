import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Target, HeartHandshake, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-16 py-16 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <span>Our Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Every Lead Deserves a Follow-Up.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          LeadRescue AI was created with a clear thesis: most performance agencies fail not from lack of traffic,
          but from catastrophic follow-up leakage.
        </p>
      </div>

      <div className="linear-card p-8 sm:p-10 space-y-6 text-sm text-slate-700 leading-relaxed">
        <h2 className="text-xl font-bold text-slate-900">The Problem We Set Out to Solve</h2>
        <p>
          In high-velocity digital advertising markets like Pakistan, digital agencies spend enormous effort
          crafting Meta and Google ad campaigns for clients. Yet when enquiries arrive via WhatsApp or lead forms,
          they get buried across scattered chat groups, private staff phones, or disorganized spreadsheets.
        </p>
        <p>
          Without disciplined tracking, over 40% of leads go cold without a second touchpoint. Clients blame the agency
          for poor lead quality, when in reality, the conversion failure occurred due to neglected follow-ups.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4">Our Core Philosophy</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Specialized, Not Generic</span>
            </div>
            <p className="text-xs text-slate-500">
              We do not build generic, bloated enterprise CRMs. Every screen exists to enforce lead recovery and follow-up accountability.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Grounded AI with Human Consent</span>
            </div>
            <p className="text-xs text-slate-500">
              AI should draft, recommend, and structure facts — it must never send autonomous messages without human review.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Client Data Isolation</span>
            </div>
            <p className="text-xs text-slate-500">
              Client workspaces are isolated at the database level with PostgreSQL RLS. Cross-client data leaks are strictly impossible.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <span>Built for Local Realities</span>
            </div>
            <p className="text-xs text-slate-500">
              Support for Urdu (RTL), WhatsApp conversational workflows, and Pakistani commercial payment methods.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/signup"
          className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 shadow-xs h-10"
        >
          <span>Join the LeadRescue AI Pilot</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </div>
  );
}
