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
        <h1 className="text-2xl font-bold text-white tracking-tight">Plan Tiers &amp; Quota Limits</h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure authoritative platform subscription parameters, PKR pricing, and server-enforced resource limits.
        </p>
      </div>

      {/* Plans Grid */}
      {loading ? (
        <div className="py-20 text-center text-slate-400 text-xs">Loading plans...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-lg text-white capitalize">{p.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                    {p.id}
                  </span>
                </div>

                <div className="mt-4">
                  <span className="text-3xl font-extrabold text-emerald-400">{formatPKR(p.pricePKR)}</span>
                  <span className="text-xs text-slate-400"> / month</span>
                </div>

                <div className="mt-6 space-y-3 text-xs text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      Client Workspaces
                    </span>
                    <span className="font-bold text-white">{p.maxClients === 999 ? "Unlimited" : p.maxClients}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Coins className="w-4 h-4 text-slate-500" />
                      Monthly Inbound Leads
                    </span>
                    <span className="font-bold text-white">{p.maxLeadsPerMonth.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Users className="w-4 h-4 text-slate-500" />
                      Team Seats
                    </span>
                    <span className="font-bold text-white">{p.maxTeamSeats}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-slate-400">
                      <Sparkles className="w-4 h-4 text-slate-500" />
                      AI Sales Drafts
                    </span>
                    <span className="font-bold text-white">{p.maxAiDraftsPerMonth.toLocaleString()} / mo</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(p)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors border border-slate-700"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Configure Limits &amp; Price</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-red-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Edit Plan: {selectedPlan.name}</h3>
                <p className="text-xs text-slate-400">ID: {selectedPlan.id}</p>
              </div>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Price in PKR (monthly)</label>
                  <input
                    type="number"
                    value={priceInput}
                    onChange={(e) => setPriceInput(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Max Client Workspaces</label>
                  <input
                    type="number"
                    value={clientsInput}
                    onChange={(e) => setClientsInput(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Max Leads / Month</label>
                  <input
                    type="number"
                    value={leadsInput}
                    onChange={(e) => setLeadsInput(Number(e.target.value))}
                    min={10}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-medium mb-1">Max Team Seats</label>
                  <input
                    type="number"
                    value={seatsInput}
                    onChange={(e) => setSeatsInput(Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Max AI Drafts / Month</label>
                <input
                  type="number"
                  value={aiDraftsInput}
                  onChange={(e) => setAiDraftsInput(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Change Justification / Reason <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder="Document reason for audit logging (e.g. Promotional pilot expansion, inflation index)..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-white placeholder:text-slate-500"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 bg-red-950/60 p-2 rounded-lg border border-red-800">
                  {errorMsg}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  disabled={saving}
                  className="px-3.5 py-2 rounded-lg border border-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xs"
                >
                  {saving ? "Saving..." : "Update Plan & Sign Audit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
