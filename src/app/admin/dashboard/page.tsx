"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CreditCard,
  AlertTriangle,
  Coins,
  Users,
  ShieldAlert,
  ArrowRight,
  History,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { getAdminDashboardAction } from "@/app/actions/admin";
import { AdminPlatformMetrics, AdminPaymentReviewItem, AdminAuditEvent } from "@/types/admin";

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<AdminPlatformMetrics | null>(null);
  const [recentLogs, setRecentLogs] = useState<AdminAuditEvent[]>([]);
  const [pendingPayments, setPendingPayments] = useState<AdminPaymentReviewItem[]>([]);

  useEffect(() => {
    getAdminDashboardAction().then((res) => {
      if (res.success) {
        setMetrics(res.metrics);
        setRecentLogs(res.recentAuditLogs);
        setPendingPayments(res.pendingPayments);
      }
      setLoading(false);
    });
  }, []);

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400">Loading platform operational metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-950 text-red-400 border border-red-800 mb-2">
            <Lock className="w-3 h-3" />
            <span>Root System Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Operations Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time multi-tenant health, subscription entitlement lifecycle, and manual bank transfer audits.
          </p>
        </div>
      </div>

      {/* Pending Manual Bank Transfer Alert Banner */}
      {pendingPayments.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800/80 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-100">
                {pendingPayments.length} Pending Manual Bank Transfer{pendingPayments.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-amber-300/80">
                Pakistani agencies awaiting IBFT deposit slip verification before account activation.
              </p>
            </div>
          </div>
          <Link
            href="/admin/subscriptions"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap shadow-xs"
          >
            <span>Review Transfers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Agencies</span>
            <Building2 className="w-4 h-4 text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-3">{metrics?.totalAgencies || 0}</p>
          <p className="text-[11px] text-emerald-400 mt-1">
            {metrics?.activeAgencies || 0} active &bull; {metrics?.suspendedAgencies || 0} suspended
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Paid Subscriptions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white mt-3">{metrics?.activePaidSubscriptions || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Enforced server-side</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending IBFT</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-amber-400 mt-3">{metrics?.pendingManualPayments || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting admin review</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Platform MRR</span>
            <Coins className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-3">
            {formatPKR(metrics?.platformMonthlyRevenuePKR || 0)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Monthly Recurring Run-rate</p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-3">{metrics?.totalLeadsManaged || 0}</p>
          <p className="text-[11px] text-slate-400 mt-1">Across all agency tenants</p>
        </div>
      </div>

      {/* Grid: Pending Payment Queue + Audit Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Bank Transfers Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="font-bold text-white text-base">IBFT Payment Review Queue</h2>
              <p className="text-xs text-slate-400">Manual Meezan Bank &amp; HBL deposits awaiting verification</p>
            </div>
            <Link
              href="/admin/subscriptions"
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <span>View all ({pendingPayments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4">
            {pendingPayments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                No manual payments awaiting review.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-white text-sm">{p.agencyName}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {p.bankName} &bull; Ref: <code className="text-amber-300 font-mono">{p.transactionReference}</code>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400 text-sm">{formatPKR(p.amountPKR)}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5">{p.planId} tier</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Admin Audit Logs Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="font-bold text-white text-base">Recent Platform Operations</h2>
              <p className="text-xs text-slate-400">Signed security log of privileged administrative actions</p>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <span>Full audit trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4">
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No recent audit events.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-red-400 bg-red-950 px-1.5 py-0.5 rounded border border-red-900">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-1">
                      Target: <span className="font-medium text-white">{log.targetId}</span>
                    </p>
                    {log.reason && (
                      <p className="text-[11px] text-slate-400 italic">
                        &quot;{log.reason}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
