export type IntegrationStatus = "connected" | "pending" | "not_connected" | "error";

export type IntegrationId =
  | "csv_import"
  | "webhook_forms"
  | "whatsapp_cloud"
  | "meta_lead_ads"
  | "google_sheets"
  | "smtp_email";

export interface IntegrationDefinition {
  id: IntegrationId;
  name: string;
  category: "Intake" | "Messaging" | "Advertising" | "Storage";
  description: string;
  status: IntegrationStatus;
  lastSyncedAt?: string | null;
  errorMessage?: string | null;
  docsUrl?: string;
  features: string[];
  setupRequirements: string[];
  isInternal?: boolean;
}

export interface InboundLeadPayload {
  clientId: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  source?: string;
  campaign?: string | null;
  dealValue?: number;
  notes?: string | null;
}

export interface WebhookIntakeResult {
  success: boolean;
  leadId?: string;
  isIdempotentReplay?: boolean;
  error?: string;
  validationErrors?: string[];
}
