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
        "flex flex-col items-center justify-center p-10 text-center rounded-3xl border-2 border-dashed border-[#DCDDDA] bg-[#F3F4F2]/40",
        className
      )}
    >
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] mb-4 shadow-[0_3px_0_0_#101113]">
        <Icon className="w-7 h-7 stroke-[2]" />
      </div>

      <h3 className="text-lg font-extrabold text-[#101113]">{title}</h3>
      <p className="mt-1.5 text-sm text-[#777D77] max-w-sm font-medium">{description}</p>

      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action && (
            <button
              type="button"
              onClick={action.onClick}
              className="btn-base btn-primary text-xs font-bold"
            >
              {action.icon && <action.icon className="w-3.5 h-3.5 mr-1 text-[#B7FF3C]" />}
              {action.label}
            </button>
          )}

          {secondaryAction && (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="btn-base btn-secondary text-xs font-bold"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
