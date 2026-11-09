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
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      {/* Top Warning Banner for Root Privileges */}
      <aside aria-label="Security Alert" className="bg-red-950/80 border-b border-red-800 text-red-200 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
        <Lock className="w-3.5 h-3.5 text-red-400" />
        <span>
          <strong>Platform Super Admin Session:</strong> Elevated privileges active. All administrative actions are signed and logged to the immutable security audit trail.
        </span>
      </aside>

      {/* Main Admin Navigation Header */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base tracking-tight">
                    LeadRescue AI
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-red-950 text-red-400 border border-red-700 rounded-md uppercase tracking-wider">
                    Super Admin
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Platform Operations Console
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                      isActive
                        ? "bg-slate-800 text-red-400 font-semibold border border-slate-700"
                        : "text-slate-300 hover:text-white hover:bg-slate-900"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isActive ? "text-red-400" : "text-slate-400")} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Profile & Exit Link */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="text-right text-xs">
                <p className="font-semibold text-white">security@leadrescue.ai</p>
                <p className="text-[10px] text-red-400">Master Authority</p>
              </div>

              <div className="h-6 w-px bg-slate-800" />

              <Link
                href="/app/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
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
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium",
                    isActive
                      ? "bg-slate-800 text-red-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-900"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
              <div className="text-xs text-slate-400">
                Logged in as: <strong className="text-white">security@leadrescue.ai</strong>
              </div>
              <Link
                href="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-200"
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
      <footer className="bg-slate-950 border-t border-slate-800 mt-auto py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-red-500" />
            <span>LeadRescue AI Super Admin Console &bull; Internal Platform Operations Only</span>
          </div>
          <div>Strict Multi-Tenant Isolation Enforced</div>
        </div>
      </footer>
    </div>
  );
}
