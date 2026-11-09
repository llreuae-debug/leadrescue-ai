"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  Menu,
  Bell,
  ExternalLink,
  LogOut,
  Settings,
  CreditCard,
  User,
} from "lucide-react";
import Link from "next/link";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { logoutAction } from "@/app/actions/auth";

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

        {/* Account Menu Dropdown */}
        <div className="flex items-center pl-2 border-l border-slate-200">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold hover:ring-2 hover:ring-blue-600 focus:outline-none transition-all"
                aria-label="Open user menu"
              >
                PD
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="z-50 min-w-[200px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg text-xs text-slate-700 animate-in fade-in-50"
              >
                <div className="px-2.5 py-2 border-b border-slate-100">
                  <p className="font-semibold text-slate-900">Prime Digital</p>
                  <p className="text-[10px] text-slate-400 truncate">admin@primedigital.pk</p>
                </div>

                <div className="py-1">
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/app/settings"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-100 cursor-pointer outline-none font-medium"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      <span>Agency Settings</span>
                    </Link>
                  </DropdownMenu.Item>

                  <DropdownMenu.Item asChild>
                    <Link
                      href="/app/billing"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-100 cursor-pointer outline-none font-medium"
                    >
                      <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                      <span>Subscription & Plan</span>
                    </Link>
                  </DropdownMenu.Item>
                </div>

                <DropdownMenu.Separator className="h-px bg-slate-100 my-1" />

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer outline-none font-semibold transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </form>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
};
