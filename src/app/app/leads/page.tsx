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
  Phone,
  Mail,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  FileSpreadsheet,
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
    // Generate sample preview rows for testing CSV mapping
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
          className="cursor-pointer group flex items-start gap-2.5"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            {lead.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
              {lead.name}
            </p>
            <p className="text-[11px] text-slate-400">
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
        <span className="font-medium text-slate-700">{lead.client?.name || "General"}</span>
      ),
    },
    {
      key: "source",
      header: "Source / Campaign",
      cell: (lead) => (
        <div>
          <span className="font-medium text-slate-700">{lead.source}</span>
          {lead.campaign && (
            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
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
          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
            lead.priority === "urgent"
              ? "bg-rose-100 text-rose-800"
              : lead.priority === "high"
              ? "bg-amber-100 text-amber-800"
              : lead.priority === "medium"
              ? "bg-blue-100 text-blue-800"
              : "bg-slate-100 text-slate-700"
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
        <span className="font-bold text-slate-900 tabular-nums">
          {formatCurrencyPKR(lead.deal_value || 0)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Management"
        description="Every Lead Deserves a Follow-Up. Central enquiry intake, duplicate detection, and rep assignment."
        badge={
          isDemo ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Demo Workspace Mode
            </span>
          ) : (
            <StatusBadge label={`${leads.length} Enquiries`} variant="default" />
          )
        }
      >
        <button
          type="button"
          onClick={() => setAddModalOpen(true)}
          className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs h-9 px-3.5"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Add Lead</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setCsvPreviewRows([]);
            setImportResult(null);
            setCsvModalOpen(true);
          }}
          className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-9 px-3.5"
        >
          <Upload className="w-3.5 h-3.5 mr-1" />
          <span>Import CSV</span>
        </button>
        <button
          type="button"
          onClick={handleExportCSV}
          className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-9 px-3.5"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          <span>Export</span>
        </button>
      </PageHeader>

      {/* Search and Multi-Criteria Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search by name, email, phone, or company..."
          wrapperClassName="w-full sm:w-72"
        />

        <div className="flex flex-wrap items-center gap-2 flex-1">
          <select
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="input-base text-xs h-9 py-0 bg-slate-50"
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
            className="input-base text-xs h-9 py-0 bg-slate-50"
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
            className="input-base text-xs h-9 py-0 bg-slate-50"
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
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
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

      {/* LEAD DETAIL DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm">
                    {selectedLead.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedLead.name}</h3>
                    <p className="text-xs text-slate-400">{selectedLead.client?.name || "Client Workspace"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 text-xs">
                {/* Contact information card */}
                <div className="linear-card p-4 space-y-3 bg-slate-50/50">
                  <h4 className="font-bold uppercase tracking-wider text-[10px] text-slate-500">
                    Contact & Campaign Details
                  </h4>
                  <div className="space-y-2">
                    {selectedLead.phone && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">WhatsApp / Phone:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{selectedLead.phone}</span>
                          <a
                            href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedLead.email && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Email:</span>
                        <a
                          href={`mailto:${selectedLead.email}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {selectedLead.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Deal Value:</span>
                      <span className="font-bold text-slate-900 tabular-nums">
                        {formatCurrencyPKR(selectedLead.deal_value || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Inbound Channel:</span>
                      <span className="font-semibold text-slate-700">{selectedLead.source}</span>
                    </div>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="space-y-2">
                  <label className="font-semibold text-slate-700 block">Lead Pipeline Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={async (e) => {
                      const newStatus = e.target.value as LeadStatus;
                      await updateLeadStatusAction(selectedLead.id, newStatus);
                      setSelectedLead({ ...selectedLead, status: newStatus });
                      loadData();
                    }}
                    className="input-base w-full bg-slate-50 text-xs font-semibold"
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
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">Recorded Notes</label>
                    <div className="p-3 rounded-lg bg-slate-50 text-slate-700 leading-relaxed border border-slate-200">
                      {selectedLead.notes}
                    </div>
                  </div>
                )}

                {/* AI Follow-up Recommendation Preview */}
                <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100 space-y-2">
                  <div className="flex items-center gap-1.5 font-bold text-violet-900">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    <span>Grounded AI Sales Suggestion</span>
                  </div>
                  <p className="text-[11px] text-violet-800 leading-relaxed">
                    Lead is in &quot;{selectedLead.status}&quot; stage with {selectedLead.source} origin. Draft an English or Urdu WhatsApp follow-up tailored to their enquiry history.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Created {new Date(selectedLead.created_at).toLocaleDateString()}
              </span>
              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="btn-base bg-white border border-slate-200 text-slate-700 text-xs font-semibold px-4 h-8"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LEAD MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-lg linear-card p-6 bg-white shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Add Inbound Enquiry</h3>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createWarning && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
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
                    className="input-base w-full text-xs"
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
                    className="input-base w-full text-xs"
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
                    className="input-base w-full text-xs"
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
                  className="input-base w-full h-auto py-2 text-xs"
                  disabled={creating}
                />
              </FormField>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  disabled={creating}
                  className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-2xl linear-card p-6 bg-white shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Import Inbound Leads via CSV</h3>
                  <p className="text-[11px] text-slate-400">Map spreadsheet columns and validate rows before writing</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCsvModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <FormField label="Target Client Workspace" required>
                <select
                  value={csvTargetClient}
                  onChange={(e) => setCsvTargetClient(e.target.value)}
                  className="input-base w-full"
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
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center space-y-3 bg-slate-50/50">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      Choose CSV file to parse
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Columns expected: Name, Phone, Email, Company, Deal Value, Notes
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateCSVFile}
                    className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 h-9 shadow-xs"
                  >
                    Load Sample CSV Dataset
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>Parsed Rows Preview ({csvPreviewRows.length} records ready)</span>
                    <button
                      type="button"
                      onClick={() => setCsvPreviewRows([])}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-semibold">
                        <tr>
                          <th className="p-2">Name</th>
                          <th className="p-2">Phone</th>
                          <th className="p-2">Email</th>
                          <th className="p-2 text-right">Value (PKR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {csvPreviewRows.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="p-2 font-semibold text-slate-900">{row.name}</td>
                            <td className="p-2 text-slate-600">{row.phone}</td>
                            <td className="p-2 text-slate-600">{row.email}</td>
                            <td className="p-2 text-right tabular-nums font-semibold text-slate-800">
                              {formatCurrencyPKR(row.dealValue || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {importResult && (
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 space-y-1">
                      <p className="font-semibold">
                        Successfully imported {importResult.imported} records into target client workspace!
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCsvModalOpen(false)}
                  className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4"
                >
                  Close
                </button>
                {csvPreviewRows.length > 0 && !importResult && (
                  <button
                    type="button"
                    onClick={handleConfirmCSVImport}
                    disabled={importing}
                    className="btn-base bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-5 shadow-xs"
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
