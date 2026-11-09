import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "ai"
  | "neutral";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  default: {
    bg: "bg-[#F3F4F2] text-[#17191C] border-[#DCDDDA]",
    text: "text-[#17191C]",
    dot: "bg-[#17191C]",
  },
  success: {
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    text: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50 text-amber-900 border-amber-200",
    text: "text-amber-900",
    dot: "bg-amber-500",
  },
  danger: {
    bg: "bg-rose-50 text-rose-800 border-rose-200",
    text: "text-rose-800",
    dot: "bg-rose-500",
  },
  ai: {
    bg: "bg-[#B7FF3C] text-[#101113] border-[#101113] font-bold shadow-[0_1px_0_0_#101113]",
    text: "text-[#101113]",
    dot: "bg-[#101113]",
  },
  neutral: {
    bg: "bg-[#F3F4F2] text-[#777D77] border-[#DCDDDA]",
    text: "text-[#777D77]",
    dot: "bg-[#777D77]",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = "default",
  dot = true,
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
        styles.bg,
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", styles.dot)} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};
