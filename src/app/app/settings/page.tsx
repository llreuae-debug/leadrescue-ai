"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Settings,
  Building,
  Globe,
  Bell,
  Shield,
  Key,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  RefreshCw,
  Save,
  Clock,
  MessageSquare,
  FileDown,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "regional" | "notifications" | "security">("profile");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Agency profile state
  const [agencyName, setAgencyName] = useState("Alpha Peak Growth");
  const [agencyEmail, setAgencyEmail] = useState("contact@alphapeak.pk");
  const [agencyPhone, setAgencyPhone] = useState("+92 300 1234567");
  const [agencyCity, setAgencyCity] = useState("Lahore");

  // Regional settings state
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [currency, setCurrency] = useState("PKR");
  const [defaultLanguage, setDefaultLanguage] = useState("en");

  // Notification state
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [slaWindowHours, setSlaWindowHours] = useState("2");

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Agency Settings"
        description="Configure agency workspace branding, regional timezones, SLA notification thresholds, and security credentials."
        badge={<span className="badge-lime text-[11px] font-bold">Workspace Config</span>}
      />

      {savedSuccess && (
        <div className="card-white p-4 border-2 border-emerald-500 bg-emerald-50 text-emerald-900 rounded-2xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">Settings saved successfully.</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#F3F4F2] rounded-2xl border-2 border-[#101113] text-xs font-bold w-fit">
        {[
          { id: "profile", label: "Agency Profile", icon: Building },
          { id: "regional", label: "Regional & Currency", icon: Globe },
          { id: "notifications", label: "SLA & Notifications", icon: Bell },
          { id: "security", label: "API & Security", icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isActive
                  ? "bg-[#17191C] text-[#B7FF3C] border-2 border-[#101113] shadow-xs"
                  : "text-[#777D77] hover:text-[#101113] border-2 border-transparent"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSave} className="card-white p-6 sm:p-8 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
            <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
              Agency Workspace Identity
            </h3>
            <span className="badge-dark text-[10px]">Owner Controlled</span>
          </div>

          <div className="space-y-4">
            <FormField label="Agency Business Name" required>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Official Contact Email" required>
                <input
                  type="email"
                  value={agencyEmail}
                  onChange={(e) => setAgencyEmail(e.target.value)}
                  className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
                />
              </FormField>

              <FormField label="Primary Business Phone" required>
                <input
                  type="tel"
                  value={agencyPhone}
                  onChange={(e) => setAgencyPhone(e.target.value)}
                  className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
                />
              </FormField>
            </div>

            <FormField label="City / Operational Base" required>
              <input
                type="text"
                value={agencyCity}
                onChange={(e) => setAgencyCity(e.target.value)}
                placeholder="e.g. Lahore, Karachi, Islamabad"
                className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
              />
            </FormField>
          </div>

          <div className="pt-2 border-t-2 border-[#DCDDDA]">
            <button type="submit" className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2">
              <Save className="w-3.5 h-3.5 text-[#B7FF3C]" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Regional */}
      {activeTab === "regional" && (
        <form onSubmit={handleSave} className="card-white p-6 sm:p-8 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
            <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
              Regional, Timezone & Currency
            </h3>
            <span className="badge-lime text-[10px]">PKR Standard</span>
          </div>

          <div className="space-y-4">
            <FormField label="Default Currency" required>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
              >
                <option value="PKR">Pakistani Rupee (PKR - Rs.)</option>
                <option value="USD">United States Dollar (USD - $)</option>
                <option value="AED">UAE Dirham (AED - د.إ)</option>
              </select>
            </FormField>

            <FormField label="Operating Timezone" required>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
              >
                <option value="Asia/Karachi">Asia/Karachi (PKT - UTC+05:00)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST - UTC+04:00)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
              </select>
            </FormField>

            <FormField label="Default Language & Interface Direction" required>
              <select
                value={defaultLanguage}
                onChange={(e) => setDefaultLanguage(e.target.value)}
                className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
              >
                <option value="en">English (LTR) — Default</option>
                <option value="ur">اردو (Urdu RTL) — مکمل اردو انٹرفیس</option>
              </select>
            </FormField>
          </div>

          <div className="pt-2 border-t-2 border-[#DCDDDA]">
            <button type="submit" className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2">
              <Save className="w-3.5 h-3.5 text-[#B7FF3C]" />
              <span>Update Regional Preferences</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: Notifications & SLA */}
      {activeTab === "notifications" && (
        <form onSubmit={handleSave} className="card-white p-6 sm:p-8 space-y-6 max-w-2xl">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
            <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
              SLA Rules & Notification Thresholds
            </h3>
            <span className="badge-dark text-[10px]">Lead Protection</span>
          </div>

          <div className="space-y-4">
            <FormField label="Lead Overdue Threshold (Hours)" required>
              <select
                value={slaWindowHours}
                onChange={(e) => setSlaWindowHours(e.target.value)}
                className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] focus:bg-white focus:outline-none text-[#101113]"
              >
                <option value="1">1 Hour — Urgent Inbound Outreach</option>
                <option value="2">2 Hours — Standard Agency SLA</option>
                <option value="4">4 Hours — Extended Working Window</option>
                <option value="24">24 Hours — Next Business Day</option>
              </select>
            </FormField>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F3F4F2] border-2 border-[#101113] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyWhatsApp}
                  onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-[#101113] text-[#101113]"
                />
                <div className="text-xs">
                  <span className="font-black text-[#101113] block">WhatsApp Escalation Alerts</span>
                  <span className="text-[#777D77] font-medium">Send real-time alerts to assigned rep when a high-priority lead is overdue.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F3F4F2] border-2 border-[#101113] cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="w-4 h-4 rounded border-2 border-[#101113] text-[#101113]"
                />
                <div className="text-xs">
                  <span className="font-black text-[#101113] block">Daily Morning Digest Email</span>
                  <span className="text-[#777D77] font-medium">Receive 9:00 AM PKT digest of pending follow-ups and unassigned enquiries.</span>
                </div>
              </label>
            </div>
          </div>

          <div className="pt-2 border-t-2 border-[#DCDDDA]">
            <button type="submit" className="btn-primary text-xs px-6 py-2.5 inline-flex items-center gap-2">
              <Save className="w-3.5 h-3.5 text-[#B7FF3C]" />
              <span>Save Notification Rules</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 4: API & Security */}
      {activeTab === "security" && (
        <div className="space-y-6 max-w-2xl">
          <div className="card-white p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
                API Tokens & Webhook Keys
              </h3>
              <span className="badge-lime text-[10px]">HMAC Active</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#101113] mb-1.5">
                  Agency Public API Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="lr_live_99f2b801a238477cb81e9d0234ac"
                    className="w-full text-xs font-mono font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] text-[#101113] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard("apiKey", "lr_live_99f2b801a238477cb81e9d0234ac")}
                    className="btn-secondary text-xs px-4 py-3 shrink-0 flex items-center gap-1.5"
                  >
                    {copiedKey === "apiKey" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "apiKey" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#101113] mb-1.5">
                  Webhook Signature Verification Secret
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value="whsec_884920491823758129038471"
                    className="w-full text-xs font-mono font-bold border-2 border-[#101113] rounded-xl p-3 bg-[#F3F4F2] text-[#101113] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard("whsec", "whsec_884920491823758129038471")}
                    className="btn-secondary text-xs px-4 py-3 shrink-0 flex items-center gap-1.5"
                  >
                    {copiedKey === "whsec" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "whsec" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card-white p-6 sm:p-8 space-y-4 border-2 border-red-500 bg-red-50/30">
            <div className="flex items-center gap-2 pb-2 border-b border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-black text-red-950 uppercase tracking-wider">
                Tenant Data & Governance
              </h3>
            </div>

            <p className="text-xs text-[#777D77] font-medium leading-relaxed">
              Export all lead data, client portfolios, and audit logs as a GDPR / enterprise compliant JSON archive.
            </p>

            <button
              type="button"
              onClick={() => alert("Tenant data archive download initiated.")}
              className="btn-secondary text-xs px-4 py-2.5 inline-flex items-center gap-2"
            >
              <FileDown className="w-3.5 h-3.5 text-[#101113]" />
              <span>Export All Agency Data (JSON)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
