import React from "react";
import { cn } from "@/lib/utils";

interface UsageMeterProps {
  label: string;
  current: number;
  limit: number;
  unit?: string;
  warningThreshold?: number; // e.g., 0.8 for 80%
  dangerThreshold?: number;  // e.g., 0.95 for 95%
  className?: string;
}

export const UsageMeter: React.FC<UsageMeterProps> = ({
  label,
  current,
  limit,
  unit = "",
  warningThreshold = 0.8,
  dangerThreshold = 0.95,
  className,
}) => {
  const percentage = Math.min(100, Math.round((current / (limit || 1)) * 100));
  const ratio = limit > 0 ? current / limit : 0;

  const barColor =
    ratio >= dangerThreshold
      ? "bg-rose-500"
      : ratio >= warningThreshold
      ? "bg-amber-500"
      : "bg-blue-600";

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="text-slate-500 tabular-nums">
          <strong className="text-slate-900 font-semibold">{current}</strong> / {limit} {unit}
          {" "}({percentage}%)
        </span>
      </div>

      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <div
          className={cn("h-full transition-all duration-300 rounded-full", barColor)}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={limit}
        />
      </div>
    </div>
  );
};
