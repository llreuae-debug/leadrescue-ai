import React from "react";
import Link from "next/link";
import { PLANS, PRICING_DISCLAIMER } from "@/config/plans";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  CheckCircle2,
  X,
  HelpCircle,
  Building2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

export default function PricingPage() {
  const comparisonCategories = [
    {
      category: "Workspaces & Volume",
      items: [
        {
          label: "Client Workspaces",
          starter: "Up to 3",
          growth: "Up to 10",
          advanced: "Up to 25",
        },
        {
          label: "Inbound Leads / month",
          starter: "300",
          growth: "1,200",
          advanced: "5,000",
        },
        {
          label: "Team Member Seats",
          starter: "2",
          growth: "6",
          advanced: "15",
        },
        {
          label: "AI Message Generations / month",
          starter: "200",
          growth: "1,000",
          advanced: "5,000",
        },
      ],
    },
    {
      category: "Features & Automation",
      items: [
        {
          label: "Visual Kanban Sales Pipeline",
          starter: true,
          growth: true,
          advanced: true,
        },
        {
          label: "Follow-up Task Scheduling & Overdue Alerts",
          starter: true,
          growth: true,
          advanced: true,
        },
        {
          label: "CSV Lead Import & Duplicate Check",
          starter: true,
          growth: true,
          advanced: true,
        },
        {
          label: "English & Urdu AI Message Drafting",
          starter: true,
          growth: true,
          advanced: true,
        },
        {
          label: "Role-Based Team Permissions (RBAC)",
          starter: false,
          growth: true,
          advanced: true,
        },
        {
          label: "Client Performance Comparison Reports",
          starter: false,
          growth: true,
          advanced: true,
        },
        {
          label: "Restricted Client Portal (Early Access)",
          starter: false,
          growth: false,
          advanced: true,
        },
      ],
    },
    {
      category: "Billing & Pakistani Support",
      items: [
        {
          label: "Manual Bank Transfer / Slip Verification",
          starter: true,
          growth: true,
          advanced: true,
        },
        {
          label: "Local WhatsApp Setup Assistance",
          starter: "Standard",
          growth: "Priority",
          advanced: "Dedicated Account Manager",
        },
      ],
    },
  ];

  return (
    <div className="space-y-16 py-16 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <span>Pakistan Launch Pricing</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Straightforward Plans for Growing Agencies
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          {PRICING_DISCLAIMER}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`linear-card p-6 sm:p-8 flex flex-col justify-between relative ${
              plan.isPopular
                ? "border-blue-500 ring-2 ring-blue-500/10 shadow-xl"
                : ""
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {plan.limits.clientWorkspaces} Workspaces
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2 min-h-[34px] leading-relaxed">
                {plan.tagline}
              </p>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tabular-nums">
                  {formatCurrencyPKR(plan.pricePKR)}
                </span>
                <span className="text-xs text-slate-500 font-medium">/{plan.period}</span>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs">
                {plan.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    {feat.included ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <span
                      className={
                        !feat.included
                          ? "text-slate-400 line-through"
                          : feat.highlight
                          ? "font-semibold text-slate-900"
                          : "text-slate-700"
                      }
                    >
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4">
              <Link
                href="/signup"
                className={`btn-base w-full text-xs font-semibold shadow-xs ${
                  plan.isPopular
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-slate-900 hover:bg-slate-800 text-white"
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="space-y-6 pt-8">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Compare Plan Capabilities
          </h2>
          <p className="text-xs text-slate-500">
            Every plan includes our core multi-tenant security architecture and 14-day evaluation period.
          </p>
        </div>

        <div className="linear-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75">
                  <th className="py-3.5 px-4 font-semibold text-slate-800 w-1/3">Capability</th>
                  <th className="py-3.5 px-4 font-semibold text-slate-800 text-center">Starter</th>
                  <th className="py-3.5 px-4 font-semibold text-slate-800 text-center bg-blue-50/50">Growth</th>
                  <th className="py-3.5 px-4 font-semibold text-slate-800 text-center">Advanced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonCategories.map((cat, cIdx) => (
                  <React.Fragment key={cIdx}>
                    <tr className="bg-slate-50/40">
                      <td
                        colSpan={4}
                        className="py-2 px-4 font-bold uppercase tracking-wider text-[10px] text-slate-500"
                      >
                        {cat.category}
                      </td>
                    </tr>
                    {cat.items.map((item, iIdx) => (
                      <tr key={iIdx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-medium text-slate-700">{item.label}</td>
                        <td className="py-3 px-4 text-center">
                          {typeof item.starter === "boolean" ? (
                            item.starter ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )
                          ) : (
                            <span className="font-semibold text-slate-800">{item.starter}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center bg-blue-50/30">
                          {typeof item.growth === "boolean" ? (
                            item.growth ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )
                          ) : (
                            <span className="font-semibold text-slate-900">{item.growth}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {typeof item.advanced === "boolean" ? (
                            item.advanced ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                            ) : (
                              <span className="text-slate-300">—</span>
                            )
                          ) : (
                            <span className="font-semibold text-slate-800">{item.advanced}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Security Note */}
      <div className="linear-card p-6 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="font-semibold text-slate-900">Flexible Local Payment Methods</p>
            <p className="text-slate-500">
              Pakistani agencies can pay via Meezan/HBL bank transfer, corporate invoice, or credit card.
            </p>
          </div>
        </div>
        <Link
          href="/contact"
          className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shrink-0"
        >
          Request Custom Billing
        </Link>
      </div>
    </div>
  );
}
