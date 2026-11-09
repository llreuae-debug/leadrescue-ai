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
    <div className="min-h-screen flex bg-[#F3F4F2] text-[#202320]">
      {/* Desktop Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#101113]/70 backdrop-blur-xs md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Mobile Drawer Content (Deep Charcoal Theme) */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#17191C] border-r-2 border-[#101113] transform transition-transform duration-200 ease-in-out md:hidden flex flex-col text-white",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-20 px-5 border-b border-[#2A2E33]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center font-black text-sm">
              LR
            </div>
            <div>
              <p className="text-base font-extrabold text-white leading-none">
                LeadRescue<span className="text-[#B7FF3C]">.ai</span>
              </p>
              <p className="text-[10px] text-[#777D77] font-semibold mt-0.5">Agency Workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileNavOpen(false)}
            className="p-1.5 rounded-lg text-[#DCDDDA] hover:text-white hover:bg-[#202327]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all",
                  isActive
                    ? "bg-[#B7FF3C] text-[#101113] shadow-[0_3px_0_0_#101113]"
                    : "text-[#DCDDDA] hover:bg-[#202327] hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0",
                    isActive
                      ? "text-[#101113]"
                      : item.isAi
                      ? "text-[#B7FF3C]"
                      : "text-[#777D77]"
                  )}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] rounded-full font-bold",
                      isActive
                        ? "bg-[#101113] text-[#B7FF3C]"
                        : "bg-[#2A2E33] text-[#DCDDDA]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#2A2E33] bg-[#101113]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#202327] text-[#B7FF3C] font-bold flex items-center justify-center text-xs shrink-0 border border-[#2A2E33]">
              PA
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">Prime Digital</p>
              <p className="text-[10px] text-[#777D77] truncate">admin@primedigital.pk</p>
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#F3F4F2]">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
