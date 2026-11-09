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
    bg: "bg-blue-50 text-blue-700 border-blue-200",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  success: {
    bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  warning: {
    bg: "bg-amber-50 text-amber-800 border-amber-200",
    text: "text-amber-800",
    dot: "bg-amber-500",
  },
  danger: {
    bg: "bg-rose-50 text-rose-700 border-rose-200",
    text: "text-rose-700",
    dot: "bg-rose-500",
  },
  ai: {
    bg: "bg-purple-50 text-purple-700 border-purple-200",
    text: "text-purple-700",
    dot: "bg-purple-600",
  },
  neutral: {
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    text: "text-slate-700",
    dot: "bg-slate-400",
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
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        styles.bg,
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", styles.dot)} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
};
