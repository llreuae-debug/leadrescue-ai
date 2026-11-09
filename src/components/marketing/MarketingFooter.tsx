import React from "react";
import Link from "next/link";
import { ShieldCheck, Heart } from "lucide-react";

export const MarketingFooter: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                LR
              </div>
              <span className="font-bold tracking-tight text-slate-900 text-sm">
                LeadRescue AI
              </span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed text-xs">
              Every Lead Deserves a Follow-Up. Designed specifically for digital marketing agencies to organize client enquiries, eliminate lead leakage, and accelerate conversions.
            </p>
            <div className="flex items-center gap-1.5 text-slate-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Multi-tenant database isolation & strict human-in-the-loop AI review.</span>
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider">
              Product
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/features" className="hover:text-slate-900 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-slate-900 transition-colors">
                  Pricing (PKR)
                </Link>
              </li>
              <li>
                <Link href="/design-system" className="hover:text-slate-900 transition-colors">
                  Design System
                </Link>
              </li>
              <li>
                <Link href="/app/dashboard" className="hover:text-slate-900 transition-colors">
                  Agency Workspace
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider">
              Company
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/about" className="hover:text-slate-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-slate-900 transition-colors">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-slate-900 uppercase text-[11px] tracking-wider">
              Legal
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} LeadRescue AI. Initial launch market: Pakistan.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for high-growth performance agencies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
