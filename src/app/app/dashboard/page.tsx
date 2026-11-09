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
  AlertTriangle,
  Building2,
  Plus,
  Upload,
  ArrowRight,
  Filter,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Phone,
  Layers,
  HelpCircle,
  FileSpreadsheet,
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
      <div className="space-y-6">
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
      <div className="space-y-6">
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
        description="Every Lead Deserves a Follow-Up. Tracking response times, neglected enquiries, and active pipeline value."
        badge={
          isDemo ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Demo Workspace Mode
            </span>
          ) : (
            <StatusBadge label="Live Agency Scoped" variant="success" />
          )
        }
      >
        <Link
          href="/app/leads"
          className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs h-9 px-3.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Lead</span>
        </Link>
        <Link
          href="/app/leads"
          className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-9 px-3.5"
        >
          <Upload className="w-3.5 h-3.5 mr-1" />
          <span>Import CSV</span>
        </Link>
        <Link
          href="/app/clients"
          className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-9 px-3.5"
        >
          <Building2 className="w-3.5 h-3.5 mr-1" />
          <span>Add Client</span>
        </Link>
      </PageHeader>

      {/* Filter & Date Range Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-slate-200 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-700">Filter Workspace:</span>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="input-base text-xs h-8 py-0 bg-slate-50"
          >
            <option value="all">All Client Accounts</option>
            <option value="horizon">Horizon Retailers</option>
            <option value="metro">Metro Logistics</option>
            <option value="skyline">Skyline Ventures</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg">
          {(["7d", "30d", "90d", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setDateRange(r)}
              className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors ${
                dateRange === r
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r === "90d" ? "90 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lead Acquisition Trend */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Lead Acquisition Trend"
            description="Daily inbound enquiries across campaigns"
            footer={
              <div className="flex items-center justify-between">
                <span>Aggregated for {dateRange === "7d" ? "past 7 days" : "selected timeframe"}</span>
                <span className="font-semibold text-slate-700">
                  {metrics.totalLeads} total records
                </span>
              </div>
            }
          >
            <div className="space-y-4 pt-2">
              <div className="h-44 flex items-end gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
                {metrics.acquisitionTrend.map((item, i) => {
                  const maxCount = Math.max(...metrics.acquisitionTrend.map((d) => d.count), 1);
                  const heightPercent = Math.max(15, Math.round((item.count / maxCount) * 100));

                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700 tabular-nums">
                        {item.count}
                      </span>
                      <div
                        className="w-full bg-blue-600 rounded-t transition-all duration-300 hover:bg-blue-500"
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className="text-[10px] text-slate-400 font-medium">{item.period}</span>
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
            description="Acquisition channel attribution"
            footer={
              <span className="text-xs text-slate-500">
                Automated source tagging via UTMs & lead forms
              </span>
            }
          >
            <div className="space-y-3 pt-2">
              {metrics.leadSources.map((source, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{source.source}</span>
                    <span className="text-slate-500 tabular-nums">
                      <strong className="text-slate-900">{source.count}</strong> ({source.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Follow-ups Due Today / Overdue */}
        <div className="lg:col-span-7 linear-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Follow-ups Requiring Immediate Action
              </h3>
              <p className="text-xs text-slate-500">
                Scheduled follow-ups assigned to your agency representatives
              </p>
            </div>
            <Link
              href="/app/follow-ups"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
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
            <div className="divide-y divide-slate-100">
              {metrics.urgentFollowUps.map((task) => (
                <div key={task.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 truncate">
                        {task.leadName}
                      </span>
                      {task.isOverdue ? (
                        <StatusBadge label="Overdue" variant="danger" />
                      ) : (
                        <StatusBadge label="Due Today" variant="warning" />
                      )}
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Client: <strong className="text-slate-700 font-medium">{task.clientName}</strong> • {task.dueAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {task.phone && (
                      <a
                        href={`https://wa.me/${task.phone.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-base bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold h-8 px-2.5"
                        title="Open WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    <Link
                      href="/app/follow-ups"
                      className="btn-base bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-semibold h-8 px-2.5"
                    >
                      Complete
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Sales Recommendations */}
        <div className="lg:col-span-5 linear-card p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <h3 className="text-sm font-semibold text-slate-900">
                AI Pipeline Recommendations
              </h3>
            </div>
            <Link
              href="/app/ai-assistant"
              className="text-xs font-semibold text-violet-600 hover:text-violet-700"
            >
              Open Assistant →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="p-3.5 rounded-xl bg-violet-50/50 border border-violet-100 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-slate-900 text-xs">{rec.title}</h4>
                  <StatusBadge label="Grounded Draft" variant="ai" dot={false} />
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {rec.description}
                </p>
                <div className="pt-1 flex items-center justify-end">
                  <Link
                    href="/app/ai-assistant"
                    className="inline-flex items-center gap-1 font-bold text-violet-700 hover:text-violet-900"
                  >
                    <span>Review Draft & Send</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="linear-card p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Recent Lead Activity</h3>
            <p className="text-xs text-slate-500">Live audit timeline across all assigned clients</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {metrics.recentActivities.map((act) => (
            <div key={act.id} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900">{act.leadName}</span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span className="text-slate-600">{act.action}</span>
                  <span className="text-slate-400 mx-1.5">•</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                    {act.clientName}
                  </span>
                </div>
              </div>
              <span className="text-slate-400 text-[11px] shrink-0">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
