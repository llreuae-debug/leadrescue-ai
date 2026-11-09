-- ============================================================================
-- LeadRescue AI — Production Demonstration Seed Script
-- Target Market: Pakistan Digital Marketing Agencies (PKT / Asia/Karachi)
-- ============================================================================

-- 1. Insert Demonstration Agency Tenant
INSERT INTO public.agencies (
  id,
  name,
  business_email,
  country,
  city,
  timezone,
  preferred_language,
  agency_size,
  business_type,
  plan_id,
  is_active
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Apex Media Pakistan',
  'director@apexmedia.pk',
  'Pakistan',
  'Lahore',
  'Asia/Karachi',
  'en',
  '11-25',
  'Performance Marketing & Lead Gen',
  'growth',
  true
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Client Workspaces (Brand Clients Managed by Agency)
INSERT INTO public.clients (
  id,
  agency_id,
  name,
  company_name,
  industry,
  contact_name,
  contact_email,
  contact_phone,
  status
) VALUES 
(
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Horizon Retailers',
  'Horizon Retailers Pvt Ltd',
  'Retail & Apparel',
  'Usman Ghani',
  'usman@horizonretailers.pk',
  '+92 300 1234567',
  'active'
),
(
  'c0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'Metro Logistics Pakistan',
  'Metro Logistics Karachi',
  'Supply Chain & Freight',
  'Fatima Noor',
  'fatima.n@metrologistics.pk',
  '+92 321 9876543',
  'active'
),
(
  'c0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'Indus Commercial Properties',
  'Indus Heights Real Estate',
  'Real Estate & Construction',
  'Saad Farooq',
  'saad@indusheights.com',
  '+92 333 5556677',
  'active'
) ON CONFLICT (id) DO NOTHING;

-- 3. Insert Inbound Leads for Horizon Retailers
INSERT INTO public.leads (
  id,
  agency_id,
  client_id,
  contact_name,
  contact_phone,
  contact_email,
  company_name,
  source,
  campaign_name,
  status,
  priority,
  deal_value,
  notes,
  last_contacted_at,
  created_at
) VALUES
(
  'l0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'Zubair Ahmed',
  '+92 301 5551234',
  'zubair.a@gmail.com',
  'Zubair Fabrics Lahore',
  'Meta Lead Ads',
  'Summer Stitched Lawn Campaign',
  'won',
  'urgent',
  180000,
  'Bulk order confirmed for 300 stitched lawn units. Payment received via Bank Alfalah IBFT.',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '5 days'
),
(
  'l0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'Ayesha Siddiqui',
  '+92 321 8889900',
  'ayesha@siddiquitraders.pk',
  'Siddiqui Traders',
  'Google Ads',
  'B2B Wholesale Inquiries',
  'qualified',
  'high',
  95000,
  'Requested formal wholesale price list and fabric swatch delivery to Faisalabad showroom.',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '3 days'
),
(
  'l0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'Kamran Khan',
  '+92 333 4445566',
  'kamran@khanenterprises.com',
  'Khan Enterprises',
  'WhatsApp Website Click',
  'Direct WhatsApp Button',
  'proposal_sent',
  'urgent',
  240000,
  'Detailed quote sent for Karachi retail outlet opening. Decision expected this Thursday.',
  NOW() - INTERVAL '4 hours',
  NOW() - INTERVAL '2 days'
),
(
  'l0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'Bilal Raza',
  '+92 345 7771122',
  'bilal.raza@outlook.com',
  'Raza Garments',
  'Meta Lead Ads',
  'Summer Stitched Lawn Campaign',
  'follow_up_required',
  'high',
  65000,
  'First telephone conversation completed; requested product catalog on WhatsApp.',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '2 days'
),
(
  'l0000000-0000-0000-0000-000000000005',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'Farhan Saeed',
  '+92 300 6667788',
  'farhan@saeedtex.com',
  'Saeed Textiles',
  'Direct Referral',
  NULL,
  'lost',
  'low',
  120000,
  'Lost to competitor offering 45-day deferred credit terms.',
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '10 days'
),
(
  'l0000000-0000-0000-0000-000000000006',
  'a0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'Tariq Bashir',
  '+92 312 9988776',
  'tariq.bashir@yahoo.com',
  NULL,
  'Meta Lead Ads',
  'Summer Stitched Lawn Campaign',
  'new',
  'medium',
  45000,
  'Inquired about minimum wholesale carton quantities.',
  NULL,
  NOW() - INTERVAL '45 minutes'
) ON CONFLICT (id) DO NOTHING;

-- 4. Insert Follow-Up Tasks for Response SLA Tracking
INSERT INTO public.follow_up_tasks (
  id,
  lead_id,
  agency_id,
  task_type,
  priority,
  status,
  due_at,
  notes
) VALUES
(
  't0000000-0000-0000-0000-000000000001',
  'l0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'whatsapp',
  'urgent',
  'due_today',
  NOW() + INTERVAL '2 hours',
  'Follow up on Karachi outlet proposal pricing and delivery schedule'
),
(
  't0000000-0000-0000-0000-000000000002',
  'l0000000-0000-0000-0000-000000000004',
  'a0000000-0000-0000-0000-000000000001',
  'call',
  'high',
  'overdue',
  NOW() - INTERVAL '3 hours',
  'Confirm receipt of wholesale PDF catalog and check order volume'
),
(
  't0000000-0000-0000-0000-000000000003',
  'l0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  'whatsapp',
  'high',
  'upcoming',
  NOW() + INTERVAL '1 day',
  'Confirm swatch dispatch courier tracking number with Faisalabad showroom'
) ON CONFLICT (id) DO NOTHING;

-- 5. Insert Lead Activity Audit Logs
INSERT INTO public.lead_activities (
  id,
  lead_id,
  agency_id,
  action,
  details,
  created_at
) VALUES
(
  'e0000000-0000-0000-0000-000000000001',
  'l0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'stage_changed',
  'Pipeline stage updated from Proposal Sent to Won Deal (PKR 180,000)',
  NOW() - INTERVAL '2 days'
),
(
  'e0000000-0000-0000-0000-000000000002',
  'l0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000001',
  'ai_draft_generated',
  'AI Sales Assistant synthesized professional WhatsApp proposal follow-up',
  NOW() - INTERVAL '4 hours'
) ON CONFLICT (id) DO NOTHING;
