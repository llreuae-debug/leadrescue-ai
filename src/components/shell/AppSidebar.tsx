"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  Kanban,
  Clock,
  Sparkles,
  BarChart3,
  UserCheck,
  Blocks,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isAi?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Overview", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Clients", href: "/app/clients", icon: Building2 },
  { label: "Leads", href: "/app/leads", icon: Users },
  { label: "Pipeline", href: "/app/pipeline", icon: Kanban },
  { label: "Follow-ups", href: "/app/follow-ups", icon: Clock },
  { label: "AI Assistant", href: "/app/ai-assistant", icon: Sparkles, isAi: true },
  { label: "Reports", href: "/app/reports", icon: BarChart3 },
  { label: "Team", href: "/app/team", icon: UserCheck },
  { label: "Integrations", href: "/app/integrations", icon: Blocks },
  { label: "Billing", href: "/app/billing", icon: CreditCard },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

interface AppSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
  className,
}) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r-2 border-[#101113] bg-[#17191C] text-white transition-all duration-200 ease-in-out relative z-30 select-none",
        collapsed ? "w-[76px]" : "w-[260px]",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-5 border-b border-[#2A2E33]">
        <Link
          href="/app/dashboard"
          className="flex items-center gap-3 overflow-hidden group"
          title="LeadRescue AI"
        >
          <div className="w-9 h-9 rounded-xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center font-black text-sm shrink-0 shadow-[0_2px_0_0_#101113] group-hover:scale-105 transition-transform">
            LR
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-extrabold tracking-tight text-white truncate">
                LeadRescue<span className="text-[#B7FF3C]">.ai</span>
              </span>
              <span className="text-[10px] text-[#777D77] font-semibold tracking-wide uppercase truncate">
                Agency Workspace
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3.5 top-24 z-40 w-7 h-7 rounded-full bg-[#17191C] border-2 border-[#B7FF3C] shadow-md flex items-center justify-center text-[#B7FF3C] hover:bg-[#B7FF3C] hover:text-[#101113] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          )}
        </button>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all group relative",
                isActive
                  ? "bg-[#B7FF3C] text-[#101113] shadow-[0_3px_0_0_#101113]"
                  : "text-[#DCDDDA] hover:bg-[#202327] hover:text-white",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive
                    ? "text-[#101113]"
                    : item.isAi
                    ? "text-[#B7FF3C] group-hover:text-[#B7FF3C]"
                    : "text-[#777D77] group-hover:text-white"
                )}
              />

              {!collapsed && (
                <span className="truncate flex-1 tracking-tight">{item.label}</span>
              )}

              {!collapsed && item.isAi && !isActive && (
                <span className="px-1.5 py-0.5 text-[9px] rounded-md bg-[#B7FF3C]/20 text-[#B7FF3C] font-extrabold uppercase border border-[#B7FF3C]/40">
                  AI
                </span>
              )}

              {!collapsed && item.badge && (
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

      {/* Footer / Account Section */}
      <div className="p-4 border-t border-[#2A2E33] bg-[#101113]/80">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
          <div className="w-9 h-9 rounded-full bg-[#202327] border border-[#2A2E33] text-[#B7FF3C] font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            PA
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">
                Prime Digital
              </p>
              <p className="text-[10px] text-[#777D77] font-medium truncate">
                admin@primedigital.pk
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
