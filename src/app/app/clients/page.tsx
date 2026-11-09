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
  ChevronRight,
  X,
  ShieldCheck,
  ArrowRight,
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
    <div className="space-y-8">
      <PageHeader
        title="Client Workspaces"
        description="Organise client brands, manage assigned representatives, and isolate lead pipelines per client."
        badge={
          isDemo ? (
            <span className="badge-dark text-xs uppercase tracking-wider">
              Demo Workspace Mode
            </span>
          ) : (
            <span className="badge-lime text-xs uppercase tracking-wider">
              {clients.length} Active Workspaces
            </span>
          )
        }
      >
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-base btn-primary text-xs font-black shadow-[0_3px_0_0_#101113]"
        >
          <Plus className="w-4 h-4 text-[#B7FF3C]" />
          <span>Add Client Workspace</span>
        </button>
      </PageHeader>

      {/* Search and Filters Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white border-2 border-[#DCDDDA] shadow-[0_2px_0_0_#DCDDDA]">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onClear={() => setSearch("")}
          placeholder="Search client by brand or industry..."
          wrapperClassName="w-full sm:w-80"
        />
        <div className="text-xs text-[#777D77] font-semibold">
          Showing <strong className="text-[#101113] font-bold">{filteredClients.length}</strong> of {clients.length} client accounts
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Link
              key={client.id}
              href={`/app/clients/${client.id}`}
              className="p-6 rounded-3xl border-2 border-[#101113] bg-white flex flex-col justify-between hover:bg-[#F3FDE1] shadow-[0_4px_0_0_#101113] hover:shadow-[0_6px_0_0_#101113] transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#17191C] text-[#B7FF3C] font-black flex items-center justify-center text-sm border-1.5 border-[#101113] shadow-[0_2px_0_0_#101113] group-hover:scale-105 transition-transform">
                      {client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-[#101113] text-base group-hover:underline decoration-[#B7FF3C] decoration-2">
                        {client.name}
                      </h3>
                      <p className="text-xs text-[#777D77] font-semibold">{client.industry}</p>
                    </div>
                  </div>
                  <StatusBadge
                    label={client.status === "active" ? "Active" : "Archived"}
                    variant={client.status === "active" ? "success" : "neutral"}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-6 py-4 border-y-2 border-[#DCDDDA] text-center bg-[#F3F4F2] rounded-2xl">
                  <div>
                    <span className="text-[10px] text-[#777D77] uppercase font-black">Total</span>
                    <p className="text-lg font-black text-[#101113] tabular-nums mt-0.5">
                      {client.totalLeads}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777D77] uppercase font-black">Active</span>
                    <p className="text-lg font-black text-[#101113] tabular-nums mt-0.5">
                      {client.activeLeads}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#777D77] uppercase font-black">Won</span>
                    <p className="text-lg font-black text-emerald-700 tabular-nums mt-0.5">
                      {client.wonOpportunities}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-2 flex items-center justify-between text-xs text-[#777D77]">
                <span className="truncate font-semibold">
                  Manager: <strong className="text-[#101113] font-bold">{client.account_manager?.full_name || "Unassigned"}</strong>
                </span>
                <span className="text-[#101113] font-black group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Open Cockpit</span>
                  <ChevronRight className="w-4 h-4 text-[#101113]" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Add Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#101113]/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border-2 border-[#101113] p-7 bg-white shadow-[0_10px_0_0_#101113] space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#DCDDDA]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#B7FF3C] text-[#101113] border-1.5 border-[#101113] flex items-center justify-center font-black">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-black text-[#101113] text-base">Add Client Workspace</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl text-[#777D77] hover:text-[#101113] hover:bg-[#F3F4F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-bold">
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
                  className="input-base w-full font-bold"
                  disabled={creating}
                />
              </FormField>

              <FormField label="Industry / Vertical" required>
                <select
                  value={newClientIndustry}
                  onChange={(e) => setNewClientIndustry(e.target.value)}
                  className="input-base w-full font-bold"
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

              <div className="p-3.5 rounded-2xl bg-[#F3F4F2] border border-[#DCDDDA] text-xs text-[#202320] flex items-start gap-2.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All leads, custom pipeline stages, and follow-up SLAs will be strictly isolated to this client workspace.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#DCDDDA]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={creating}
                  className="btn-base btn-secondary text-xs font-bold px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn-base btn-primary text-xs font-black px-5 shadow-[0_3px_0_0_#101113]"
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
