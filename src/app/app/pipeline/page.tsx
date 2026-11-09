"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getLeadsAction } from "@/app/actions/leads";
import { getClientsAction, ClientWithMetrics } from "@/app/actions/clients";
import { updateLeadStageAction, PIPELINE_STAGES } from "@/app/actions/pipeline";
import { Lead, LeadStatus } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  Kanban,
  List,
  Filter,
  X,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronRight,
  MoveRight,
} from "lucide-react";

export default function PipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Filters & View Mode
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Selected Lead Drawer State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Loss Reason Dialog State
  const [lossModalOpen, setLossModalOpen] = useState(false);
  const [lossTargetLeadId, setLossTargetLeadId] = useState<string | null>(null);
  const [lossReason, setLossReason] = useState("Budget constraint / Price sensitivity");

  // Drag State
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, clientsRes] = await Promise.all([
        getLeadsAction({
          clientId: clientFilter,
          search,
        }),
        getClientsAction(),
      ]);

      if (leadsRes.success) {
        setLeads(leadsRes.data);
        setIsDemo(!!leadsRes.isDemo);
      } else {
        setError(leadsRes.error || "Failed to load pipeline leads.");
      }

      if (clientsRes.success) {
        setClients(clientsRes.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch pipeline data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clientFilter, search]);

  const handleStageChange = async (leadId: string, newStage: LeadStatus) => {
    if (newStage === "lost") {
      setLossTargetLeadId(leadId);
      setLossModalOpen(true);
      return;
    }

    // Optimistic UI update
    const previousLeads = [...leads];
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStage } : l))
    );

    const res = await updateLeadStageAction(leadId, newStage);
    if (!res.success) {
      // Rollback on failure
      setLeads(previousLeads);
      alert(res.error || "Failed to update pipeline stage.");
    }
  };

  const handleConfirmLoss = async () => {
    if (!lossTargetLeadId) return;

    const previousLeads = [...leads];
    setLeads((prev) =>
      prev.map((l) => (l.id === lossTargetLeadId ? { ...l, status: "lost" } : l))
    );
    setLossModalOpen(false);

    const res = await updateLeadStageAction(lossTargetLeadId, "lost", lossReason);
    if (!res.success) {
      setLeads(previousLeads);
      alert(res.error || "Failed to mark lead as lost.");
    }
    setLossTargetLeadId(null);
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId);
    setDraggedLeadId(leadId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, stageId: LeadStatus) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("text/plain") || draggedLeadId;
    if (leadId) {
      handleStageChange(leadId, stageId);
    }
    setDraggedLeadId(null);
  };

  // Calculate total pipeline value across active stages
  const activePipelineValue = leads
    .filter((l) => l.status !== "lost")
    .reduce((sum, l) => sum + (Number(l.deal_value) || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Sales Pipeline"
        description="Visual Kanban board tracking enquiry velocity from New to Won. Drag cards or use keyboard stage selectors."
        badge={
          isDemo ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Demo Workspace Mode
            </span>
          ) : (
            <StatusBadge label="Real-time Pipeline" variant="success" />
          )
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

      {/* Filter and View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search leads in pipeline..."
            wrapperClassName="w-full sm:w-64"
          />

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="input-base text-xs h-9 py-0 bg-slate-50"
          >
            <option value="all">All Client Workspaces</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-500">
            Pipeline Volume:{" "}
            <strong className="text-slate-900 font-bold tabular-nums">
              {formatCurrencyPKR(activePipelineValue)}
            </strong>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${
                viewMode === "kanban"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 ${
                viewMode === "list"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Pipeline Board */}
      {loading ? (
        <LoadingState type="skeleton" rows={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : viewMode === "kanban" ? (
        /* KANBAN BOARD VIEW */
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1240px]">
            {PIPELINE_STAGES.map((stage) => {
              const stageLeads = leads.filter((l) => l.status === stage.id);
              const stageValue = stageLeads.reduce(
                (sum, l) => sum + (Number(l.deal_value) || 0),
                0
              );

              return (
                <div
                  key={stage.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage.id)}
                  className="w-[280px] shrink-0 flex flex-col rounded-xl bg-slate-100/70 border border-slate-200/80 p-3 max-h-[calc(100vh-250px)]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                      <h3 className="font-bold text-slate-900 text-xs">{stage.label}</h3>
                      <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                        {stageLeads.length}
                      </span>
                    </div>
                    {stageValue > 0 && (
                      <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
                        {formatCurrencyPKR(stageValue)}
                      </span>
                    )}
                  </div>

                  {/* Column Cards */}
                  <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                    {stageLeads.length === 0 ? (
                      <div className="py-8 text-center text-slate-400 text-[11px] border border-dashed border-slate-200 rounded-lg">
                        Drop enquiry here
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onClick={() => setSelectedLead(lead)}
                          className="linear-card p-3.5 space-y-2.5 cursor-grab active:cursor-grabbing hover:border-slate-300 hover:shadow-sm transition-all bg-white"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-bold text-slate-900 text-xs hover:text-blue-600 transition-colors">
                              {lead.name}
                            </span>
                            <span
                              className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                lead.priority === "urgent"
                                  ? "bg-rose-100 text-rose-800"
                                  : lead.priority === "high"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {lead.priority}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span className="truncate max-w-[140px] font-medium text-slate-700">
                              {lead.client?.name || "Client"}
                            </span>
                            <span className="font-bold text-slate-900 tabular-nums">
                              {formatCurrencyPKR(lead.deal_value || 0)}
                            </span>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                            <span className="truncate">
                              {lead.source}
                            </span>

                            {/* Keyboard-Accessible Stage Selector */}
                            <select
                              aria-label={`Change stage for ${lead.name}`}
                              value={lead.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleStageChange(lead.id, e.target.value as LeadStatus);
                              }}
                              className="input-base text-[10px] h-6 py-0 px-1.5 bg-slate-50 font-semibold"
                            >
                              {PIPELINE_STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  → {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* LIST VIEW FOR NARROW / MOBILE SCREENS */
        <div className="linear-card divide-y divide-slate-100 text-xs">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 cursor-pointer"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{lead.name}</span>
                  <StatusBadge
                    label={lead.status.replace("_", " ")}
                    variant={
                      lead.status === "won"
                        ? "success"
                        : lead.status === "follow_up_required"
                        ? "warning"
                        : lead.status === "lost"
                        ? "danger"
                        : "default"
                    }
                  />
                </div>
                <p className="text-slate-500 text-xs">
                  Client: <strong className="text-slate-700 font-medium">{lead.client?.name}</strong> • {lead.source} • Priority: {lead.priority}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatCurrencyPKR(lead.deal_value || 0)}
                </span>
                <select
                  aria-label={`Move stage for ${lead.name}`}
                  value={lead.status}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleStageChange(lead.id, e.target.value as LeadStatus);
                  }}
                  className="input-base text-xs h-8 py-0 bg-slate-50 font-semibold"
                >
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LOSS REASON CONFIRMATION DIALOG */}
      {lossModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-md linear-card p-6 bg-white shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center gap-2.5 text-rose-600 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-slate-900 text-sm">Mark Lead as Lost</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Recording why enquiries are lost helps your agency identify pricing resistance, qualification mismatch, or slow follow-ups.
            </p>

            <FormField label="Primary Reason for Loss" required>
              <select
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                className="input-base w-full text-xs"
              >
                <option value="Budget constraint / Price sensitivity">
                  Budget constraint / Price sensitivity
                </option>
                <option value="Selected competitor agency">Selected competitor agency</option>
                <option value="Unresponsive to 3+ follow-up attempts">
                  Unresponsive to 3+ follow-up attempts
                </option>
                <option value="Unqualified business / Incompatible vertical">
                  Unqualified business / Incompatible vertical
                </option>
                <option value="Client cancelled campaign">Client cancelled campaign</option>
              </select>
            </FormField>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLossModalOpen(false)}
                className="btn-base bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 h-9"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLoss}
                className="btn-base bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-4 h-9 shadow-xs"
              >
                Confirm Loss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEAD DETAIL DRAWER (reused from Leads module) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 p-6 space-y-6 text-xs">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedLead.name}</h3>
                  <p className="text-slate-400">{selectedLead.client?.name || "Client"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 space-y-2 border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Pipeline Stage:</span>
                  <StatusBadge
                    label={selectedLead.status.replace("_", " ")}
                    variant={selectedLead.status === "won" ? "success" : "default"}
                  />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Deal Value:</span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatCurrencyPKR(selectedLead.deal_value || 0)}
                  </span>
                </div>
                {selectedLead.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">WhatsApp:</span>
                    <a
                      href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{selectedLead.phone}</span>
                    </a>
                  </div>
                )}
              </div>

              {selectedLead.notes && (
                <div className="space-y-1">
                  <span className="font-semibold text-slate-700">Notes & Loss Reason:</span>
                  <p className="p-3 rounded-lg bg-slate-50 text-slate-700 border border-slate-200">
                    {selectedLead.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="btn-base bg-slate-100 text-slate-700 text-xs font-semibold px-4 h-9"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
