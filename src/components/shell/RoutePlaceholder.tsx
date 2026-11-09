import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LucideIcon, Layers, Sparkles } from "lucide-react";

interface RoutePlaceholderProps {
  title: string;
  stageNumber: number;
  stageName: string;
  description: string;
  icon: LucideIcon;
  plannedFeatures: string[];
}

export const RoutePlaceholder: React.FC<RoutePlaceholderProps> = ({
  title,
  stageNumber,
  stageName,
  description,
  icon: Icon,
  plannedFeatures,
}) => {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        badge={
          <span className="badge-lime text-[11px] font-bold">
            Stage {stageNumber} Roadmap
          </span>
        }
      />

      <div className="card-white p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#17191C] text-[#B7FF3C] flex items-center justify-center shrink-0 border-2 border-[#101113]">
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-[#101113]">
                Stage {stageNumber}: {stageName}
              </h3>
              <span className="badge-dark text-[10px]">Architecture Spec</span>
            </div>
            <p className="text-xs sm:text-sm text-[#777D77] leading-relaxed max-w-2xl font-medium">
              This module connects directly to the multi-tenant database in its dedicated build stage.
              In accordance with our product principles, we do not present simulated data as real records.
            </p>
          </div>
        </div>

        <div className="border-t-2 border-[#DCDDDA] pt-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#101113]">
            <Sparkles className="w-3.5 h-3.5 text-[#101113]" />
            <span>Planned Deliverables & Capabilities</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plannedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F3F4F2] border-2 border-[#101113] text-xs font-bold text-[#101113]"
              >
                <div className="w-2 h-2 rounded-full bg-[#B7FF3C] border border-[#101113] shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
