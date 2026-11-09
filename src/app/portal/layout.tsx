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
  Menu,
  X,
  Sparkles,
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
    <div className="min-h-screen flex flex-col bg-[#F3F4F2] text-[#101113]">
      {/* Top Banner for Demo State */}
      {isDemo && (
        <aside aria-label="Demo Mode Notice" className="bg-[#17191C] border-b-2 border-[#101113] text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#B7FF3C] animate-pulse" />
          <span>
            <strong className="text-[#B7FF3C]">Client Portal Live Preview:</strong> Client workspace for{" "}
            <strong>{workspace.name}</strong> managed by <strong>{workspace.agencyName}</strong>.
          </span>
        </aside>
      )}

      {/* Main Portal Header */}
      <header className="bg-white border-b-2 border-[#101113] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Branding & Client Identifier */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#17191C] text-[#B7FF3C] flex items-center justify-center font-black text-base border-2 border-[#101113] shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#101113] text-base leading-tight">
                    {workspace.name}
                  </span>
                  <span className="badge-lime text-[10px]">
                    Client Portal
                  </span>
                </div>
                <p className="text-xs text-[#777D77] font-medium">
                  Managed by <span className="font-bold text-[#101113]">{workspace.agencyName}</span>
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#F3F4F2] p-1.5 rounded-2xl border-2 border-[#101113]">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      isActive
                        ? "bg-[#17191C] text-[#B7FF3C] border-2 border-[#101113] shadow-xs"
                        : "text-[#777D77] hover:text-[#101113] border-2 border-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions & Support info */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSwitcher />

              <div className="text-right text-xs">
                <p className="text-[#777D77] font-bold uppercase text-[10px] tracking-wider">Agency Support</p>
                <a
                  href={`mailto:${workspace.supportEmail}`}
                  className="font-bold text-[#101113] hover:underline"
                >
                  {workspace.supportEmail}
                </a>
              </div>

              <div className="h-6 w-0.5 bg-[#DCDDDA]" />

              <Link
                href="/app/dashboard"
                className="btn-secondary text-xs py-2 px-3.5 inline-flex items-center gap-1.5"
                title="Switch back to full agency console"
              >
                <span>Agency View</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#101113]" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[#101113] border-2 border-[#101113] hover:bg-[#F3F4F2]"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-[#101113] bg-white px-4 pt-3 pb-5 space-y-2">
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
                      ? "bg-[#17191C] text-[#B7FF3C] border-2 border-[#101113]"
                      : "text-[#101113] hover:bg-[#F3F4F2]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            <div className="pt-3 border-t-2 border-[#DCDDDA] flex flex-col gap-2.5">
              <div className="text-xs text-[#777D77] font-medium">
                Agency Support: <a href={`mailto:${workspace.supportEmail}`} className="font-bold text-[#101113] underline">{workspace.supportEmail}</a>
              </div>
              <Link
                href="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary text-xs py-2.5 text-center"
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
      <footer className="bg-white border-t-2 border-[#101113] mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#777D77]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#17191C] text-[#B7FF3C] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span>
              Secure Client Workspace for <strong className="text-[#101113]">{workspace.name}</strong>. Access is restricted strictly to verified enquiries.
            </span>
          </div>
          <div className="flex items-center gap-4 text-[#101113]">
            <span>Powered by LeadRescue AI</span>
            <span>&bull;</span>
            <span className="font-mono">{workspace.supportPhone}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
