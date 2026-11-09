import React from "react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  action,
  children,
  footer,
  className,
}) => {
  return (
    <div className={cn("linear-card p-5 flex flex-col justify-between", className)}>
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>

        <div className="pt-4">{children}</div>
      </div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
};
