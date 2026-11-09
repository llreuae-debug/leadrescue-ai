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
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  description,
  className,
  highlight = false,
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl p-6 transition-all duration-180 relative overflow-hidden border-2",
        highlight
          ? "bg-[#B7FF3C] border-[#101113] text-[#101113] shadow-[0_4px_0_0_#101113]"
          : "bg-white border-[#DCDDDA] hover:border-[#101113] text-[#202320] shadow-[0_2px_0_0_#DCDDDA] hover:shadow-[0_4px_0_0_#101113]",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-wider",
            highlight ? "text-[#101113]" : "text-[#777D77]"
          )}
        >
          {title}
        </p>
        {Icon && (
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-1.5",
              highlight
                ? "bg-[#101113] text-[#B7FF3C] border-[#101113]"
                : "bg-[#F3F4F2] text-[#17191C] border-[#DCDDDA]"
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <span
          className={cn(
            "text-3xl font-extrabold tracking-tight tabular-nums",
            highlight ? "text-[#101113]" : "text-[#101113]"
          )}
        >
          {value}
        </span>
        {change && (
          <span
            className={cn(
              "inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full border",
              highlight
                ? "bg-[#101113] text-[#B7FF3C] border-[#101113]"
                : change.trend === "up"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : change.trend === "down"
                ? "bg-rose-50 text-rose-800 border-rose-200"
                : "bg-[#F3F4F2] text-[#777D77] border-[#DCDDDA]"
            )}
          >
            {change.trend === "up" && <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />}
            {change.trend === "down" && <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
            {change.value}
          </span>
        )}
      </div>

      {(description || change?.label) && (
        <p
          className={cn(
            "mt-2 text-xs font-medium",
            highlight ? "text-[#101113]/80" : "text-[#777D77]"
          )}
        >
          {change?.label || description}
        </p>
      )}
    </div>
  );
};
