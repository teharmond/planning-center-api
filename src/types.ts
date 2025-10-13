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
}

export type AuthConfig = BasicAuthConfig | BearerAuthConfig;

export interface PlanningCenterConfig {
  auth?: AuthConfig; // Optional - will use ENV variables if not provided
  rateLimitDelay?: number; // ms to wait between requests (default: 100)
  maxRetries?: number; // max retries for rate limit (default: 3)
}

export interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  data: T;
  tokens?: RefreshedTokens;
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
