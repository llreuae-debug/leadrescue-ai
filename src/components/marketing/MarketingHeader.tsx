"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowRight, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

export const MarketingHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { label: "About us", href: "/about" },
    { label: "Services & Features", href: "/features" },
    { label: "Use Cases", href: "/app/dashboard" },
    { label: "Pricing", href: "/pricing" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-[#DCDDDA] bg-white/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#17191C] text-[#B7FF3C] border-2 border-[#101113] flex items-center justify-center font-black text-base shadow-[0_3px_0_0_#101113] group-hover:scale-105 transition-transform">
            LR
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#101113] leading-none">
              LeadRescue<span className="text-[#B7FF3C] bg-[#101113] px-1 rounded-sm ml-0.5">.ai</span>
            </span>
            <span className="text-[10px] text-[#777D77] font-bold hidden sm:inline-block mt-0.5">
              Every Lead Deserves a Follow-Up.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors",
                  isActive
                    ? "text-[#101113] underline decoration-[#B7FF3C] decoration-4 underline-offset-8"
                    : "text-[#202320] hover:text-[#101113] hover:underline decoration-[#B7FF3C] decoration-2 underline-offset-8"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/login"
            className="text-xs font-bold text-[#202320] hover:text-[#101113] px-3 py-2 transition-colors"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="btn-base btn-primary text-xs font-bold shadow-[0_3px_0_0_#101113] hover:shadow-[0_4px_0_0_#101113]"
          >
            <span>Start Free Trial</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#B7FF3C]" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2.5 rounded-xl text-[#202320] hover:bg-[#F3F4F2] border border-[#DCDDDA]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-[#101113] bg-white px-6 pt-3 pb-8 space-y-4 shadow-xl">
          <nav className="flex flex-col space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-bold text-[#202320] hover:bg-[#F3F4F2]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-[#DCDDDA] flex flex-col gap-3">
            <div className="flex justify-start">
              <LanguageSwitcher />
            </div>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-sm font-bold text-[#202320] hover:bg-[#F3F4F2] rounded-xl border border-[#DCDDDA]"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-base btn-lime text-sm font-bold w-full justify-center"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
