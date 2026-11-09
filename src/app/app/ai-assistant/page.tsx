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
    setErrorMessage(null);
    try {
      const res = await getLeadContextSnapshotAction(leadId);
      if (res.success && res.lead) {
        setLeadContext(res.lead);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to switch lead");
    }
  };

  const handleGenerate = async (
    intent: AssistantIntent,
    promptText?: string,
    objectionCat?: ObjectionCategory
  ) => {
    if (!selectedLeadId) {
      setErrorMessage("Please select a lead first.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const res = await generateAiResponseAction({
        leadId: selectedLeadId,
        intent,
        language,
        tone,
        customPrompt: promptText,
        objectionType: objectionCat,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.error || "Generation failed. Please try again.");
      } else {
        setResponses((prev) => [res.data!, ...prev]);
        setEditableDrafts((prev) => ({
          ...prev,
          [res.data!.id]: res.data!.content,
        }));
        if (res.quota) setQuota(res.quota);
        setCustomPrompt("");
        setShowObjectionSelect(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during generation.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openWhatsAppUrl = (phone?: string | null, text?: string) => {
    if (!phone) {
      alert("No phone number recorded for this lead.");
      return;
    }
    const cleanPhone = phone.replace(/[^0-9]/g, "");
    // Extract blockquote or raw text
    const cleanText = text
      ? text.replace(/###.*?\n/g, "").replace(/> /g, "").trim()
      : "";
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(cleanText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
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
        />

        {quota && (
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <span>{quota.planTier}</span>
                <span className="text-slate-400">•</span>
                <span className="text-violet-700 font-semibold">
                  {quota.requestsUsed} / {quota.requestLimit} requests
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">Resets on {quota.resetDate}</p>
            </div>
            <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden ml-1">
              <div
                className="bg-violet-600 h-full rounded-full"
                style={{ width: `${Math.min(100, (quota.requestsUsed / quota.requestLimit) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {isDemo && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Demo Workspace Mode:</strong> Using local grounded test data. AI generations run through strict local deterministic synthesizer with zero API cost.
            </span>
          </div>
          <span className="bg-amber-200 text-amber-900 text-[11px] px-2 py-0.5 rounded font-mono">
            GROUNDED LOCAL ENGINE
          </span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Context Selector & Grounding Inspector (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Target Lead
              </span>
              <span className="text-[11px] font-mono text-slate-400">Context Boundary</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Select Active Lead</label>
              <select
                value={selectedLeadId}
                onChange={(e) => handleLeadChange(e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900"
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
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Pipeline Status:</span>
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
                    <span className="text-slate-500">Priority:</span>
                    <span className="font-semibold text-slate-800 uppercase">{leadContext.priority}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Inbound Channel:</span>
                    <span className="font-medium text-slate-800">{leadContext.source}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Est. Deal Value:</span>
                    <span className="font-semibold text-emerald-700">
                      {leadContext.dealValue > 0 ? `PKR ${leadContext.dealValue.toLocaleString()}` : "Not logged"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-slate-700">{leadContext.phone || "Missing"}</span>
                  </div>
                </div>

                {/* Grounded Notes */}
                <div>
                  <span className="text-xs font-medium text-slate-600 block mb-1">Lead Notes on File:</span>
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs text-slate-600 italic leading-relaxed max-h-24 overflow-y-auto">
                    {leadContext.notes ? `"${leadContext.notes}"` : "No qualitative notes on file."}
                  </div>
                </div>

                {/* Grounding Safety Box */}
                <div className="bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-[11px] text-blue-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-950">
                    <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                    Strict Grounding Active
                  </div>
                  <p className="text-blue-800/90 leading-normal">
                    This assistant will only use verified lead attributes. Missing values (e.g. unknown budget or timeline) will be flagged instead of fabricated.
                  </p>
                </div>
              </div>
            )}
          </div>

            {/* Language & Tone Preferences */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Generation Controls
            </span>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Output Language</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                    language === "en"
                      ? "bg-blue-50 border-blue-600 text-blue-700 font-semibold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("ur")}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-all ${
                    language === "ur"
                      ? "bg-blue-50 border-blue-600 text-blue-700 font-semibold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  اردو (Urdu)
                </button>
              </div>
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Tone of Voice</label>
              <div className="grid grid-cols-3 gap-1.5">
                {(["professional", "friendly", "concise"] as AssistantTone[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border capitalize text-center transition-all ${
                      tone === t
                        ? "bg-violet-50 border-violet-600 text-violet-700 font-semibold"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Suggested AI Actions
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("summarize_history")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                Summarize Lead History
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("draft_whatsapp")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium rounded-lg transition-colors border border-emerald-200/60 disabled:opacity-50"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                Draft WhatsApp Message
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("draft_email")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-medium rounded-lg transition-colors border border-blue-200/60 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                Draft Email Outreach
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("suggest_questions")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 hover:bg-violet-100 text-violet-800 text-xs font-medium rounded-lg transition-colors border border-violet-200/60 disabled:opacity-50"
              >
                <HelpCircle className="w-3.5 h-3.5 text-violet-600" />
                Qualification Questions
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => handleGenerate("suggest_next_action")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium rounded-lg transition-colors border border-amber-200/60 disabled:opacity-50"
              >
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                Next-Best Action
              </button>

              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setShowObjectionSelect(!showObjectionSelect)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border disabled:opacity-50 ${
                  showObjectionSelect
                    ? "bg-rose-100 border-rose-300 text-rose-900"
                    : "bg-rose-50 hover:bg-rose-100 border-rose-200/60 text-rose-800"
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                Handle Objection...
              </button>
            </div>

            {/* Objection Selection Dropdown */}
            {showObjectionSelect && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs flex flex-col md:flex-row md:items-center gap-3">
                <span className="font-semibold text-slate-700 shrink-0">Select Prospect Objection:</span>
                <select
                  value={selectedObjection}
                  onChange={(e) => setSelectedObjection(e.target.value as ObjectionCategory)}
                  className="bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 grow"
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
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded text-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  Generate Rebuttal
                </button>
              </div>
            )}
          </div>

          {/* Prompt Composer Box */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
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
                  placeholder={`Ask anything about ${leadContext?.name || "this lead"} (e.g. "Draft a polite follow-up acknowledging they run an e-commerce brand")...`}
                  rows={2}
                  disabled={isGenerating}
                  className="w-full text-xs border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 focus:bg-white resize-none text-slate-900 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !customPrompt.trim()}
                  className="absolute right-2.5 bottom-3 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Synthesizing...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Response Thread */}
          <div className="space-y-4">
            {responses.length === 0 && !isGenerating && (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center space-y-2">
                <Bot className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-sm font-semibold text-slate-700">No Drafts Generated Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click any of the suggested prompt chips above or type a custom question to generate grounded sales guidance.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex items-center justify-center gap-3 text-slate-600">
                <RefreshCw className="w-5 h-5 text-violet-600 animate-spin" />
                <span className="text-xs font-medium">
                  Reviewing verified lead records & compiling grounded {language === "ur" ? "Urdu" : "English"} response...
                </span>
              </div>
            )}

            {responses.map((resp) => (
              <div
                key={resp.id}
                className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all"
              >
                {/* Response Meta Header */}
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-violet-100 text-violet-700 rounded">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-semibold text-slate-800">
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
                    <span className="font-medium text-slate-600">{resp.leadName}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-slate-200/80 text-slate-700 text-[10px] px-2 py-0.5 rounded font-mono uppercase">
                      {resp.language === "ur" ? "اردو (UR)" : "EN"} • {resp.tone}
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-600" />
                      Review Required
                    </span>
                  </div>
                </div>

                {/* Grounded Facts & Missing Information Tabs */}
                <div className="px-5 py-2.5 bg-slate-50/50 border-b border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="font-semibold text-slate-700 block mb-0.5">Verified Facts Used:</span>
                    <ul className="text-slate-600 space-y-0.5 list-disc list-inside">
                      {resp.groundedFacts.slice(0, 3).map((f, i) => (
                        <li key={i}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {resp.missingFacts.length > 0 && (
                    <div>
                      <span className="font-semibold text-amber-800 block mb-0.5">Missing Context (Not Inferred):</span>
                      <ul className="text-amber-700 space-y-0.5 list-disc list-inside">
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
                    className={`prose prose-xs max-w-none text-slate-800 leading-relaxed font-sans ${
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
                      className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed text-slate-900"
                    />
                  </div>

                  {/* Operational Next Steps */}
                  {resp.suggestedNextSteps.length > 0 && (
                    <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1">
                      <span className="font-semibold text-slate-700">Recommended Next Steps:</span>
                      <ul className="space-y-1 text-slate-600 list-disc list-inside">
                        {resp.suggestedNextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Footer Controls: Copy, WhatsApp Web Launch, Regenerate */}
                <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    Human-in-the-loop: No automatic messages are sent without user review.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(resp.id, editableDrafts[resp.id] ?? resp.content)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg shadow-2xs transition-colors"
                    >
                      {copiedId === resp.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-semibold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copy Draft</span>
                        </>
                      )}
                    </button>

                    {leadContext?.phone && (resp.intent === "draft_whatsapp" || resp.intent === "custom_prompt") && (
                      <button
                        type="button"
                        onClick={() => openWhatsAppUrl(leadContext.phone, editableDrafts[resp.id] ?? resp.content)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-2xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open in WhatsApp</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleGenerate(resp.intent, customPrompt, selectedObjection)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
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
