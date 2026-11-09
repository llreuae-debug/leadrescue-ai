export type SupportedLanguage = "en" | "ur";

export interface TranslationDictionary {
  // Brand & Tagline
  brandName: string;
  tagline: string;

  // Navigation
  navDashboard: string;
  navLeads: string;
  navPipeline: string;
  navFollowUps: string;
  navClients: string;
  navAiAssistant: string;
  navReports: string;
  navTeam: string;
  navIntegrations: string;
  navBilling: string;
  navSettings: string;
  navClientPortal: string;
  navSuperAdmin: string;

  // Actions
  actionSave: string;
  actionCancel: string;
  actionEdit: string;
  actionDelete: string;
  actionExportCsv: string;
  actionSearch: string;
  actionFilter: string;
  actionApprove: string;
  actionReject: string;
  actionSendWhatsApp: string;
  actionAddLead: string;
  actionNewClient: string;
  actionInviteMember: string;
  actionSignOut: string;

  // Statuses
  statusNew: string;
  statusContacted: string;
  statusQualified: string;
  statusProposalSent: string;
  statusWon: string;
  statusLost: string;
  statusActive: string;
  statusSuspended: string;
  statusPending: string;

  // Metrics
  metricTotalLeads: string;
  metricContactedLeads: string;
  metricQualifiedLeads: string;
  metricWonDeals: string;
  metricWonRevenue: string;
  metricFollowUpsDue: string;
  metricOverdueTasks: string;
  metricConversionRate: string;

  // Financial & Banking (Pakistan localized)
  currencyPKR: string;
  paymentMethodIBFT: string;
  bankMeezan: string;
  bankHBL: string;
  depositSlipRef: string;
  planStarter: string;
  planGrowth: string;
  planAdvanced: string;

  // Accessibility & Empty States
  skipToContent: string;
  switchLanguage: string;
  noRecordsFound: string;
  loading: string;
  demoNotice: string;
  privacyShieldNotice: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    brandName: "LeadRescue AI",
    tagline: "Every Lead Deserves a Follow-Up.",

    navDashboard: "Dashboard",
    navLeads: "Leads",
    navPipeline: "Pipeline",
    navFollowUps: "Follow-Ups",
    navClients: "Clients",
    navAiAssistant: "AI Assistant",
    navReports: "Reports & Analytics",
    navTeam: "Team Members",
    navIntegrations: "Integrations",
    navBilling: "Billing & Plans",
    navSettings: "Settings",
    navClientPortal: "Client Portal",
    navSuperAdmin: "Super Admin",

    actionSave: "Save",
    actionCancel: "Cancel",
    actionEdit: "Edit",
    actionDelete: "Delete",
    actionExportCsv: "Export CSV",
    actionSearch: "Search records...",
    actionFilter: "Filter",
    actionApprove: "Approve",
    actionReject: "Reject",
    actionSendWhatsApp: "Send WhatsApp",
    actionAddLead: "Add Lead",
    actionNewClient: "New Client",
    actionInviteMember: "Invite Member",
    actionSignOut: "Sign Out",

    statusNew: "New",
    statusContacted: "Contacted",
    statusQualified: "Qualified",
    statusProposalSent: "Proposal Sent",
    statusWon: "Won Deal",
    statusLost: "Lost",
    statusActive: "Active",
    statusSuspended: "Suspended",
    statusPending: "Pending Review",

    metricTotalLeads: "Total Leads",
    metricContactedLeads: "Contacted",
    metricQualifiedLeads: "Qualified Leads",
    metricWonDeals: "Closed Won",
    metricWonRevenue: "Won Deal Revenue",
    metricFollowUpsDue: "Follow-Ups Due Today",
    metricOverdueTasks: "Overdue Follow-Ups",
    metricConversionRate: "Conversion Rate",

    currencyPKR: "PKR",
    paymentMethodIBFT: "Bank Transfer (IBFT)",
    bankMeezan: "Meezan Bank Limited",
    bankHBL: "Habib Bank Limited (HBL)",
    depositSlipRef: "Transaction Reference (UTR/RRN)",
    planStarter: "Starter Plan",
    planGrowth: "Growth Plan",
    planAdvanced: "Advanced Plan",

