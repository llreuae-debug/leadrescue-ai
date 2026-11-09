"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { UsageMeter } from "@/components/ui/UsageMeter";
import { FormField } from "@/components/ui/FormField";
import {
  AgencyUsageMetrics,
  BillingContact,
  PaymentRecord,
  SubscriptionDetails,
} from "@/types/billing";
import { PLANS, PlanTier } from "@/config/plans";
import {
  getBillingOverviewAction,
  reviewPaymentProofAction,
  submitManualPaymentProofAction,
  updateBillingContactAction,
} from "@/app/actions/billing";
import {
  CreditCard,
  Building,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Copy,
  Check,
  Download,
  Info,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Receipt,
  FileText,
  Upload,
} from "lucide-react";

export default function BillingPage() {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(null);
  const [usage, setUsage] = useState<AgencyUsageMetrics | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [bankDetails, setBankDetails] = useState<{
    bankName: string;
    accountTitle: string;
    iban: string;
    accountNumber: string;
    branchCode: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Modals
  const [showSubmitProofModal, setShowSubmitProofModal] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);

  // Submit proof form state
  const [targetPlanId, setTargetPlanId] = useState<"starter" | "growth" | "advanced">("growth");
  const [transferBank, setTransferBank] = useState<string>("Meezan Bank Limited");
  const [transactionRef, setTransactionRef] = useState<string>("");
  const [transferNotes, setTransferNotes] = useState<string>("");
  const [isSubmittingProof, setIsSubmittingProof] = useState<boolean>(false);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await getBillingOverviewAction();
      if (res.success) {
        setSubscription(res.subscription);
        setUsage(res.usage);
        setPayments(res.payments);
        setBankDetails(res.bankDetails);
        setIsDemo(Boolean(res.isDemo));
      } else {
        setErrorMessage(res.error || "Failed to load billing details");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load billing data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const selectedPlanObj = PLANS.find((p) => p.id === targetPlanId) || PLANS[1];

  const handleSubmitProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingProof(true);
    setErrorMessage(null);
    try {
      const res = await submitManualPaymentProofAction({
        planId: targetPlanId,
        amountPKR: selectedPlanObj.pricePKR,
        transactionRef,
        bankName: transferBank,
        notes: transferNotes,
      });

      if (res.success) {
        setShowSubmitProofModal(false);
        setTransactionRef("");
        setTransferNotes("");
        setSuccessMessage("Bank transfer proof submitted. Our team will verify and activate your tier shortly.");
        setTimeout(() => setSuccessMessage(null), 5000);
        loadData();
      } else {
        setErrorMessage(res.error || "Submission failed");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Submission error");
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const handleApproveProof = async (paymentId: string) => {
    try {
      const res = await reviewPaymentProofAction({ paymentId, action: "approve" });
      if (res.success) {
        setSuccessMessage("Payment approved and subscription activated!");
        setTimeout(() => setSuccessMessage(null), 4000);
        loadData();
      } else {
        alert(res.error || "Failed to approve");
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Subscription & Billing"
          description="Manage plan entitlements, Pakistani bank transfer payments, usage limits, and receipts."
        />
        <LoadingState message="Loading subscription entitlements and billing ledger..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Subscription & Billing"
          description="Authoritative PKR plan tiers, Pakistani manual bank transfer review workflow, and quota enforcement."
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
          >
            <span>Change Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSubmitProofModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit Bank Transfer Receipt</span>
          </button>
        </div>
      </div>

      {/* Demo Workspace Banner */}
      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Pakistan Pilot Billing Mode:</strong> Manual bank transfer review workflow active for Pakistani digital agencies. Zero simulated card payments.
            </span>
          </div>
          <span className="bg-amber-200 text-amber-900 text-[11px] px-2 py-0.5 rounded font-mono">
            IBFT VERIFICATION WORKFLOW
          </span>
        </div>
      )}

      {/* Alerts */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3.5 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-900 font-semibold text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Subscription Hero Card */}
      {subscription && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Current Subscription Plan
              </span>
              <StatusBadge
                label={subscription.status === "active" ? "ACTIVE PAID" : "TRIAL"}
                variant={subscription.status === "active" ? "success" : "warning"}
                dot
              />
            </div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl font-bold text-slate-900">{subscription.planName} Plan</h2>
              <span className="text-lg font-semibold text-slate-700">
                PKR {subscription.pricePKR.toLocaleString()}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Billing cycle renews on{" "}
              <strong className="text-slate-800">
                {new Date(subscription.renewsAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              View Plan Features
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetPlanId("advanced");
                setShowSubmitProofModal(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
            >
              Upgrade to Advanced
            </button>
          </div>
        </div>
      )}

      {/* Quota & Usage Meters Grid */}
      {usage && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="text-sm font-bold text-slate-900">Monthly Usage & Entitlement Quotas</h3>
            <span className="text-xs text-slate-500">
              Enforced server-side against authoritative plan limits.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-1.5 p-3.5 bg-slate-50/70 border border-slate-100 rounded-lg">
              <UsageMeter
                label="Client Workspaces"
                current={usage.clientWorkspaces.used}
                limit={usage.clientWorkspaces.limit}
                unit="clients"
              />
            </div>

            <div className="space-y-1.5 p-3.5 bg-slate-50/70 border border-slate-100 rounded-lg">
              <UsageMeter
                label="Monthly Leads Ingestion"
                current={usage.leadsThisMonth.used}
                limit={usage.leadsThisMonth.limit}
                unit="leads"
              />
            </div>

            <div className="space-y-1.5 p-3.5 bg-slate-50/70 border border-slate-100 rounded-lg">
              <UsageMeter
                label="Team Member Seats"
                current={usage.teamSeats.used}
                limit={usage.teamSeats.limit}
                unit="seats"
              />
            </div>

            <div className="space-y-1.5 p-3.5 bg-slate-50/70 border border-slate-100 rounded-lg">
              <UsageMeter
                label="Grounded AI Follow-up Drafts"
                current={usage.aiDraftsThisMonth.used}
                limit={usage.aiDraftsThisMonth.limit}
                unit="drafts"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pakistan Manual IBFT Bank Details */}
      {bankDetails && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-emerald-600" />
                Pakistan Interbank Fund Transfer (IBFT) Instructions
              </h3>
              <p className="text-xs text-slate-500">
                Transfer subscription payments via 1Link, Raast, or internet banking to our corporate account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitProofModal(true)}
              className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              Submit Transfer Proof
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px]">Bank Name & Branch</span>
              <strong className="text-slate-800 block">{bankDetails.bankName}</strong>
              <span className="text-slate-400 text-[11px]">{bankDetails.branchCode}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
              <span className="text-slate-500 block text-[11px]">Account Title</span>
              <strong className="text-slate-800 block">{bankDetails.accountTitle}</strong>
              <span className="text-slate-400 text-[11px]">LeadRescue AI Official Corporate Title</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 block text-[11px]">IBAN / Account Number</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("iban", bankDetails.iban)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-[11px] flex items-center gap-1"
                >
                  {copiedKey === "iban" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "iban" ? "Copied" : "Copy IBAN"}</span>
                </button>
              </div>
              <strong className="text-slate-900 font-mono block text-xs tracking-tight">{bankDetails.iban}</strong>
              <span className="text-slate-500 font-mono text-[11px]">A/C: {bankDetails.accountNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment History & Receipts Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-0">
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">Invoices & Payment History</h3>
          </div>
          <span className="text-xs text-slate-500">Auditable manual payment review lifecycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-5">Invoice Ref / ID</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Amount (PKR)</th>
                <th className="py-3 px-4">Method & Bank</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5">
                    <span className="font-mono font-semibold text-slate-900 block">{p.id}</span>
                    <span className="text-[11px] text-slate-400 font-mono">Ref: {p.transactionRef}</span>
                  </td>

                  <td className="py-3 px-4 font-semibold text-slate-800">{p.planName}</td>

                  <td className="py-3 px-4 font-bold text-slate-900">
                    PKR {p.amountPKR.toLocaleString()}
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    <span className="block font-medium">{p.bankName}</span>
                    <span className="text-[11px] text-slate-400">Manual IBFT</span>
                  </td>

                  <td className="py-3 px-4">
                    <StatusBadge
                      label={p.status.toUpperCase()}
                      variant={
                        p.status === "approved"
                          ? "success"
                          : p.status === "pending"
                          ? "warning"
                          : "danger"
                      }
                      dot
                    />
                  </td>

                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {new Date(p.submittedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleApproveProof(p.id)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                        >
                          Approve (Admin)
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReceipt(p);
                          setShowReceiptModal(true);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-50 rounded border border-slate-200 shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-slate-400" />
                        <span>Receipt</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Bank Transfer Proof Modal */}
      {showSubmitProofModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-blue-600" />
                Submit Bank Transfer Receipt
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitProofModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-3.5">
              <FormField label="Target Subscription Tier" required>
                <select
                  value={targetPlanId}
                  onChange={(e) => setTargetPlanId(e.target.value as any)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 font-semibold"
                >
                  <option value="starter">Starter — PKR 2,999 / month</option>
                  <option value="growth">Growth — PKR 6,999 / month</option>
                  <option value="advanced">Advanced — PKR 14,999 / month</option>
                </select>
              </FormField>

              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-blue-900">Total Due for {selectedPlanObj.name}:</span>
                <strong className="text-blue-950 font-bold text-sm">
                  PKR {selectedPlanObj.pricePKR.toLocaleString()}
                </strong>
              </div>

              <FormField label="Bank You Transferred From" required>
                <select
                  value={transferBank}
                  onChange={(e) => setTransferBank(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                >
                  <option value="Meezan Bank Limited">Meezan Bank Limited</option>
                  <option value="Habib Bank Limited (HBL)">Habib Bank Limited (HBL)</option>
                  <option value="Bank Alfalah">Bank Alfalah</option>
                  <option value="Faysal Bank">Faysal Bank</option>
                  <option value="Allied Bank Limited (ABL)">Allied Bank Limited (ABL)</option>
                  <option value="EasyPaisa / JazzCash">EasyPaisa / JazzCash</option>
                  <option value="Other Commercial Bank">Other Commercial Bank</option>
                </select>
              </FormField>

              <FormField label="Bank Transaction Reference / UTR / RRN" required>
                <input
                  type="text"
                  required
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="e.g. 2026111009876543 or FT99441122"
                  className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
                />
              </FormField>

              <FormField label="Additional Notes (Optional)">
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Sender account title, mobile receipt number, or special instructions..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 resize-none"
                />
              </FormField>

              <div className="text-[11px] text-slate-500 space-y-1">
                <strong>Review SLA:</strong> Payments submitted via manual bank transfer are reconciled by finance during Pakistani business hours (1–3 hours). The plan will be marked <em>Pending</em> immediately.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubmitProofModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProof}
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-lg shadow-2xs transition-colors"
                >
                  {isSubmittingProof ? "Submitting..." : "Submit Payment Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Comparison Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Change Subscription Plan</h3>
                <p className="text-xs text-slate-500">Pick a plan matching your agency's client load and lead velocity.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {PLANS.map((plan) => {
                const isCurrent = subscription?.planId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-xl p-5 border flex flex-col justify-between space-y-4 ${
                      isCurrent
                        ? "border-blue-600 bg-blue-50/20 shadow-xs"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-900">{plan.name}</h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="text-xl font-extrabold text-slate-900">
                        PKR {plan.pricePKR.toLocaleString()}
                        <span className="text-xs text-slate-400 font-normal"> / mo</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-snug">{plan.tagline}</p>

                      <ul className="space-y-1.5 pt-2 text-xs text-slate-600">
                        {plan.features.slice(0, 5).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{f.text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      disabled={isCurrent}
                      onClick={() => {
                        setTargetPlanId(plan.id);
                        setShowUpgradeModal(false);
                        setShowSubmitProofModal(true);
                      }}
                      className={`w-full py-2 px-3 text-xs font-semibold rounded-lg transition-colors ${
                        isCurrent
                          ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                      }`}
                    >
                      {isCurrent ? "Active Plan" : `Upgrade to ${plan.name}`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Payment Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-blue-600" />
                Subscription Payment Receipt
              </h3>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-4 rounded-lg space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receipt Ref:</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Plan Tier:</span>
                  <span className="font-semibold text-slate-900">{selectedReceipt.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-bold text-emerald-700">
                    PKR {selectedReceipt.amountPKR.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bank / Channel:</span>
                  <span className="text-slate-700">{selectedReceipt.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="text-slate-700">{selectedReceipt.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Audit Status:</span>
                  <span className="uppercase font-bold text-slate-800">{selectedReceipt.status}</span>
                </div>
                {selectedReceipt.reviewerName && (
                  <div className="flex justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Approved By:</span>
                    <span>{selectedReceipt.reviewerName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
