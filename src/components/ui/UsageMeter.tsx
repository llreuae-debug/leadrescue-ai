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
      : "bg-[#B7FF3C]";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#202320]">{label}</span>
        <span className="text-[#777D77] tabular-nums font-medium">
          <strong className="text-[#101113] font-bold">{current}</strong> / {limit} {unit}
          {" "}({percentage}%)
        </span>
      </div>

      <div className="w-full h-3 bg-[#F3F4F2] rounded-full overflow-hidden border border-[#DCDDDA] p-0.5">
        <div
          className={cn("h-full transition-all duration-300 rounded-full border border-[#101113]/20", barColor)}
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
