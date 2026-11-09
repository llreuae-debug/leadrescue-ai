import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  subtext?: string;
  className?: string;
  rows?: number;
  type?: "spinner" | "skeleton";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading records...",
  subtext,
  className,
  rows = 4,
  type = "spinner",
}) => {
  if (type === "skeleton") {
    return (
      <div className={cn("w-full space-y-3 p-4 animate-pulse", className)}>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="space-y-2 pt-2">
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-12 text-center",
        className
      )}
    >
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3 stroke-[2]" />
      <p className="text-sm font-medium text-slate-800">{message}</p>
      {subtext && <p className="text-xs text-slate-500 mt-0.5">{subtext}</p>}
    </div>
  );
};
