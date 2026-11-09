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
    <div
      className={cn(
        "rounded-3xl border-2 border-[#DCDDDA] hover:border-[#101113] bg-white p-6 flex flex-col justify-between shadow-[0_2px_0_0_#DCDDDA] transition-all duration-180",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#F3F4F2]">
          <div>
            <h3 className="text-base font-extrabold text-[#101113]">{title}</h3>
            {description && (
              <p className="text-xs text-[#777D77] mt-0.5 font-medium">{description}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>

        <div className="pt-4">{children}</div>
      </div>

      {footer && (
        <div className="mt-4 pt-3.5 border-t-2 border-[#F3F4F2] text-xs text-[#777D77]">
          {footer}
        </div>
      )}
    </div>
  );
};
