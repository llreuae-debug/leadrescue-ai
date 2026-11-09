import React from "react";
import { cn } from "@/lib/utils";
import { Filter, RotateCcw } from "lucide-react";

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
        "flex flex-wrap items-center gap-3 p-3.5 rounded-2xl bg-[#F3F4F2] border-1.5 border-[#DCDDDA] text-xs",
        className
      )}
    >
      <div className="flex items-center gap-2 font-bold text-[#202320] mr-1">
        <Filter className="w-4 h-4 text-[#17191C]" />
        <span>Filters</span>
        {activeCount > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-[#B7FF3C] text-[#101113] border border-[#101113] font-extrabold text-[11px]">
            {activeCount}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5 flex-1">
        {children}
      </div>

      {activeCount > 0 && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs text-[#17191C] hover:text-[#101113] transition-colors ml-auto font-bold underline underline-offset-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      )}
    </div>
  );
};
