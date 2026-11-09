import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
    label?: string;
  };
  icon?: LucideIcon;
  description?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
}) => {
  return (
    <div
      className={cn(
        "linear-card p-5 relative overflow-hidden transition-all duration-150 hover:border-slate-300",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-100">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-semibold",
              change.trend === "up"
                ? "text-emerald-600"
                : change.trend === "down"
                ? "text-rose-600"
                : "text-slate-500"
            )}
          >
            {change.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {change.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change.value}
          </span>
        )}
      </div>

      {(description || change?.label) && (
        <p className="mt-1 text-xs text-slate-500">
          {change?.label || description}
        </p>
      )}
    </div>
  );
};
