"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { LoadingState } from "@/components/ui/LoadingState";
import { IntegrationDefinition, IntegrationId } from "@/types/integrations";
import {
  getIntegrationsAction,
  getWebhookCredentialsAction,
  testWebhookConnectionAction,
} from "@/app/actions/integrations";
import {
  Blocks,
  FileSpreadsheet,
  Webhook,
  MessageSquare,
  Share2,
  Table,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Code,
  ShieldCheck,
  Send,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  ChevronRight,
  ShieldAlert,
  X,
} from "lucide-react";
import Link from "next/link";

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationDefinition[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationDefinition | null>(null);

  // Webhook credentials modal
  const [showWebhookModal, setShowWebhookModal] = useState<boolean>(false);
  const [webhookData, setWebhookData] = useState<{
    endpointUrl: string;
    signingSecret: string;
    sampleCurl: string;
    sampleHtml: string;
  } | null>(null);
  const [revealSecret, setRevealSecret] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // WhatsApp setup modal
  const [showWhatsAppModal, setShowWhatsAppModal] = useState<boolean>(false);

  // Generic modal for unconfigured integrations
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const res = await getIntegrationsAction();
        if (res.success) {
          setIntegrations(res.integrations);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const openWebhookModal = async () => {
    setShowWebhookModal(true);
    setTestResult(null);
    try {
      const data = await getWebhookCredentialsAction();
      if (data.success) {
        setWebhookData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setTestResult(null);
    try {
      const res = await testWebhookConnectionAction("client-1");
      setTestResult({
        success: res.success,
        message: res.message || res.error || "Webhook response received",
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || "Failed to trigger test ping",
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getIntegrationIcon = (id: IntegrationId) => {
    switch (id) {
      case "csv_import":
        return <FileSpreadsheet className="w-6 h-6 text-[#101113]" />;
      case "webhook_forms":
        return <Webhook className="w-6 h-6 text-[#101113]" />;
      case "whatsapp_cloud":
        return <MessageSquare className="w-6 h-6 text-[#101113]" />;
      case "meta_lead_ads":
        return <Share2 className="w-6 h-6 text-[#101113]" />;
      case "google_sheets":
        return <Table className="w-6 h-6 text-[#101113]" />;
      case "smtp_email":
        return <Mail className="w-6 h-6 text-[#101113]" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="Integrations Centre"
        description="Reliable inbound lead capture, webhook signatures, and verified third-party communication channels."
        badge={<span className="badge-lime text-[11px] font-bold">API Connectors</span>}
      />

      {/* Honest Status & Security Principles Banner */}
      <div className="card-white p-5 bg-[#F3F4F2] flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#17191C] text-[#B7FF3C] flex items-center justify-center shrink-0 border border-[#101113]">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-xs text-[#101113] space-y-1">
          <span className="font-black text-[#101113] uppercase tracking-wider block text-xs">
            Zero Mocked Claims & Verified Connection Model
          </span>
          <p className="leading-relaxed font-medium text-[#777D77]">
            LeadRescue AI marks third-party integrations as <strong className="text-[#101113]">Connected</strong> only after real credentials, permissions, and validation handshakes succeed. Unconfigured integrations default strictly to <strong className="text-[#101113]">Not Connected</strong> with setup guides rather than misleading buttons.
          </p>
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Loading integration catalog and active endpoints..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="card-white p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#B7FF3C] text-[#101113] flex items-center justify-center shrink-0 border-2 border-[#101113]">
                    {getIntegrationIcon(item.id)}
                  </div>

                  <span className={item.status === "connected" ? "badge-lime text-[10px]" : "badge-dark text-[10px]"}>
                    {item.status === "connected" ? "CONNECTED" : "NOT CONNECTED"}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#101113]">{item.name}</h3>
                  <span className="text-[10px] text-[#777D77] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                </div>

                <p className="text-xs text-[#777D77] leading-relaxed font-medium">{item.description}</p>

                {/* Features Pill List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-black text-[#101113] uppercase tracking-wider block">
                    Capabilities:
                  </span>
                  <ul className="text-xs text-[#101113] space-y-1 font-medium">
                    {item.features.slice(0, 2).map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#101113] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t-2 border-[#DCDDDA]">
                {item.id === "csv_import" ? (
                  <Link
                    href="/app/leads"
                    className="w-full btn-secondary text-xs py-2.5 px-3 flex items-center justify-center gap-1.5"
                  >
                    <span>Open CSV Importer</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                ) : item.id === "webhook_forms" ? (
                  <button
                    type="button"
                    onClick={openWebhookModal}
                    className="w-full btn-lime text-xs py-2.5 px-3 flex items-center justify-center gap-1.5"
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>View Webhook & Code</span>
                  </button>
                ) : item.id === "whatsapp_cloud" ? (
                  <button
                    type="button"
                    onClick={() => setShowWhatsAppModal(true)}
                    className="w-full btn-secondary text-xs py-2.5 px-3 flex items-center justify-center gap-1.5"
                  >
                    <span>Configure Meta Cloud API</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIntegration(item);
                      setShowConfigModal(true);
                    }}
                    className="w-full btn-secondary text-xs py-2.5 px-3 flex items-center justify-center gap-1.5"
                  >
                    <span>Setup Credentials</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Webhook & Embedded Form Drawer Modal */}
      {showWebhookModal && webhookData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 border-2 border-[#101113] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <div className="flex items-center gap-2">
                <Webhook className="w-5 h-5 text-[#101113]" />
                <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
                  Inbound Webhook & Form Endpoint
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWebhookModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F3F4F2] flex items-center justify-center text-[#101113] font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Endpoint URL */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#101113] mb-1.5">
                  Webhook Endpoint (POST)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookData.endpointUrl}
                    className="w-full text-xs font-mono bg-[#F3F4F2] border-2 border-[#101113] rounded-xl px-3.5 py-2.5 text-[#101113] font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyText("url", webhookData.endpointUrl)}
                    className="btn-secondary text-xs px-4 py-2.5 shrink-0 flex items-center gap-1.5"
                  >
                    {copiedKey === "url" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "url" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Signing Secret */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[#101113] mb-1.5">
                  HMAC SHA-256 Signing Secret
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type={revealSecret ? "text" : "password"}
                    readOnly
                    value={webhookData.signingSecret}
                    className="w-full text-xs font-mono bg-[#F3F4F2] border-2 border-[#101113] rounded-xl px-3.5 py-2.5 text-[#101113] font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setRevealSecret(!revealSecret)}
                    className="p-2.5 border-2 border-[#101113] bg-white hover:bg-[#F3F4F2] rounded-xl text-[#101113]"
                    title={revealSecret ? "Hide secret" : "Reveal secret"}
                  >
                    {revealSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => copyText("secret", webhookData.signingSecret)}
                    className="btn-secondary text-xs px-4 py-2.5 shrink-0 flex items-center gap-1.5"
                  >
                    {copiedKey === "secret" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === "secret" ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <p className="text-[11px] text-[#777D77] font-medium mt-1">
                  Pass signature in header <code>x-leadrescue-signature</code>. Requests with duplicate <code>idempotency-key</code> headers will not create duplicate leads.
                </p>
              </div>

              {/* Self-Test Ping Section */}
              <div className="card-white p-4 bg-[#F3F4F2] flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="font-black text-[#101113] text-xs uppercase tracking-wider block">Dispatch Self-Test Ping</span>
                  <p className="text-[11px] text-[#777D77] font-medium">
                    Sends a verified test payload to validate your endpoint handling and signature computation.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isTestingWebhook}
                  onClick={handleTestWebhook}
                  className="btn-primary text-xs px-4 py-2 shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>{isTestingWebhook ? "Pinging..." : "Test Ping"}</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-2xl border-2 text-xs flex items-center gap-2 font-bold ${
                    testResult.success
                      ? "bg-emerald-50 border-emerald-500 text-emerald-900"
                      : "bg-red-50 border-red-500 text-red-900"
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* Code Snippets */}
              <div className="space-y-2">
                <span className="font-black uppercase tracking-wider text-[#101113] block text-[11px]">
                  Sample cURL Command:
                </span>
                <pre className="p-4 bg-[#17191C] text-[#B7FF3C] rounded-2xl border-2 border-[#101113] font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {webhookData.sampleCurl}
                </pre>
              </div>

              <div className="space-y-2">
                <span className="font-black uppercase tracking-wider text-[#101113] block text-[11px]">
                  Embeddable HTML Lead Form Snippet:
                </span>
                <pre className="p-4 bg-[#17191C] text-[#B7FF3C] rounded-2xl border-2 border-[#101113] font-mono text-[11px] overflow-x-auto leading-relaxed">
                  {webhookData.sampleHtml}
                </pre>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#DCDDDA]">
              <button
                type="button"
                onClick={() => setShowWebhookModal(false)}
                className="btn-primary text-xs px-5 py-2.5"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Official WhatsApp Business API Guidance Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border-2 border-[#101113] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#101113]" />
                <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">
                  Official WhatsApp Cloud API
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F3F4F2] flex items-center justify-center text-[#101113] font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-[#101113]">
              <div className="bg-red-50 border-2 border-red-500 text-red-950 rounded-2xl p-4 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span className="font-medium">
                  <strong className="font-bold">Strict Policy:</strong> LeadRescue AI strictly avoids unofficial browser scrapers or unapproved headless WhatsApp sessions, which lead to permanent Meta number bans.
                </span>
              </div>

              <p className="font-medium text-[#777D77]">
                To enable automated outbound messaging, complete the official Meta Developer onboarding:
              </p>

              <ol className="list-decimal list-inside space-y-2 text-[#101113] font-medium">
                <li>
                  <strong>Meta Business Manager:</strong> Complete Business Verification in Meta Business Suite.
                </li>
                <li>
                  <strong>Register Number:</strong> Provision a clean Pakistani number (+92) not currently registered on WhatsApp Personal/Business app.
                </li>
                <li>
                  <strong>Permanent Access Token:</strong> Generate a System User token with <code>whatsapp_business_messaging</code> permissions.
                </li>
                <li>
                  <strong>Phone Number ID:</strong> Copy the Phone Number ID from Meta App Dashboard.
                </li>
              </ol>

              <div className="bg-[#F3F4F2] p-4 rounded-2xl border-2 border-[#101113] text-[11px] text-[#101113] font-medium">
                <em>Until credentials are provided, sales representatives use the built-in click-to-chat review launch modal (`https://wa.me/`) with zero ban risk.</em>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#DCDDDA]">
              <button
                type="button"
                onClick={() => setShowWhatsAppModal(false)}
                className="btn-primary text-xs px-5 py-2.5"
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generic Setup Requirements Modal */}
      {showConfigModal && selectedIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="card-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border-2 border-[#101113] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#DCDDDA]">
              <h3 className="text-sm font-black text-[#101113] uppercase tracking-wider">{selectedIntegration.name}</h3>
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F3F4F2] flex items-center justify-center text-[#101113] font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-[#777D77] font-medium">
              <p>{selectedIntegration.description}</p>

              <div>
                <span className="font-black text-[#101113] uppercase text-[10px] tracking-wider block mb-2">
                  Required Credentials to Connect:
                </span>
                <ul className="space-y-1.5 list-disc list-inside text-[#101113]">
                  {selectedIntegration.setupRequirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F3F4F2] border-2 border-[#101113] text-[#101113] rounded-2xl p-4 text-[11px]">
                <strong className="font-bold">Configuration Note:</strong> Provide these credentials in your deployment environment variables (see <code>.env.example</code>). This service will switch to <strong>Connected</strong> once validated.
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t-2 border-[#DCDDDA]">
              <button
                type="button"
                onClick={() => setShowConfigModal(false)}
                className="btn-primary text-xs px-5 py-2.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
