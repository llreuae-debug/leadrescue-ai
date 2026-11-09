"use client";

import React, { useEffect, useState } from "react";
import { 
  Layers, 
  TrendingUp, 
  CheckCircle2, 
  Trophy, 
  Coins, 
  BarChart2, 
  ShieldCheck,
  Building2,
  Calendar
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { getClientPortalReportsAction, getClientPortalLeadsAction } from "@/app/actions/portal";
import { ClientPortalMetrics, ClientPortalWorkspace, ClientPortalLead } from "@/types/portal";

export default function ClientPortalReportsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ClientPortalMetrics | null>(null);
  const [workspace, setWorkspace] = useState<ClientPortalWorkspace | null>(null);
  const [leads, setLeads] = useState<ClientPortalLead[]>([]);

  useEffect(() => {
    Promise.all([
      getClientPortalReportsAction(),
      getClientPortalLeadsAction(),
    ]).then(([repRes, leadsRes]) => {
      if (repRes.success) {
        setMetrics(repRes.metrics);
        setWorkspace(repRes.workspace);
      }
      if (leadsRes.success) {
        setLeads(leadsRes.leads);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState message="Computing conversion reports..." />
      </div>
    );
  }

  const formatPKR = (val: number) => `PKR ${val.toLocaleString()}`;

  // Calculate detailed channel performance
  const channelStatsMap: Record<
    string,
    { total: number; qualified: number; won: number; wonValue: number }
  > = {};

  for (const l of leads) {
    const src = l.source || "Direct / Inbound";
    if (!channelStatsMap[src]) {
      channelStatsMap[src] = { total: 0, qualified: 0, won: 0, wonValue: 0 };
    }
    channelStatsMap[src].total += 1;
    if (["qualified", "proposal_sent", "won"].includes(l.status)) {
      channelStatsMap[src].qualified += 1;
    }
    if (l.status === "won") {
      channelStatsMap[src].won += 1;
      channelStatsMap[src].wonValue += l.dealValue || 0;
    }
  }

  const channelPerformance = Object.entries(channelStatsMap)
    .map(([channel, s]) => ({
      channel,
      total: s.total,
      qualified: s.qualified,
      won: s.won,
      wonValue: s.wonValue,
      conversionRate: s.total > 0 ? Math.round((s.won / s.total) * 1000) / 10 : 0,
      shareOfLeads: metrics?.totalLeads ? Math.round((s.total / metrics.totalLeads) * 100) : 0,
    }))
    .sort((a, b) => b.wonValue - a.wonValue);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>{workspace?.name} &bull; Verified Analytics</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Acquisition &amp; Conversion Reports
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Measurable marketing returns and conversion rates managed by{" "}
          <strong className="text-slate-700">{workspace?.agencyName}</strong>.
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Conversion Rate"
          value={`${metrics?.conversionRate || 0}%`}
          icon={Trophy}
          change={{ value: "Inquiry to closed deal", trend: "up" }}
        />
        <StatCard
          title="Total Revenue Generated"
          value={formatPKR(metrics?.totalWonValuePKR || 0)}
          icon={Coins}
          change={{ value: "Confirmed closed value", trend: "up" }}
        />
        <StatCard
          title="Qualified Pipeline Rate"
          value={
            metrics?.totalLeads
              ? `${Math.round(((metrics.qualifiedLeads) / metrics.totalLeads) * 100)}%`
              : "0%"
          }
          icon={CheckCircle2}
          change={{ value: "High-intent inquiries", trend: "up" }}
        />
        <StatCard
          title="Active Marketing Channels"
          value={metrics?.sourceBreakdown.length || 0}
          icon={Layers}
          change={{ value: "Attributed sources", trend: "neutral" }}
        />
      </div>

      {/* Conversion Funnel Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Inbound Conversion Funnel</h2>
            <p className="text-xs text-slate-500">Progressive customer qualification stages</p>
          </div>
          <BarChart2 className="w-5 h-5 text-slate-400" />
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">1. Enquiries</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">{metrics?.totalLeads || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">100% of received inquiries</p>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">2. Contacted</p>
            <p className="text-2xl font-extrabold text-blue-900 mt-2">{metrics?.contactedLeads || 0}</p>
            <p className="text-[11px] text-blue-700 mt-1">
              {metrics?.totalLeads ? Math.round(((metrics.contactedLeads) / metrics.totalLeads) * 100) : 0}% first contact rate
            </p>
          </div>

          <div className="bg-indigo-50/50 rounded-xl p-4 border border-indigo-200">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">3. Qualified</p>
            <p className="text-2xl font-extrabold text-indigo-900 mt-2">{metrics?.qualifiedLeads || 0}</p>
            <p className="text-[11px] text-indigo-700 mt-1">
              {metrics?.totalLeads ? Math.round(((metrics.qualifiedLeads) / metrics.totalLeads) * 100) : 0}% commercial qualification
            </p>
          </div>

          <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">4. Won Deals</p>
            <p className="text-2xl font-extrabold text-emerald-900 mt-2">{metrics?.wonLeads || 0}</p>
            <p className="text-[11px] text-emerald-700 mt-1">
              {metrics?.conversionRate || 0}% overall conversion
            </p>
          </div>
        </div>
      </div>

      {/* Attribution Performance Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Channel Attribution &amp; ROI</h2>
            <p className="text-xs text-slate-500">Breakdown of leads, qualifications, and converted revenue by channel</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Channel / Source</th>
                <th className="py-3 px-4 text-center">Total Inquiries</th>
                <th className="py-3 px-4 text-center">Share</th>
                <th className="py-3 px-4 text-center">Qualified</th>
                <th className="py-3 px-4 text-center">Won Deals</th>
                <th className="py-3 px-4 text-right">Won Revenue (PKR)</th>
                <th className="py-3 px-4 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {channelPerformance.map((item) => (
                <tr key={item.channel} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {item.channel}
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                    {item.total}
                  </td>
                  <td className="py-3.5 px-4 text-center text-xs text-slate-500">
                    {item.shareOfLeads}%
                  </td>
                  <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                    {item.qualified}
                  </td>
                  <td className="py-3.5 px-4 text-center font-semibold text-emerald-700">
                    {item.won}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                    {item.wonValue > 0 ? formatPKR(item.wonValue) : "—"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {item.conversionRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grounded Performance Guarantee */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="leading-relaxed">
          <strong>Grounded Metrics Guarantee:</strong> Conversion figures and deal values represent 
          verified, closed inquiries. LeadRescue AI adheres to strict data integrity standards and does not 
          fabricate simulated ROI projections or vanity metrics.
        </p>
      </div>
    </div>
  );
}
