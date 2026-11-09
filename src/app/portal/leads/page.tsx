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
  Calendar,
  Sparkles,
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
          <div className="flex items-center gap-2 mb-1.5">
            <span className="badge-lime text-[10px]">Client Workspace</span>
            <span className="badge-dark text-[10px]">Verified Leads</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#101113] tracking-tight">Customer Enquiries</h1>
          <p className="text-xs sm:text-sm text-[#777D77] font-medium mt-1">
            Verified inbound enquiries belonging strictly to <strong className="text-[#101113]">{workspace?.name}</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={exporting || leads.length === 0}
            className="btn-lime text-xs py-2.5 px-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? "Generating CSV..." : "Export My Enquiries (CSV)"}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-white p-4 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-[#777D77] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, phone, company, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#101113] text-xs font-bold text-[#101113] bg-[#F3F4F2] focus:bg-white focus:outline-none placeholder:text-[#777D77]"
          />
        </form>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Status Dropdown */}
          <div className="w-1/2 md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#101113] text-xs font-bold text-[#101113] bg-[#F3F4F2] focus:outline-none"
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
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#101113] text-xs font-bold text-[#101113] bg-[#F3F4F2] focus:outline-none"
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
      <div className="card-white overflow-hidden space-y-0">
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
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#101113] text-[#101113] uppercase tracking-wider font-black text-[11px] bg-[#F3F4F2]">
                  <th className="py-3 px-5">Customer Name</th>
                  <th className="py-3 px-4">Contact Details</th>
                  <th className="py-3 px-4">Company</th>
                  <th className="py-3 px-4">Marketing Source</th>
                  <th className="py-3 px-4">Pipeline Status</th>
                  <th className="py-3 px-4 text-right">Deal Value</th>
                  <th className="py-3 px-5 text-center">Direct Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDDDA]">
                {leads.map((lead) => {
                  const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : null;
                  return (
                    <tr key={lead.id} className="hover:bg-[#F3F4F2] transition-colors">
                      {/* Name */}
                      <td className="py-3.5 px-5 font-bold text-[#101113]">
                        {lead.name}
                        {lead.campaign && (
                          <p className="text-[11px] font-medium text-[#777D77] mt-0.5">
                            Camp: {lead.campaign}
                          </p>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-xs text-[#101113]">
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 font-mono font-bold">
                            <Phone className="w-3.5 h-3.5 text-[#777D77]" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {lead.email && (
                          <div className="flex items-center gap-1.5 mt-0.5 text-[#777D77] font-medium">
                            <Mail className="w-3.5 h-3.5 text-[#777D77]" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        {!lead.phone && !lead.email && (
                          <span className="text-[#777D77] italic">No contact details</span>
                        )}
                      </td>

                      {/* Company */}
                      <td className="py-3.5 px-4 text-xs text-[#101113]">
                        {lead.company ? (
                          <div className="flex items-center gap-1.5 font-bold">
                            <Building2 className="w-3.5 h-3.5 text-[#777D77]" />
                            <span>{lead.company}</span>
                          </div>
                        ) : (
                          <span className="text-[#777D77] italic font-medium">Individual client</span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4">
                        <span className="badge-dark text-[10px]">
                          {lead.source}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge
                          label={lead.status.replace(/_/g, " ").toUpperCase()}
                          variant={getStatusVariant(lead.status)}
                        />
                      </td>

                      {/* Deal Value */}
                      <td className="py-3.5 px-4 text-right font-mono font-black text-[#101113] text-xs">
                        {lead.dealValue > 0 ? formatPKR(lead.dealValue) : "—"}
                      </td>

                      {/* WhatsApp Button */}
                      <td className="py-3.5 px-5 text-center">
                        {cleanPhone ? (
                          <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17191C] hover:bg-[#101113] text-[#B7FF3C] text-[11px] font-black border border-[#101113] transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        ) : (
                          <span className="text-xs text-[#777D77] font-medium">—</span>
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

      {/* Privacy & Redaction Assurance Note in Deep Charcoal */}
      <div className="card-charcoal p-4 sm:p-5 rounded-2xl border-2 border-[#101113] text-white flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#B7FF3C] text-[#101113] flex items-center justify-center shrink-0 mt-0.5 font-bold">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          <strong className="text-white font-bold">Privacy Safeguard:</strong> This view is strictly restricted to your authorized workspace (
          {workspace?.name}). Internal agency margins, private rep notes, and team internal deliberations
          are securely redacted.
        </p>
      </div>
    </div>
  );
}
