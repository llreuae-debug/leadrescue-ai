"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  PhoneCall, 
  CheckCircle2, 
  Trophy, 
  Coins, 
  MessageSquare, 
  ExternalLink,
  ArrowRight,
  TrendingUp,
  Building2,
  Calendar
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { getClientPortalDashboardAction } from "@/app/actions/portal";
import { ClientPortalMetrics, ClientPortalLead, ClientPortalWorkspace } from "@/types/portal";

export default function ClientPortalDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<ClientPortalMetrics | null>(null);
  const [recentLeads, setRecentLeads] = useState<ClientPortalLead[]>([]);
  const [workspace, setWorkspace] = useState<ClientPortalWorkspace | null>(null);

  useEffect(() => {
    getClientPortalDashboardAction().then((res) => {
      if (res.success) {
        setMetrics(res.metrics);
        setRecentLeads(res.recentLeads);
        setWorkspace(res.workspace);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingState message="Loading client portal overview..." />
      </div>
    );
  }

  const formatPKR = (amount: number) => {
    return `PKR ${amount.toLocaleString()}`;
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

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/20">
            <Building2 className="w-3.5 h-3.5" />
            <span>{workspace?.name} &bull; Client Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campaign Performance &amp; Lead Recovery
          </h1>
          <p className="mt-2 text-sm sm:text-base text-blue-100/90 leading-relaxed">
            Real-time status of your inbound marketing inquiries, follow-up SLA coverage, 
            and confirmed deal conversions managed by <span className="font-semibold text-white">{workspace?.agencyName}</span>.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Enquiries"
          value={metrics?.totalLeads || 0}
          icon={Users}
          change={{ value: "All inbound", trend: "neutral" }}
        />
        <StatCard
          title="Contacted"
          value={metrics?.contactedLeads || 0}
          icon={PhoneCall}
          change={{
            value: metrics?.totalLeads ? `${Math.round(((metrics.contactedLeads) / metrics.totalLeads) * 100)}% coverage` : "0%",
            trend: "up",
          }}
        />
        <StatCard
          title="Qualified Leads"
          value={metrics?.qualifiedLeads || 0}
          icon={CheckCircle2}
          change={{ value: "High intent", trend: "up" }}
        />
        <StatCard
          title="Closed Deals"
          value={metrics?.wonLeads || 0}
          icon={Trophy}
          change={{ value: `${metrics?.conversionRate || 0}% conv. rate`, trend: "up" }}
        />
        <StatCard
          title="Won Revenue"
          value={formatPKR(metrics?.totalWonValuePKR || 0)}
          icon={Coins}
          change={{ value: "Confirmed conversions", trend: "up" }}
        />
      </div>

      {/* Grid: Inbound Channel Performance + Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Source Channels Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Inbound Lead Sources</h2>
              <p className="text-xs text-slate-500">Distribution across active marketing channels</p>
            </div>
            <TrendingUp className="w-5 h-5 text-slate-400" />
          </div>

          <div className="mt-5 space-y-4">
            {metrics?.sourceBreakdown && metrics.sourceBreakdown.length > 0 ? (
              metrics.sourceBreakdown.map((src) => (
                <div key={src.source} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{src.source}</span>
                    <span className="text-slate-500 font-semibold">
                      {src.count} ({src.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${src.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No source attribution recorded yet.</p>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link
              href="/portal/reports"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-between"
            >
              <span>View full attribution report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base">Recent Inquiries</h2>
              <p className="text-xs text-slate-500">Verified customer leads received in your workspace</p>
            </div>
            <Link
              href="/portal/leads"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="mt-4">
            {recentLeads.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No inquiries found"
                description="Your workspace currently has no incoming leads recorded."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Channel</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Deal Value</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentLeads.map((lead) => {
                      const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : null;
                      return (
                        <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <p className="font-semibold text-slate-900 text-sm leading-tight">{lead.name}</p>
                            <p className="text-xs text-slate-400">{lead.company || lead.email || "Individual"}</p>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                              {lead.source}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge
                              label={lead.status.replace("_", " ").toUpperCase()}
                              variant={getStatusVariant(lead.status)}
                            />
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-slate-900 text-xs">
                            {lead.dealValue > 0 ? formatPKR(lead.dealValue) : "—"}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {cleanPhone ? (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-medium transition-colors"
                                title="Open WhatsApp chat"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">No phone</span>
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
        </div>
      </div>
    </div>
  );
}
