-- LeadRescue AI: Stage 4 Leads, Follow-ups, and Dashboard Support
-- Includes multi-tenant tables, indexes, and RLS policies

-- 1. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  source TEXT NOT NULL DEFAULT 'Meta Ads',
  campaign TEXT,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'follow_up_required', 'proposal_sent', 'won', 'lost'
  priority TEXT NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  deal_value NUMERIC(14, 2) DEFAULT 0,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  last_contacted_at TIMESTAMPTZ,
  next_follow_up_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Follow-Up Tasks Table
CREATE TABLE IF NOT EXISTS public.follow_up_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  due_at TIMESTAMPTZ NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'whatsapp', -- 'call', 'whatsapp', 'email', 'meeting'
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'snoozed', 'cancelled'
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Lead Activities Table
CREATE TABLE IF NOT EXISTS public.lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- e.g. 'created', 'status_changed', 'follow_up_scheduled', 'ai_draft_generated'
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. High-Performance Indexes for Dashboard Aggregation
CREATE INDEX IF NOT EXISTS idx_leads_agency_id ON public.leads(agency_id);
CREATE INDEX IF NOT EXISTS idx_leads_client_id ON public.leads(client_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up_at ON public.leads(next_follow_up_at);

CREATE INDEX IF NOT EXISTS idx_follow_ups_agency_id ON public.follow_up_tasks(agency_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due_at ON public.follow_up_tasks(due_at);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_up_tasks(status);

CREATE INDEX IF NOT EXISTS idx_lead_activities_agency_id ON public.lead_activities(agency_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_created_at ON public.lead_activities(created_at);

-- 5. Row-Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies: Leads
CREATE POLICY "Agency members can view leads belonging to their agency"
  ON public.leads FOR SELECT
  USING (public.is_agency_member(agency_id));

CREATE POLICY "Agency members can create leads for their agency"
  ON public.leads FOR INSERT
  WITH CHECK (public.is_agency_member(agency_id));

CREATE POLICY "Agency members can update leads for their agency"
  ON public.leads FOR UPDATE
  USING (public.is_agency_member(agency_id))
  WITH CHECK (public.is_agency_member(agency_id));

CREATE POLICY "Agency admins can delete leads"
  ON public.leads FOR DELETE
  USING (public.is_agency_admin(agency_id));

-- 7. RLS Policies: Follow-Up Tasks
CREATE POLICY "Agency members can view follow-ups belonging to their agency"
  ON public.follow_up_tasks FOR SELECT
  USING (public.is_agency_member(agency_id));

CREATE POLICY "Agency members can create follow-ups for their agency"
  ON public.follow_up_tasks FOR INSERT
  WITH CHECK (public.is_agency_member(agency_id));

CREATE POLICY "Agency members can update follow-ups for their agency"
  ON public.follow_up_tasks FOR UPDATE
  USING (public.is_agency_member(agency_id))
  WITH CHECK (public.is_agency_member(agency_id));

-- 8. RLS Policies: Lead Activities
CREATE POLICY "Agency members can view lead activities belonging to their agency"
  ON public.lead_activities FOR SELECT
  USING (public.is_agency_member(agency_id));

CREATE POLICY "Agency members can insert lead activities for their agency"
  ON public.lead_activities FOR INSERT
  WITH CHECK (public.is_agency_member(agency_id));
