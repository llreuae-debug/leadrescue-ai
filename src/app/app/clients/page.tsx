"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getClientsAction, createClientAction, ClientWithMetrics } from "@/app/actions/clients";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchInput } from "@/components/ui/SearchInput";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import { FormField } from "@/components/ui/FormField";
import {
  Building2,
  Plus,
  Users,
  Briefcase,
  ChevronRight,
  TrendingUp,
  X,
  ShieldCheck,
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  // Add Client Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientIndustry, setNewClientIndustry] = useState("E-commerce & Fashion");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const loadClients = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getClientsAction();
      if (res.success) {
        setClients(res.data);
        setIsDemo(!!res.isDemo);
      } else {
        setError(res.error || "Failed to load clients");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load client workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;

    setCreating(true);
    setCreateError(null);

    const res = await createClientAction({
      name: newClientName,
      industry: newClientIndustry,
      status: "active",
    });

    if (res.success) {
      setModalOpen(false);
      setNewClientName("");
      loadClients();
    } else {
      setCreateError(res.error || "Failed to create client workspace");
    }
    setCreating(false);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Workspaces"
        description="Organise client accounts, manage assigned representatives, and isolate lead pipelines per brand."
        badge={
          isDemo ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Demo Workspace Mode
            </span>
          ) : (
            <StatusBadge label={`${clients.length} Active Workspaces`} variant="success" />
          )
        }
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs h-9 px-4"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span>Add Client Workspace</span>
        </button>
      </PageHeader>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search client by brand or industry..."
          wrapperClassName="sm:w-80"
        />
        <div className="text-xs text-slate-500">
          Showing <strong className="text-slate-900 font-semibold">{filteredClients.length}</strong> of {clients.length} clients
        </div>
      </div>

      {/* Client List */}
      {loading ? (
        <LoadingState type="skeleton" rows={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={loadClients} />
      ) : filteredClients.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No client workspaces found"
          description={
            search
              ? "No clients matching your search criteria."
              : "Get started by creating your agency's first client workspace."
          }
          action={{
            label: "Create Client Workspace",
            onClick: () => setModalOpen(true),
            icon: Plus,
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <Link
              key={client.id}
              href={`/app/clients/${client.id}`}
              className="linear-card p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-[11px] text-slate-500">{client.industry}</p>
                    </div>
                  </div>
                  <StatusBadge
                    label={client.status === "active" ? "Active" : "Archived"}
                    variant={client.status === "active" ? "success" : "neutral"}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-5 py-3 border-y border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Total</span>
                    <p className="text-base font-bold text-slate-900 tabular-nums">
                      {client.totalLeads}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Active</span>
                    <p className="text-base font-bold text-blue-600 tabular-nums">
                      {client.activeLeads}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Won</span>
                    <p className="text-base font-bold text-emerald-600 tabular-nums">
                      {client.wonOpportunities}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="truncate">
                  Manager: <strong className="text-slate-700 font-medium">{client.account_manager?.full_name || "Unassigned"}</strong>
                </span>
                <span className="text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  <span>Open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
          <div className="w-full max-w-md linear-card p-6 bg-white shadow-xl space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Add Client Workspace</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs font-medium">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateClient} className="space-y-4">
              <FormField label="Client Brand Name" required>
                <input
                  type="text"
                  required
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Apex Retailers"
                  className="input-base w-full"
                  disabled={creating}
                />
              </FormField>

              <FormField label="Industry / Vertical" required>
                <select
                  value={newClientIndustry}
                  onChange={(e) => setNewClientIndustry(e.target.value)}
                  className="input-base w-full"
                  disabled={creating}
                >
                  <option value="E-commerce & Fashion">E-commerce & Fashion</option>
                  <option value="Real Estate & Property">Real Estate & Property</option>
                  <option value="Logistics & Fleet">Logistics & Fleet</option>
                  <option value="Healthcare & Clinics">Healthcare & Clinics</option>
                  <option value="Software & B2B SaaS">Software & B2B SaaS</option>
                  <option value="Education & Visa Services">Education & Visa Services</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All leads, custom pipeline stages, and follow-up SLAs will be strictly isolated to this client workspace.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={creating}
                  className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 shadow-xs"
                >
                  {creating ? "Creating..." : "Create Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
