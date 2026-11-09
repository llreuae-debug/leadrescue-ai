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
  AlertCircle,
  CheckCircle2,
  Filter,
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
          <p className="font-semibold text-slate-900">{lead.name}</p>
          <p className="text-[11px] text-slate-400">{lead.company}</p>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client Workspace",
      cell: (lead) => <span className="font-medium text-slate-600">{lead.client}</span>,
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
      cell: (lead) => <span className="font-semibold text-slate-900">{lead.dealValue}</span>,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 sm:p-10 max-w-6xl mx-auto space-y-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              Stage 1 Foundation
            </span>
            <span className="text-xs text-slate-400">Design System & Component Showcase</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-2">
            LeadRescue AI Component Architecture
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Linear and Stripe inspired UI tokens, accessible primitives, and consistent micro-states.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/app/dashboard"
            className="btn-base bg-blue-600 text-white hover:bg-blue-700 text-xs shadow-xs"
          >
            <span>Open Application Shell</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 1. Brand Tokens & Typography */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          1. Brand Palette & Color Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          <div className="linear-card p-3 space-y-2">
            <div className="h-10 rounded-md bg-[#2563EB]" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Primary Blue</p>
              <p className="text-[10px] text-slate-400 font-mono">#2563EB</p>
            </div>
          </div>
          <div className="linear-card p-3 space-y-2">
            <div className="h-10 rounded-md bg-[#101827]" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Deep Navy</p>
              <p className="text-[10px] text-slate-400 font-mono">#101827</p>
            </div>
          </div>
          <div className="linear-card p-3 space-y-2">
            <div className="h-10 rounded-md bg-[#7C3AED]" />
            <div>
              <p className="text-xs font-semibold text-slate-800">AI Violet</p>
              <p className="text-[10px] text-slate-400 font-mono">#7C3AED</p>
            </div>
          </div>
          <div className="linear-card p-3 space-y-2">
            <div className="h-10 rounded-md bg-[#16A34A]" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Success</p>
              <p className="text-[10px] text-slate-400 font-mono">#16A34A</p>
            </div>
          </div>
          <div className="linear-card p-3 space-y-2">
            <div className="h-10 rounded-md bg-[#D97706]" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Warning</p>
              <p className="text-[10px] text-slate-400 font-mono">#D97706</p>
            </div>
          </div>
          <div className="linear-card p-3 space-y-2">
            <div className="h-10 rounded-md bg-[#DC2626]" />
            <div>
              <p className="text-xs font-semibold text-slate-800">Danger</p>
              <p className="text-[10px] text-slate-400 font-mono">#DC2626</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Status Badges */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          2. Status Badges
        </h2>
        <div className="flex flex-wrap gap-2.5 items-center p-4 rounded-xl bg-white border border-slate-200">
          <StatusBadge label="New Lead" variant="default" />
          <StatusBadge label="Won Opportunity" variant="success" />
          <StatusBadge label="Follow-up Due" variant="warning" />
          <StatusBadge label="Overdue" variant="danger" />
          <StatusBadge label="AI Draft Ready" variant="ai" />
          <StatusBadge label="Archived" variant="neutral" />
          <StatusBadge label="Without Indicator" variant="default" dot={false} />
        </div>
      </section>

      {/* 3. Stat Cards */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          3. Stat Cards & KPI Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          />
          <StatCard
            title="Pipeline Value"
            value="PKR 4.2M"
            change={{ value: "+8.1%", trend: "up", label: "Weighted forecast" }}
            icon={TrendingUp}
          />
        </div>
      </section>

      {/* 4. Usage Meters */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          4. Entitlement & Usage Meters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="linear-card p-4 space-y-3">
            <UsageMeter
              label="Monthly Leads Ingestion"
              current={340}
              limit={500}
              unit="leads"
            />
          </div>
          <div className="linear-card p-4 space-y-3">
            <UsageMeter
              label="AI Message Generations"
              current={820}
              limit={1000}
              unit="prompts"
            />
          </div>
          <div className="linear-card p-4 space-y-3">
            <UsageMeter
              label="Client Workspaces"
              current={5}
              limit={5}
              unit="workspaces"
            />
          </div>
        </div>
      </section>

      {/* 5. Search & Filters */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          5. Search & Filter Bar
        </h2>
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <SearchInput
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onClear={() => setSearchValue("")}
              placeholder="Search leads by name, email, or client..."
              wrapperClassName="sm:w-80"
            />
            <FilterBar activeCount={1} onReset={() => {}}>
              <select className="input-base text-xs h-8 py-0">
                <option>All Clients</option>
                <option>Horizon Commerce</option>
                <option>Metro Logistics</option>
              </select>
              <select className="input-base text-xs h-8 py-0">
                <option>All Statuses</option>
                <option>Follow-up Due</option>
                <option>Won</option>
              </select>
            </FilterBar>
          </div>
        </div>
      </section>

      {/* 6. Data Table */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          6. Responsive Data Table
        </h2>
        <DataTable
          columns={columns}
          data={sampleLeads}
          keyExtractor={(l) => l.id}
          currentPage={1}
          totalPages={3}
          onPageChange={() => {}}
        />
      </section>

      {/* 7. Dialog & Modal Controls */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          7. Modals & Dialogs
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setDialogDestructive(false);
              setDialogOpen(true);
            }}
            className="btn-base bg-blue-600 text-white hover:bg-blue-700 text-xs shadow-xs"
          >
            Open Standard Dialog
          </button>
          <button
            type="button"
            onClick={() => {
              setDialogDestructive(true);
              setDialogOpen(true);
            }}
            className="btn-base bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs"
          >
            Open Destructive Dialog
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

      {/* 8. Micro-states: Loading, Empty, Error */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
          8. Component Micro-states
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="linear-card p-4">
            <LoadingState message="Connecting to workspace..." />
          </div>
          <div className="linear-card p-4">
            <EmptyState
              title="No neglected leads"
              description="Great job! All client enquiries have active follow-up tasks scheduled."
            />
          </div>
          <div className="linear-card p-4">
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