    skipToContent: "Skip to main content",
    switchLanguage: "Switch Language / زبان تبدیل کریں",
    noRecordsFound: "No records found matching your filters.",
    loading: "Loading data...",
    demoNotice: "Preview Mode: Showing demonstration data.",
    privacyShieldNotice: "Confidential data isolation enforced across all workspaces.",
  },

  ur: {
    brandName: "لیڈ ریسکیو اے آئی",
    tagline: "ہر لیڈ کی فالو اپ ضروری ہے۔",

    navDashboard: "ڈیش بورڈ",
    navLeads: "کسٹمر لیڈز",
    navPipeline: "سیلز پائپ لائن",
    navFollowUps: "فالو اپ ٹاسکس",
    navClients: "کلائنٹ ورک اسپیس",
    navAiAssistant: "اے آئی سیلز اسسٹنٹ",
    navReports: "رپورٹس اور تجزیات",
    navTeam: "ٹیم ممبران",
    navIntegrations: "انٹیگریشنز",
    navBilling: "بلنگ اور سبسکرپشن",
    navSettings: "سیٹنگز",
    navClientPortal: "کلائنٹ پورٹل",
    navSuperAdmin: "سپر ایڈمن",

    actionSave: "محفوظ کریں",
    actionCancel: "منسوخ کریں",
    actionEdit: "تبدیل کریں",
    actionDelete: "حذف کریں",
    actionExportCsv: "ایکسپورٹ CSV",
    actionSearch: "تلاش کریں...",
    actionFilter: "فلٹر کریں",
    actionApprove: "منظور کریں",
    actionReject: "مسترد کریں",
    actionSendWhatsApp: "واٹس ایپ پیغام",
    actionAddLead: "نئی لیڈ درج کریں",
    actionNewClient: "نیا کلائنٹ شامل کریں",
    actionInviteMember: "ممبر کو مدعو کریں",
    actionSignOut: "لاگ آؤٹ",

    statusNew: "نئی لیڈ",
    statusContacted: "رابطہ مکمل",
    statusQualified: "اہل قرار",
    statusProposalSent: "پروپوزل ارسال",
    statusWon: "کامیاب سودا",
    statusLost: "ناکام",
    statusActive: "فعال",
    statusSuspended: "معطل",
    statusPending: "زیرِ جائزہ",

    metricTotalLeads: "کل لیڈز",
    metricContactedLeads: "رابطہ شدہ لیڈز",
    metricQualifiedLeads: "اہل لیڈز",
    metricWonDeals: "کامیاب سودے",
    metricWonRevenue: "حاصل شدہ آمدنی",
    metricFollowUpsDue: "آج کے فالو اپس",
    metricOverdueTasks: "تاخیر شدہ فالو اپس",
    metricConversionRate: "شرحِ کامیابی (کنورژن)",

    currencyPKR: "روپے",
    paymentMethodIBFT: "بینک ٹرانسفر (IBFT)",
    bankMeezan: "میزان بینک لمیٹڈ",
    bankHBL: "حبیب بینک لمیٹڈ (HBL)",
    depositSlipRef: "ٹرانزیکشن ریفرنس نمبر (UTR/RRN)",
    planStarter: "اسٹارٹر پلان",
    planGrowth: "گروتھ پلان",
    planAdvanced: "ایڈوانسڈ پلان",

    skipToContent: "براہ راست مواد پر جائیں",
    switchLanguage: "زبان تبدیل کریں / Switch Language",
    noRecordsFound: "کوئی ریکارڈ نہیں ملا۔",
    loading: "ڈیٹا لوڈ ہو رہا ہے...",
    demoNotice: "ڈیمو موڈ: نمائشی ڈیٹا دکھایا جا رہا ہے۔",
    privacyShieldNotice: "تمام ورک اسپیسز میں مکمل ڈیٹا تحفظ اور رازداری نافذ ہے۔",
  },
};

/**
 * Ensures phone numbers maintain Left-To-Right isolation in RTL contexts.
 */
export function formatBilingualPhone(phone?: string | null): string {
  if (!phone) return "";
  const cleaned = phone.trim();
  // Wrap with Unicode LTR mark to prevent digit reordering in RTL
  return `\u202A${cleaned}\u202C`;
}

/**
 * Formats currency appropriately for both languages.
 */
export function formatBilingualCurrency(amount: number, lang: SupportedLanguage): string {
  const formatted = amount.toLocaleString("en-US");
  if (lang === "ur") {
    return `${formatted} روپے`;
  }
  return `PKR ${formatted}`;
}
