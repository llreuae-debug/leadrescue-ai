import React from "react";
import { cn } from "@/lib/utils";
import { Filter, RotateCcw } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  children?: React.ReactNode;
  activeCount?: number;
  onReset?: () => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  activeCount = 0,
  onReset,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs",
        className
      )}
    >
      <div className="flex items-center gap-1.5 font-semibold text-slate-700 mr-1">
        <Filter className="w-3.5 h-3.5 text-slate-500" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="ml-1 px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
            {activeCount}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 flex-1">
        {children}
      </div>

      {activeCount > 0 && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors ml-auto font-medium"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};
