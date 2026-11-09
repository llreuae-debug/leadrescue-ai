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
          bg: "bg-blue-950 text-blue-400 border-blue-800",
          icon: CheckCircle2,
        };
      case "plan_updated":
        return {
          bg: "bg-purple-950 text-purple-400 border-purple-800",
          icon: Sliders,
        };
      default:
        return {
          bg: "bg-slate-800 text-slate-300 border-slate-700",
          icon: History,
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Security &amp; Operations Audit Trail</h1>
        <p className="text-sm text-slate-400 mt-1">
          Non-repudiable log of privileged Super Admin operations, manual payment approvals, account suspensions, and pricing updates.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              actionFilter === tab.key
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No audit records match your selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Timestamp (UTC)</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Admin Actor</th>
                  <th className="py-3 px-4">Target Resource</th>
                  <th className="py-3 px-4">Documented Reason</th>
                  <th className="py-3 px-4">Safe Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {logs.map((log) => {
                  const badge = getActionBadge(log.action);
                  const Icon = badge.icon;
                  return (
                    <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                      {/* Timestamp */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badge.bg}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{log.action}</span>
                        </span>
                      </td>

                      {/* Actor */}
                      <td className="py-3.5 px-4 text-white font-medium">
                        {log.actorEmail}
                      </td>

                      {/* Target */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="text-[10px] uppercase font-bold text-slate-500 mr-1.5">
                          {log.targetType}:
                        </span>
                        <code className="text-red-400 font-mono text-[11px]">{log.targetId}</code>
                      </td>

                      {/* Reason */}
                      <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                        {log.reason ? (
                          <span className="italic">&quot;{log.reason}&quot;</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>

                      {/* Metadata JSON preview */}
                      <td className="py-3.5 px-4">
                        {log.metadata && Object.keys(log.metadata).length > 0 ? (
                          <pre className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800 max-w-xs overflow-x-auto">
                            {JSON.stringify(log.metadata)}
                          </pre>
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
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

      {/* Security Assurance Banner */}
      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs flex items-center gap-3">
        <Lock className="w-4 h-4 text-red-400 shrink-0" />
        <p className="leading-relaxed">
          <strong>Immutable Record Integrity:</strong> Platform audit logs are append-only. 
          All administrative operations automatically purge sensitive keys (passwords, tokens, bearer headers) 
          via server-side metadata sanitization before persistence.
        </p>
      </div>
    </div>
  );
}
