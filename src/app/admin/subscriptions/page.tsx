"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  Clock,
  ShieldCheck,
  Search,
  X,
} from "lucide-react";
import { getAdminSubscriptionsAction, reviewAdminPaymentAction } from "@/app/actions/admin";
import { AdminPaymentReviewItem } from "@/types/admin";

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<AdminPaymentReviewItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // Review modal
  const [activePayment, setActivePayment] = useState<AdminPaymentReviewItem | null>(null);
  const [reviewDecision, setReviewDecision] = useState<"approved" | "rejected">("approved");
  const [reasonInput, setReasonInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPayments = async () => {
    setLoading(true);
    const res = await getAdminSubscriptionsAction({ status: statusFilter });
    if (res.success) {
      setPayments(res.payments);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, [statusFilter]);

  const handleOpenReview = (item: AdminPaymentReviewItem, decision: "approved" | "rejected") => {
    setActivePayment(item);
    setReviewDecision(decision);
    setReasonInput("");
    setErrorMsg(null);
  };

  const handleConfirmReview = async () => {
    if (!activePayment) return;
    if (reviewDecision === "rejected" && (!reasonInput || reasonInput.trim().length < 5)) {
      setErrorMsg("Please provide a rejection justification (minimum 5 characters).");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await reviewAdminPaymentAction(
        activePayment.id,
        reviewDecision,
        reasonInput || undefined
      );
      if (res.success) {
        setActivePayment(null);
        await loadPayments();
      } else {
        setErrorMsg(res.error || "Review submission failed.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatPKR = (amount: number) => `PKR ${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="badge-lime text-[10px]">IBFT Verification</span>
          <span className="badge-dark text-[10px]">Financial Compliance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Manual Bank Transfer Submissions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Verify and reconcile Pakistani IBFT bank deposits (Meezan Bank &amp; HBL) before activating paid subscription tiers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[#282B30] pb-3 overflow-x-auto">
        {[
          { key: "all", label: "All Payments" },
          { key: "pending", label: "Pending Verification" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ].map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === tab.key
                ? "bg-[#17191C] text-[#B7FF3C] border-2 border-[#3A3F47] shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Payments Review Table */}
      <div className="bg-[#17191C] rounded-3xl border-2 border-[#282B30] overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-2 border-[#B7FF3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400 font-bold">Querying payment ledger...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 font-medium">
            No bank transfers found matching current filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-[#282B30] text-slate-400 uppercase tracking-wider font-black text-[11px] bg-[#101113]">
                  <th className="py-3 px-5">Agency</th>
                  <th className="py-3 px-4">Plan Tier</th>
                  <th className="py-3 px-4">Bank &amp; Channel</th>
                  <th className="py-3 px-4">Transaction Reference</th>
                  <th className="py-3 px-4 text-right">Amount (PKR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282B30]">
                {payments.map((item) => (
                  <tr key={item.id} className="hover:bg-[#101113]/50 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-white text-sm">
                      {item.agencyName}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-[#B7FF3C] uppercase text-[11px]">
                      {item.planId}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {item.bankName}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      {item.transactionReference}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-[#B7FF3C]">
                      {formatPKR(item.amountPKR)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wide border ${
                          item.status === "approved"
                            ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                            : item.status === "pending"
                            ? "bg-amber-950 text-amber-400 border-amber-800"
                            : "bg-red-950 text-red-400 border-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {item.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenReview(item, "approved")}
                            className="btn-lime text-xs py-1.5 px-3 inline-flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenReview(item, "rejected")}
                            className="px-3 py-1.5 rounded-xl border border-red-800 bg-red-950/40 text-red-400 hover:bg-red-900/60 text-xs font-bold transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">
                          Reviewed by {item.reviewedBy || "System"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {activePayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#17191C] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border-2 border-[#282B30] text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#282B30]">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#B7FF3C]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  {reviewDecision === "approved" ? "Approve Manual Deposit" : "Reject Manual Deposit"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePayment(null)}
                className="w-8 h-8 rounded-full hover:bg-[#101113] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[#101113] border border-[#282B30] space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Agency:</span>
                  <span className="font-bold text-white">{activePayment.agencyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Plan Tier:</span>
                  <span className="font-bold text-[#B7FF3C] uppercase">{activePayment.planId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Amount:</span>
                  <span className="font-black text-[#B7FF3C]">{formatPKR(activePayment.amountPKR)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Bank &amp; Ref:</span>
                  <span className="text-white">{activePayment.bankName} &bull; {activePayment.transactionReference}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                  Review Justification / Audit Reason
                </label>
                <textarea
                  rows={3}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder={
                    reviewDecision === "approved"
                      ? "Optional: Note bank statement line match or transaction batch..."
                      : "Mandatory: Reason for rejection (e.g. invalid reference, insufficient amount, unverified slip)..."
                  }
                  className="w-full text-xs font-medium border-2 border-[#282B30] rounded-xl p-3 bg-[#101113] focus:outline-none focus:border-[#B7FF3C] text-white resize-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 font-bold bg-red-950/60 border border-red-800 p-3 rounded-xl">
                  {errorMsg}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-[#282B30]">
              <button
                type="button"
                onClick={() => setActivePayment(null)}
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#101113] rounded-xl border border-[#282B30]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirmReview}
                className={
                  reviewDecision === "approved"
                    ? "btn-lime text-xs px-5 py-2.5"
                    : "px-5 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl"
                }
              >
                {submitting ? "Signing Audit..." : reviewDecision === "approved" ? "Approve Deposit & Activate" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
