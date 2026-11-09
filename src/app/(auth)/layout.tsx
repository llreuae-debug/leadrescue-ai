import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            LR
          </div>
          <span className="text-sm font-bold tracking-tight text-slate-900">
            LeadRescue AI
          </span>
        </Link>
        <span className="text-xs text-slate-500 hidden sm:inline-block">
          Every Lead Deserves a Follow-Up.
        </span>
      </div>

      {/* Main Form Center */}
      <div className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="w-full max-w-6xl mx-auto text-center text-xs text-slate-400 py-2">
        <p>© {new Date().getFullYear()} LeadRescue AI • Pakistan Agency Pilot</p>
      </div>
    </div>
  );
}
