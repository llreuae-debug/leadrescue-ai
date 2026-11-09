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
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";

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
        "h-20 border-b-2 border-[#DCDDDA] bg-white flex items-center justify-between px-5 sm:px-8 sticky top-0 z-20",
        className
      )}
    >
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3.5">
        {onOpenMobileNav && (
          <button
            type="button"
            onClick={onOpenMobileNav}
            className="md:hidden p-2 rounded-xl text-[#202320] hover:bg-[#F3F4F2] border border-[#DCDDDA] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Breadcrumb nav */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold text-[#777D77]">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <span className="text-[#DCDDDA] font-bold">/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-[#101113] hover:underline transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[#101113] font-bold px-2 py-0.5 rounded-md bg-[#F3F4F2] border border-[#DCDDDA]/60">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right: Actions, Notifications, User */}
      <div className="flex items-center gap-3">
        <LanguageSwitcher />

        <Link
          href="/design-system"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#101113] bg-[#F3F4F2] hover:bg-[#B7FF3C] border-1.5 border-[#101113] rounded-full shadow-[0_2px_0_0_#101113] transition-all"
          title="Component Showcase"
        >
          <span>Design Tokens</span>
          <ExternalLink className="w-3 h-3 text-[#101113]" />
        </Link>

        {/* Notifications placeholder */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative p-2.5 rounded-xl text-[#202320] hover:bg-[#F3F4F2] border border-[#DCDDDA] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#B7FF3C] ring-2 ring-[#101113]" />
        </button>

        {/* User Account Dropdown */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F3F4F2] border border-transparent hover:border-[#DCDDDA] transition-colors focus:outline-none cursor-pointer"
              aria-label="User account menu"
            >
              <div className="w-9 h-9 rounded-xl bg-[#17191C] text-[#B7FF3C] font-bold flex items-center justify-center text-xs shrink-0 border-1.5 border-[#101113] shadow-[0_2px_0_0_#101113]">
                AD
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#101113] leading-none">
                  Ali Daniyal
                </span>
                <span className="text-[10px] text-[#777D77] font-medium leading-tight mt-0.5">
                  Agency Owner
                </span>
              </div>
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[200px] bg-white rounded-2xl border-2 border-[#101113] shadow-[0_8px_0_0_#101113] p-1.5 text-xs font-semibold text-[#202320] animate-in fade-in zoom-in-95"
            >
              <div className="px-3 py-2 border-b border-[#DCDDDA] mb-1">
                <p className="font-extrabold text-[#101113]">Ali Daniyal</p>
                <p className="text-[11px] text-[#777D77] font-normal truncate">
                  ali@primedigital.pk
                </p>
              </div>

              <DropdownMenu.Item asChild>
                <Link
                  href="/app/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F3F4F2] cursor-pointer outline-none"
                >
                  <User className="w-3.5 h-3.5 text-[#777D77]" />
                  <span>Profile Settings</span>
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item asChild>
                <Link
                  href="/app/billing"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F3F4F2] cursor-pointer outline-none"
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#777D77]" />
                  <span>Subscription & Billing</span>
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item asChild>
                <Link
                  href="/app/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#F3F4F2] cursor-pointer outline-none"
                >
                  <Settings className="w-3.5 h-3.5 text-[#777D77]" />
                  <span>Agency Settings</span>
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-[#DCDDDA] my-1" />

              <DropdownMenu.Item asChild>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer outline-none font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </form>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
};
