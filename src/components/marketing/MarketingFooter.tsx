import React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export const MarketingFooter: React.FC = () => {
  return (
    <footer className="border-t-2 border-[#101113] bg-[#17191C] text-[#DCDDDA] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        {/* Top bar with Brand and nav */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-[#2A2E33]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center font-black text-sm">
              LR
            </div>
            <span className="font-extrabold tracking-tight text-white text-lg">
              LeadRescue<span className="text-[#B7FF3C]">.ai</span>
            </span>
          </div>

          <nav className="flex flex-wrap items-center gap-6 sm:gap-8 font-bold text-sm text-[#DCDDDA]">
            <Link href="/about" className="hover:text-[#B7FF3C] transition-colors">
              About us
            </Link>
            <Link href="/features" className="hover:text-[#B7FF3C] transition-colors">
              Services & Features
            </Link>
            <Link href="/pricing" className="hover:text-[#B7FF3C] transition-colors">
              Pricing
            </Link>
            <Link href="/contact" className="hover:text-[#B7FF3C] transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Middle grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-12">
          {/* Contact Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="inline-block">
              <span className="badge-lime text-xs uppercase tracking-wider">Contact us</span>
            </div>
            <p className="text-sm text-white font-medium">
              Email: info@leadrescue.ai
            </p>
            <p className="text-sm text-white font-medium">
              Phone: +92 300 1234567 / +971 4 123 4567
            </p>
            <p className="text-xs text-[#777D77] max-w-sm leading-relaxed">
              Address: Level 4, Tech Innovation Hub, Gulberg III, Lahore, Pakistan.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#B7FF3C] pt-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#B7FF3C]" />
              <span>Multi-tenant database isolation & human-in-the-loop AI review.</span>
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-7 bg-[#202327] border-2 border-[#2A2E33] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-4 justify-between">
            <input
              type="email"
              placeholder="Email address for agency insights"
              className="w-full sm:flex-1 h-12 rounded-xl bg-[#17191C] border border-[#2A2E33] px-4 text-sm text-white placeholder:text-[#777D77] focus:outline-none focus:border-[#B7FF3C]"
            />
            <button
              type="button"
              className="w-full sm:w-auto h-12 btn-base btn-lime text-xs font-bold px-6 shrink-0"
            >
              <span>Subscribe to news</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom links */}
        <div className="pt-8 border-t border-[#2A2E33] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777D77]">
          <div>
            © {new Date().getFullYear()} LeadRescue AI. All Rights Reserved. Initial launch: Pakistan & MENA.
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/privacy" className="hover:text-white transition-colors underline underline-offset-4">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors underline underline-offset-4">
              Terms of Service
            </Link>
            <Link href="/design-system" className="hover:text-[#B7FF3C] transition-colors">
              Design System Showcase
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
