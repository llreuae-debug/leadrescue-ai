"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ShieldAlert,
  Building2,
  CreditCard,
  Sliders,
  History,
  LayoutDashboard,
  ExternalLink,
  Menu,
  X,
  Lock,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      href: "/admin/dashboard",
      label: "Platform Overview",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/agencies",
      label: "Agencies Directory",
      icon: Building2,
    },
    {
      href: "/admin/subscriptions",
      label: "Manual Payments",
      icon: CreditCard,
    },
    {
      href: "/admin/plans",
      label: "Plans & Limits",
      icon: Sliders,
    },
    {
      href: "/admin/audit-logs",
      label: "Security Audit Trail",
      icon: History,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#101113] text-white">
      {/* Top Security Privileges Banner */}
      <aside aria-label="Security Alert" className="bg-[#17191C] border-b-2 border-[#101113] text-[#B7FF3C] px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5" />
        <span>
          <strong className="text-white uppercase tracking-wider">Super Admin Console:</strong> Elevated system root privileges active. All administrative mutations are cryptographically signed.
        </span>
      </aside>

      {/* Main Admin Navigation Header */}
      <header className="bg-[#17191C] border-b-2 border-[#282B30] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Branding */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#B7FF3C] text-[#101113] flex items-center justify-center font-black text-base border-2 border-[#101113] shadow-xs">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-white text-base tracking-tight">
                    LeadRescue AI
                  </span>
                  <span className="badge-lime text-[10px]">
                    Super Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Platform Operations Console
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5 bg-[#101113] p-1.5 rounded-2xl border-2 border-[#282B30]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#17191C] text-[#B7FF3C] border-2 border-[#3A3F47] shadow-xs"
                        : "text-slate-400 hover:text-white border-2 border-transparent"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#B7FF3C]" : "text-slate-500")} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Profile & Exit Link */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right text-xs">
                <p className="font-bold text-white">security@leadrescue.ai</p>
                <p className="text-[10px] text-[#B7FF3C] font-mono font-bold">Master Authority</p>
              </div>

              <div className="h-6 w-0.5 bg-[#282B30]" />

              <Link
                href="/app/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border-2 border-[#282B30] bg-[#101113] hover:bg-[#17191C] text-xs font-bold text-white transition-colors"
                title="Switch back to Agency App"
              >
                <span>Agency View</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Mobile Toggle */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-white border-2 border-[#282B30] hover:bg-[#101113]"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t-2 border-[#282B30] bg-[#17191C] px-4 pt-3 pb-5 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                    isActive
                      ? "bg-[#101113] text-[#B7FF3C] border-2 border-[#282B30]"
                      : "text-slate-300 hover:bg-[#101113]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t-2 border-[#282B30] flex flex-col gap-2.5">
              <div className="text-xs text-slate-400">
                Logged in as: <strong className="text-white">security@leadrescue.ai</strong>
              </div>
              <Link
                href="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-lime text-xs py-2.5 text-center"
              >
                Return to Agency Console
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Admin Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-[#17191C] border-t-2 border-[#282B30] mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2 text-slate-400">
            <Lock className="w-3.5 h-3.5 text-[#B7FF3C]" />
            <span>LeadRescue AI Super Admin Console &bull; Internal Platform Operations Only</span>
          </div>
          <div className="text-[#B7FF3C] font-mono">Strict Multi-Tenant Isolation Enforced</div>
        </div>
      </footer>
    </div>
  );
}
