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
  X,
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
        <div className="flex items-center gap-2 mb-1.5">
          <span className="badge-lime text-[10px]">Multi-Tenant Fleet</span>
          <span className="badge-dark text-[10px]">Operations Console</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Platform Agency Directory</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Inspect agency subscription health, monitor active workspaces, and manage operational account status.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#17191C] p-4 rounded-2xl border-2 border-[#282B30] flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search agencies by business name, domain slug, or ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-[#282B30] text-xs font-bold text-white bg-[#101113] focus:outline-none focus:border-[#B7FF3C] placeholder:text-slate-500"
          />
        </form>

        <div className="w-full md:w-52">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#282B30] text-xs font-bold text-white bg-[#101113] focus:outline-none"
          >
            <option value="all">All Account Statuses</option>
            <option value="active">Active Agencies</option>
            <option value="suspended">Suspended Agencies</option>
          </select>
        </div>
      </div>

      {/* Agencies Directory Table */}
      <div className="bg-[#17191C] rounded-3xl border-2 border-[#282B30] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#B7FF3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold">Querying agency registry...</p>
          </div>
        ) : agencies.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No agency workspaces found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#282B30] text-slate-400 uppercase tracking-wider font-black text-[11px] bg-[#101113]">
                  <th className="py-3 px-5">Agency Profile</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Subscription</th>
                  <th className="py-3 px-4 text-center">Workspaces</th>
                  <th className="py-3 px-4 text-center">Team Seats</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282B30]">
                {agencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-[#101113]/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-white text-sm">{agency.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">slug: {agency.slug}</p>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#B7FF3C] uppercase text-[11px]">
                      {agency.planTier}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="badge-lime text-[10px] font-bold">
                        {agency.subscriptionStatus.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      {agency.totalClients}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                      {agency.totalLeads}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                          agency.accountStatus === "active"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                            : "bg-red-950 text-red-400 border-red-800"
                        }`}
                      >
                        {agency.accountStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {agency.accountStatus === "active" ? (
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(agency, "suspend")}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-800 bg-red-950/40 text-red-400 hover:bg-red-900/60 text-xs font-bold transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Suspend Agency</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenActionModal(agency, "reactivate")}
                          className="btn-lime text-xs py-1.5 px-3 inline-flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reactivate</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Suspend / Reactivate Confirmation Modal */}
      {selectedAgency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#17191C] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border-2 border-[#282B30] text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#282B30]">
              <div className="flex items-center gap-2">
                {actionType === "suspend" ? (
                  <Ban className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-[#B7FF3C]" />
                )}
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {actionType === "suspend" ? "Suspend Agency Workspace" : "Reactivate Agency Workspace"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAgency(null)}
                className="w-8 h-8 rounded-full hover:bg-[#101113] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p className="font-medium">
                You are about to modify the operational status for{" "}
                <strong className="text-white">{selectedAgency.name}</strong> ({selectedAgency.slug}).
              </p>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                  Compliance Justification (Audit Required)
                </label>
                <textarea
                  rows={3}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="State non-repudiable compliance justification (e.g. Terms violation, requested deactivation, KYC failure)..."
                  className="w-full text-xs font-medium border-2 border-[#282B30] rounded-xl p-3 bg-[#101113] focus:outline-none focus:border-[#B7FF3C] text-white resize-none"
                />
              </div>

              {actionError && (
                <p className="text-xs text-red-400 font-bold bg-red-950/60 border border-red-800 p-3 rounded-xl">
                  {actionError}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#282B30]">
              <button
                type="button"
                onClick={() => setSelectedAgency(null)}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#101113] rounded-xl border border-[#282B30]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleExecuteStatusChange}
                className={
                  actionType === "suspend"
                    ? "px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
                    : "btn-lime text-xs px-5 py-2.5"
                }
              >
                {submitting ? "Signing & Executing..." : actionType === "suspend" ? "Confirm Suspension" : "Reactivate Workspace"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
