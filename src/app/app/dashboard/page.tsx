"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getDashboardDataAction } from "@/app/actions/dashboard";
import { DashboardMetrics } from "@/types/database";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ChartCard } from "@/components/ui/ChartCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  Users,
  Clock,
  Sparkles,
  TrendingUp,
  Building2,
  Plus,
  Upload,
  ArrowRight,
  Filter,
  CheckCircle2,
  MessageSquare,
  Layers,
  ArrowUpRight,
} from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [selectedClient, setSelectedClient] = useState("all");
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardDataAction({
        clientId: selectedClient,
        dateRange,
      });

      if (res.success) {
        setMetrics(res.data);
        setIsDemo(!!res.isDemo);
      } else {
        setError(res.error || "Failed to load dashboard metrics");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClient, dateRange]);

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Agency Command Centre"
          description="Real-time enquiry accountability, conversion velocity, and follow-up SLAs."
        />
        <LoadingState type="skeleton" rows={6} />
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="space-y-8">
        <PageHeader title="Agency Command Centre" />
        <ErrorState
          title="Unable to load dashboard"
          message={error || "Could not retrieve metrics for your agency."}
          onRetry={fetchData}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Page Header & Quick Actions */}
      <PageHeader
        title="Agency Overview"
        description="Every Lead Deserves a Follow-Up. Tracking response velocity, neglected enquiries, and active pipeline value."
        badge={
          isDemo ? (
            <span className="badge-dark text-xs uppercase tracking-wider">
              Demo Workspace Mode
            </span>
          ) : (
            <span className="badge-lime text-xs uppercase tracking-wider">
              Live Scoped Tenant
            </span>
          )
        }
      >
        <Link
          href="/app/leads"
          className="btn-base btn-primary text-xs font-black shadow-[0_3px_0_0_#101113]"
        >
          <Plus className="w-4 h-4 text-[#B7FF3C]" />
          <span>Add Lead</span>
        </Link>
        <Link
          href="/app/leads"
          className="btn-base btn-secondary text-xs font-bold border-2 border-[#101113]"
        >
          <Upload className="w-3.5 h-3.5 mr-1 text-[#101113]" />
          <span>Import CSV</span>
        </Link>
        <Link
          href="/app/clients"
          className="btn-base btn-secondary text-xs font-bold border-2 border-[#101113]"
        >
          <Building2 className="w-3.5 h-3.5 mr-1 text-[#101113]" />
          <span>Add Client</span>
        </Link>
      </PageHeader>

      {/* Filter & Timeframe Strip */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-white border-2 border-[#DCDDDA] shadow-[0_2px_0_0_#DCDDDA] text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F3F4F2] border border-[#DCDDDA] flex items-center justify-center">
            <Filter className="w-4 h-4 text-[#101113]" />
          </div>
          <span className="font-extrabold text-[#101113]">Client Workspace:</span>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="input-base text-xs h-10 py-0 rounded-xl bg-[#F3F4F2] font-bold border border-[#DCDDDA]"
          >
            <option value="all">All Client Accounts</option>
            <option value="horizon">Horizon Retailers</option>
            <option value="metro">Metro Logistics</option>
            <option value="skyline">Skyline Ventures</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-[#F3F4F2] p-1.5 rounded-2xl border border-[#DCDDDA]">
          {(["7d", "30d", "90d", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDateRange(r)}
              className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                dateRange === r
                  ? "bg-[#101113] text-[#B7FF3C] shadow-sm"
                  : "text-[#777D77] hover:text-[#101113]"
              }`}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r === "90d" ? "90 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Leads"
          value={metrics.totalLeads}
          change={{ value: "+18%", trend: "up", label: "vs prior period" }}
          icon={Users}
        />
        <StatCard
          title="New Enquiries"
          value={metrics.newLeads}
          change={{ value: "Awaiting touch", trend: "neutral", label: "Requires assignment" }}
          icon={Layers}
        />
        <StatCard
          title="Qualified Leads"
          value={metrics.qualifiedLeads}
          change={{ value: "37% rate", trend: "up", label: "High purchase intent" }}
          icon={CheckCircle2}
        />
        <StatCard
          title="Follow-ups Due"
          value={metrics.followUpsDueToday}
          change={{
            value: `${metrics.overdueFollowUps} Overdue`,
            trend: metrics.overdueFollowUps > 0 ? "down" : "neutral",
            label: "Action needed",
          }}
          icon={Clock}
          highlight={metrics.overdueFollowUps > 0}
        />
        <StatCard
          title="Won Opportunities"
          value={metrics.wonOpportunities}
          change={{
            value: formatCurrencyPKR(metrics.totalPipelineValue),
            trend: "up",
            label: "Total closed volume",
          }}
          icon={TrendingUp}
        />
      </div>

      {/* Main Dashboard Grid: Trend + Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lead Acquisition Trend */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Lead Acquisition Trend"
            description="Daily inbound enquiries across client campaigns"
            footer={
              <div className="flex items-center justify-between text-xs font-bold text-[#101113]">
                <span>Aggregated for {dateRange === "7d" ? "past 7 days" : "selected timeframe"}</span>
                <span className="badge-lime text-[11px] py-0.5 px-2">
                  {metrics.totalLeads} total records
                </span>
              </div>
            }
          >
            <div className="space-y-4 pt-2">
              <div className="h-48 flex items-end gap-3 pt-6 pb-2 px-2 border-b-2 border-[#DCDDDA]">
                {metrics.acquisitionTrend.map((item, i) => {
                  const maxCount = Math.max(...metrics.acquisitionTrend.map((d) => d.count), 1);
                  const heightPercent = Math.max(18, Math.round((item.count / maxCount) * 100));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[11px] font-black text-[#101113] tabular-nums group-hover:scale-110 transition-transform">
                        {item.count}
                      </span>
                      <div
                        className="w-full bg-[#B7FF3C] hover:bg-[#A3EE28] border-1.5 border-[#101113] rounded-t-xl transition-all duration-200 shadow-[0_2px_0_0_#101113]"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] text-[#777D77] font-bold uppercase">{item.period}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ChartCard>
        </div>

        {/* Lead Sources Distribution */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Enquiry Source Breakdown"
            description="Acquisition channel attribution & volume"
            footer={
              <span className="text-xs text-[#777D77] font-medium">
                Automated source tagging via UTMs, WhatsApp & lead forms
              </span>
            }
          >
            <div className="space-y-4 pt-2">
              {metrics.leadSources.map((source, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#101113]">{source.source}</span>
                    <span className="text-[#777D77] tabular-nums font-bold">
                      <strong className="text-[#101113] font-black">{source.count}</strong> ({source.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[#F3F4F2] rounded-full overflow-hidden border border-[#DCDDDA] p-0.5">
                    <div
                      className="h-full bg-[#101113] rounded-full transition-all duration-300"
                      style={{ width: `${source.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Urgent Follow-ups & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Follow-ups Due Today / Overdue */}
        <div className="lg:col-span-7 card-white p-7 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#DCDDDA]">
            <div>
              <h3 className="text-base font-black text-[#101113]">
                Follow-ups Requiring Immediate Action
              </h3>
              <p className="text-xs text-[#777D77] font-medium mt-0.5">
                Scheduled follow-ups assigned to your agency representatives
              </p>
            </div>
            <Link
              href="/app/follow-ups"
              className="text-xs font-black text-[#101113] hover:underline decoration-[#B7FF3C] decoration-2"
            >
              View All ({metrics.urgentFollowUps.length}) →
            </Link>
          </div>

          {metrics.urgentFollowUps.length === 0 ? (
            <EmptyState
              title="All follow-ups completed"
              description="No overdue or pending tasks for today. Outstanding work!"
            />
          ) : (
            <div className="divide-y divide-[#DCDDDA]">
              {metrics.urgentFollowUps.map((task) => (
                <div key={task.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-black text-[#101113] truncate text-sm">
                        {task.leadName}
                      </span>
                      {task.isOverdue ? (
                        <StatusBadge label="Overdue" variant="danger" />
                      ) : (
                        <StatusBadge label="Due Today" variant="warning" />
                      )}
                    </div>
                    <p className="text-[#777D77] text-xs font-medium">
                      Client: <strong className="text-[#101113] font-bold">{task.clientName}</strong> • {task.dueAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.phone && (
                      <a
                        href={`https://wa.me/${task.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-base bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold h-9 px-3 rounded-xl"
                        title="Open WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <Link
                      href="/app/follow-ups"
                      className="btn-base btn-secondary text-xs font-bold h-9 px-3"
                    >
                      Complete
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Sales Recommendations (Deep Charcoal Card) */}
        <div className="lg:col-span-5 card-charcoal p-7 space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#2A2E33]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#B7FF3C] text-[#101113] flex items-center justify-center font-black">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-white">
                AI Recommendations
              </h3>
            </div>
            <Link
              href="/app/ai-assistant"
              className="text-xs font-black text-[#B7FF3C] hover:underline"
            >
              Open Studio →
            </Link>
          </div>

          <div className="space-y-4">
            {metrics.aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-[#202327] border border-[#2A2E33] space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-extrabold text-white text-xs">{rec.title}</h4>
                  <span className="badge-lime text-[10px] py-0 px-2">Grounded</span>
                </div>
                <p className="text-[#DCDDDA] text-[11px] leading-relaxed font-medium">
                  {rec.description}
                </p>
                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href="/app/ai-assistant"
                    className="inline-flex items-center gap-1.5 font-black text-[#B7FF3C] hover:underline"
                  >
                    <span>Review Draft & Send</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="card-white p-7 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#DCDDDA]">
          <div>
            <h3 className="text-base font-black text-[#101113]">Recent Lead Activity</h3>
            <p className="text-xs text-[#777D77] font-medium mt-0.5">Live audit timeline across all assigned client sub-accounts</p>
          </div>
        </div>

        <div className="divide-y divide-[#DCDDDA]">
          {metrics.recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#101113] shrink-0" />
                <div>
                  <span className="font-extrabold text-[#101113]">{act.leadName}</span>
                  <span className="text-[#DCDDDA] mx-2 font-bold">•</span>
                  <span className="text-[#202320] font-medium">{act.action}</span>
                  <span className="text-[#DCDDDA] mx-2 font-bold">•</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#F3F4F2] text-[#101113] font-bold text-[10px] border border-[#DCDDDA]">
                    {act.clientName}
                  </span>
                </div>
              </div>
              <span className="text-[#777D77] text-xs font-semibold shrink-0">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
