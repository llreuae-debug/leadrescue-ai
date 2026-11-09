import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, Inbox } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-300 bg-white/50",
        className
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mb-4 shadow-xs">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>

      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{description}</p>

      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
            >
              {action.icon && <action.icon className="w-3.5 h-3.5 mr-1" />}
              {action.label}
            </button>
          )}

          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
