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
  Sparkles,
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
        <div className="w-8 h-8 border-2 border-[#B7FF3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-400 font-bold">Loading platform operational metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#17191C] text-[#B7FF3C] border-2 border-[#282B30] mb-2">
            <Lock className="w-3 h-3" />
            <span>Root System Authority</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Platform Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
            Real-time multi-tenant health, subscription entitlement lifecycle, and manual bank transfer audits.
          </p>
        </div>
      </div>

      {/* Pending Manual Bank Transfer Alert Banner */}
      {pendingPayments.length > 0 && (
        <div className="p-5 rounded-3xl bg-[#17191C] border-2 border-[#B7FF3C] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#B7FF3C] text-[#101113] flex items-center justify-center shrink-0 font-bold border-2 border-[#101113]">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-black text-white">
                {pendingPayments.length} Pending Manual Bank Transfer{pendingPayments.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-slate-300 font-medium">
                Pakistani agencies awaiting IBFT deposit slip verification before account activation.
              </p>
            </div>
          </div>
          <Link
            href="/admin/subscriptions"
            className="btn-lime text-xs py-2.5 px-4 inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Review Transfers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#17191C] border-2 border-[#282B30] rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Agencies</span>
            <Building2 className="w-4 h-4 text-[#B7FF3C]" />
          </div>
          <p className="text-3xl font-black text-white tabular-nums">{metrics?.totalAgencies || 0}</p>
          <p className="text-[11px] text-[#B7FF3C] font-bold">
            {metrics?.activeAgencies || 0} active &bull; {metrics?.suspendedAgencies || 0} suspended
          </p>
        </div>

        <div className="bg-[#17191C] border-2 border-[#282B30] rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Paid Subscriptions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white tabular-nums">{metrics?.activePaidSubscriptions || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Enforced server-side</p>
        </div>

        <div className="bg-[#17191C] border-2 border-[#282B30] rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Pending IBFT</span>
            <CreditCard className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-black text-amber-400 tabular-nums">{metrics?.pendingManualPayments || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Awaiting admin review</p>
        </div>

        <div className="bg-[#17191C] border-2 border-[#282B30] rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Platform MRR</span>
            <Coins className="w-4 h-4 text-[#B7FF3C]" />
          </div>
          <p className="text-2xl font-black text-white tabular-nums">
            {formatPKR(metrics?.platformMonthlyRevenuePKR || 0)}
          </p>
          <p className="text-[11px] text-slate-400 font-medium">Monthly Recurring Run-rate</p>
        </div>

        <div className="bg-[#17191C] border-2 border-[#282B30] rounded-3xl p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Leads</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white tabular-nums">{metrics?.totalLeadsManaged || 0}</p>
          <p className="text-[11px] text-slate-400 font-medium">Across all agency tenants</p>
        </div>
      </div>

      {/* Grid: Pending Payment Queue + Audit Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Bank Transfers Preview */}
        <div className="bg-[#17191C] border-2 border-[#282B30] rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#282B30]">
            <div>
              <h2 className="font-black text-white text-sm uppercase tracking-wider">IBFT Payment Review Queue</h2>
              <p className="text-xs text-slate-400 font-medium">Manual Meezan Bank &amp; HBL deposits awaiting verification</p>
            </div>
            <Link
              href="/admin/subscriptions"
              className="text-xs font-bold text-[#B7FF3C] hover:underline flex items-center gap-1"
            >
              <span>View all ({pendingPayments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            {pendingPayments.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8 font-medium">
                No manual payments awaiting review.
              </p>
            ) : (
              <div className="space-y-3">
                {pendingPayments.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-2xl bg-[#101113] border border-[#282B30] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-white text-sm">{p.agencyName}</p>
                      <p className="text-slate-400 text-[11px] mt-0.5 font-medium">
                        {p.bankName} &bull; Ref: <code className="text-[#B7FF3C] font-mono font-bold">{p.transactionReference}</code>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-black text-[#B7FF3C] text-sm">{formatPKR(p.amountPKR)}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mt-0.5">{p.planId} tier</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Admin Audit Logs Preview */}
        <div className="bg-[#17191C] border-2 border-[#282B30] rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#282B30]">
            <div>
              <h2 className="font-black text-white text-sm uppercase tracking-wider">Recent Operations Audit</h2>
              <p className="text-xs text-slate-400 font-medium">Signed security log of privileged administrative actions</p>
            </div>
            <Link
              href="/admin/audit-logs"
              className="text-xs font-bold text-[#B7FF3C] hover:underline flex items-center gap-1"
            >
              <span>Full audit trail</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            {recentLogs.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8 font-medium">No recent audit events.</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl bg-[#101113] border border-[#282B30] text-xs flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-[#B7FF3C] bg-[#17191C] px-2 py-0.5 rounded-lg border border-[#282B30] font-bold uppercase">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs font-medium">
                      Target: <span className="font-bold text-white">{log.targetId}</span>
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
