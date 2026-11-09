import Link from "next/link";
import { ArrowRight, LayoutDashboard, Palette, Sparkles, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
            LR
          </div>
          <div>
            <span className="font-bold tracking-tight text-white text-base">LeadRescue AI</span>
            <span className="hidden sm:inline-block ml-2 text-xs text-slate-400 font-mono">v0.1.0</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <Link
            href="/design-system"
            className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            <span>Design System</span>
          </Link>
          <Link
            href="/app/dashboard"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 font-medium transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Stage 1 Completed: Project Foundation & Design System</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Every Lead Deserves a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Follow-Up.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Stop losing valuable enquiries. LeadRescue AI empowers digital marketing agencies
          to organise client leads, eliminate neglected opportunities, and execute personalised follow-ups.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/app/dashboard"
            className="btn-base bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 shadow-lg shadow-blue-600/30"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Enter Agency Workspace</span>
          </Link>

          <Link
            href="/design-system"
            className="btn-base bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 text-sm font-medium px-5"
          >
            <Palette className="w-4 h-4 text-violet-400" />
            <span>Inspect Shared Components</span>
          </Link>
        </div>

        <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <div className="text-blue-400 font-semibold text-xs uppercase tracking-wider">Multi-Tenant Core</div>
            <p className="text-xs text-slate-300">
              Agency and client data strictly isolated at the database level with PostgreSQL RLS.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <div className="text-violet-400 font-semibold text-xs uppercase tracking-wider">Grounded AI</div>
            <p className="text-xs text-slate-300">
              AI drafts grounded strictly in verified lead facts. Human-in-the-loop approval before sending.
            </p>
          </div>
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
            <div className="text-emerald-400 font-semibold text-xs uppercase tracking-wider">Pakistan Pilot Ready</div>
            <p className="text-xs text-slate-300">
              Configured for PKR pricing, manual bank review workflow, and Urdu (RTL) foundations.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          © 2026 LeadRescue AI. Built for Digital Marketing Agencies.
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Zero Mocked Data in Production Principle</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
