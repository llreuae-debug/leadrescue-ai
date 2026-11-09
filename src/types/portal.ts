export interface ClientPortalLead {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  company?: string | null;
  source: string;
  campaign?: string | null;
  status: string;
  dealValue: number;
  createdAt: string;
}

export interface ClientPortalMetrics {
  totalLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  wonLeads: number;
  totalWonValuePKR: number;
  conversionRate: number;
  sourceBreakdown: {
    source: string;
    count: number;
    percentage: number;
  }[];
}

export interface ClientPortalWorkspace {
  id: string;
  name: string;
  industry: string;
  agencyName: string;
  supportEmail: string;
  supportPhone: string;
}
