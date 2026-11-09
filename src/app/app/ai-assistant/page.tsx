"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  AssistantIntent,
  AssistantLanguage,
  AssistantQuota,
  AssistantResponse,
  AssistantTone,
  LeadContextSnapshot,
  ObjectionCategory,
} from "@/types/ai-assistant";
import {
  generateAiResponseAction,
  getAssistantLeadsAction,
  getAssistantQuotaAction,
  getLeadContextSnapshotAction,
} from "@/app/actions/ai-assistant";
import {
  Sparkles,
  Bot,
  User,
  Copy,
  Check,
  Send,
  MessageSquare,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  ExternalLink,
  Info,
  Clock,
  Building,
  Phone,
  DollarSign,
  AlertTriangle,
  FileText,
  RotateCcw,
  Zap,
} from "lucide-react";

export default function AiAssistantPage() {
  const [leads, setLeads] = useState<
    { id: string; name: string; clientName: string; status: string; priority: string; phone?: string | null }[]
  >([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>("");
  const [leadContext, setLeadContext] = useState<LeadContextSnapshot | null>(null);
  const [quota, setQuota] = useState<AssistantQuota | null>(null);
  const [language, setLanguage] = useState<AssistantLanguage>("en");
  const [tone, setTone] = useState<AssistantTone>("professional");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  const [selectedObjection, setSelectedObjection] = useState<ObjectionCategory>("price_too_high");
  const [showObjectionSelect, setShowObjectionSelect] = useState<boolean>(false);

  const [responses, setResponses] = useState<AssistantResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [editableDrafts, setEditableDrafts] = useState<Record<string, string>>({});

  // Initial load
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const [leadsRes, quotaRes] = await Promise.all([
          getAssistantLeadsAction(),
          getAssistantQuotaAction(),
        ]);

        if (leadsRes.success && leadsRes.leads.length > 0) {
          setLeads(leadsRes.leads);
          setSelectedLeadId(leadsRes.leads[0].id);
          setIsDemo(Boolean(leadsRes.isDemo));

          // Fetch snapshot for first lead
          const ctxRes = await getLeadContextSnapshotAction(leadsRes.leads[0].id);
          if (ctxRes.success && ctxRes.lead) {
            setLeadContext(ctxRes.lead);
          }
        }
        setQuota(quotaRes);
      } catch (err: any) {
        setErrorMessage(err.message || "Failed to initialize AI Sales Assistant");
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Update lead context when selector changes
  const handleLeadChange = async (leadId: string) => {
    setSelectedLeadId(leadId);
    try {
      const res = await getLeadContextSnapshotAction(leadId);
      if (res.success && res.lead) {
        setLeadContext(res.lead);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Generate action
  const handleGenerate = async (
    intent: AssistantIntent,
    prompt?: string,
    objection?: ObjectionCategory
  ) => {
    if (!selectedLeadId) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await generateAiResponseAction({
        leadId: selectedLeadId,
        intent,
        language,
        tone,
        customPrompt: prompt,
        objectionType: objection,
      });

      if (res.success && res.data) {
        setResponses((prev) => [res.data!, ...prev]);
        setEditableDrafts((prev) => ({
          ...prev,
          [res.data!.id]: res.data!.content,
        }));
        if (intent === "custom_prompt") {
          setCustomPrompt("");
        }
        // Refresh quota
        const updatedQuota = await getAssistantQuotaAction();
        setQuota(updatedQuota);
      } else {
        setErrorMessage(res.error || "Failed to generate AI response.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to generate AI response.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openWhatsAppUrl = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${cleanPhone}?text=${encodedText}`;
    window.open(url, "_blank");
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="AI Sales Assistant"
          description="Grounded, permission-checked sales assistance for Pakistani agency lead management."
        />
        <LoadingState message="Loading lead context and AI assistant engine..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Title and AI Usage Meter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="AI Sales Assistant"
          description="Grounded lead intelligence, English & Urdu follow-up drafting, and objection handling."
          badge={<span className="badge-lime text-[11px] font-bold">Grounded Sales Studio</span>}
        />

        {quota && (
          <div className="card-charcoal px-5 py-3 rounded-2xl flex items-center gap-4 text-white">
            <div className="w-8 h-8 rounded-xl bg-[#B7FF3C] text-[#101113] flex items-center justify-center shrink-0 font-bold border border-[#101113]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-[#B7FF3C] uppercase text-[10px] tracking-wider">{quota.planTier}</span>
                <span className="text-slate-400">•</span>
                <span className="font-mono text-white">
                  {quota.requestsUsed} / {quota.requestLimit} reqs
                </span>
              </div>
              <p className="text-slate-400 text-[11px] font-medium">Resets on {quota.resetDate}</p>
            </div>
            <div className="w-20 bg-[#282B30] rounded-full h-2 overflow-hidden border border-[#3A3F47] ml-1">
              <div
                className="bg-[#B7FF3C] h-full rounded-full"
                style={{ width: `${Math.min(100, (quota.requestsUsed / quota.requestLimit) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {isDemo && (
        <div className="card-white p-4 bg-[#F3F4F2] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#17191C] text-[#B7FF3C] flex items-center justify-center shrink-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <span className="text-[#101113] font-medium">
              <strong className="font-bold">Demo Workspace Mode:</strong> Using local grounded test data. AI generations run through strict local deterministic synthesizer with zero API cost.
            </span>
          </div>
          <span className="badge-dark text-[10px] shrink-0 font-mono">
            GROUNDED LOCAL ENGINE
          </span>
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

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Context Selector & Grounding Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-white p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <span className="text-xs font-black text-[#101113] uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#101113]" />
                Target Lead Record
              </span>
              <span className="badge-lime text-[10px]">Context Safe</span>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#101113] mb-1.5">
                Select Active Lead
              </label>
              <select
                value={selectedLeadId}
                onChange={(e) => handleLeadChange(e.target.value)}
                className="w-full text-xs font-bold border-2 border-[#101113] rounded-xl p-2.5 bg-[#F3F4F2] focus:bg-white focus:outline-none transition-all text-[#101113]"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} — {l.clientName} ({l.status.replace(/_/g, " ")})
                  </option>
                ))}
              </select>
            </div>

            {leadContext && (
              <div className="space-y-3 pt-2">
                <div className="bg-[#F3F4F2] rounded-2xl p-4 border-2 border-[#101113] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#777D77] font-bold">Pipeline Status:</span>
                    <StatusBadge
                      label={leadContext.status.replace(/_/g, " ").toUpperCase()}
                      variant={
                        leadContext.status === "won"
                          ? "success"
                          : leadContext.status === "lost"
                          ? "danger"
                          : leadContext.status === "follow_up_required"
                          ? "warning"
                          : "default"
                      }
                      dot
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#777D77] font-bold">Priority:</span>
                    <span className="font-black text-[#101113] uppercase">{leadContext.priority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#777D77] font-bold">Inbound Channel:</span>
                    <span className="badge-dark text-[10px]">{leadContext.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#777D77] font-bold">Est. Deal Value:</span>
                    <span className="font-mono font-black text-[#101113]">
                      {leadContext.dealValue > 0 ? `PKR ${leadContext.dealValue.toLocaleString()}` : "Not logged"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#777D77] font-bold">Phone Number:</span>
                    <span className="font-mono font-bold text-[#101113]">{leadContext.phone || "Missing"}</span>
                  </div>
                </div>

                {/* Grounded Notes */}
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#101113] block mb-1">
                    Grounded Lead Notes:
                  </span>
                  <div className="bg-[#F3F4F2] border-2 border-[#101113] rounded-xl p-3 text-xs text-[#101113] italic font-medium leading-relaxed max-h-24 overflow-y-auto">
                    {leadContext.notes ? `"${leadContext.notes}"` : "No qualitative notes on file."}
                  </div>
                </div>

                {/* Grounding Safety Box */}
                <div className="card-charcoal p-3.5 rounded-2xl text-[11px] text-white space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[#B7FF3C]">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Strict Grounding Active
                  </div>
                  <p className="text-slate-300 leading-normal font-medium">
                    This assistant strictly uses verified lead attributes. Missing values (e.g. unknown budget or timeline) will be flagged instead of fabricated.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Language & Tone Preferences */}
          <div className="card-white p-6 space-y-4">
            <span className="text-xs font-black text-[#101113] uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b-2 border-[#DCDDDA]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#101113]" />
              Generation Controls
            </span>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#101113] mb-1.5">
                Output Language
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`py-2 px-3 text-xs rounded-xl font-bold text-center transition-all border-2 ${
                    language === "en"
                      ? "bg-[#17191C] text-[#B7FF3C] border-[#101113] shadow-xs"
                      : "bg-white text-[#777D77] border-[#DCDDDA] hover:border-[#101113]"
                  }`}
                >
                  English (LTR)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("ur")}
                  className={`py-2 px-3 text-xs rounded-xl font-bold text-center transition-all border-2 ${
                    language === "ur"
                      ? "bg-[#17191C] text-[#B7FF3C] border-[#101113] shadow-xs"
                      : "bg-white text-[#777D77] border-[#DCDDDA] hover:border-[#101113]"
                  }`}
                >
                  اردو (Urdu RTL)
                </button>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[#101113] mb-1.5">
                Tone of Voice
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["professional", "friendly", "concise"] as AssistantTone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`py-2 px-2 text-[11px] font-bold rounded-xl border-2 capitalize text-center transition-all ${
                      tone === t
                        ? "bg-[#B7FF3C] text-[#101113] border-[#101113] shadow-xs"
                        : "bg-white text-[#777D77] border-[#DCDDDA] hover:border-[#101113]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interaction Thread & Composer (8 Cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Action Chips Bar */}
          <div className="card-white p-5 space-y-3">
            <span className="text-xs font-black text-[#101113] uppercase tracking-wider block">
              Grounded AI Prompt Actions
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("summarize_history")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F3F4F2] hover:bg-[#17191C] hover:text-[#B7FF3C] text-[#101113] text-xs font-bold rounded-xl border-2 border-[#101113] transition-colors disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5" />
                Summarize Lead History
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("draft_whatsapp")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#B7FF3C] hover:bg-[#a6ec34] text-[#101113] text-xs font-black rounded-xl border-2 border-[#101113] transition-colors disabled:opacity-50"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Draft WhatsApp Message
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("draft_email")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F3F4F2] hover:bg-[#17191C] hover:text-white text-[#101113] text-xs font-bold rounded-xl border-2 border-[#101113] transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                Draft Email Outreach
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("suggest_questions")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F3F4F2] hover:bg-[#17191C] hover:text-white text-[#101113] text-xs font-bold rounded-xl border-2 border-[#101113] transition-colors disabled:opacity-50"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                Qualification Framework
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("suggest_next_action")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#F3F4F2] hover:bg-[#17191C] hover:text-white text-[#101113] text-xs font-bold rounded-xl border-2 border-[#101113] transition-colors disabled:opacity-50"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                Next-Best Action
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setShowObjectionSelect(!showObjectionSelect)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition-colors border-2 border-[#101113] disabled:opacity-50 ${
                  showObjectionSelect
                    ? "bg-[#17191C] text-white"
                    : "bg-[#F3F4F2] text-[#101113] hover:bg-[#17191C] hover:text-white"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Handle Objection...
              </button>
            </div>

            {/* Objection Selection Dropdown */}
            {showObjectionSelect && (
              <div className="bg-[#F3F4F2] border-2 border-[#101113] rounded-2xl p-3.5 text-xs flex flex-col md:flex-row md:items-center gap-3">
                <span className="font-black text-[#101113] shrink-0">Select Prospect Objection:</span>
                <select
                  value={selectedObjection}
                  onChange={(e) => setSelectedObjection(e.target.value as ObjectionCategory)}
                  className="bg-white border-2 border-[#101113] rounded-xl px-3 py-2 text-xs font-bold text-[#101113] focus:outline-none grow"
                >
                  <option value="price_too_high">"Price is too high / Out of budget"</option>
                  <option value="send_proposal_first">"Just send me a proposal first, don't call"</option>
                  <option value="already_bought">"We already hired another agency / vendor"</option>
                  <option value="need_partner_approval">"I need to discuss with my business partner"</option>
                  <option value="follow_up_later">"Follow up with me next month"</option>
                </select>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={() => handleGenerate("handle_objection", undefined, selectedObjection)}
                  className="btn-primary text-xs px-4 py-2 shrink-0 disabled:opacity-50"
                >
                  Generate Rebuttal
                </button>
              </div>
            )}
          </div>

          {/* Prompt Composer Box */}
          <div className="card-white p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customPrompt.trim()) {
                  handleGenerate("custom_prompt", customPrompt);
                }
              }}
              className="space-y-2"
            >
              <div className="relative">
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={`Ask anything about ${leadContext?.name || "this lead"} (e.g. "Draft a polite follow-up acknowledging they run an e-commerce brand in Lahore")...`}
                  rows={2}
                  disabled={isGenerating}
                  className="w-full text-xs font-medium border-2 border-[#101113] rounded-2xl p-3.5 focus:outline-none bg-[#F3F4F2] focus:bg-white resize-none text-[#101113] placeholder:text-[#777D77]"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !customPrompt.trim()}
                  className="absolute right-3 bottom-4 px-4 py-2 bg-[#17191C] hover:bg-[#101113] disabled:bg-[#DCDDDA] text-[#B7FF3C] text-xs font-black rounded-xl border border-[#101113] transition-colors flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Response Thread */}
          <div className="space-y-4">
            {responses.length === 0 && !isGenerating && (
              <div className="card-white p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#17191C] text-[#B7FF3C] flex items-center justify-center mx-auto border-2 border-[#101113]">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-[#101113]">No Drafts Generated Yet</h4>
                <p className="text-xs text-[#777D77] max-w-sm mx-auto font-medium">
                  Click any suggested prompt button above or type a custom query to generate grounded, client-safe sales communications.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="card-white p-6 flex items-center justify-center gap-3 text-[#101113]">
                <RefreshCw className="w-5 h-5 animate-spin text-[#101113]" />
                <span className="text-xs font-bold">
                  Reviewing verified lead records & compiling grounded {language === "ur" ? "Urdu" : "English"} response...
                </span>
              </div>
            )}

            {responses.map((resp) => (
              <div
                key={resp.id}
                className="card-white overflow-hidden space-y-0"
              >
                {/* Response Meta Header */}
                <div className="bg-[#17191C] px-5 py-3.5 border-b-2 border-[#101113] flex flex-wrap items-center justify-between gap-2 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-[#B7FF3C] text-[#101113] rounded-md font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-black text-white">
                      {resp.intent === "draft_whatsapp"
                        ? "WhatsApp Follow-up Draft"
                        : resp.intent === "draft_email"
                        ? "Email Outreach Draft"
                        : resp.intent === "handle_objection"
                        ? "Objection Handling Script"
                        : resp.intent === "suggest_questions"
                        ? "Qualification Framework"
                        : "Lead Intelligence Summary"}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="font-bold text-[#B7FF3C]">{resp.leadName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="badge-dark text-[10px] font-mono uppercase bg-[#282B30] text-white border border-[#3A3F47]">
                      {resp.language === "ur" ? "اردو (UR)" : "EN"} • {resp.tone}
                    </span>
                    <span className="badge-lime text-[10px] font-bold">
                      Grounded Draft
                    </span>
                  </div>
                </div>

                {/* Grounded Facts & Missing Information Tabs */}
                <div className="px-5 py-3 bg-[#F3F4F2] border-b-2 border-[#DCDDDA] grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="font-black text-[#101113] block mb-1 uppercase text-[10px] tracking-wider">
                      Verified Facts Used:
                    </span>
                    <ul className="text-[#101113] space-y-0.5 list-disc list-inside font-medium">
                      {resp.groundedFacts.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {resp.missingFacts.length > 0 && (
                    <div>
                      <span className="font-black text-amber-800 block mb-1 uppercase text-[10px] tracking-wider">
                        Missing Context (Not Inferred):
                      </span>
                      <ul className="text-amber-900 space-y-0.5 list-disc list-inside font-medium">
                        {resp.missingFacts.slice(0, 2).map((m, i) => (
                          <li key={i}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Response Body / Editable Draft */}
                <div className="p-5 space-y-3">
                  <div
                    className={`prose prose-xs max-w-none text-[#101113] leading-relaxed font-sans ${
                      resp.language === "ur" ? "text-right font-serif text-base" : ""
                    }`}
                  >
                    <textarea
                      rows={resp.content.split("\n").length + 2}
                      value={editableDrafts[resp.id] ?? resp.content}
                      onChange={(e) =>
                        setEditableDrafts((prev) => ({
                          ...prev,
                          [resp.id]: e.target.value,
                        }))
                      }
                      className="w-full text-xs font-mono bg-[#F3F4F2] border-2 border-[#101113] rounded-2xl p-4 focus:outline-none focus:bg-white leading-relaxed text-[#101113] font-bold"
                    />
                  </div>

                  {/* Operational Next Steps */}
                  {resp.suggestedNextSteps.length > 0 && (
                    <div className="bg-[#F3F4F2] rounded-2xl p-3.5 border-2 border-[#101113] text-xs space-y-1">
                      <span className="font-black text-[#101113] uppercase text-[10px] tracking-wider">
                        Recommended Next Steps:
                      </span>
                      <ul className="space-y-1 text-[#101113] list-disc list-inside font-medium">
                        {resp.suggestedNextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Controls: Copy, WhatsApp Web Launch, Regenerate */}
                <div className="bg-[#F3F4F2] px-5 py-3 border-t-2 border-[#DCDDDA] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-[#777D77] flex items-center gap-1.5 font-medium">
                    <Info className="w-3.5 h-3.5 text-[#101113]" />
                    Human-in-the-loop: No automatic messages are sent without user review.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(resp.id, editableDrafts[resp.id] ?? resp.content)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white border-2 border-[#101113] hover:bg-[#F3F4F2] text-[#101113] font-bold rounded-xl transition-colors"
                    >
                      {copiedId === resp.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-black">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#101113]" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>

                    {leadContext?.phone && (resp.intent === "draft_whatsapp" || resp.intent === "custom_prompt") && (
                      <button
                        type="button"
                        onClick={() => openWhatsAppUrl(leadContext.phone!, editableDrafts[resp.id] ?? resp.content)}
                        className="btn-lime text-xs py-1.5 px-3.5 flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open WhatsApp</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleGenerate(resp.intent, customPrompt, selectedObjection)}
                      className="p-2 text-[#101113] hover:bg-white rounded-xl border border-transparent hover:border-[#101113] transition-colors"
                      title="Regenerate draft"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
