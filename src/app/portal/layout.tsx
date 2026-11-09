"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  BarChart3, 
  Users2, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { getClientPortalWorkspaceAction } from "@/app/actions/portal";
import { ClientPortalWorkspace } from "@/types/portal";

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [workspace, setWorkspace] = useState<ClientPortalWorkspace>({
    id: "client-1",
    name: "Horizon Retailers",
    industry: "Retail & Apparel",
    agencyName: "Apex Media Pakistan",
    supportEmail: "support@apexmedia.pk",
    supportPhone: "+92 300 1234567",
  });
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    getClientPortalWorkspaceAction().then((res) => {
      if (res.success && res.workspace) {
        setWorkspace(res.workspace);
        setIsDemo(!!res.isDemo);
      }
    });
  }, []);

  const navLinks = [
    {
      href: "/portal/dashboard",
      label: "Overview",
      icon: BarChart3,
    },
    {
      href: "/portal/leads",
      label: "My Inquiries",
      icon: Users2,
    },
    {
      href: "/portal/reports",
      label: "Attribution & Reports",
      icon: Layers,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Banner for Demo State */}
      {isDemo && (
        <aside aria-label="Demo Mode Notice" className="bg-amber-500/10 border-b border-amber-200 text-amber-900 px-4 py-1.5 text-xs font-medium text-center flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          <span>
            <strong>Client Portal Preview:</strong> Viewing client workspace for{" "}
            <strong>{workspace.name}</strong> managed by <strong>{workspace.agencyName}</strong>.
          </span>
        </aside>
      )}

      {/* Main Portal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Branding & Client Identifier */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base leading-tight">
                    {workspace.name}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded-full">
                    Client Portal
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Managed by <span className="font-medium text-slate-700">{workspace.agencyName}</span>
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-slate-100 text-blue-600 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions & Support info */}
            <div className="hidden md:flex items-center gap-3">
              <LanguageSwitcher />

              <div className="text-right text-xs">
                <p className="text-slate-400">Support Contact</p>
                <a
                  href={`mailto:${workspace.supportEmail}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {workspace.supportEmail}
                </a>
              </div>

              <div className="h-6 w-px bg-slate-200" />

              <Link
                href="/app/dashboard"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                title="Switch back to full agency console"
              >
                <span>Agency View</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
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
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              <div className="text-xs text-slate-500">
                Support: <a href={`mailto:${workspace.supportEmail}`} className="text-blue-600">{workspace.supportEmail}</a>
              </div>
              <Link
                href="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-slate-100 text-xs font-medium text-slate-700"
              >
                Return to Agency App
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Simplified Client Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              Secure Client Workspace for <strong>{workspace.name}</strong>. Data restricted strictly to verified enquiries.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by LeadRescue AI</span>
            <span>&bull;</span>
            <span>{workspace.supportPhone}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
