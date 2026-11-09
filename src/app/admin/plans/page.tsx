"use client";

import React, { useEffect, useState } from "react";
import {
  Sliders,
  CheckCircle2,
  Edit,
  ShieldCheck,
  Coins,
  Users,
  Building2,
  Sparkles,
  X,
} from "lucide-react";
import { getAdminPlansAction, updateAdminPlanAction } from "@/app/actions/admin";
import { AdminPlanDefinition } from "@/types/admin";

export default function AdminPlansPage() {
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<AdminPlanDefinition[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<AdminPlanDefinition | null>(null);

  // Edit form state
  const [priceInput, setPriceInput] = useState<number>(0);
  const [clientsInput, setClientsInput] = useState<number>(0);
  const [leadsInput, setLeadsInput] = useState<number>(0);
  const [seatsInput, setSeatsInput] = useState<number>(0);
  const [aiDraftsInput, setAiDraftsInput] = useState<number>(0);
  const [reasonInput, setReasonInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadPlans = async () => {
    setLoading(true);
    const res = await getAdminPlansAction();
    if (res.success) {
      setPlans(res.plans);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenEdit = (plan: AdminPlanDefinition) => {
    setSelectedPlan(plan);
    setPriceInput(plan.pricePKR);
    setClientsInput(plan.maxClients);
    setLeadsInput(plan.maxLeadsPerMonth);
    setSeatsInput(plan.maxTeamSeats);
    setAiDraftsInput(plan.maxAiDraftsPerMonth);
    setReasonInput("");
    setErrorMsg(null);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    if (!reasonInput || reasonInput.trim().length < 5) {
      setErrorMsg("Please provide an administrative reason (min 5 characters) for the audit trail.");
      return;
    }

    setSaving(true);
    setErrorMsg(null);
    try {
      const res = await updateAdminPlanAction(
        selectedPlan.id,
        {
          pricePKR: priceInput,
          maxClients: clientsInput,
          maxLeadsPerMonth: leadsInput,
          maxTeamSeats: seatsInput,
          maxAiDraftsPerMonth: aiDraftsInput,
        },
        reasonInput
      );

      if (res.success) {
        setSelectedPlan(null);
        await loadPlans();
      } else {
        setErrorMsg(res.error || "Failed to update plan definition.");
      }
    } finally {
      setSaving(false);
    }
  };

  const formatPKR = (amount: number) => `PKR ${amount.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="badge-lime text-[10px]">Authoritative Limits</span>
          <span className="badge-dark text-[10px]">Platform Quotas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Plan Tiers &amp; Quota Limits</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
          Configure authoritative platform subscription parameters, PKR pricing, and server-enforced resource limits.
        </p>
      </div>

      {/* Plan Cards Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-[#B7FF3C] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-400 font-bold">Loading tier definitions...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-[#17191C] rounded-3xl border-2 border-[#282B30] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#3A3F47] transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <span className="badge-lime text-[10px]">
                    PKR / Month
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-[#B7FF3C] tabular-nums font-mono">
                    {formatPKR(plan.pricePKR)}
                  </span>
                  <span className="text-xs text-slate-400 font-bold">/ mo</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  Authoritative tier entitlements enforced strictly across all tenant workspaces.
                </p>

                <div className="space-y-2.5 pt-3 border-t border-[#282B30] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Client Workspaces:</span>
                    <strong className="text-white font-mono font-bold">{plan.maxClients}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Monthly Lead Quota:</span>
                    <strong className="text-white font-mono font-bold">{plan.maxLeadsPerMonth}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">Team Member Seats:</span>
                    <strong className="text-white font-mono font-bold">{plan.maxTeamSeats}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-medium">AI Sales Generations:</span>
                    <strong className="text-[#B7FF3C] font-mono font-bold">{plan.maxAiDraftsPerMonth}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenEdit(plan)}
                className="w-full btn-lime text-xs py-2.5 px-4 flex items-center justify-center gap-2"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Modify Tier Quotas</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit Plan Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#17191C] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border-2 border-[#282B30] text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#282B30]">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#B7FF3C]" />
                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Modify {selectedPlan.name} Tier
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="w-8 h-8 rounded-full hover:bg-[#101113] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                  Monthly Subscription Fee (PKR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={priceInput}
                  onChange={(e) => setPriceInput(Number(e.target.value))}
                  className="w-full text-xs font-mono font-bold border-2 border-[#282B30] rounded-xl p-3 bg-[#101113] focus:outline-none focus:border-[#B7FF3C] text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                    Max Clients
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={clientsInput}
                    onChange={(e) => setClientsInput(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold border-2 border-[#282B30] rounded-xl p-3 bg-[#101113] focus:outline-none focus:border-[#B7FF3C] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                    Monthly Leads Limit
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={leadsInput}
                    onChange={(e) => setLeadsInput(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold border-2 border-[#282B30] rounded-xl p-3 bg-[#101113] focus:outline-none focus:border-[#B7FF3C] text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                    Max Team Seats
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={seatsInput}
                    onChange={(e) => setSeatsInput(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold border-2 border-[#282B30] rounded-xl p-3 bg-[#101113] focus:outline-none focus:border-[#B7FF3C] text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                    Max AI Drafts / Mo
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={aiDraftsInput}
                    onChange={(e) => setAiDraftsInput(Number(e.target.value))}
                    className="w-full text-xs font-mono font-bold border-2 border-[#282B30] rounded-xl p-3 bg-[#101113] focus:outline-none focus:border-[#B7FF3C] text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-white mb-1.5">
                  Administrative Reason (Audit Log Mandatory)
                </label>
                <textarea
                  rows={2}
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Justification for plan price or quota change..."
                  className="w-full text-xs font-medium border-2 border-[#282B30] rounded-xl p-3 bg-[#101113] focus:outline-none focus:border-[#B7FF3C] text-white resize-none"
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 font-bold bg-red-950/60 border border-red-800 p-3 rounded-xl">
                  {errorMsg}
                </p>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#282B30]">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white bg-[#101113] rounded-xl border border-[#282B30]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-lime text-xs px-5 py-2.5"
                >
                  {saving ? "Signing Changes..." : "Save Tier Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
