export interface BasicAuthConfig {
  type: "basic";
  clientId: string;
  clientSecret: string;
}

export interface BearerAuthConfig {
  type: "bearer";
  bearerToken: string;
  refreshToken?: string;
  autoRefresh?: boolean;
  lastRefreshedAt?: Date | string | number; // Optional: when token was last refreshed
  tokenExpiryMs?: number; // Optional: token lifetime in ms (default: 7200000 = 2 hours)
  onTokenRefresh?: (tokens: RefreshedTokens) => void | Promise<void>; // Callback when tokens are refreshed
}

export type AuthConfig = BasicAuthConfig | BearerAuthConfig;

export interface PlanningCenterConfig {
  auth?: AuthConfig; // Optional - will use ENV variables if not provided
  rateLimitDelay?: number; // ms to wait between requests (default: 100)
  maxRetries?: number; // max retries for rate limit (default: 3)
  autoPaginate?: boolean; // auto-fetch all pages (default: true)
}

export interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  data: T;
  meta?: {
    total_count?: number;
    count?: number;
    next?: { offset?: number };
    can_order_by?: string[];
    can_query_by?: string[];
    can_include?: string[];
    can_filter?: string[];
    parent?: { id: string; type: string };
  };
  links?: {
    self?: string;
    next?: string;
    prev?: string;
  };
}

export interface PersonAttributes {
  first_name?: string;
  last_name?: string;
  birthdate?: string;
  anniversary?: string;
  gender?: string;
  grade?: number;
  child?: boolean;
  status?: string;
  school_type?: string;
  graduation_year?: number;
  site_administrator?: boolean;
  accounting_administrator?: boolean;
  people_permissions?: string;
  membership?: string;
  inactivated_at?: string;
  medical_notes?: string;
  middle_name?: string;
  nickname?: string;
  given_name?: string;
  demographic_avatar_url?: string;
  directory_status?: string;
  passed_background_check?: boolean;
  can_create_forms?: boolean;
  school_type_other?: string;
}

export interface PersonCreateAttributes {
  accounting_administrator?: boolean;
  anniversary?: string;
  birthdate?: string;
  child?: boolean;
  given_name?: string;
  grade?: number;
  graduation_year?: number;
  middle_name?: string;
  nickname?: string;
  people_permissions?: string;
  site_administrator?: boolean;
  gender?: string;
  inactivated_at?: string;
  medical_notes?: string;
  membership?: string;
  stripe_customer_identifier?: string;
  created_by_id?: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  gender_id?: string;
  primary_campus_id?: string;
  remote_id?: string;
  status?: string;
}

export interface PersonUpdateAttributes {
  accounting_administrator?: boolean;
  anniversary?: string;
  birthdate?: string;
  child?: boolean;
  given_name?: string;
  grade?: number;
  graduation_year?: number;
  middle_name?: string;
  nickname?: string;
  people_permissions?: string;
  site_administrator?: boolean;
  gender?: string;
  inactivated_at?: string;
  medical_notes?: string;
  membership?: string;
  stripe_customer_identifier?: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  gender_id?: string;
  primary_campus_id?: string;
  remote_id?: string;
  status?: string;
}

export interface Person {
  id: string;
  type: "Person";
  attributes: PersonAttributes;
}

export interface GroupAttributes {
  archived_at?: string;
  contact_email?: string;
  created_at?: string;
  description?: string;
  enrollment_open?: boolean;
  enrollment_strategy?: string;
  events_visibility?: string;
  location_type_preference?: string;
  memberships_count?: number;
  name?: string;
  public_church_center_web_url?: string;
  schedule?: string;
  virtual_location_url?: string;
}

export interface Group {
  id: string;
  type: "Group";
  attributes: GroupAttributes;
}

export interface TagAttributes {
  name?: string;
  position?: number;
}

export interface Tag {
  id: string;
  type: "Tag";
  attributes: TagAttributes;
}

export interface CampusAttributes {
  name?: string;
  description?: string;
  time_zone?: string;
  latitude?: number;
  longitude?: number;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  phone_number?: string;
  website?: string;
  avatar_url?: string;
}

export interface Campus {
  id: string;
  type: "Campus";
  attributes: CampusAttributes;
}

export interface GroupTypeAttributes {
  name?: string;
  description?: string;
  church_center_visible?: boolean;
  position?: number;
  color?: string;
}

export interface GroupType {
  id: string;
  type: "GroupType";
  attributes: GroupTypeAttributes;
}
