"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge, BadgeVariant } from "@/components/ui/StatusBadge";
import { DataTable, Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { FormField } from "@/components/ui/FormField";
import { SearchInput } from "@/components/ui/SearchInput";
import { FilterBar } from "@/components/ui/FilterBar";
import { ChartCard } from "@/components/ui/ChartCard";
import { UsageMeter } from "@/components/ui/UsageMeter";
import {
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

interface SampleLead {
  id: string;
  name: string;
  company: string;
  client: string;
  status: string;
  badgeVariant: BadgeVariant;
  dealValue: string;
}

const sampleLeads: SampleLead[] = [
  {
    id: "lead-1",
    name: "Tariq Mahmood",
    company: "Apex Retailers",
    client: "Horizon Commerce",
    status: "Follow-up Due",
    badgeVariant: "warning",
    dealValue: "PKR 145,000",
  },
  {
    id: "lead-2",
    name: "Fatima Noor",
    company: "Skyline Logistics",
    client: "Metro Logistics",
    status: "AI Draft Ready",
    badgeVariant: "ai",
    dealValue: "PKR 320,000",
  },
  {
    id: "lead-3",
    name: "Zainab Ali",
    company: "TechNova PK",
    client: "SaaS Ventures",
    status: "Won Opportunity",
    badgeVariant: "success",
    dealValue: "PKR 450,000",
  },
  {
    id: "lead-4",
    name: "Bilal Khan",
    company: "Green Crescent",
    client: "Eco Builders",
    status: "Overdue",
    badgeVariant: "danger",
    dealValue: "PKR 85,000",
  },
];

export default function DesignSystemPage() {
  const [searchValue, setSearchValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDestructive, setDialogDestructive] = useState(false);

  const columns: Column<SampleLead>[] = [
    {
      key: "name",
      header: "Lead Contact",
      cell: (lead) => (
        <div>
          <p className="font-extrabold text-[#101113]">{lead.name}</p>
          <p className="text-[11px] text-[#777D77] font-medium">{lead.company}</p>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client Workspace",
      cell: (lead) => <span className="font-bold text-[#202320]">{lead.client}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (lead) => (
        <StatusBadge label={lead.status} variant={lead.badgeVariant} />
      ),
    },
    {
      key: "value",
      header: "Deal Value",
      align: "right",
      cell: (lead) => <span className="font-extrabold text-[#101113]">{lead.dealValue}</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F3F4F2] text-[#202320] p-6 sm:p-12 max-w-7xl mx-auto space-y-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-8 border-b-2 border-[#101113] gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="badge-lime text-xs font-black uppercase tracking-wider">
              Neo-Minimalism Reference
            </span>
            <span className="text-xs font-bold text-[#777D77]">Creative Agency Visual Direction</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#101113] mt-3">
            LeadRescue AI Design System
          </h1>
          <p className="text-sm font-medium text-[#777D77] mt-1.5 max-w-2xl">
            Electric Lime accent, deep charcoal contrast surfaces, pure white canvases, and 3-archetype responsive cards.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/app/dashboard"
            className="btn-base btn-primary text-xs font-bold shadow-[0_3px_0_0_#101113]"
          >
            <span>Open Agency App Shell</span>
            <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
          </Link>
        </div>
      </div>

      {/* 1. Tri-Tone Card Archetypes */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Archetypes</span>
          <h2 className="text-xl font-black text-[#101113]">
            1. Tri-Tone Card Archetypes (Reference Implementation)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A: White */}
          <div className="card-white p-7 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-[#F3F4F2] border border-[#DCDDDA] text-[11px] font-black uppercase text-[#101113]">
                  Card Archetype A
                </span>
                <div className="circle-badge-dark">
                  <ArrowUpRight className="w-5 h-5 text-[#B7FF3C]" />
                </div>
              </div>
              <h3 className="text-xl font-black text-[#101113] leading-snug">
                Crisp White Surface
              </h3>
              <p className="text-xs text-[#777D77] mt-2 font-medium leading-relaxed">
                Primary CRM workspace canvas, high-contrast tables, clean forms, and transparent reporting modules.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#101113]">
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card B: Electric Lime */}
          <div className="card-lime p-7 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-[#FFFFFF] border border-[#101113] text-[11px] font-black uppercase text-[#101113]">
                  Card Archetype B
                </span>
                <div className="w-11 h-11 rounded-full bg-[#101113] flex items-center justify-center text-[#B7FF3C]">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
              <h3 className="text-xl font-black text-[#101113] leading-snug">
                Signature Electric Lime
              </h3>
              <p className="text-xs text-[#101113]/85 mt-2 font-semibold leading-relaxed">
                High-impact CTA blocks, AI recommendations, feature highlights, and active subscription callouts.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#101113]">
              <span>See workflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card C: Deep Charcoal */}
          <div className="card-charcoal p-7 flex flex-col justify-between min-h-[220px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-1 rounded-md bg-[#202327] border border-[#2A2E33] text-[11px] font-black uppercase text-[#B7FF3C]">
                  Card Archetype C
                </span>
                <div className="circle-badge-lime">
                  <ArrowUpRight className="w-5 h-5 text-[#101113]" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white leading-snug">
                Deep Charcoal Surface
              </h3>
              <p className="text-xs text-[#DCDDDA] mt-2 font-medium leading-relaxed">
                Dark sidebar navigation, Super Admin console, testimonial highlights, and high-impact editorial blocks.
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-black text-[#B7FF3C]">
              <span>Explore console</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#B7FF3C]" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Brand Tokens & Typography */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Palette</span>
          <h2 className="text-xl font-black text-[#101113]">
            2. Brand Palette & Color Tokens
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="bg-white border-2 border-[#101113] rounded-2xl p-4 space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="h-12 rounded-xl bg-[#B7FF3C] border border-[#101113]" />
            <div>
              <p className="text-xs font-black text-[#101113]">Electric Lime</p>
              <p className="text-[10px] text-[#777D77] font-mono">#B7FF3C</p>
            </div>
          </div>
          <div className="bg-white border-2 border-[#101113] rounded-2xl p-4 space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="h-12 rounded-xl bg-[#17191C]" />
            <div>
              <p className="text-xs font-black text-[#101113]">Deep Charcoal</p>
              <p className="text-[10px] text-[#777D77] font-mono">#17191C</p>
            </div>
          </div>
          <div className="bg-white border-2 border-[#101113] rounded-2xl p-4 space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="h-12 rounded-xl bg-[#101113]" />
            <div>
              <p className="text-xs font-black text-[#101113]">Almost Black</p>
              <p className="text-[10px] text-[#777D77] font-mono">#101113</p>
            </div>
          </div>
          <div className="bg-white border-2 border-[#101113] rounded-2xl p-4 space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="h-12 rounded-xl bg-[#F3F4F2] border border-[#DCDDDA]" />
            <div>
              <p className="text-xs font-black text-[#101113]">Soft Grey</p>
              <p className="text-[10px] text-[#777D77] font-mono">#F3F4F2</p>
            </div>
          </div>
          <div className="bg-white border-2 border-[#101113] rounded-2xl p-4 space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="h-12 rounded-xl bg-[#DCDDDA]" />
            <div>
              <p className="text-xs font-black text-[#101113]">Border Grey</p>
              <p className="text-[10px] text-[#777D77] font-mono">#DCDDDA</p>
            </div>
          </div>
          <div className="bg-white border-2 border-[#101113] rounded-2xl p-4 space-y-2 shadow-[0_3px_0_0_#101113]">
            <div className="h-12 rounded-xl bg-[#16A34A]" />
            <div>
              <p className="text-xs font-black text-[#101113]">Success Green</p>
              <p className="text-[10px] text-[#777D77] font-mono">#16A34A</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Button Archetypes */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Controls</span>
          <h2 className="text-xl font-black text-[#101113]">
            3. Interactive Button Archetypes
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-4 p-6 rounded-3xl bg-white border-2 border-[#DCDDDA]">
          <button type="button" className="btn-base btn-primary">
            <span>Primary Charcoal Button</span>
            <ArrowRight className="w-4 h-4 text-[#B7FF3C]" />
          </button>
          <button type="button" className="btn-base btn-lime">
            <span>Electric Lime Button</span>
            <ArrowRight className="w-4 h-4 text-[#101113]" />
          </button>
          <button type="button" className="btn-base btn-secondary">
            <span>Secondary Button</span>
          </button>
          <div className="circle-badge-dark">
            <ArrowUpRight className="w-5 h-5 text-[#B7FF3C]" />
          </div>
          <div className="circle-badge-lime">
            <ArrowUpRight className="w-5 h-5 text-[#101113]" />
          </div>
        </div>
      </section>

      {/* 4. Status Badges */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Badges</span>
          <h2 className="text-xl font-black text-[#101113]">
            4. Status Badges & Pill Indicators
          </h2>
        </div>
        <div className="flex flex-wrap gap-3 items-center p-6 rounded-3xl bg-white border-2 border-[#DCDDDA]">
          <StatusBadge label="New Lead" variant="default" />
          <StatusBadge label="Won Opportunity" variant="success" />
          <StatusBadge label="Follow-up Due" variant="warning" />
          <StatusBadge label="Overdue" variant="danger" />
          <StatusBadge label="AI Draft Ready" variant="ai" />
          <StatusBadge label="Archived" variant="neutral" />
          <StatusBadge label="Without Indicator" variant="default" dot={false} />
          <span className="badge-lime text-xs">Custom Headline Badge</span>
          <span className="badge-dark text-xs">Dark Headline Badge</span>
        </div>
      </section>

      {/* 5. Stat Cards */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Metrics</span>
          <h2 className="text-xl font-black text-[#101113]">
            5. Stat Cards & KPI Metrics
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Active Leads"
            value="1,428"
            change={{ value: "+12.4%", trend: "up", label: "vs last 30 days" }}
            icon={Users}
          />
          <StatCard
            title="Follow-ups Due Today"
            value="18"
            change={{ value: "4 Overdue", trend: "down", label: "Requires attention" }}
            icon={Clock}
          />
          <StatCard
            title="AI Recommendations"
            value="42"
            change={{ value: "+18%", trend: "up", label: "Drafted for review" }}
            icon={Sparkles}
            highlight={true}
          />
          <StatCard
            title="Pipeline Value"
            value="PKR 4.2M"
            change={{ value: "+8.1%", trend: "up", label: "Weighted forecast" }}
            icon={TrendingUp}
          />
        </div>
      </section>

      {/* 6. Entitlement & Usage Meters */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Quotas</span>
          <h2 className="text-xl font-black text-[#101113]">
            6. Entitlement & Usage Meters
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border-2 border-[#DCDDDA] bg-white p-6 shadow-[0_2px_0_0_#DCDDDA]">
            <UsageMeter
              label="Monthly Leads Ingestion"
              current={340}
              limit={500}
              unit="leads"
            />
          </div>
          <div className="rounded-3xl border-2 border-[#DCDDDA] bg-white p-6 shadow-[0_2px_0_0_#DCDDDA]">
            <UsageMeter
              label="AI Message Generations"
              current={820}
              limit={1000}
              unit="prompts"
            />
          </div>
          <div className="rounded-3xl border-2 border-[#DCDDDA] bg-white p-6 shadow-[0_2px_0_0_#DCDDDA]">
            <UsageMeter
              label="Client Workspaces"
              current={5}
              limit={5}
              unit="workspaces"
            />
          </div>
        </div>
      </section>

      {/* 7. Search & Filters */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Filtering</span>
          <h2 className="text-xl font-black text-[#101113]">
            7. Search & Filter Bar
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="Search leads by name, email, or client..."
              wrapperClassName="sm:w-80"
            />
            <FilterBar activeCount={1} onReset={() => {}}>
              <select className="input-base text-xs h-10 py-0 rounded-xl">
                <option>All Clients</option>
                <option>Horizon Commerce</option>
                <option>Metro Logistics</option>
              </select>
              <select className="input-base text-xs h-10 py-0 rounded-xl">
                <option>All Statuses</option>
                <option>Follow-up Due</option>
                <option>Won</option>
              </select>
            </FilterBar>
          </div>
        </div>
      </section>

      {/* 8. Data Table */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Tables</span>
          <h2 className="text-xl font-black text-[#101113]">
            8. Responsive Data Table
          </h2>
        </div>
        <DataTable
          columns={columns}
          data={sampleLeads}
          keyExtractor={(l) => l.id}
          currentPage={1}
          totalPages={3}
          onPageChange={() => {}}
        />
      </section>

      {/* 9. Dialog & Modal Controls */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">Modals</span>
          <h2 className="text-xl font-black text-[#101113]">
            9. Modals & Dialogs
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setDialogDestructive(false);
              setDialogOpen(true);
            }}
            className="btn-base btn-lime text-xs font-bold"
          >
            Open Standard Modal
          </button>
          <button
            type="button"
            onClick={() => {
              setDialogDestructive(true);
              setDialogOpen(true);
            }}
            className="btn-base bg-rose-50 border-1.5 border-rose-300 text-rose-800 hover:bg-rose-100 text-xs font-bold"
          >
            Open Destructive Modal
          </button>
        </div>

        <ConfirmDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={
            dialogDestructive
              ? "Archive Client Workspace?"
              : "Generate AI Follow-up Draft"
          }
          description={
            dialogDestructive
              ? "Are you sure you want to archive Horizon Commerce? All associated leads will be hidden from the active pipeline until restored."
              : "LeadRescue AI will review the lead's timeline and draft a personalized WhatsApp follow-up for your review."
          }
          isDestructive={dialogDestructive}
          confirmLabel={dialogDestructive ? "Yes, Archive Workspace" : "Generate Draft"}
          onConfirm={() => setDialogOpen(false)}
        />
      </section>

      {/* 10. Micro-states: Loading, Empty, Error */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <span className="badge-lime text-xs uppercase tracking-wider">States</span>
          <h2 className="text-xl font-black text-[#101113]">
            10. Component Micro-states
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border-2 border-[#DCDDDA] bg-white p-6 shadow-[0_2px_0_0_#DCDDDA]">
            <LoadingState message="Connecting to workspace..." />
          </div>
          <div className="rounded-3xl border-2 border-[#DCDDDA] bg-white p-6 shadow-[0_2px_0_0_#DCDDDA]">
            <EmptyState
              title="No neglected leads"
              description="Great job! All client enquiries have active follow-up tasks scheduled."
            />
          </div>
          <div className="rounded-3xl border-2 border-[#DCDDDA] bg-white p-6 shadow-[0_2px_0_0_#DCDDDA]">
            <ErrorState
              title="Sync Error"
              message="Unable to refresh lead timeline due to a network interruption."
              onRetry={() => {}}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
