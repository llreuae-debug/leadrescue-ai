"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboardingAction, OnboardingState } from "@/app/actions/onboarding";
import { FormField } from "@/components/ui/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Building2,
  User,
  Globe2,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Upload,
} from "lucide-react";

const STEPS = [
  { id: 1, title: "Agency Identity", description: "Profile & agency name" },
  { id: 2, title: "Regional Settings", description: "Timezone & language" },
  { id: 3, title: "First Client", description: "Client workspace setup" },
  { id: 4, title: "Lead Ingestion", description: "Optional CSV import" },
  { id: 5, title: "Ready", description: "Launch workspace" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<OnboardingState>({
    fullName: "Tariq Mahmood",
    phone: "+92 300 1234567",
    agencyName: "Prime Digital Agency",
    businessEmail: "admin@primedigital.pk",
    country: "Pakistan",
    city: "Lahore",
    timezone: "Asia/Karachi",
    preferredLanguage: "en",
    agencySize: "1-10 team members",
    businessType: "Performance Marketing & Meta Ads",
    firstClientName: "Horizon Retailers",
    firstClientIndustry: "E-commerce & Fashion",
  });

  const handleChange = (field: keyof OnboardingState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setErrorMessage(null);
    if (currentStep === 1) {
      if (!formData.fullName.trim() || !formData.agencyName.trim() || !formData.businessEmail.trim()) {
        setErrorMessage("Please complete all required agency identity fields.");
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setErrorMessage(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await completeOnboardingAction(formData);
      if (result.success) {
        router.push("/app/dashboard");
      } else {
        setErrorMessage(result.error || "Failed to complete onboarding.");
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
              LR
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-tight">LeadRescue AI</p>
              <p className="text-[10px] text-slate-500 font-medium">Agency Onboarding Wizard</p>
            </div>
          </div>
          <StatusBadge label={`Step ${currentStep} of 5`} variant="default" dot={false} />
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {STEPS.map((s) => (
            <div key={s.id} className="space-y-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  currentStep >= s.id ? "bg-blue-600" : "bg-slate-200"
                }`}
              />
              <p className="text-[10px] font-semibold text-slate-500 truncate hidden sm:block">
                {s.title}
              </p>
            </div>
          ))}
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold">Action Required</p>
              <p className="text-[11px] leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* STEP 1: AGENCY IDENTITY */}
        {currentStep === 1 && (
          <div className="linear-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Your Profile & Agency Workspace</h2>
              <p className="text-xs text-slate-500">
                Set up your administrative identity and the primary name of your agency.
              </p>
            </div>

            <div className="space-y-4">
              <FormField label="Your Full Name" required>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="input-base w-full"
                  placeholder="e.g. Tariq Mahmood"
                />
              </FormField>

              <FormField label="Direct Phone / WhatsApp" hint="Used for agency admin notifications">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="input-base w-full"
                  placeholder="+92 300 1234567"
                />
              </FormField>

              <FormField label="Agency Workspace Name" required>
                <input
                  type="text"
                  value={formData.agencyName}
                  onChange={(e) => handleChange("agencyName", e.target.value)}
                  className="input-base w-full"
                  placeholder="e.g. Prime Digital Agency"
                />
              </FormField>

              <FormField label="Agency Business Email" required>
                <input
                  type="email"
                  value={formData.businessEmail}
                  onChange={(e) => handleChange("businessEmail", e.target.value)}
                  className="input-base w-full"
                  placeholder="admin@primedigital.pk"
                />
              </FormField>
            </div>
          </div>
        )}

        {/* STEP 2: REGIONAL & BUSINESS SETTINGS */}
        {currentStep === 2 && (
          <div className="linear-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Regional & Operating Settings</h2>
              <p className="text-xs text-slate-500">
                Configure your timezone for accurate follow-up due dates and SLA tracking.
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Country" required>
                  <select
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="input-base w-full"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </FormField>

                <FormField label="City">
                  <input
                    type="text"
                    value={formData.city || ""}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="input-base w-full"
                    placeholder="e.g. Lahore, Karachi, Islamabad"
                  />
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Agency Timezone" hint="Critical for follow-up reminders" required>
                  <select
                    value={formData.timezone}
                    onChange={(e) => handleChange("timezone", e.target.value)}
                    className="input-base w-full"
                  >
                    <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4)</option>
                    <option value="Asia/Riyadh">Asia/Riyadh (AST, UTC+3)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="UTC">UTC (Universal Time)</option>
                  </select>
                </FormField>

                <FormField label="Preferred Language" required>
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => handleChange("preferredLanguage", e.target.value as "en" | "ur")}
                    className="input-base w-full"
                  >
                    <option value="en">English (LTR)</option>
                    <option value="ur">اردو — Urdu (RTL)</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Agency Size">
                  <select
                    value={formData.agencySize}
                    onChange={(e) => handleChange("agencySize", e.target.value)}
                    className="input-base w-full"
                  >
                    <option value="1-5 team members">1–5 team members</option>
                    <option value="6-15 team members">6–15 team members</option>
                    <option value="16-50 team members">16–50 team members</option>
                    <option value="50+ team members">50+ team members</option>
                  </select>
                </FormField>

                <FormField label="Primary Specialisation">
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleChange("businessType", e.target.value)}
                    className="input-base w-full"
                  >
                    <option value="Performance Marketing & Meta Ads">Performance Marketing & Meta Ads</option>
                    <option value="B2B Lead Generation">B2B Lead Generation</option>
                    <option value="E-commerce Scaling">E-commerce Scaling</option>
                    <option value="Full-Service Creative Agency">Full-Service Creative Agency</option>
                  </select>
                </FormField>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: FIRST CLIENT WORKSPACE */}
        {currentStep === 3 && (
          <div className="linear-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Create Your First Client Workspace</h2>
              <p className="text-xs text-slate-500">
                LeadRescue AI isolates leads by client brand so campaigns and enquiries never mix.
              </p>
            </div>

            <div className="space-y-4">
              <FormField label="Client Brand Name" hint="You can add more clients anytime" required>
                <input
                  type="text"
                  value={formData.firstClientName || ""}
                  onChange={(e) => handleChange("firstClientName", e.target.value)}
                  className="input-base w-full"
                  placeholder="e.g. Horizon Retailers"
                />
              </FormField>

              <FormField label="Client Industry">
                <select
                  value={formData.firstClientIndustry || "E-commerce & Fashion"}
                  onChange={(e) => handleChange("firstClientIndustry", e.target.value)}
                  className="input-base w-full"
                >
                  <option value="E-commerce & Fashion">E-commerce & Fashion</option>
                  <option value="Real Estate & Property">Real Estate & Property</option>
                  <option value="Healthcare & Wellness">Healthcare & Wellness</option>
                  <option value="Software & B2B SaaS">Software & B2B SaaS</option>
                  <option value="Education & Visa Consultancy">Education & Visa Consultancy</option>
                  <option value="Automotive & Logistics">Automotive & Logistics</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-blue-900">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Multi-Tenant Isolation Guaranteed</p>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    This client will receive its own isolated lead repository, pipeline stages, and follow-up timeline protected by database Row-Level Security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: OPTIONAL CSV LEAD IMPORT */}
        {currentStep === 4 && (
          <div className="linear-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Import Existing Enquiries (Optional)</h2>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100">
                  Optional
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Bring existing spreadsheet leads into {formData.firstClientName || "your client workspace"} to test follow-up scheduling.
              </p>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center space-y-3 hover:border-slate-300 transition-colors bg-white">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
                <Upload className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Drag and drop your lead spreadsheet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports CSV, XLSX up to 10MB</p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => alert("CSV file mapping will be configured in Stage 5. You can safely proceed!")}
                  className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-8 px-3"
                >
                  Browse File
                </button>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Don&apos;t have leads ready right now?</span>
              <button
                type="button"
                onClick={handleNext}
                className="font-bold text-blue-600 hover:underline"
              >
                Skip this step →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: READY & DASHBOARD INTRO */}
        {currentStep === 5 && (
          <div className="linear-card p-6 sm:p-8 space-y-6">
            <div className="space-y-1 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-xs mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your Agency Workspace is Ready!</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Here is a summary of the configuration for {formData.agencyName}:
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Agency Workspace</span>
                <span className="font-semibold text-slate-900">{formData.agencyName}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">First Client</span>
                <span className="font-semibold text-slate-900">{formData.firstClientName} ({formData.firstClientIndustry})</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Timezone</span>
                <span className="font-semibold text-slate-900">{formData.timezone}</span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Default Language</span>
                <span className="font-semibold text-slate-900">
                  {formData.preferredLanguage === "ur" ? "اردو (Urdu RTL)" : "English (LTR)"}
                </span>
              </div>
              <div className="p-3 flex justify-between">
                <span className="text-slate-500">Assigned Role</span>
                <span className="font-semibold text-blue-600">Agency Owner</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>What happens next?</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                You will enter your Agency Overview. From there, you can explore the pipeline, schedule follow-ups, and review grounded AI drafts for client leads.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between pt-2">
          {currentStep > 1 && currentStep < 5 ? (
            <button
              type="button"
              onClick={handleBack}
              disabled={isSubmitting}
              className="btn-base bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-4 h-10"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 h-10 shadow-xs"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={isSubmitting}
              className="btn-base bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-6 h-11 shadow-md shadow-blue-600/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Configuring your agency...</span>
              ) : (
                <>
                  <span>Launch Agency Workspace</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
