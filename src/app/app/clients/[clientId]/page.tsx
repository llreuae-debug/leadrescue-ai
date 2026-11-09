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
import { EmptyState } from "@/components/ui/EmptyState";
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
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
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
        <div>
          <p className="font-semibold text-slate-900">{lead.name}</p>
          <p className="text-[11px] text-slate-400">{lead.company || lead.phone || lead.email}</p>
        </div>
      ),
    },
    {
      key: "source",
      header: "Source",
      cell: (lead) => <span className="font-medium text-slate-600">{lead.source}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (lead) => (
        <StatusBadge
          label={lead.status.replace("_", " ")}
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
        <span className="font-semibold text-slate-900 tabular-nums">
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Clients</span>
        </Link>
      </div>

      {/* Client Page Header */}
      <PageHeader
        title={client.name}
        description={`Dedicated workspace in ${client.industry}. Enquiries and reports are completely isolated.`}
        badge={
          <StatusBadge
            label={client.status === "active" ? "Active Client" : "Archived"}
            variant={client.status === "active" ? "success" : "neutral"}
          />
        }
      >
        <Link
          href="/app/leads"
          className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs h-9 px-3.5"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Lead</span>
        </Link>
      </PageHeader>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
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
              className={`flex items-center gap-2 px-4 py-2.5 border-b-2 transition-colors ${
                isActive
                  ? "border-blue-600 text-blue-600 font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-900"
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
            />
            <StatCard
              title="Won Opportunities"
              value={client.wonOpportunities}
              change={{ value: "Closed revenue", trend: "up" }}
              icon={CheckCircle2}
            />
          </div>

          <div className="linear-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Workspace Metadata</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Account Manager</span>
                <p className="font-semibold text-slate-800">
                  {client.account_manager?.full_name || "Unassigned"}
                </p>
                <p className="text-[11px] text-slate-500">{client.account_manager?.email}</p>
              </div>
              <div className="p-3.5 rounded-lg bg-slate-50 space-y-1">
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Industry Vertical</span>
                <p className="font-semibold text-slate-800">{client.industry}</p>
                <p className="text-[11px] text-slate-500">Created {new Date(client.created_at).toLocaleDateString()}</p>
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
            emptyDescription="Import leads via CSV or create the first enquiry for this client."
          />
        </div>
      )}

      {/* TAB 3: PIPELINE */}
      {activeTab === "pipeline" && (
        <div className="linear-card p-8 text-center space-y-3">
          <Kanban className="w-8 h-8 text-blue-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Dedicated Pipeline</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            View this client&apos;s full interactive Kanban board in the main Sales Pipeline module.
          </p>
          <div className="pt-2">
            <Link
              href="/app/pipeline"
              className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 h-9 shadow-xs"
            >
              Open Agency Pipeline →
            </Link>
          </div>
        </div>
      )}

      {/* TAB 4: REPORTS */}
      {activeTab === "reports" && (
        <div className="linear-card p-8 text-center space-y-3">
          <BarChart3 className="w-8 h-8 text-blue-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Client Performance Reports</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Review detailed conversion cohorts, source attribution, and rep SLAs in the Reports module.
          </p>
          <div className="pt-2">
            <Link
              href="/app/reports"
              className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 h-9 shadow-xs"
            >
              Open Reports Module →
            </Link>
          </div>
        </div>
      )}

      {/* TAB 5: SETTINGS */}
      {activeTab === "settings" && (
        <div className="linear-card p-6 sm:p-8 space-y-5 max-w-xl">
          <h3 className="text-sm font-bold text-slate-900">Client Settings</h3>
          <div className="space-y-4">
            <FormField label="Client Name" required>
              <input
                type="text"
                defaultValue={client.name}
                className="input-base w-full"
              />
            </FormField>
            <FormField label="Industry" required>
              <input
                type="text"
                defaultValue={client.industry}
                className="input-base w-full"
              />
            </FormField>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert("Settings updated successfully.")}
                className="btn-base bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold px-4 h-9 shadow-xs"
              >
                Save Client Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
