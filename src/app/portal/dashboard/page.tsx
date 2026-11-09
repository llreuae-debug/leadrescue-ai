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
  Calendar,
  Sparkles,
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
      {/* Top Hero Banner in Deep Charcoal */}
      <div className="card-charcoal p-6 sm:p-8 rounded-3xl border-2 border-[#101113] text-white relative overflow-hidden space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#282B30] text-[#B7FF3C] text-xs font-black uppercase tracking-wider border border-[#3A3F47]">
          <Building2 className="w-3.5 h-3.5" />
          <span>{workspace?.name} &bull; Client Portal</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
          Campaign Performance &amp; Lead Recovery
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-medium">
          Real-time visibility into your inbound marketing enquiries, follow-up SLA coverage, 
          and verified deal conversions managed by <span className="font-bold text-[#B7FF3C]">{workspace?.agencyName}</span>.
        </p>
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
          change={{ value: "Verified intent", trend: "up" }}
        />
        <StatCard
          title="Closed Deals"
          value={metrics?.wonLeads || 0}
          icon={Trophy}
          change={{ value: `${metrics?.conversionRate || 0}% conv. rate`, trend: "up" }}
          highlight={true}
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
        <div className="card-white p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
            <div>
              <h2 className="font-black text-[#101113] text-sm uppercase tracking-wider">Inbound Channels</h2>
              <p className="text-xs text-[#777D77] font-medium">Distribution across marketing sources</p>
            </div>
            <TrendingUp className="w-5 h-5 text-[#101113]" />
          </div>

          <div className="space-y-4 pt-1">
            {metrics?.sourceBreakdown && metrics.sourceBreakdown.length > 0 ? (
              metrics.sourceBreakdown.map((src) => (
                <div key={src.source} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-[#101113]">{src.source}</span>
                    <span className="font-mono text-[#777D77]">
                      {src.count} ({src.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F3F4F2] border-2 border-[#101113] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-[#B7FF3C] h-full rounded-full transition-all duration-300"
                      style={{ width: `${src.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#777D77] text-center py-6 font-medium">No source attribution recorded yet.</p>
            )}
          </div>

          <div className="pt-4 border-t-2 border-[#DCDDDA]">
            <Link
              href="/portal/reports"
              className="text-xs font-black text-[#101113] hover:text-[#777D77] flex items-center justify-between transition-colors"
            >
              <span>View full attribution report</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Recent Inquiries List */}
        <div className="lg:col-span-2 card-white p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
            <div>
              <h2 className="font-black text-[#101113] text-sm uppercase tracking-wider">Recent Inquiries</h2>
              <p className="text-xs text-[#777D77] font-medium">Verified customer leads received in your workspace</p>
            </div>
            <Link
              href="/portal/leads"
              className="text-xs font-black text-[#101113] hover:text-[#777D77] flex items-center gap-1 transition-colors"
            >
              <span>View all enquiries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            {recentLeads.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No inquiries found"
                description="Your workspace currently has no incoming leads recorded."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#101113] text-[#101113] uppercase tracking-wider font-black text-[11px]">
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Channel</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3 text-right">Deal Value</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCDDDA]">
                    {recentLeads.map((lead) => {
                      const cleanPhone = lead.phone ? lead.phone.replace(/[^0-9]/g, "") : null;
                      return (
                        <tr key={lead.id} className="hover:bg-[#F3F4F2] transition-colors">
                          <td className="py-3 px-3">
                            <p className="font-bold text-[#101113] text-xs leading-tight">{lead.name}</p>
                            <p className="text-[11px] text-[#777D77] font-medium">{lead.company || lead.email || "Individual"}</p>
                          </td>
                          <td className="py-3 px-3">
                            <span className="badge-dark text-[10px]">
                              {lead.source}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <StatusBadge
                              label={lead.status.replace(/_/g, " ").toUpperCase()}
                              variant={getStatusVariant(lead.status)}
                            />
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-[#101113] text-xs">
                            {lead.dealValue > 0 ? formatPKR(lead.dealValue) : "—"}
                          </td>
                          <td className="py-3 px-3 text-center">
                            {cleanPhone ? (
                              <a
                                href={`https://wa.me/${cleanPhone}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#17191C] hover:bg-[#101113] text-[#B7FF3C] text-[11px] font-bold border border-[#101113] transition-colors"
                                title="Open WhatsApp chat"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </a>
                            ) : (
                              <span className="text-xs text-[#777D77] font-medium">No phone</span>
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
