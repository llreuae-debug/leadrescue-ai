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
  MessageSquare,
  Sparkles,
  ArrowRight,
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

    const previousLeads = [...leads];
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStage } : l))
    );

    const res = await updateLeadStageAction(leadId, newStage);
    if (!res.success) {
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

  const activePipelineValue = leads
    .filter((l) => l.status !== "lost")
    .reduce((sum, l) => sum + (Number(l.deal_value) || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Sales Pipeline"
        description="Visual Kanban board tracking enquiry velocity from New to Won. Drag cards or use keyboard stage selectors."
        badge={
          isDemo ? (
            <span className="badge-dark text-xs uppercase tracking-wider">
              Demo Workspace Mode
            </span>
          ) : (
            <span className="badge-lime text-xs uppercase tracking-wider">
              Real-time Pipeline
            </span>
          )
        }
      >
        <Link
          href="/app/leads"
          className="btn-base btn-primary text-xs font-black shadow-[0_3px_0_0_#101113]"
        >
          <Plus className="w-4 h-4 text-[#B7FF3C]" />
          <span>Add Lead</span>
        </Link>
      </PageHeader>

      {/* Filter and View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border-2 border-[#DCDDDA] shadow-[0_2px_0_0_#DCDDDA] text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClear={() => setSearch("")}
            placeholder="Search leads in pipeline..."
            wrapperClassName="w-full sm:w-72"
          />

          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="input-base text-xs h-10 py-0 rounded-xl bg-[#F3F4F2] font-bold border border-[#DCDDDA]"
          >
            <option value="all">All Client Workspaces</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-xs text-[#777D77] font-semibold">
            Pipeline Volume:{" "}
            <strong className="text-[#101113] font-black tabular-nums text-sm">
              {formatCurrencyPKR(activePipelineValue)}
            </strong>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F3F4F2] p-1 rounded-2xl border border-[#DCDDDA]">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-[#101113] text-[#B7FF3C] shadow-sm"
                  : "text-[#777D77] hover:text-[#101113]"
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-[#101113] text-[#B7FF3C] shadow-sm"
                  : "text-[#777D77] hover:text-[#101113]"
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
        /* KANBAN BOARD VIEW (Neo-minimalist style) */
        <div className="overflow-x-auto pb-6">
          <div className="flex gap-5 min-w-[1300px]">
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
                  className="w-[290px] shrink-0 flex flex-col rounded-3xl bg-[#F3F4F2] border-2 border-[#101113] p-4 max-h-[calc(100vh-240px)] shadow-[0_4px_0_0_#101113]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#101113]">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.color} border border-[#101113]`} />
                      <h3 className="font-black text-[#101113] text-xs">{stage.label}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-[#101113] text-[#B7FF3C] text-[10px] font-black">
                        {stageLeads.length}
                      </span>
                    </div>
                    {stageValue > 0 && (
                      <span className="text-[10px] font-bold text-[#777D77] tabular-nums">
                        {formatCurrencyPKR(stageValue)}
                      </span>
                    )}
                  </div>

                  {/* Column Cards */}
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                    {stageLeads.length === 0 ? (
                      <div className="py-12 text-center text-[#777D77] font-bold text-xs border-2 border-dashed border-[#DCDDDA] rounded-2xl bg-white/40">
                        Drop enquiry here
                      </div>
                    ) : (
                      stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, lead.id)}
                          onClick={() => setSelectedLead(lead)}
                          className="p-4 rounded-2xl border-2 border-[#101113] bg-white space-y-3 cursor-grab active:cursor-grabbing hover:bg-[#F3FDE1] shadow-[0_3px_0_0_#101113] hover:shadow-[0_5px_0_0_#101113] transition-all"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-extrabold text-[#101113] text-xs hover:underline decoration-[#B7FF3C] decoration-2">
                              {lead.name}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                lead.priority === "urgent"
                                  ? "bg-rose-50 text-rose-800 border-rose-300"
                                  : lead.priority === "high"
                                  ? "bg-amber-50 text-amber-900 border-amber-300"
                                  : "bg-[#B7FF3C] text-[#101113] border-[#101113]"
                              }`}
                            >
                              {lead.priority}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="truncate max-w-[140px] font-bold text-[#777D77]">
                              {lead.client?.name || "Client"}
                            </span>
                            <span className="font-black text-[#101113] tabular-nums">
                              {formatCurrencyPKR(lead.deal_value || 0)}
                            </span>
                          </div>

                          <div className="pt-2.5 border-t border-[#DCDDDA] flex items-center justify-between text-[10px] text-[#777D77] font-bold">
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
                              className="input-base text-[10px] h-6 py-0 px-1.5 bg-[#F3F4F2] font-bold border border-[#DCDDDA] rounded-lg"
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
        /* LIST VIEW */
        <div className="rounded-3xl border-2 border-[#101113] bg-white divide-y divide-[#DCDDDA] overflow-hidden shadow-[0_4px_0_0_#101113]">
          {leads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F3F4F2]/60 cursor-pointer transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-black text-[#101113] text-sm">{lead.name}</span>
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
                <p className="text-[#777D77] text-xs font-semibold">
                  Client: <strong className="text-[#101113] font-bold">{lead.client?.name}</strong> • {lead.source} • Priority: {lead.priority}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-black text-[#101113] tabular-nums text-sm">
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
                  className="input-base text-xs h-9 py-0 rounded-xl bg-[#F3F4F2] font-bold border border-[#DCDDDA]"
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

      {/* LEAD DETAIL DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#101113]/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white h-full border-l-2 border-[#101113] shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between p-6 border-b-2 border-[#DCDDDA]">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#17191C] text-[#B7FF3C] font-black flex items-center justify-center text-sm border-1.5 border-[#101113] shadow-[0_2px_0_0_#101113]">
                    {selectedLead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-black text-[#101113] text-lg">{selectedLead.name}</h3>
                    <p className="text-xs text-[#777D77] font-semibold">{selectedLead.client?.name || "Client Workspace"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-2 rounded-xl text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-xs">
                <div className="card-white p-5 space-y-3 bg-[#F3F4F2]">
                  <h4 className="font-black uppercase tracking-wider text-[11px] text-[#101113]">
                    Deal Attributes
                  </h4>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#777D77] font-medium">Pipeline Stage:</span>
                      <StatusBadge label={selectedLead.status.replace("_", " ")} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#777D77] font-medium">Deal Forecast Value:</span>
                      <span className="font-black text-[#101113] tabular-nums text-sm">
                        {formatCurrencyPKR(selectedLead.deal_value || 0)}
                      </span>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#777D77] font-medium">Phone / WhatsApp:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#101113]">{selectedLead.phone}</span>
                          <a
                            href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-[#B7FF3C] text-[#101113] hover:bg-[#A3EE28] border border-[#101113]"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {selectedLead.notes && (
                  <div className="space-y-2">
                    <label className="font-black text-[#101113] block">Sales Rep Notes</label>
                    <div className="p-4 rounded-2xl bg-white text-[#202320] leading-relaxed border-2 border-[#DCDDDA] font-medium">
                      {selectedLead.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 border-t-2 border-[#DCDDDA] bg-[#F3F4F2] flex items-center justify-between">
              <span className="text-[11px] text-[#777D77] font-semibold">
                Updated {new Date(selectedLead.updated_at || selectedLead.created_at).toLocaleDateString()}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="btn-base btn-secondary text-xs font-bold px-4 h-9 border-2 border-[#101113]"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOSS REASON MODAL */}
      {lossModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101113]/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border-2 border-[#101113] p-7 bg-white shadow-[0_10px_0_0_#101113] space-y-6 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 border border-rose-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-[#101113] text-base">Mark Opportunity as Lost</h3>
                <p className="text-xs text-[#777D77] font-medium">Provide a post-mortem reason for agency conversion reports</p>
              </div>
            </div>

            <FormField label="Primary Reason for Lost Deal" required>
              <select
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                className="input-base w-full font-bold text-xs"
              >
                <option value="Budget constraint / Price sensitivity">Budget constraint / Price sensitivity</option>
                <option value="Chosen competing agency or vendor">Chosen competing agency or vendor</option>
                <option value="No response after 3+ follow-ups">No response after 3+ follow-ups</option>
                <option value="Unqualified enquiry / spam lead">Unqualified enquiry / spam lead</option>
                <option value="Timing / Project cancelled">Timing / Project cancelled</option>
                <option value="Other">Other</option>
              </select>
            </FormField>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLossModalOpen(false);
                  setLossTargetLeadId(null);
                }}
                className="btn-base btn-secondary text-xs font-bold px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmLoss}
                className="btn-base bg-rose-600 hover:bg-rose-700 text-white border-1.5 border-rose-800 text-xs font-black px-5 shadow-[0_3px_0_0_#9f1239]"
              >
                Confirm Lost Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
