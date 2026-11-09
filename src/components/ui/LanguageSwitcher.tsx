"use client";

import React from "react";
import { Languages } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "pill" | "icon" | "minimal";
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className,
  variant = "pill",
}) => {
  const { language, toggleLanguage, isUrdu } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer select-none border",
        isUrdu
          ? "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
        className
      )}
      aria-label="Switch application language between English and Urdu / زبان تبدیل کریں"
      title={isUrdu ? "Switch to English" : "اردو میں دیکھیں"}
    >
      <Languages className="w-3.5 h-3.5 opacity-80" />
      <span>{isUrdu ? "English" : "اردو"}</span>
    </button>
  );
};
