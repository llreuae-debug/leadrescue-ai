"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Search,
  Filter,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Ban,
  RotateCcw,
  Users,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { getAdminAgenciesAction, toggleAgencyStatusAction } from "@/app/actions/admin";
import { AdminAgencySummary } from "@/types/admin";

export default function AdminAgenciesPage() {
  const [loading, setLoading] = useState(true);
  const [agencies, setAgencies] = useState<AdminAgencySummary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Suspend/Reactivate modal state
  const [selectedAgency, setSelectedAgency] = useState<AdminAgencySummary | null>(null);
  const [actionType, setActionType] = useState<"suspend" | "reactivate">("suspend");
  const [reasonInput, setReasonInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadAgencies = async () => {
    setLoading(true);
    const res = await getAdminAgenciesAction({
      query: searchQuery,
      status: statusFilter,
    });
    if (res.success) {
      setAgencies(res.agencies);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAgencies();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAgencies();
  };

  const handleOpenActionModal = (agency: AdminAgencySummary, type: "suspend" | "reactivate") => {
    setSelectedAgency(agency);
    setActionType(type);
    setReasonInput("");
    setActionError(null);
  };

  const handleExecuteStatusChange = async () => {
    if (!selectedAgency) return;
    if (!reasonInput || reasonInput.trim().length < 5) {
      setActionError("Please provide a specific compliance justification (minimum 5 characters).");
      return;
    }

    setSubmitting(true);
    setActionError(null);
    try {
      const newStatus = actionType === "suspend" ? "suspended" : "active";
      const res = await toggleAgencyStatusAction(selectedAgency.id, newStatus, reasonInput);
      if (res.success) {
        setSelectedAgency(null);
        await loadAgencies();
      } else {
        setActionError(res.error || "Failed to update agency status.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Platform Agency Directory</h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect agency subscription health, monitor active workspaces, and manage operational account status.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by agency name, slug, or owner email..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs text-white focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:border-transparent placeholder:text-slate-500"
          />
        </form>

        <div className="w-full md:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-red-600"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Agencies Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading agency directory...</div>
        ) : agencies.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No agencies found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Agency / Slug</th>
                  <th className="py-3 px-4">Owner Email</th>
                  <th className="py-3 px-4 text-center">Plan Tier</th>
                  <th className="py-3 px-4 text-center">Subscription</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Usage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {agencies.map((agency) => {
                  const isSuspended = agency.accountStatus === "suspended";
                  return (
                    <tr key={agency.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* Name & Slug */}
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {agency.name}
                        <p className="text-[11px] font-mono text-slate-400 mt-0.5">/{agency.slug}</p>
                      </td>

                      {/* Owner Email */}
                      <td className="py-3.5 px-4 text-xs text-slate-300">
                        {agency.ownerEmail}
                      </td>

                      {/* Plan Tier */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-800 text-slate-200 border border-slate-700">
                          {agency.planTier}
                        </span>
                      </td>

                      {/* Subscription Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            agency.subscriptionStatus === "active"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                              : "bg-amber-950 text-amber-400 border border-amber-800"
                          }`}
                        >
                          {agency.subscriptionStatus}
                        </span>
                      </td>

                      {/* Account Status */}
                      <td className="py-3.5 px-4 text-center">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950 text-red-400 border border-red-800">
                            <Ban className="w-3 h-3" />
                            <span>Suspended</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      {/* Usage */}
                      <td className="py-3.5 px-4 text-center text-xs text-slate-400">
                        <span className="font-medium text-white">{agency.totalClients}</span> clients &bull;{" "}
                        <span className="font-medium text-white">{agency.totalLeads}</span> leads
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        {isSuspended ? (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(agency, "reactivate")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-medium transition-colors border border-emerald-700"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Reactivate</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenActionModal(agency, "suspend")}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-medium transition-colors border border-red-800"
                          >
                            <Ban className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
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

      {/* Sensitive Customer Lead Protection Notice */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-3">
        <EyeOff className="w-4 h-4 text-slate-500 shrink-0" />
        <p className="leading-relaxed">
          <strong>Customer Lead Privacy Boundary:</strong> In accordance with LeadRescue AI multi-tenant architecture, 
          raw customer lead contact details and private rep communications are never exposed in Super Admin directory views. 
          Only tenant-level administrative metadata and usage counts are accessible.
        </p>
      </div>

      {/* Suspend / Reactivate Confirmation Modal */}
      {selectedAgency && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  actionType === "suspend"
                    ? "bg-red-950 text-red-400 border border-red-800"
                    : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                }`}
              >
                {actionType === "suspend" ? (
                  <Ban className="w-5 h-5" />
                ) : (
                  <RotateCcw className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {actionType === "suspend" ? "Suspend Agency Workspace" : "Reactivate Agency Workspace"}
                </h3>
                <p className="text-xs text-slate-400">{selectedAgency.name}</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {actionType === "suspend"
                ? "Suspending this agency immediately disables team access and pauses automated inbound lead notifications. This operation is signed and logged."
                : "Reactivating this agency will restore active portal access and inbound lead follow-up processing."}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Compliance Justification / Reason <span className="text-red-400">*</span>
              </label>
              <textarea
                value={reasonInput}
                onChange={(e) => setReasonInput(e.target.value)}
                placeholder="Document the administrative reason (e.g. Terms violation, non-payment, client request)..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-red-600"
              />
            </div>

            {actionError && (
              <p className="text-xs text-red-400 bg-red-950/60 p-2 rounded-lg border border-red-800">
                {actionError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAgency(null)}
                disabled={submitting}
                className="px-3.5 py-2 rounded-lg border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteStatusChange}
                disabled={submitting}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors ${
                  actionType === "suspend"
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-emerald-600 hover:bg-emerald-500"
                }`}
              >
                {submitting ? "Executing..." : actionType === "suspend" ? "Confirm Suspension" : "Confirm Reactivation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
