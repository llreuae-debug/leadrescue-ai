"use client";

import React, { useState, useEffect } from "react";
import {
  getLeadsAction,
  createLeadAction,
  updateLeadStatusAction,
  importLeadsCSVAction,
  CSVLeadRow,
} from "@/app/actions/leads";
import { getClientsAction, ClientWithMetrics } from "@/app/actions/clients";
import { Lead, LeadStatus, LeadPriority } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { DataTable, Column } from "@/components/ui/DataTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  Users,
  Plus,
  Upload,
  Download,
  Filter,
  X,
  Sparkles,
  AlertTriangle,
  MessageSquare,
  FileSpreadsheet,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [clients, setClients] = useState<ClientWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [clientFilter, setClientFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Lead Detail Drawer State
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Add Lead Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    clientId: "",
    source: "Meta Ads",
    campaign: "Inbound Campaign",
    status: "new" as LeadStatus,
    priority: "medium" as LeadPriority,
    dealValue: 0,
    notes: "",
  });
  const [creating, setCreating] = useState(false);
  const [createWarning, setCreateWarning] = useState<string | null>(null);

  // CSV Import Modal State
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [csvTargetClient, setCsvTargetClient] = useState("");
  const [csvPreviewRows, setCsvPreviewRows] = useState<CSVLeadRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    duplicates: number;
    errors: string[];
  } | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [leadsRes, clientsRes] = await Promise.all([
        getLeadsAction({
          clientId: clientFilter,
          status: statusFilter,
          priority: priorityFilter,
          search,
        }),
        getClientsAction(),
      ]);

      if (leadsRes.success) {
        setLeads(leadsRes.data);
        setIsDemo(!!leadsRes.isDemo);
      } else {
        setError(leadsRes.error || "Failed to load leads");
      }

      if (clientsRes.success) {
        setClients(clientsRes.data);
        if (!csvTargetClient && clientsRes.data.length > 0) {
          setCsvTargetClient(clientsRes.data[0].id);
        }
        if (!newLead.clientId && clientsRes.data.length > 0) {
          setNewLead((prev) => ({ ...prev, clientId: clientsRes.data[0].id }));
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [clientFilter, statusFilter, priorityFilter, search]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateWarning(null);

    const res = await createLeadAction({
      clientId: newLead.clientId || (clients[0]?.id ?? ""),
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      company: newLead.company,
      source: newLead.source,
      campaign: newLead.campaign,
      status: newLead.status,
      priority: newLead.priority,
      dealValue: newLead.dealValue,
      notes: newLead.notes,
    });

    if (res.success) {
      setAddModalOpen(false);
      setNewLead({
        name: "",
        email: "",
        phone: "",
        company: "",
        clientId: clients[0]?.id || "",
        source: "Meta Ads",
        campaign: "Inbound Campaign",
        status: "new",
        priority: "medium",
        dealValue: 0,
        notes: "",
      });
      loadData();
    } else {
      setCreateWarning(res.error || "Failed to create lead.");
    }
    setCreating(false);
  };

  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Company", "Client", "Source", "Status", "Priority", "Deal Value"];
    const rows = leads.map((l) => [
      l.name,
      l.email || "",
      l.phone || "",
      l.company || "",
      l.client?.name || "",
      l.source,
      l.status,
      l.priority,
      l.deal_value || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((cell) => `"${cell}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `LeadRescue_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateCSVFile = () => {
    const sampleRows: CSVLeadRow[] = [
      {
        name: "Rashid Minhas",
        email: "rashid@textiles.pk",
        phone: "+92 301 2233445",
        company: "Minhas Fabrics",
        source: "CSV Import",
        dealValue: 350000,
        status: "new",
        priority: "high",
        notes: "Inquired via bulk textile expo",
      },
      {
        name: "Sobia Qasim",
        email: "sobia@fashionhub.pk",
        phone: "+92 322 9988112",
        company: "Fashion Hub",
        source: "CSV Import",
        dealValue: 120000,
        status: "new",
        priority: "medium",
        notes: "Instagram lead sheet export",
      },
    ];
    setCsvPreviewRows(sampleRows);
  };

  const handleConfirmCSVImport = async () => {
    setImporting(true);
    setImportResult(null);

    const res = await importLeadsCSVAction(csvTargetClient, csvPreviewRows);
    if (res.success) {
      setImportResult({
        imported: res.importedCount,
        duplicates: res.duplicateCount,
        errors: res.errors.map((e) => `Row ${e.row}: ${e.error}`),
      });
      loadData();
    }
    setImporting(false);
  };

  const columns: Column<Lead>[] = [
    {
      key: "name",
      header: "Lead Contact",
      cell: (lead) => (
        <div
          onClick={() => setSelectedLead(lead)}
          className="cursor-pointer group flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-[#17191C] text-[#B7FF3C] font-black flex items-center justify-center text-xs shrink-0 group-hover:scale-105 transition-transform shadow-[0_2px_0_0_#101113]">
            {lead.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-extrabold text-[#101113] group-hover:underline">
              {lead.name}
            </p>
            <p className="text-[11px] text-[#777D77] font-medium">
              {lead.company ? `${lead.company} • ` : ""}
              {lead.phone || lead.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client Workspace",
      cell: (lead) => (
        <span className="font-bold text-[#202320]">{lead.client?.name || "General"}</span>
      ),
    },
    {
      key: "source",
      header: "Source / Campaign",
      cell: (lead) => (
        <div>
          <span className="font-bold text-[#101113]">{lead.source}</span>
          {lead.campaign && (
            <p className="text-[10px] text-[#777D77] truncate max-w-[140px] font-medium">
              {lead.campaign}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "priority",
      header: "Priority",
      cell: (lead) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            lead.priority === "urgent"
              ? "bg-rose-50 text-rose-800 border-rose-300"
              : lead.priority === "high"
              ? "bg-amber-50 text-amber-900 border-amber-300"
              : lead.priority === "medium"
              ? "bg-[#B7FF3C] text-[#101113] border-[#101113]"
              : "bg-[#F3F4F2] text-[#777D77] border-[#DCDDDA]"
          }`}
        >
          {lead.priority}
        </span>
      ),
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
              : lead.status === "lost"
              ? "danger"
              : "default"
          }
        />
      ),
    },
    {
      key: "deal_value",
      header: "Deal Value",
      align: "right",
      cell: (lead) => (
        <span className="font-extrabold text-[#101113] tabular-nums">
          {formatCurrencyPKR(lead.deal_value || 0)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lead Management"
        description="Every Lead Deserves a Follow-Up. Central enquiry intake, duplicate detection, and representative assignment."
        badge={
          isDemo ? (
            <span className="badge-dark text-xs uppercase tracking-wider">
              Demo Workspace Mode
            </span>
          ) : (
            <span className="badge-lime text-xs uppercase tracking-wider">
              {leads.length} Active Enquiries
            </span>
          )
        }
      >
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="btn-base btn-primary text-xs font-black shadow-[0_3px_0_0_#101113]"
        >
          <Plus className="w-4 h-4 text-[#B7FF3C]" />
          <span>Add Lead</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setCsvPreviewRows([]);
            setImportResult(null);
            setCsvModalOpen(true);
          }}
          className="btn-base btn-secondary text-xs font-bold border-2 border-[#101113]"
        >
          <Upload className="w-3.5 h-3.5 mr-1 text-[#101113]" />
          <span>Import CSV</span>
        </button>
        <button
          type="button"
          onClick={handleExportCSV}
          className="btn-base btn-secondary text-xs font-bold border-2 border-[#101113]"
        >
          <Download className="w-3.5 h-3.5 mr-1 text-[#101113]" />
          <span>Export CSV</span>
        </button>
      </PageHeader>

      {/* Search and Multi-Criteria Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-3xl bg-white border-2 border-[#DCDDDA] shadow-[0_2px_0_0_#DCDDDA] text-xs">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search by name, email, phone, or company..."
          wrapperClassName="w-full sm:w-80"
        />

        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="input-base text-xs h-10 py-0 rounded-xl bg-[#F3F4F2] font-bold border border-[#DCDDDA]"
          >
            <option value="all">All Clients</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-base text-xs h-10 py-0 rounded-xl bg-[#F3F4F2] font-bold border border-[#DCDDDA]"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="follow_up_required">Follow-up Required</option>
            <option value="proposal_sent">Proposal Sent</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-base text-xs h-10 py-0 rounded-xl bg-[#F3F4F2] font-bold border border-[#DCDDDA]"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {(search || clientFilter !== "all" || statusFilter !== "all" || priorityFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setClientFilter("all");
              setStatusFilter("all");
              setPriorityFilter("all");
            }}
            className="text-xs text-[#101113] hover:underline font-black cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Leads Data Table */}
      {loading ? (
        <LoadingState type="skeleton" rows={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadData} />
      ) : (
        <DataTable
          columns={columns}
          data={leads}
          keyExtractor={(l) => l.id}
          emptyTitle="No leads matching current filters"
          emptyDescription="Try clearing your search criteria or create an enquiry."
        />
      )}

      {/* LEAD DETAIL DRAWER (High-contrast neo-minimalist style) */}
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
                  className="p-2 rounded-xl text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-xs">
                {/* Contact information card */}
                <div className="card-white p-5 space-y-3 bg-[#F3F4F2]">
                  <h4 className="font-black uppercase tracking-wider text-[11px] text-[#101113]">
                    Contact & Campaign Details
                  </h4>
                  <div className="space-y-2.5">
                    {selectedLead.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#777D77] font-medium">WhatsApp / Phone:</span>
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
                    {selectedLead.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-[#777D77] font-medium">Email:</span>
                        <a
                          href={`mailto:${selectedLead.email}`}
                          className="font-bold text-[#101113] hover:underline decoration-[#B7FF3C]"
                        >
                          {selectedLead.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[#777D77] font-medium">Deal Value:</span>
                      <span className="font-black text-[#101113] tabular-nums">
                        {formatCurrencyPKR(selectedLead.deal_value || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#777D77] font-medium">Inbound Channel:</span>
                      <span className="font-bold text-[#101113]">{selectedLead.source}</span>
                    </div>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="space-y-2">
                  <label className="font-black text-[#101113] block">Lead Pipeline Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value as LeadStatus;
                      await updateLeadStatusAction(selectedLead.id, newStatus);
                      setSelectedLead({ ...selectedLead, status: newStatus });
                      loadData();
                    }}
                    className="input-base w-full bg-white text-xs font-bold border-1.5 border-[#101113]"
                  >
                    <option value="new">New Enquiry</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="follow_up_required">Follow-up Required</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="won">Won Opportunity</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                {/* Notes */}
                {selectedLead.notes && (
                  <div className="space-y-2">
                    <label className="font-black text-[#101113] block">Recorded Notes</label>
                    <div className="p-4 rounded-2xl bg-white text-[#202320] leading-relaxed border-2 border-[#DCDDDA] font-medium">
                      {selectedLead.notes}
                    </div>
                  </div>
                )}

                {/* AI Follow-up Recommendation Preview */}
                <div className="card-charcoal p-5 space-y-2">
                  <div className="flex items-center gap-2 font-black text-[#B7FF3C]">
                    <Sparkles className="w-4 h-4" />
                    <span>Grounded AI Sales Suggestion</span>
                  </div>
                  <p className="text-[11px] text-[#DCDDDA] leading-relaxed font-medium">
                    Lead is in &quot;{selectedLead.status}&quot; stage with {selectedLead.source} origin. Draft an English or Urdu WhatsApp follow-up tailored to their enquiry history.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 border-t-2 border-[#DCDDDA] bg-[#F3F4F2] flex items-center justify-between">
              <span className="text-[11px] text-[#777D77] font-semibold">
                Created {new Date(selectedLead.created_at).toLocaleDateString()}
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

      {/* CREATE LEAD MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101113]/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border-2 border-[#101113] p-7 bg-white shadow-[0_10px_0_0_#101113] space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#DCDDDA]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center font-black">
                  <Plus className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#101113] text-base">Add Inbound Enquiry</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-xl text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createWarning && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>{createWarning}</p>
              </div>
            )}

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Contact Full Name" required>
                  <input
                    type="text"
                    required
                    value={newLead.name}
                    onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                    placeholder="e.g. Tariq Mahmood"
                    className="input-base w-full"
                    disabled={creating}
                  />
                </FormField>
                <FormField label="Client Workspace" required>
                  <select
                    value={newLead.clientId}
                    onChange={(e) => setNewLead({ ...newLead, clientId: e.target.value })}
                    className="input-base w-full"
                    disabled={creating}
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="WhatsApp / Phone">
                  <input
                    type="tel"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    placeholder="+92 3XX XXXXXXX"
                    className="input-base w-full"
                    disabled={creating}
                  />
                </FormField>
                <FormField label="Email Address">
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    placeholder="contact@company.pk"
                    className="input-base w-full"
                    disabled={creating}
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormField label="Inbound Channel">
                  <select
                    value={newLead.source}
                    onChange={(e) => setNewLead({ ...newLead, source: e.target.value })}
                    className="input-base w-full text-xs font-bold"
                    disabled={creating}
                  >
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Website Form">Website Form</option>
                    <option value="WhatsApp Click">WhatsApp Click</option>
                    <option value="Referral">Referral</option>
                  </select>
                </FormField>
                <FormField label="Priority">
                  <select
                    value={newLead.priority}
                    onChange={(e) => setNewLead({ ...newLead, priority: e.target.value as any })}
                    className="input-base w-full text-xs font-bold"
                    disabled={creating}
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </FormField>
                <FormField label="Deal Value (PKR)">
                  <input
                    type="number"
                    value={newLead.dealValue || ""}
                    onChange={(e) => setNewLead({ ...newLead, dealValue: Number(e.target.value) })}
                    placeholder="250000"
                    className="input-base w-full text-xs font-bold"
                    disabled={creating}
                  />
                </FormField>
              </div>

              <FormField label="Lead Notes / Enquired Products">
                <textarea
                  rows={3}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="Specific requirements, quotation details, or discussion summary..."
                  className="w-full rounded-xl border-1.5 border-[#DCDDDA] p-3 text-xs text-[#202320] focus:border-[#101113] focus:ring-2 focus:ring-[#B7FF3C]/40 outline-none"
                  disabled={creating}
                />
              </FormField>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  disabled={creating}
                  className="btn-base btn-secondary text-xs font-bold px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-base btn-primary text-xs font-black px-5 shadow-[0_3px_0_0_#101113]"
                >
                  {creating ? "Saving..." : "Create Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {csvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101113]/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl border-2 border-[#101113] p-7 bg-white shadow-[0_10px_0_0_#101113] space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#DCDDDA]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center font-black">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-[#101113] text-base">Import Inbound Leads via CSV</h3>
                  <p className="text-[11px] text-[#777D77] font-medium">Map spreadsheet columns and validate rows before writing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCsvModalOpen(false)}
                className="p-1.5 rounded-xl text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              <FormField label="Target Client Workspace" required>
                <select
                  value={csvTargetClient}
                  onChange={(e) => setCsvTargetClient(e.target.value)}
                  className="input-base w-full font-bold"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.industry})
                    </option>
                  ))}
                </select>
              </FormField>

              {/* Upload Dropzone */}
              {csvPreviewRows.length === 0 ? (
                <div className="border-2 border-dashed border-[#DCDDDA] rounded-3xl p-8 text-center space-y-3 bg-[#F3F4F2]/50">
                  <Upload className="w-9 h-9 text-[#17191C] mx-auto" />
                  <div>
                    <p className="text-xs font-black text-[#101113]">
                      Choose CSV file to parse
                    </p>
                    <p className="text-[11px] text-[#777D77] mt-0.5 font-medium">
                      Columns expected: Name, Phone, Email, Company, Deal Value, Notes
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateCSVFile}
                    className="btn-base btn-primary text-xs font-black px-5 shadow-[0_3px_0_0_#101113]"
                  >
                    Load Sample CSV Dataset
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-[#101113]">
                    <span>Parsed Rows Preview ({csvPreviewRows.length} records ready)</span>
                    <button
                      type="button"
                      onClick={() => setCsvPreviewRows([])}
                      className="text-[#777D77] hover:text-[#101113] underline font-bold"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="border-2 border-[#DCDDDA] rounded-2xl overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#F3F4F2] border-b border-[#DCDDDA] text-[11px] text-[#101113] font-black uppercase">
                        <tr>
                          <th className="p-3">Name</th>
                          <th className="p-3">Phone</th>
                          <th className="p-3">Email</th>
                          <th className="p-3 text-right">Value (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#DCDDDA]">
                        {csvPreviewRows.map((row, i) => (
                          <tr key={i} className="hover:bg-[#F3F4F2]/60">
                            <td className="p-3 font-extrabold text-[#101113]">{row.name}</td>
                            <td className="p-3 text-[#202320] font-medium">{row.phone}</td>
                            <td className="p-3 text-[#202320] font-medium">{row.email}</td>
                            <td className="p-3 text-right tabular-nums font-black text-[#101113]">
                              {formatCurrencyPKR(row.dealValue || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {importResult && (
                    <div className="p-4 rounded-2xl bg-[#F3FDE1] border-1.5 border-[#101113] text-xs text-[#101113] space-y-1 font-bold">
                      <p>
                        ✓ Successfully imported {importResult.imported} records into target client workspace!
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#DCDDDA]">
                <button
                  type="button"
                  onClick={() => setCsvModalOpen(false)}
                  className="btn-base btn-secondary text-xs font-bold px-4"
                >
                  Close
                </button>
                {csvPreviewRows.length > 0 && !importResult && (
                  <button
                    type="button"
                    onClick={handleConfirmCSVImport}
                    disabled={importing}
                    className="btn-base btn-lime text-xs font-black px-6"
                  >
                    {importing ? "Importing..." : "Confirm & Import Leads"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
