"use client";

import React, { useState } from "react";
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
  ShieldAlert,
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
        "hidden md:flex flex-col border-r border-slate-200 bg-white transition-all duration-200 ease-in-out relative z-30 select-none",
        collapsed ? "w-[72px]" : "w-[248px]",
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
        <Link
          href="/app/dashboard"
          className="flex items-center gap-2.5 overflow-hidden"
          title="LeadRescue AI"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
            LR
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight text-slate-900 truncate">
                LeadRescue AI
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
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
          className="absolute -right-3 top-20 z-40 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors group relative",
                isActive
                  ? item.isAi
                    ? "bg-purple-50 text-purple-700 font-semibold"
                    : "bg-blue-50 text-blue-700 font-semibold"
                  : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900",
                collapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive
                    ? item.isAi
                      ? "text-purple-600"
                      : "text-blue-600"
                    : item.isAi
                    ? "text-purple-500 group-hover:text-purple-600"
                    : "text-slate-400 group-hover:text-slate-600"
                )}
              />

              {!collapsed && (
                <span className="truncate flex-1">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-slate-100 text-slate-600 font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer / Account Section */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div
          className={cn(
            "flex items-center gap-2.5",
            collapsed && "justify-center"
          )}
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-semibold flex items-center justify-center text-xs shrink-0">
            PA
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">
                Prime Digital
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                admin@primedigital.pk
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
