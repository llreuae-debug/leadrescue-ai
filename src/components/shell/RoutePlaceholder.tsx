import React from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LucideIcon, Clock, Layers } from "lucide-react";

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
          <StatusBadge
            label={`Scheduled for Stage ${stageNumber}`}
            variant="warning"
          />
        }
      />

      <div className="linear-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Icon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-900">
              Stage {stageNumber}: {stageName}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">
              This module will be connected directly to the multi-tenant database in its dedicated build stage.
              In accordance with our product principles, we do not present simulated data as real records.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Planned Deliverables</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {plannedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
