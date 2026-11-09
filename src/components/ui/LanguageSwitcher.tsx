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
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer select-none border-1.5 shadow-[0_2px_0_0_#101113]",
        isUrdu
          ? "bg-[#B7FF3C] text-[#101113] border-[#101113] hover:bg-[#A3EE28]"
          : "bg-[#FFFFFF] text-[#17191C] border-[#101113] hover:bg-[#F3F4F2]",
        className
      )}
      aria-label="Switch application language between English and Urdu / زبان تبدیل کریں"
      title={isUrdu ? "Switch to English" : "اردو میں دیکھیں"}
    >
      <Languages className="w-3.5 h-3.5 opacity-90" />
      <span>{isUrdu ? "English (EN)" : "اردو (UR)"}</span>
    </button>
  );
};
