"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { getClientByIdAction, ClientWithMetrics } from "@/app/actions/clients";
import { getLeadsAction } from "@/app/actions/leads";
import { Lead } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable, Column } from "@/components/ui/DataTable";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  Building2,
  Users,
  Kanban,
  BarChart3,
  Settings,
  ArrowLeft,
  Plus,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const resolvedParams = use(params);
  const clientId = resolvedParams.clientId;

  const [client, setClient] = useState<ClientWithMetrics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "pipeline" | "reports" | "settings">("overview");

  useEffect(() => {
    async function loadClientData() {
      setLoading(true);
      setError(null);
      try {
        const clientRes = await getClientByIdAction(clientId);
        if (clientRes.success && clientRes.data) {
          setClient(clientRes.data);
          const leadsRes = await getLeadsAction({ clientId });
          if (leadsRes.success) {
            setLeads(leadsRes.data);
          }
        } else {
          setError(clientRes.error || "Client workspace not found.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load client.");
      } finally {
        setLoading(false);
      }
    }
    loadClientData();
  }, [clientId]);

  if (loading) {
    return <LoadingState type="skeleton" rows={5} />;
  }

  if (error || !client) {
    return (
      <div className="space-y-4">
        <Link
          href="/app/clients"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#101113] hover:text-[#777D77] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Clients</span>
        </Link>
        <ErrorState message={error || "Client not found."} />
      </div>
    );
  }

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Lead Contact",
      cell: (lead) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#17191C] text-[#B7FF3C] font-black text-xs flex items-center justify-center shrink-0 border border-[#101113]">
            {lead.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-[#101113]">{lead.name}</p>
            <p className="text-[11px] text-[#777D77] font-medium">{lead.company || lead.phone || lead.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "source",
      header: "Inbound Source",
      cell: (lead) => (
        <span className="badge-dark text-[11px]">{lead.source}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (lead) => (
        <StatusBadge
          label={lead.status.replace(/_/g, " ")}
          variant={
            lead.status === "won"
              ? "success"
              : lead.status === "follow_up_required"
              ? "warning"
              : lead.status === "new"
              ? "default"
              : "neutral"
          }
        />
      ),
    },
    {
      key: "deal_value",
      header: "Deal Value",
      align: "right",
      cell: (lead) => (
        <span className="font-mono font-bold text-[#101113] text-xs">
          {formatCurrencyPKR(lead.deal_value || 0)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/app/clients"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#777D77] hover:text-[#101113] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Clients</span>
        </Link>
      </div>

      {/* Client Page Header */}
      <PageHeader
        title={client.name}
        description={`Dedicated workspace for ${client.name} in ${client.industry}. All lead records and pipeline stages are strictly partitioned.`}
        badge={
          <span className={client.status === "active" ? "badge-lime text-[11px]" : "badge-dark text-[11px]"}>
            {client.status === "active" ? "Active Workspace" : "Archived"}
          </span>
        }
      >
        <Link
          href="/app/leads"
          className="btn-lime text-xs py-2 px-4 flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Lead</span>
        </Link>
      </PageHeader>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#F3F4F2] rounded-2xl border-2 border-[#101113] text-xs font-bold w-fit">
        {[
          { id: "overview", label: "Overview", icon: Building2 },
          { id: "leads", label: `Leads (${leads.length})`, icon: Users },
          { id: "pipeline", label: "Pipeline", icon: Kanban },
          { id: "reports", label: "Reports", icon: BarChart3 },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-[#17191C] text-[#B7FF3C] border-2 border-[#101113] shadow-xs"
                  : "text-[#777D77] hover:text-[#101113] border-2 border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Enquiries"
              value={client.totalLeads}
              change={{ value: "Historical count", trend: "neutral" }}
              icon={Users}
            />
            <StatCard
              title="Active Pipeline Leads"
              value={client.activeLeads}
              change={{ value: "In progress", trend: "up" }}
              icon={Clock}
              highlight={true}
            />
            <StatCard
              title="Won Opportunities"
              value={client.wonOpportunities}
              change={{ value: "Closed revenue", trend: "up" }}
              icon={CheckCircle2}
            />
          </div>

          <div className="card-white p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#101113]" />
                <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
                  Client Workspace Governance
                </h3>
              </div>
              <span className="badge-lime text-[10px]">Multi-Tenant Partitioned</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#F3F4F2] border-2 border-[#101113] space-y-1.5">
                <span className="text-[#777D77] font-black uppercase text-[10px] tracking-wider">
                  Assigned Account Manager
                </span>
                <p className="font-black text-[#101113] text-sm">
                  {client.account_manager?.full_name || "Unassigned Agency Rep"}
                </p>
                <p className="text-[11px] text-[#777D77] font-medium">{client.account_manager?.email || "No email linked"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F3F4F2] border-2 border-[#101113] space-y-1.5">
                <span className="text-[#777D77] font-black uppercase text-[10px] tracking-wider">
                  Industry & Provisioned Date
                </span>
                <p className="font-black text-[#101113] text-sm">{client.industry}</p>
                <p className="text-[11px] text-[#777D77] font-medium">
                  Created on {new Date(client.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LEADS */}
      {activeTab === "leads" && (
        <div className="space-y-4">
          <DataTable
            columns={columns}
            data={leads}
            keyExtractor={(l) => l.id}
            emptyTitle={`No leads recorded for ${client.name}`}
            emptyDescription="Import leads via CSV or create the first enquiry for this client workspace."
          />
        </div>
      )}

      {/* TAB 3: PIPELINE */}
      {activeTab === "pipeline" && (
        <div className="card-white p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#17191C] text-[#B7FF3C] flex items-center justify-center mx-auto border-2 border-[#101113]">
            <Kanban className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#101113]">Dedicated Visual Pipeline</h3>
          <p className="text-xs text-[#777D77] max-w-md mx-auto font-medium">
            View this client&apos;s 5-stage interactive Kanban board with live drag-and-drop stages in the main Pipeline module.
          </p>
          <div className="pt-2">
            <Link
              href="/app/pipeline"
              className="btn-lime text-xs px-5 py-2.5 inline-flex items-center gap-2"
            >
              <span>Open Interactive Pipeline</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS */}
      {activeTab === "reports" && (
        <div className="card-white p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#17191C] text-[#B7FF3C] flex items-center justify-center mx-auto border-2 border-[#101113]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-[#101113]">Client Performance Analytics</h3>
          <p className="text-xs text-[#777D77] max-w-md mx-auto font-medium">
            Review detailed conversion cohorts, acquisition source attribution, and rep SLAs in the Executive Reports module.
          </p>
          <div className="pt-2">
            <Link
              href="/app/reports"
              className="btn-lime text-xs px-5 py-2.5 inline-flex items-center gap-2"
            >
              <span>Open Reports Module</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeTab === "settings" && (
        <div className="card-white p-6 sm:p-8 space-y-5 max-w-xl">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
            <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
              Client Workspace Settings
            </h3>
            <span className="badge-dark text-[10px]">Admin Only</span>
          </div>

          <div className="space-y-4">
            <FormField label="Client Name" required>
              <input
                type="text"
                defaultValue={client.name}
                className="input-base w-full bg-white border-2 border-[#101113] rounded-xl text-xs font-bold text-[#101113] px-3.5 py-2.5"
              />
            </FormField>

            <FormField label="Industry Vertical" required>
              <input
                type="text"
                defaultValue={client.industry}
                className="input-base w-full bg-white border-2 border-[#101113] rounded-xl text-xs font-bold text-[#101113] px-3.5 py-2.5"
              />
            </FormField>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert("Settings updated successfully.")}
                className="btn-primary text-xs px-5 py-2.5"
              >
                Save Workspace Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
