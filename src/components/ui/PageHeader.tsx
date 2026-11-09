import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode; // For action buttons
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 pb-6 border-b-2 border-[#DCDDDA] sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#101113]">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm font-medium text-[#777D77] max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3 pt-1 sm:pt-0">
          {children}
        </div>
      )}
    </div>
  );
};
