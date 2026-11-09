export type AgencyRole =
  | "owner"
  | "admin"
  | "manager"
  | "sales_representative"
  | "viewer";

export type MembershipStatus = "active" | "invited" | "suspended";

export type ClientStatus = "active" | "paused" | "archived";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Agency {
  id: string;
  name: string;
  business_email?: string | null;
  country: string;
  city?: string | null;
  timezone: string;
  preferred_language: "en" | "ur";
  agency_size?: string | null;
  business_type?: string | null;
  plan_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AgencyMember {
  id: string;
  agency_id: string;
  user_id: string;
  role: AgencyRole;
  status: MembershipStatus;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface ClientWorkspace {
  id: string;
  agency_id: string;
  name: string;
  industry: string;
  status: ClientStatus;
  account_manager_id?: string | null;
  logo_url?: string | null;
  created_at: string;
  updated_at: string;
  account_manager?: Profile | null;
}

export interface UserAgencyContext {
  agency: Agency;
  member: AgencyMember;
  profile: Profile;
}
