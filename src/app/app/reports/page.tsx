"use client";

import { useState, useEffect, useTransition } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CalculatedReportSummary,
  ClientComparisonMetric,
  LostReasonMetric,
  ReportsFilterOptions,
  SourcePerformanceMetric,
} from "@/lib/reports/metrics";
import { exportReportsCsvAction, getReportsDataAction } from "@/app/actions/reports";
import {
  BarChart3,
  Download,
  Calendar,
  Building,
  Filter,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  AlertCircle,
  HelpCircle,
  Info,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Percent,
} from "lucide-react";

export default function ReportsPage() {
  const [filters, setFilters] = useState<ReportsFilterOptions>({
    dateRange: "30d",
    clientId: "all",
    source: "all",
  });

  const [summary, setSummary] = useState<CalculatedReportSummary | null>(null);
  const [sources, setSources] = useState<SourcePerformanceMetric[]>([]);
  const [clients, setClients] = useState<ClientComparisonMetric[]>([]);
  const [lostReasons, setLostReasons] = useState<LostReasonMetric[]>([]);
  const [clientOptions, setClientOptions] = useState<{ id: string; name: string }[]>([]);
  const [sourceOptions, setSourceOptions] = useState<string[]>([]);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFormulaModal, setShowFormulaModal] = useState<boolean>(false);

  const [isPending, startTransition] = useTransition();

  const loadData = async (currentFilters: ReportsFilterOptions) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await getReportsDataAction(currentFilters);
      if (res.success) {
        setSummary(res.summary);
        setSources(res.sources);
        setClients(res.clients);
        setLostReasons(res.lostReasons);
        setClientOptions(res.clientOptions);
        setSourceOptions(res.sourceOptions);
        setIsDemo(Boolean(res.isDemo));
      } else {
        setErrorMessage(res.error || "Failed to load reports");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(filters);
  }, []);

  const handleFilterChange = (key: keyof ReportsFilterOptions, value: string) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    startTransition(() => {
      loadData(updated);
    });
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const res = await exportReportsCsvAction(filters);
      if (res.success && res.csvContent) {
        const blob = new Blob([res.csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", res.filename || "leadrescue-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(res.error || "Failed to export report CSV");
      }
    } catch (err: any) {
      alert(err.message || "Export error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Export Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Reports & Analytics"
          description="Transparent, mathematically verified performance metrics and conversion rates across agency clients."
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFormulaModal(!showFormulaModal)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Metric Formulas</span>
          </button>

          <button
            type="button"
            disabled={isExporting || isLoading}
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Demo Workspace Banner */}
      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demo Workspace Mode:</strong> Metrics are computed on client workspaces using local test records. Zero simulated claims or fabricated metrics.
            </span>
          </div>
          <span className="bg-amber-200 text-amber-900 text-[11px] px-2 py-0.5 rounded font-mono">
            VERIFIED LOCAL AGGREGATION
          </span>
        </div>
      )}

      {/* Metric Definitions Card */}
      {showFormulaModal && (
        <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 text-xs text-blue-950 space-y-2">
          <div className="flex items-center justify-between font-semibold pb-1 border-b border-blue-200/60">
            <span className="flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-blue-600" />
              Documented Metric Formulas & SLAs
            </span>
            <button
              onClick={() => setShowFormulaModal(false)}
              className="text-blue-600 hover:text-blue-900 text-[11px]"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px] leading-relaxed">
            <div>
              <strong>Contact Rate:</strong> (Leads marked <em>Contacted</em>, <em>Qualified</em>, <em>Proposal Sent</em>, <em>Won</em>, or <em>Lost</em> ÷ Total Cohort Leads) × 100%. Measures outreach coverage.
            </div>
            <div>
              <strong>Qualification Rate:</strong> (Leads marked <em>Qualified</em>, <em>Proposal Sent</em>, or <em>Won</em> ÷ Total Cohort Leads) × 100%. Measures targeting and campaign intent.
            </div>
            <div>
              <strong>Follow-Up Completion Rate:</strong> (Completed Tasks ÷ Tasks Due in Period) × 100%. Cancelled tasks are excluded from denominator; snoozed tasks remain active.
            </div>
            <div>
              <strong>Won Conversion Rate:</strong> (Won Leads ÷ [Won Leads + Lost Leads Closed in Period]) × 100%. Measures closing effectiveness on concluded opportunities.
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span>Filters</span>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {(["7d", "30d", "90d", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleFilterChange("dateRange", r)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                filters.dateRange === r
                  ? "bg-white text-blue-700 shadow-2xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : r === "90d" ? "90 Days" : "All Time"}
            </button>
          ))}
        </div>

        {/* Client Workspace Dropdown */}
        <select
          value={filters.clientId || "all"}
          onChange={(e) => handleFilterChange("clientId", e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
        >
          <option value="all">All Client Workspaces</option>
          {clientOptions.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Inbound Source Dropdown */}
        <select
          value={filters.source || "all"}
          onChange={(e) => handleFilterChange("source", e.target.value)}
          className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
        >
          <option value="all">All Inbound Sources</option>
          {sourceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {isPending && (
          <span className="text-xs text-slate-400 italic ml-auto animate-pulse">
            Recalculating metrics...
          </span>
        )}
      </div>

      {isLoading ? (
        <LoadingState message="Calculating server-side report aggregations..." />
      ) : errorMessage ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => loadData(filters)}
            className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
          >
            Retry
          </button>
        </div>
      ) : summary && summary.totalLeads === 0 ? (
        <EmptyState
          title="No Data for Selected Timeframe"
          description="There are no leads or follow-up activities recorded for this date range and filter set."
          action={{
            label: "Reset to All Time",
            onClick: () => handleFilterChange("dateRange", "all"),
          }}
        />
      ) : summary ? (
        <>
          {/* Executive KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Contact Rate</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{summary.contactRate}%</div>
              <p className="text-[11px] text-slate-500">
                {summary.contactedLeads} of {summary.totalLeads} leads reached first touchpoint
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Qualification Rate</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{summary.qualificationRate}%</div>
              <p className="text-[11px] text-slate-500">
                {summary.qualifiedLeads} of {summary.totalLeads} prospects verified as qualified
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Follow-Up Completion</span>
                <TrendingUp className="w-4 h-4 text-violet-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{summary.followUpCompletionRate}%</div>
              <p className="text-[11px] text-slate-500">
                {summary.completedTasks} of {summary.totalTasksDue} eligible scheduled tasks completed
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Won Conversion Rate</span>
                <Award className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{summary.wonRate}%</div>
              <p className="text-[11px] text-emerald-700 font-semibold">
                PKR {summary.totalWonValuePKR.toLocaleString()} closed revenue
              </p>
            </div>
          </div>

          {/* Section 1: Inbound Source Performance & Lost Reasons */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inbound Source Table (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Inbound Channel Attribution</h3>
                  <p className="text-xs text-slate-500">Performance, qualification, and closing volume by lead source.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                      <th className="pb-2.5">Source</th>
                      <th className="pb-2.5 text-right">Inquiries</th>
                      <th className="pb-2.5 text-right">Qualified</th>
                      <th className="pb-2.5 text-right">Won</th>
                      <th className="pb-2.5 text-right">Win Rate</th>
                      <th className="pb-2.5 text-right">Won Volume (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sources.map((src) => (
                      <tr key={src.source} className="hover:bg-slate-50/50">
                        <td className="py-2.5 font-medium text-slate-800">{src.source}</td>
                        <td className="py-2.5 text-right font-mono text-slate-600">{src.totalLeads}</td>
                        <td className="py-2.5 text-right font-mono text-slate-600">{src.qualifiedLeads}</td>
                        <td className="py-2.5 text-right font-mono text-emerald-700 font-semibold">{src.wonLeads}</td>
                        <td className="py-2.5 text-right font-mono text-slate-700">{src.winRate}%</td>
                        <td className="py-2.5 text-right font-mono text-slate-900 font-semibold">
                          {src.wonValuePKR > 0 ? `PKR ${src.wonValuePKR.toLocaleString()}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lost Opportunity Root Cause Analysis (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Lost Opportunity Root Causes</h3>
                <p className="text-xs text-slate-500">Categorized loss reasons logged during stage transitions.</p>
              </div>

              {lostReasons.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No lost opportunities recorded for this cohort.
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  {lostReasons.map((lr) => (
                    <div key={lr.reason} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-700">{lr.reason}</span>
                        <span className="font-mono text-slate-500 text-[11px]">
                          {lr.count} leads ({lr.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-rose-500 h-full rounded-full"
                          style={{ width: `${lr.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Client Workspace Comparison */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Client Workspace Comparison</h3>
              <p className="text-xs text-slate-500">
                Comparative lead volume, response velocity, and pipeline closing across active agency clients.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                    <th className="pb-2.5">Client Workspace</th>
                    <th className="pb-2.5 text-right">Total Leads</th>
                    <th className="pb-2.5 text-right">Contact Rate</th>
                    <th className="pb-2.5 text-right">Qualification Rate</th>
                    <th className="pb-2.5 text-right">Won Deals</th>
                    <th className="pb-2.5 text-right">Won Revenue (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clients.map((cl) => (
                    <tr key={cl.clientId} className="hover:bg-slate-50/50">
                      <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {cl.clientName}
                      </td>
                      <td className="py-3 text-right font-mono text-slate-700">{cl.totalLeads}</td>
                      <td className="py-3 text-right font-mono text-blue-700 font-medium">{cl.contactRate}%</td>
                      <td className="py-3 text-right font-mono text-violet-700 font-medium">{cl.qualificationRate}%</td>
                      <td className="py-3 text-right font-mono text-emerald-700 font-semibold">{cl.wonLeads}</td>
                      <td className="py-3 text-right font-mono text-slate-900 font-bold">
                        {cl.wonValuePKR > 0 ? `PKR ${cl.wonValuePKR.toLocaleString()}` : "PKR 0"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
