import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Failed to load data",
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-rose-200 bg-rose-50/50",
        className
      )}
    >
      <div className="flex items-center justify-center w-11 h-11 rounded-full bg-rose-100 text-rose-600 mb-3">
        <AlertTriangle className="w-5 h-5 stroke-[2]" />
      </div>
      <h3 className="text-sm font-semibold text-rose-950">{title}</h3>
      <p className="mt-1 text-xs text-rose-700 max-w-md">{message}</p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 btn-base bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" />
          Try Again
        </button>
      )}
    </div>
  );
};
