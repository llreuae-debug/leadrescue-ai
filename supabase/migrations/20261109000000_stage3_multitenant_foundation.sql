-- LeadRescue AI: Stage 3 Multi-Tenant Database Migration
-- Multi-tenant schema with PostgreSQL Row-Level Security (RLS)

-- 1. Custom Types
DO $$ BEGIN
  CREATE TYPE agency_role AS ENUM (
    'owner',
    'admin',
    'manager',
    'sales_representative',
    'viewer'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE membership_status AS ENUM (
    'active',
    'invited',
    'suspended'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Agencies Table (Tenants)
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_email TEXT,
  country TEXT NOT NULL DEFAULT 'Pakistan',
  city TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Karachi',
  preferred_language TEXT NOT NULL DEFAULT 'en', -- 'en' or 'ur'
  agency_size TEXT DEFAULT '1-10',
  business_type TEXT DEFAULT 'Digital Marketing',
  plan_id TEXT NOT NULL DEFAULT 'starter',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Agency Members Table (Tenant Membership & RBAC)
CREATE TABLE IF NOT EXISTS public.agency_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role agency_role NOT NULL DEFAULT 'sales_representative',
  status membership_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_agency_user UNIQUE (agency_id, user_id)
);

-- 5. Clients Table (Client Workspaces owned by Agency)
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'paused', 'archived'
  account_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Indexes for High-Velocity Queries & Tenant Scopes
CREATE INDEX IF NOT EXISTS idx_agency_members_user_id ON public.agency_members(user_id);
CREATE INDEX IF NOT EXISTS idx_agency_members_agency_id ON public.agency_members(agency_id);
CREATE INDEX IF NOT EXISTS idx_agency_members_role ON public.agency_members(role);
CREATE INDEX IF NOT EXISTS idx_clients_agency_id ON public.clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_clients_account_manager_id ON public.clients(account_manager_id);

-- 7. Automated Profile Trigger for auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agency User'),
    COALESCE(NEW.email, '')
  )
  ON CONFLICT (id) DO UPDATE
  SET
    full_name = EXCLUDED.full_name,
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Row-Level Security (RLS) Helper Functions
-- Check if current authenticated user belongs to an agency
CREATE OR REPLACE FUNCTION public.is_agency_member(check_agency_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.agency_members
    WHERE agency_id = check_agency_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Check if current authenticated user is an agency owner or admin
CREATE OR REPLACE FUNCTION public.is_agency_admin(check_agency_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.agency_members
    WHERE agency_id = check_agency_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 9. Enable Row-Level Security on All Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies: Profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Members of the same agency can view peer profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.agency_members m1
      JOIN public.agency_members m2 ON m1.agency_id = m2.agency_id
      WHERE m1.user_id = auth.uid()
        AND m2.user_id = public.profiles.id
        AND m1.status = 'active'
    )
  );

-- 11. RLS Policies: Agencies
CREATE POLICY "Agency members can view their agency"
  ON public.agencies FOR SELECT
  USING (public.is_agency_member(id));

CREATE POLICY "Authenticated users can create a new agency"
  ON public.agencies FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Agency owners and admins can update their agency"
  ON public.agencies FOR UPDATE
  USING (public.is_agency_admin(id))
  WITH CHECK (public.is_agency_admin(id));

-- 12. RLS Policies: Agency Members
CREATE POLICY "Agency members can view members of their agency"
  ON public.agency_members FOR SELECT
  USING (public.is_agency_member(agency_id));

CREATE POLICY "Agency owners and admins can add/invite members"
  ON public.agency_members FOR INSERT
  WITH CHECK (
    -- Allow user creating their own first ownership record, or existing admin adding a member
    (user_id = auth.uid() AND role = 'owner')
    OR public.is_agency_admin(agency_id)
  );

CREATE POLICY "Agency owners and admins can update agency members"
  ON public.agency_members FOR UPDATE
  USING (public.is_agency_admin(agency_id))
  WITH CHECK (public.is_agency_admin(agency_id));

CREATE POLICY "Agency owners and admins can remove agency members"
  ON public.agency_members FOR DELETE
  USING (public.is_agency_admin(agency_id));

-- 13. RLS Policies: Clients
CREATE POLICY "Agency members can view clients belonging to their agency"
  ON public.clients FOR SELECT
  USING (public.is_agency_member(agency_id));

CREATE POLICY "Authorized agency staff can create clients for their agency"
  ON public.clients FOR INSERT
  WITH CHECK (
    public.is_agency_member(agency_id)
    AND EXISTS (
      SELECT 1 FROM public.agency_members
      WHERE agency_id = public.clients.agency_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin', 'manager')
        AND status = 'active'
    )
  );

CREATE POLICY "Authorized agency staff can update clients for their agency"
  ON public.clients FOR UPDATE
  USING (
    public.is_agency_member(agency_id)
    AND EXISTS (
      SELECT 1 FROM public.agency_members
      WHERE agency_id = public.clients.agency_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin', 'manager')
        AND status = 'active'
    )
  );

CREATE POLICY "Agency owners and admins can delete clients"
  ON public.clients FOR DELETE
  USING (public.is_agency_admin(agency_id));
