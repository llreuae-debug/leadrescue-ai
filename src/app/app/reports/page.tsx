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
        setErrorMessage(res.error || "Failed to export report CSV.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to export CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Executive Reports & SLA Analytics"
          description="Verified lead response rates, source conversion ROI, and pipeline closing velocity across agency client accounts."
          badge={<span className="badge-lime text-[11px] font-bold">Executive Intelligence</span>}
        />

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowFormulaModal(!showFormulaModal)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#101113] bg-white hover:bg-[#F3F4F2] border-2 border-[#101113] rounded-xl shadow-xs transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Metric Formulas</span>
          </button>

          <button
            type="button"
            disabled={isExporting || isLoading}
            onClick={handleExportCsv}
            className="btn-lime text-xs py-2 px-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Demo Workspace Banner */}
      {isDemo && (
        <div className="card-white p-4 bg-[#F3F4F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#17191C] text-[#B7FF3C] flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="text-[#101113] font-medium">
              <strong className="font-bold">Demo Workspace Mode:</strong> Metrics are computed on client workspaces using local test records. Zero simulated claims or fabricated metrics.
            </span>
          </div>
          <span className="badge-dark text-[10px] shrink-0 font-mono">
            VERIFIED LOCAL AGGREGATION
          </span>
        </div>
      )}

      {/* Metric Definitions Card */}
      {showFormulaModal && (
        <div className="card-charcoal p-6 rounded-3xl border-2 border-[#101113] text-white space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#282B30]">
            <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B7FF3C]">
              <ShieldAlert className="w-4 h-4" />
              Documented Metric Formulas & SLAs
            </span>
            <button
              onClick={() => setShowFormulaModal(false)}
              className="text-slate-400 hover:text-white text-xs font-bold underline"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed font-medium">
            <div className="p-3.5 rounded-2xl bg-[#282B30] border border-[#3A3F47] space-y-1">
              <strong className="text-white block font-bold">Contact Rate:</strong>
              <p className="text-slate-300">
                (Leads marked <em>Contacted</em>, <em>Qualified</em>, <em>Proposal Sent</em>, <em>Won</em>, or <em>Lost</em> ÷ Total Cohort Leads) × 100%. Measures outreach coverage.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#282B30] border border-[#3A3F47] space-y-1">
              <strong className="text-white block font-bold">Qualification Rate:</strong>
              <p className="text-slate-300">
                (Leads marked <em>Qualified</em>, <em>Proposal Sent</em>, or <em>Won</em> ÷ Total Cohort Leads) × 100%. Measures targeting and campaign intent.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#282B30] border border-[#3A3F47] space-y-1">
              <strong className="text-white block font-bold">Follow-Up Completion Rate:</strong>
              <p className="text-slate-300">
                (Completed Tasks ÷ Tasks Due in Period) × 100%. Cancelled tasks are excluded from denominator; snoozed tasks remain active.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#282B30] border border-[#3A3F47] space-y-1">
              <strong className="text-white block font-bold">Won Conversion Rate:</strong>
              <p className="text-slate-300">
                (Won Leads ÷ [Won Leads + Lost Leads Closed in Period]) × 100%. Measures closing effectiveness on concluded opportunities.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="card-white p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-black text-[#101113] uppercase tracking-wider mr-2">
          <Filter className="w-3.5 h-3.5 text-[#101113]" />
          <span>Filters</span>
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-1 bg-[#F3F4F2] p-1 rounded-xl border-2 border-[#101113]">
          {(["7d", "30d", "90d", "all"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => handleFilterChange("dateRange", r)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                filters.dateRange === r
                  ? "bg-[#17191C] text-[#B7FF3C] shadow-xs"
                  : "text-[#777D77] hover:text-[#101113]"
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
          className="text-xs border-2 border-[#101113] rounded-xl px-3.5 py-2 bg-[#F3F4F2] text-[#101113] focus:outline-none font-bold"
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
          className="text-xs border-2 border-[#101113] rounded-xl px-3.5 py-2 bg-[#F3F4F2] text-[#101113] focus:outline-none font-bold"
        >
          <option value="all">All Inbound Sources</option>
          {sourceOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {isPending && (
          <span className="text-xs text-[#777D77] font-bold italic ml-auto animate-pulse">
            Recalculating metrics...
          </span>
        )}
      </div>

      {isLoading ? (
        <LoadingState message="Calculating server-side report aggregations..." />
      ) : errorMessage ? (
        <div className="card-white p-4 border-2 border-red-500 bg-red-50 text-red-900 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-bold">{errorMessage}</span>
          </div>
          <button
            onClick={() => loadData(filters)}
            className="text-red-700 hover:text-red-900 font-bold underline ml-2"
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
            <div className="card-white p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#777D77] font-bold uppercase tracking-wider">
                <span>Contact Rate</span>
                <Clock className="w-4 h-4 text-[#101113]" />
              </div>
              <div className="text-3xl font-black text-[#101113] tabular-nums">{summary.contactRate}%</div>
              <p className="text-[11px] text-[#777D77] font-medium">
                {summary.contactedLeads} of {summary.totalLeads} reached first touchpoint
              </p>
            </div>

            <div className="card-lime p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#101113] font-black uppercase tracking-wider">
                <span>Qualification Rate</span>
                <CheckCircle2 className="w-4 h-4 text-[#101113]" />
              </div>
              <div className="text-3xl font-black text-[#101113] tabular-nums">{summary.qualificationRate}%</div>
              <p className="text-[11px] text-[#101113] font-bold">
                {summary.qualifiedLeads} of {summary.totalLeads} verified qualified
              </p>
            </div>

            <div className="card-white p-6 space-y-2">
              <div className="flex items-center justify-between text-xs text-[#777D77] font-bold uppercase tracking-wider">
                <span>Follow-Up Completion</span>
                <TrendingUp className="w-4 h-4 text-[#101113]" />
              </div>
              <div className="text-3xl font-black text-[#101113] tabular-nums">{summary.followUpCompletionRate}%</div>
              <p className="text-[11px] text-[#777D77] font-medium">
                {summary.completedTasks} of {summary.totalTasksDue} scheduled tasks completed
              </p>
            </div>

            <div className="card-charcoal p-6 space-y-2 text-white">
              <div className="flex items-center justify-between text-xs text-[#B7FF3C] font-black uppercase tracking-wider">
                <span>Won Conversion</span>
                <Award className="w-4 h-4 text-[#B7FF3C]" />
              </div>
              <div className="text-3xl font-black text-white tabular-nums">{summary.wonRate}%</div>
              <p className="text-[11px] text-[#B7FF3C] font-mono font-bold">
                PKR {summary.totalWonValuePKR.toLocaleString()} closed revenue
              </p>
            </div>
          </div>

          {/* Section 1: Inbound Source Performance & Lost Reasons */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Inbound Source Table (7 Cols) */}
            <div className="lg:col-span-7 card-white p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
                <div>
                  <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
                    Inbound Channel Attribution
                  </h3>
                  <p className="text-xs text-[#777D77] font-medium">Performance, qualification, and closing volume by lead source.</p>
                </div>
                <span className="badge-lime text-[10px]">ROI Attributed</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#101113] text-[#101113] font-black uppercase tracking-wider text-[11px]">
                      <th className="pb-3">Source</th>
                      <th className="pb-3 text-right">Inquiries</th>
                      <th className="pb-3 text-right">Qualified</th>
                      <th className="pb-3 text-right">Won</th>
                      <th className="pb-3 text-right">Win Rate</th>
                      <th className="pb-3 text-right">Won Volume</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCDDDA]">
                    {sources.map((src) => (
                      <tr key={src.source} className="hover:bg-[#F3F4F2] transition-colors">
                        <td className="py-3 font-bold text-[#101113]">{src.source}</td>
                        <td className="py-3 text-right font-mono font-bold text-[#777D77]">{src.totalLeads}</td>
                        <td className="py-3 text-right font-mono font-bold text-[#777D77]">{src.qualifiedLeads}</td>
                        <td className="py-3 text-right font-mono font-black text-[#101113]">{src.wonLeads}</td>
                        <td className="py-3 text-right font-mono font-bold text-[#101113]">{src.winRate}%</td>
                        <td className="py-3 text-right font-mono font-black text-[#101113]">
                          {src.wonValuePKR > 0 ? `PKR ${src.wonValuePKR.toLocaleString()}` : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lost Opportunity Root Cause Analysis (5 Cols) */}
            <div className="lg:col-span-5 card-charcoal p-6 rounded-3xl border-2 border-[#101113] text-white space-y-4">
              <div className="pb-3 border-b border-[#282B30]">
                <h3 className="text-sm font-black text-white uppercase tracking-wider">
                  Lost Opportunity Root Causes
                </h3>
                <p className="text-xs text-slate-400 font-medium">Categorized loss reasons logged during stage transitions.</p>
              </div>

              {lostReasons.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 font-medium">
                  No lost opportunities recorded for this cohort.
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  {lostReasons.map((lr) => (
                    <div key={lr.reason} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{lr.reason}</span>
                        <span className="font-mono text-[#B7FF3C] text-[11px] font-bold">
                          {lr.count} leads ({lr.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#282B30] rounded-full h-2.5 overflow-hidden border border-[#3A3F47]">
                        <div
                          className="bg-[#B7FF3C] h-full rounded-full"
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
          <div className="card-white p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <div>
                <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
                  Client Workspace Comparison
                </h3>
                <p className="text-xs text-[#777D77] font-medium">
                  Comparative lead volume, response velocity, and pipeline closing across active agency clients.
                </p>
              </div>
              <span className="badge-dark text-[10px]">Multi-Tenant Overview</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b-2 border-[#101113] text-[#101113] font-black uppercase tracking-wider text-[11px]">
                    <th className="pb-3">Client Workspace</th>
                    <th className="pb-3 text-right">Total Leads</th>
                    <th className="pb-3 text-right">Contact Rate</th>
                    <th className="pb-3 text-right">Qualification Rate</th>
                    <th className="pb-3 text-right">Won Deals</th>
                    <th className="pb-3 text-right">Won Revenue (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCDDDA]">
                  {clients.map((cl) => (
                    <tr key={cl.clientId} className="hover:bg-[#F3F4F2] transition-colors">
                      <td className="py-3.5 font-bold text-[#101113] flex items-center gap-2">
                        <Building className="w-3.5 h-3.5 text-[#101113]" />
                        {cl.clientName}
                      </td>
                      <td className="py-3.5 text-right font-mono font-bold text-[#777D77]">{cl.totalLeads}</td>
                      <td className="py-3.5 text-right font-mono font-bold text-[#101113]">{cl.contactRate}%</td>
                      <td className="py-3.5 text-right font-mono font-bold text-[#101113]">{cl.qualificationRate}%</td>
                      <td className="py-3.5 text-right font-mono font-black text-[#101113]">{cl.wonLeads}</td>
                      <td className="py-3.5 text-right font-mono font-black text-[#101113]">
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
