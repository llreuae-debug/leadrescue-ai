import React from "react";
import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F3F4F2] flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#17191C] text-[#B7FF3C] flex items-center justify-center font-black text-xs border-2 border-[#101113] shadow-xs">
            LR
          </div>
          <span className="text-base font-black tracking-tight text-[#101113]">
            LeadRescue AI
          </span>
        </Link>
        <span className="badge-lime text-[11px] font-bold hidden sm:inline-block">
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
      <div className="w-full max-w-6xl mx-auto text-center text-xs font-bold text-[#777D77] py-2">
        <p>© {new Date().getFullYear()} LeadRescue AI &bull; Pakistan Digital Marketing Agency OS</p>
      </div>
    </div>
  );
}
