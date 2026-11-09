import React from "react";
import Link from "next/link";
import { PLANS, PRICING_DISCLAIMER } from "@/config/plans";
import { formatCurrencyPKR } from "@/lib/utils";
import {
  CheckCircle2,
  X,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Check,
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
    <div className="space-y-24 py-16 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Title */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2">
          <span className="badge-lime text-xs font-black uppercase tracking-wider">
            Agency Pricing
          </span>
          <span className="text-xs font-bold text-[#777D77]">Billed Monthly in PKR</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#101113] leading-tight">
          Straightforward Plans for Growing Agencies
        </h1>
        <p className="text-base sm:text-lg text-[#202320] font-medium leading-relaxed">
          {PRICING_DISCLAIMER}
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {PLANS.map((plan) => {
          const isHighlight = plan.isPopular;

          return (
            <div
              key={plan.id}
              className={`p-8 rounded-3xl border-2 border-[#101113] flex flex-col justify-between transition-all relative ${
                isHighlight
                  ? "bg-[#B7FF3C] shadow-[0_8px_0_0_#101113]"
                  : "bg-white shadow-[0_4px_0_0_#101113] hover:shadow-[0_6px_0_0_#101113]"
              }`}
            >
              {isHighlight && (
                <div className="absolute -top-4 left-8 px-4 py-1 rounded-full bg-[#101113] text-[#B7FF3C] text-xs font-black uppercase tracking-wider border border-[#B7FF3C]">
                  Most Popular Choice
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-[#101113]">{plan.name}</h3>
                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${
                      isHighlight
                        ? "bg-white text-[#101113] border-[#101113]"
                        : "bg-[#F3F4F2] text-[#101113] border-[#DCDDDA]"
                    }`}
                  >
                    {plan.limits.clientWorkspaces} Workspaces
                  </span>
                </div>

                <p
                  className={`text-xs mt-2 font-bold min-h-[36px] ${
                    isHighlight ? "text-[#101113]/85" : "text-[#777D77]"
                  }`}
                >
                  {plan.tagline}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5 pb-6 border-b-2 border-[#101113]/20">
                  <span className="text-4xl sm:text-5xl font-black text-[#101113] tabular-nums">
                    {formatCurrencyPKR(plan.pricePKR)}
                  </span>
                  <span className="text-xs font-bold text-[#101113]">/{plan.period}</span>
                </div>

                <div className="mt-6 space-y-3 text-xs font-bold">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {feat.included ? (
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                            isHighlight
                              ? "bg-[#101113] text-[#B7FF3C] border-[#101113]"
                              : "bg-[#B7FF3C] text-[#101113] border-[#101113]"
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border border-[#DCDDDA] bg-[#F3F4F2] text-[#777D77]">
                          <X className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                      <span
                        className={
                          !feat.included
                            ? "text-[#777D77] line-through font-medium"
                            : feat.highlight
                            ? "text-[#101113] font-black"
                            : "text-[#202320]"
                        }
                      >
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 pt-4">
                <Link
                  href="/signup"
                  className={`btn-base w-full text-xs font-black h-12 shadow-[0_3px_0_0_#101113] ${
                    isHighlight
                      ? "bg-[#101113] text-white hover:bg-[#202327]"
                      : "btn-primary"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="space-y-8 pt-8">
        <div className="space-y-2">
          <span className="badge-lime text-xs uppercase tracking-wider">Matrix</span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-[#101113]">
            Compare Plan Capabilities
          </h2>
          <p className="text-sm font-medium text-[#777D77]">
            Every plan includes our multi-tenant PostgreSQL security architecture and 14-day evaluation period.
          </p>
        </div>

        <div className="rounded-3xl border-2 border-[#101113] bg-white overflow-hidden shadow-[0_6px_0_0_#101113]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-[#101113] bg-[#17191C] text-white">
                  <th className="py-4 px-6 font-black uppercase text-[11px] tracking-wider w-1/3">Capability</th>
                  <th className="py-4 px-6 font-black uppercase text-[11px] tracking-wider text-center">Starter</th>
                  <th className="py-4 px-6 font-black uppercase text-[11px] tracking-wider text-center bg-[#B7FF3C] text-[#101113]">
                    Growth (Popular)
                  </th>
                  <th className="py-4 px-6 font-black uppercase text-[11px] tracking-wider text-center">Agency Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DCDDDA]">
                {comparisonCategories.map((cat, cIdx) => (
                  <React.Fragment key={cIdx}>
                    <tr className="bg-[#F3F4F2]">
                      <td
                        colSpan={4}
                        className="py-3 px-6 font-black uppercase tracking-wider text-[11px] text-[#101113]"
                      >
                        {cat.category}
                      </td>
                    </tr>
                    {cat.items.map((item, iIdx) => (
                      <tr key={iIdx} className="hover:bg-[#F3F4F2]/50 transition-colors">
                        <td className="py-3.5 px-6 font-bold text-[#202320]">{item.label}</td>
                        <td className="py-3.5 px-6 text-center">
                          {typeof item.starter === "boolean" ? (
                            item.starter ? (
                              <div className="w-5 h-5 rounded-full bg-[#101113] text-[#B7FF3C] flex items-center justify-center mx-auto">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : (
                              <span className="text-[#DCDDDA] font-bold">—</span>
                            )
                          ) : (
                            <span className="font-extrabold text-[#101113]">{item.starter}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-center bg-[#F3FDE1]">
                          {typeof item.growth === "boolean" ? (
                            item.growth ? (
                              <div className="w-5 h-5 rounded-full bg-[#101113] text-[#B7FF3C] flex items-center justify-center mx-auto">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : (
                              <span className="text-[#DCDDDA] font-bold">—</span>
                            )
                          ) : (
                            <span className="font-extrabold text-[#101113]">{item.growth}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-6 text-center">
                          {typeof item.advanced === "boolean" ? (
                            item.advanced ? (
                              <div className="w-5 h-5 rounded-full bg-[#101113] text-[#B7FF3C] flex items-center justify-center mx-auto">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            ) : (
                              <span className="text-[#DCDDDA] font-bold">—</span>
                            )
                          ) : (
                            <span className="font-extrabold text-[#101113]">{item.advanced}</span>
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
      <div className="card-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <p className="text-base font-extrabold text-[#101113]">Direct Pakistani Payment Methods</p>
            <p className="text-xs text-[#777D77] font-medium mt-0.5">
              Agencies can pay via Meezan/HBL bank transfer (IBFT), corporate billing invoice, or credit card.
            </p>
          </div>
        </div>
        <Link
          href="/contact"
          className="btn-base btn-secondary text-xs font-bold border-2 border-[#101113] shrink-0"
        >
          Request Custom Invoice
        </Link>
      </div>
    </div>
  );
}
