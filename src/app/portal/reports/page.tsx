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
  Calendar,
  Sparkles,
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
        <div className="inline-flex items-center gap-2 text-xs font-black text-[#101113] badge-lime mb-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>{workspace?.name} &bull; Verified Analytics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#101113] tracking-tight">
          Acquisition &amp; Conversion Reports
        </h1>
        <p className="text-xs sm:text-sm text-[#777D77] font-medium mt-1">
          Measurable marketing returns and conversion rates managed by{" "}
          <strong className="text-[#101113]">{workspace?.agencyName}</strong>.
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Conversion Rate"
          value={`${metrics?.conversionRate || 0}%`}
          icon={Trophy}
          change={{ value: "Inquiry to closed deal", trend: "up" }}
          highlight={true}
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
          title="Active Channels"
          value={metrics?.sourceBreakdown.length || 0}
          icon={Layers}
          change={{ value: "Attributed sources", trend: "neutral" }}
        />
      </div>

      {/* Conversion Funnel Overview */}
      <div className="card-white p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
          <div>
            <h2 className="font-black text-[#101113] text-sm uppercase tracking-wider">Inbound Conversion Funnel</h2>
            <p className="text-xs text-[#777D77] font-medium">Progressive customer qualification stages</p>
          </div>
          <BarChart2 className="w-5 h-5 text-[#101113]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#F3F4F2] border-2 border-[#101113] space-y-1">
            <p className="text-[10px] font-black text-[#777D77] uppercase tracking-wider">1. Enquiries</p>
            <p className="text-3xl font-black text-[#101113] tabular-nums">{metrics?.totalLeads || 0}</p>
            <p className="text-[11px] text-[#777D77] font-medium">100% of received inquiries</p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F3F4F2] border-2 border-[#101113] space-y-1">
            <p className="text-[10px] font-black text-[#101113] uppercase tracking-wider">2. Contacted</p>
            <p className="text-3xl font-black text-[#101113] tabular-nums">{metrics?.contactedLeads || 0}</p>
            <p className="text-[11px] text-[#777D77] font-medium">
              {metrics?.totalLeads ? Math.round(((metrics.contactedLeads) / metrics.totalLeads) * 100) : 0}% first contact rate
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#F3F4F2] border-2 border-[#101113] space-y-1">
            <p className="text-[10px] font-black text-[#101113] uppercase tracking-wider">3. Qualified</p>
            <p className="text-3xl font-black text-[#101113] tabular-nums">{metrics?.qualifiedLeads || 0}</p>
            <p className="text-[11px] text-[#777D77] font-medium">
              {metrics?.totalLeads ? Math.round(((metrics.qualifiedLeads) / metrics.totalLeads) * 100) : 0}% commercial intent
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#B7FF3C] border-2 border-[#101113] space-y-1">
            <p className="text-[10px] font-black text-[#101113] uppercase tracking-wider">4. Won Deals</p>
            <p className="text-3xl font-black text-[#101113] tabular-nums">{metrics?.wonLeads || 0}</p>
            <p className="text-[11px] text-[#101113] font-black">
              {metrics?.conversionRate || 0}% overall conversion
            </p>
          </div>
        </div>
      </div>

      {/* Attribution Performance Table */}
      <div className="card-white overflow-hidden space-y-0">
        <div className="p-6 border-b-2 border-[#DCDDDA] flex items-center justify-between bg-[#F3F4F2]">
          <div>
            <h2 className="font-black text-[#101113] text-sm uppercase tracking-wider">Channel Attribution &amp; ROI</h2>
            <p className="text-xs text-[#777D77] font-medium">Breakdown of leads, qualifications, and converted revenue by channel</p>
          </div>
          <span className="badge-lime text-[10px]">Verified Closed Revenue</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#101113] text-[#101113] font-black uppercase tracking-wider text-[11px] bg-white">
                <th className="py-3 px-5">Channel / Source</th>
                <th className="py-3 px-4 text-center">Total Inquiries</th>
                <th className="py-3 px-4 text-center">Share</th>
                <th className="py-3 px-4 text-center">Qualified</th>
                <th className="py-3 px-4 text-center">Won Deals</th>
                <th className="py-3 px-4 text-right">Won Revenue (PKR)</th>
                <th className="py-3 px-5 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCDDDA]">
              {channelPerformance.map((item) => (
                <tr key={item.channel} className="hover:bg-[#F3F4F2] transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#101113]">
                    {item.channel}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#777D77]">
                    {item.total}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[#777D77] font-medium">
                    {item.shareOfLeads}%
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-[#101113]">
                    {item.qualified}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-black text-[#101113]">
                    {item.won}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-black text-[#101113]">
                    {item.wonValue > 0 ? formatPKR(item.wonValue) : "—"}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="badge-dark text-[10px] font-mono">
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
      <div className="card-charcoal p-5 rounded-2xl border-2 border-[#101113] text-white flex items-center gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#B7FF3C] text-[#101113] flex items-center justify-center shrink-0 font-bold">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-medium">
          <strong className="text-white font-bold">Grounded Metrics Guarantee:</strong> Conversion figures and deal values represent 
          verified, closed inquiries. LeadRescue AI adheres to strict data integrity standards and does not 
          fabricate simulated ROI projections or vanity metrics.
        </p>
      </div>
    </div>
  );
}
