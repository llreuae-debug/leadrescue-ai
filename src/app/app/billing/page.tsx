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
  X,
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
          badge={<span className="badge-lime text-[11px] font-bold">Billing Portal</span>}
        />

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#101113] bg-white hover:bg-[#F3F4F2] border-2 border-[#101113] rounded-xl shadow-xs transition-colors"
          >
            <span>Change Plan</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSubmitProofModal(true)}
            className="btn-lime text-xs py-2 px-4 inline-flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit Bank Receipt</span>
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
              <strong className="font-bold">Pakistan Pilot Billing Mode:</strong> Manual bank transfer review workflow active for Pakistani digital marketing agencies. Zero simulated card transactions.
            </span>
          </div>
          <span className="badge-dark text-[10px] shrink-0 font-mono">
            IBFT VERIFICATION WORKFLOW
          </span>
        </div>
      )}

      {/* Alerts */}
      {successMessage && (
        <div className="card-white p-4 border-2 border-emerald-500 bg-emerald-50 text-emerald-900 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="card-white p-4 border-2 border-red-500 bg-red-50 text-red-900 rounded-2xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-bold">{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-700 hover:text-red-900 font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Active Subscription Hero Card in Electric Lime */}
      {subscription && (
        <div className="card-lime p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-[#101113] uppercase tracking-wider">
                Current Subscription Plan
              </span>
              <span className="badge-dark text-[10px]">
                {subscription.status === "active" ? "ACTIVE PAID" : "TRIAL"}
              </span>
            </div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-3xl font-black text-[#101113]">{subscription.planName} Plan</h2>
              <span className="text-xl font-black text-[#101113]">
                PKR {subscription.pricePKR.toLocaleString()}
                <span className="text-xs font-bold text-[#101113]/70"> / month</span>
              </span>
            </div>
            <p className="text-xs text-[#101113] font-medium">
              Billing cycle renews on{" "}
              <strong className="font-black">
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
              className="px-4 py-2.5 text-xs font-bold text-[#101113] bg-white hover:bg-[#F3F4F2] border-2 border-[#101113] rounded-xl transition-colors shadow-xs"
            >
              View Plan Features
            </button>
            <button
              type="button"
              onClick={() => {
                setTargetPlanId("advanced");
                setShowSubmitProofModal(true);
              }}
              className="btn-primary text-xs px-5 py-2.5"
            >
              Upgrade to Advanced
            </button>
          </div>
        </div>
      )}

      {/* Quota & Usage Meters Grid */}
      {usage && (
        <div className="card-white p-6 space-y-5">
          <div className="flex items-center justify-between border-b-2 border-[#DCDDDA] pb-3">
            <div>
              <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
                Monthly Usage & Entitlement Quotas
              </h3>
              <p className="text-xs text-[#777D77] font-medium">
                Enforced server-side against authoritative plan limits.
              </p>
            </div>
            <span className="badge-lime text-[10px]">Authoritative Limits</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="space-y-2 p-4 bg-[#F3F4F2] border-2 border-[#101113] rounded-2xl">
              <UsageMeter
                label="Client Workspaces"
                current={usage.clientWorkspaces.used}
                limit={usage.clientWorkspaces.limit}
                unit="clients"
              />
            </div>

            <div className="space-y-2 p-4 bg-[#F3F4F2] border-2 border-[#101113] rounded-2xl">
              <UsageMeter
                label="Monthly Leads Ingestion"
                current={usage.leadsThisMonth.used}
                limit={usage.leadsThisMonth.limit}
                unit="leads"
              />
            </div>

            <div className="space-y-2 p-4 bg-[#F3F4F2] border-2 border-[#101113] rounded-2xl">
              <UsageMeter
                label="Team Member Seats"
                current={usage.teamSeats.used}
                limit={usage.teamSeats.limit}
                unit="seats"
              />
            </div>

            <div className="space-y-2 p-4 bg-[#F3F4F2] border-2 border-[#101113] rounded-2xl">
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
        <div className="card-charcoal p-6 sm:p-8 rounded-3xl border-2 border-[#101113] text-white space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#282B30] pb-3 gap-3">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wider">
                <Building className="w-4 h-4 text-[#B7FF3C]" />
                Pakistan Interbank Fund Transfer (IBFT) Details
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Transfer subscription payments via 1Link, Raast, or internet banking to our corporate account.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmitProofModal(true)}
              className="btn-lime text-xs py-2 px-4 self-start sm:self-auto"
            >
              Submit Transfer Proof
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#282B30] p-4 rounded-2xl border border-[#3A3F47] space-y-1">
              <span className="text-slate-400 block text-[11px] font-medium">Bank Name & Branch</span>
              <strong className="text-white block font-bold text-sm">{bankDetails.bankName}</strong>
              <span className="text-[#B7FF3C] text-[11px] font-mono font-bold">{bankDetails.branchCode}</span>
            </div>

            <div className="bg-[#282B30] p-4 rounded-2xl border border-[#3A3F47] space-y-1">
              <span className="text-slate-400 block text-[11px] font-medium">Account Title</span>
              <strong className="text-white block font-bold text-sm">{bankDetails.accountTitle}</strong>
              <span className="text-slate-400 text-[11px] font-medium">LeadRescue AI Official Corporate Title</span>
            </div>

            <div className="bg-[#282B30] p-4 rounded-2xl border border-[#3A3F47] space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 block text-[11px] font-medium">IBAN / Account Number</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("iban", bankDetails.iban)}
                  className="text-[#B7FF3C] hover:underline font-bold text-[11px] flex items-center gap-1"
                >
                  {copiedKey === "iban" ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === "iban" ? "Copied" : "Copy IBAN"}</span>
                </button>
              </div>
              <strong className="text-[#B7FF3C] font-mono block text-xs tracking-tight font-bold">{bankDetails.iban}</strong>
              <span className="text-slate-300 font-mono text-[11px]">A/C: {bankDetails.accountNumber}</span>
            </div>
          </div>
        </div>
      )}

      {/* Payment History & Receipts Table */}
      <div className="card-white overflow-hidden space-y-0">
        <div className="px-6 py-4 border-b-2 border-[#DCDDDA] flex items-center justify-between bg-[#F3F4F2]">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#101113]" />
            <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">Invoices & Payment History</h3>
          </div>
          <span className="text-xs text-[#777D77] font-medium">Auditable manual payment review lifecycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#101113] text-[#101113] font-black uppercase tracking-wider text-[11px] bg-white">
                <th className="py-3 px-6">Invoice Ref / ID</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Amount (PKR)</th>
                <th className="py-3 px-4">Method & Bank</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCDDDA]">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-[#F3F4F2] transition-colors">
                  <td className="py-3.5 px-6">
                    <span className="font-mono font-bold text-[#101113] block">{p.id}</span>
                    <span className="text-[11px] text-[#777D77] font-mono">Ref: {p.transactionRef}</span>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#101113]">{p.planName}</td>

                  <td className="py-3.5 px-4 font-mono font-black text-[#101113]">
                    PKR {p.amountPKR.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-4 text-[#777D77]">
                    <span className="block font-bold text-[#101113]">{p.bankName}</span>
                    <span className="text-[11px] text-[#777D77] font-medium">Manual IBFT</span>
                  </td>

                  <td className="py-3.5 px-4">
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

                  <td className="py-3.5 px-4 text-[#777D77] font-mono text-[11px] font-bold">
                    {new Date(p.submittedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === "pending" && (
                        <button
                          type="button"
                          onClick={() => handleApproveProof(p.id)}
                          className="px-2.5 py-1 text-[11px] font-bold text-[#101113] bg-[#B7FF3C] hover:bg-[#a6ec34] rounded-lg border-2 border-[#101113] transition-colors"
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
                        className="px-2.5 py-1 text-[11px] font-bold text-[#101113] bg-white hover:bg-[#F3F4F2] rounded-lg border-2 border-[#101113] transition-colors flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-[#101113]" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border-2 border-[#101113] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <h3 className="text-sm font-black text-[#101113] flex items-center gap-2 uppercase tracking-wider">
                <Upload className="w-4 h-4 text-[#101113]" />
                Submit Bank Transfer Receipt
              </h3>
              <button
                type="button"
                onClick={() => setShowSubmitProofModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F3F4F2] flex items-center justify-center text-[#101113] font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <FormField label="Target Subscription Tier" required>
                <select
                  value={targetPlanId}
                  onChange={(e) => setTargetPlanId(e.target.value as any)}
                  className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
                >
                  <option value="starter">Starter — PKR 2,999 / month</option>
                  <option value="growth">Growth — PKR 6,999 / month</option>
                  <option value="advanced">Advanced — PKR 14,999 / month</option>
                </select>
              </FormField>

              <div className="p-3.5 bg-[#B7FF3C] rounded-2xl border-2 border-[#101113] flex items-center justify-between text-xs font-bold text-[#101113]">
                <span>Total Due for {selectedPlanObj.name}:</span>
                <strong className="font-black text-sm">
                  PKR {selectedPlanObj.pricePKR.toLocaleString()}
                </strong>
              </div>

              <FormField label="Bank You Transferred From" required>
                <select
                  value={transferBank}
                  onChange={(e) => setTransferBank(e.target.value)}
                  className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
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
                  className="w-full text-xs font-mono font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
                />
              </FormField>

              <FormField label="Additional Notes (Optional)">
                <textarea
                  rows={2}
                  value={transferNotes}
                  onChange={(e) => setTransferNotes(e.target.value)}
                  placeholder="Sender account title, mobile receipt number, or special instructions..."
                  className="w-full text-xs font-medium border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113] resize-none"
                />
              </FormField>

              <div className="text-[11px] text-[#777D77] font-medium space-y-1">
                <strong className="text-[#101113]">Review SLA:</strong> Payments submitted via manual bank transfer are reconciled by finance during Pakistani business hours (1–3 hours). The plan will be marked <em>Pending</em> immediately.
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t-2 border-[#DCDDDA]">
                <button
                  type="button"
                  onClick={() => setShowSubmitProofModal(false)}
                  className="btn-secondary text-xs px-4 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProof}
                  className="btn-lime text-xs px-5 py-2.5"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-5 border-2 border-[#101113] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <div>
                <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">Change Subscription Plan</h3>
                <p className="text-xs text-[#777D77] font-medium">Pick a plan matching your agency's client load and lead velocity.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUpgradeModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F3F4F2] flex items-center justify-center text-[#101113] font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {PLANS.map((plan) => {
                const isCurrent = subscription?.planId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl p-6 border-2 flex flex-col justify-between space-y-4 ${
                      isCurrent
                        ? "border-[#101113] bg-[#B7FF3C]"
                        : "border-[#101113] bg-white"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-[#101113]">{plan.name}</h4>
                        {isCurrent && (
                          <span className="badge-dark text-[10px]">
                            Current Plan
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-black text-[#101113]">
                        PKR {plan.pricePKR.toLocaleString()}
                        <span className="text-xs font-bold text-[#777D77]"> / mo</span>
                      </div>
                      <p className="text-xs text-[#777D77] leading-snug font-medium">{plan.tagline}</p>

                      <ul className="space-y-2 pt-2 text-xs text-[#101113] font-medium">
                        {plan.features.slice(0, 5).map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#101113] shrink-0 font-black" />
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
                      className={`w-full py-2.5 px-4 text-xs font-black rounded-xl border-2 border-[#101113] transition-colors ${
                        isCurrent
                          ? "bg-white/50 text-[#101113] cursor-not-allowed opacity-60"
                          : "btn-primary"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border-2 border-[#101113] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <h3 className="text-sm font-black text-[#101113] flex items-center gap-2 uppercase tracking-wider">
                <Receipt className="w-4 h-4 text-[#101113]" />
                Subscription Payment Receipt
              </h3>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F3F4F2] flex items-center justify-center text-[#101113] font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#F3F4F2] p-5 rounded-2xl border-2 border-[#101113] space-y-2.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#777D77] font-medium">Receipt Ref:</span>
                  <span className="font-bold text-[#101113]">{selectedReceipt.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777D77] font-medium">Plan Tier:</span>
                  <span className="font-bold text-[#101113]">{selectedReceipt.planName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777D77] font-medium">Amount Paid:</span>
                  <span className="font-black text-[#101113]">
                    PKR {selectedReceipt.amountPKR.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777D77] font-medium">Bank / Channel:</span>
                  <span className="text-[#101113] font-bold">{selectedReceipt.bankName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777D77] font-medium">Transaction ID:</span>
                  <span className="text-[#101113] font-bold">{selectedReceipt.transactionRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777D77] font-medium">Audit Status:</span>
                  <span className="uppercase font-black text-[#101113]">{selectedReceipt.status}</span>
                </div>
                {selectedReceipt.reviewerName && (
                  <div className="flex justify-between text-[11px] text-[#777D77] pt-2 border-t-2 border-[#DCDDDA]">
                    <span>Approved By:</span>
                    <span className="font-bold text-[#101113]">{selectedReceipt.reviewerName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#DCDDDA]">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="btn-primary text-xs px-5 py-2.5"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
