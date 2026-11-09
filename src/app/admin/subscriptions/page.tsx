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
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Manual Bank Transfer Submissions
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Verify and reconcile Pakistani IBFT bank deposits (Meezan Bank &amp; HBL) before activating paid subscription tiers.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              statusFilter === tab.key
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xs">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs">Loading payment submissions...</div>
        ) : payments.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-xs">
            No payments match your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Agency</th>
                  <th className="py-3 px-4">Plan &amp; Amount</th>
                  <th className="py-3 px-4">Bank &amp; Reference (UTR)</th>
                  <th className="py-3 px-4">Submitted Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {payments.map((p) => {
                  const isPending = p.status === "pending";
                  return (
                    <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {p.agencyName}
                        <p className="text-[11px] font-mono text-slate-500">{p.agencyId}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-white text-xs">{formatPKR(p.amountPKR)}</p>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          {p.planId}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-xs">
                        <p className="text-slate-300 font-medium">{p.bankName}</p>
                        <code className="text-amber-300 font-mono text-[11px] bg-slate-900 px-1.5 py-0.5 rounded mt-0.5 inline-block border border-slate-800">
                          {p.transactionReference}
                        </code>
                      </td>

                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {new Date(p.submittedAt).toLocaleDateString([], {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {p.status === "approved" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approved</span>
                          </span>
                        )}
                        {p.status === "rejected" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-950 text-red-400 border border-red-800">
                            <XCircle className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                        {p.status === "pending" && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-400 border border-amber-800">
                            <Clock className="w-3 h-3" />
                            <span>Pending Review</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenReview(p, "approved")}
                              className="px-2.5 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-2xs"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenReview(p, "rejected")}
                              className="px-2.5 py-1 rounded-md bg-red-950 hover:bg-red-900 text-red-400 text-xs font-semibold transition-colors border border-red-800"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">
                            By {p.reviewedBy?.split("@")[0] || "Admin"}
                          </span>
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

      {/* Confirmation Modal */}
      {activePayment && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  reviewDecision === "approved"
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-red-950 text-red-400 border border-red-800"
                }`}
              >
                {reviewDecision === "approved" ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <XCircle className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {reviewDecision === "approved" ? "Approve Bank Transfer" : "Reject Bank Transfer"}
                </h3>
                <p className="text-xs text-slate-400">{activePayment.agencyName}</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Plan:</span>
                <span className="text-white font-bold uppercase">{activePayment.planId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">PKR Amount:</span>
                <span className="text-emerald-400 font-bold">{formatPKR(activePayment.amountPKR)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transaction Reference:</span>
                <span className="text-amber-300 font-mono">{activePayment.transactionReference}</span>
              </div>
            </div>

            {reviewDecision === "approved" ? (
              <p className="text-xs text-slate-300 leading-relaxed">
                Confirming approval will immediately elevate {activePayment.agencyName} to active paid entitlements.
              </p>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Rejection Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="State reason (e.g. Deposit not received on statement, incorrect UTR number, partial amount)..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-red-600"
                />
              </div>
            )}

            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-950/60 p-2 rounded-lg border border-red-800">
                {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActivePayment(null)}
                disabled={submitting}
                className="px-3.5 py-2 rounded-lg border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                disabled={submitting}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors ${
                  reviewDecision === "approved"
                    ? "bg-emerald-600 hover:bg-emerald-500"
                    : "bg-red-600 hover:bg-red-500"
                }`}
              >
                {submitting ? "Processing..." : reviewDecision === "approved" ? "Confirm & Activate" : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
