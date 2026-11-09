"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  Bell,
  Search,
  Plus,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface AppHeaderProps {
  onOpenMobileNav?: () => void;
  breadcrumbs?: { label: string; href?: string }[];
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenMobileNav,
  breadcrumbs = [{ label: "Workspace" }],
  className,
}) => {
  return (
    <header
      className={cn(
        "h-16 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20",
        className
      )}
    >
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3">
        {onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <span className="text-slate-300">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-slate-800 font-medium transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-800 font-semibold">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Actions, Notifications, User */}
      <div className="flex items-center gap-2.5">
        <Link
          href="/design-system"
          className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
          title="Component Showcase"
        >
          <span>Design Tokens</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        {/* Notifications placeholder */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
        </button>

        {/* Agency / User Profile Avatar */}
        <div className="flex items-center pl-2 border-l border-slate-200 gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold cursor-pointer">
            PD
          </div>
        </div>
      </div>
    </header>
  );
};
