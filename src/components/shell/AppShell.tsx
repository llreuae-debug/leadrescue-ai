"use client";

import React, { useState } from "react";
import { AppSidebar, navItems } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppShellProps {
  children: React.ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  breadcrumbs,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Mobile Drawer Content */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              LR
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">LeadRescue AI</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Every Lead Deserves a Follow-Up.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? item.isAi
                      ? "bg-purple-50 text-purple-700 font-semibold"
                      : "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4",
                    isActive
                      ? item.isAi
                        ? "text-purple-600"
                        : "text-blue-600"
                      : "text-slate-400"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-xs">
              PA
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">Prime Digital</p>
              <p className="text-[10px] text-slate-400 truncate">admin@primedigital.pk</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader
          breadcrumbs={breadcrumbs}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
