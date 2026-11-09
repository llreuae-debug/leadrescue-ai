"use client";

import React, { useEffect, useState } from "react";
import {
  History,
  ShieldAlert,
  Search,
  Filter,
  Lock,
  Calendar,
  User,
  CheckCircle2,
  Ban,
  Coins,
  Sliders,
  Sparkles,
} from "lucide-react";
import { getAdminAuditLogsAction } from "@/app/actions/admin";
import { AdminAuditEvent } from "@/types/admin";

export default function AdminAuditLogsPage() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<AdminAuditEvent[]>([]);
  const [actionFilter, setActionFilter] = useState("all");

  const loadLogs = async () => {
    setLoading(true);
    const res = await getAdminAuditLogsAction({ action: actionFilter });
    if (res.success) {
      setLogs(res.logs);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadLogs();
  }, [actionFilter]);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "payment_approved":
        return {
          bg: "bg-emerald-950 text-emerald-400 border-emerald-800",
          icon: CheckCircle2,
        };
      case "payment_rejected":
      case "agency_suspended":
        return {
          bg: "bg-red-950 text-red-400 border-red-800",
          icon: Ban,
        };
      case "agency_reactivated":
        return {
          bg: "bg-[#17191C] text-[#B7FF3C] border-[#282B30]",
          icon: CheckCircle2,
        };
      case "plan_updated":
        return {
          bg: "bg-purple-950 text-purple-400 border-purple-800",
          icon: Sliders,
        };
      default:
        return {
          bg: "bg-[#101113] text-slate-300 border-[#282B30]",
          icon: History,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="badge-lime text-[10px]">Non-Repudiable</span>
          <span className="badge-dark text-[10px]">Immutable Ledger</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Security &amp; Operations Audit Trail</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Non-repudiable log of privileged Super Admin operations, manual payment approvals, account suspensions, and pricing updates.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[#282B30] pb-3 overflow-x-auto">
        {[
          { key: "all", label: "All Audit Events" },
          { key: "payment_approved", label: "Payments Approved" },
          { key: "payment_rejected", label: "Payments Rejected" },
          { key: "agency_suspended", label: "Agencies Suspended" },
          { key: "agency_reactivated", label: "Agencies Reactivated" },
          { key: "plan_updated", label: "Plan Changes" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActionFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              actionFilter === tab.key
                ? "bg-[#17191C] text-[#B7FF3C] border-2 border-[#3A3F47] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#17191C] rounded-3xl border-2 border-[#282B30] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#B7FF3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold">Querying audit trail...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No audit records found matching selected action.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#282B30] text-slate-400 uppercase tracking-wider font-black text-[11px] bg-[#101113]">
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-4">Action Type</th>
                  <th className="py-3 px-4">Super Admin</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-5">Compliance Justification / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282B30]">
                {logs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const Icon = badge.icon;
                  return (
                    <tr key={log.id} className="hover:bg-[#101113]/50 transition-colors">
                      <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400 whitespace-nowrap font-bold">
                        {new Date(log.timestamp).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider ${badge.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{log.action.replace(/_/g, " ")}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-white text-[11px] font-bold">
                        {log.actorEmail}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-[#B7FF3C] text-[11px]">
                        {log.targetId}
                      </td>

                      <td className="py-3.5 px-5 text-slate-300 font-medium text-xs">
                        {log.reason ? (
                          <span>&ldquo;{log.reason}&rdquo;</span>
                        ) : (
                          <span className="text-slate-500 italic">No note logged</span>
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

      {/* Security Immutable Log Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#17191C] border-2 border-[#282B30] text-slate-300 text-xs flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#B7FF3C] text-[#101113] flex items-center justify-center shrink-0 mt-0.5 font-bold">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <p className="leading-relaxed font-medium">
          <strong className="text-white font-bold">Cryptographic Non-Repudiation:</strong> Audit logs are stored in append-only tables
          with RLS preventing updates or deletions even by Super Admins. Every transaction approval,
          rejection, suspension, and quota modification is permanently captured.
        </p>
      </div>
    </div>
  );
}
