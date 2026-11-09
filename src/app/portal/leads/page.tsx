"use client";

import React, { useEffect, useState } from "react";
import { 
  Users2, 
  Search, 
  Download, 
  Filter, 
  MessageSquare, 
  Mail, 
  Phone, 
  Building2, 
  ShieldAlert,
  Calendar
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { 
  getClientPortalLeadsAction, 
  exportClientPortalLeadsCsvAction 
} from "@/app/actions/portal";
import { ClientPortalLead, ClientPortalWorkspace } from "@/types/portal";

export default function ClientPortalLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [leads, setLeads] = useState<ClientPortalLead[]>([]);
  const [workspace, setWorkspace] = useState<ClientPortalWorkspace | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const loadLeads = async () => {
    setLoading(true);
    const res = await getClientPortalLeadsAction({
      query: searchQuery,
      status: statusFilter,
      source: sourceFilter,
    });
    if (res.success) {
      setLeads(res.leads);
      setWorkspace(res.workspace);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter, sourceFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLeads();
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const res = await exportClientPortalLeadsCsvAction();
      if (res.success && res.csvContent) {
        const blob = new Blob([res.csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", res.filename || "client-enquiries.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } finally {
      setExporting(false);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "won":
        return "success";
      case "qualified":
      case "proposal_sent":
        return "default";
      case "contacted":
        return "neutral";
      case "lost":
        return "danger";
      default:
        return "warning";
    }
  };

  const formatPKR = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
  };

  const distinctSources = Array.from(new Set(leads.map((l) => l.source))).filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Customer Enquiries</h1>
          <p className="text-sm text-slate-500 mt-1">
            Verified inbound enquiries belonging strictly to <strong className="text-slate-700">{workspace?.name}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting || leads.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>{exporting ? "Generating CSV..." : "Export My Enquiries (CSV)"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, company, or email..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Dropdown */}
          <div className="w-1/2 md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal_sent">Proposal Sent</option>
              <option value="won">Won Deals</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="w-1/2 md:w-48">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Sources</option>
              {distinctSources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingState message="Filtering inquiries..." />
          </div>
        ) : leads.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={Users2}
              title="No customer enquiries match your filters"
              description="Try adjusting your search terms, status filter, or source channel."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Marketing Source</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Deal Value</th>
                  <th className="py-3 px-4 text-center">Direct Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leads.map((lead) => {
                  const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : null;
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {lead.name}
                        {lead.campaign && (
                          <p className="text-[11px] font-normal text-slate-400 mt-0.5">
                            Camp: {lead.campaign}
                          </p>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {lead.phone && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        {!lead.phone && !lead.email && (
                          <span className="text-slate-400 italic">No contact details</span>
                        )}
                      </td>

                      {/* Company */}
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {lead.company ? (
                          <div className="flex items-center gap-1.5 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.company}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Individual client</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {lead.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          label={lead.status.replace("_", " ").toUpperCase()}
                          variant={getStatusVariant(lead.status)}
                        />
                      </td>

                      {/* Deal Value */}
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-900 text-xs">
                        {lead.dealValue > 0 ? formatPKR(lead.dealValue) : "—"}
                      </td>

                      {/* WhatsApp Button */}
                      <td className="py-3.5 px-4 text-center">
                        {cleanPhone ? (
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-2xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Privacy & Redaction Assurance Note */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
        <p className="leading-relaxed">
          <strong>Privacy Safeguard:</strong> This view is strictly restricted to your authorized workspace (
          {workspace?.name}). Internal agency margins, private rep notes, and team internal deliberations
          are securely redacted.
        </p>
      </div>
    </div>
  );
}
