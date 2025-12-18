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
  clientId?: string; // Required for OAuth token refresh
  clientSecret?: string; // Required for OAuth token refresh
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
  included?: Array<{
    type: string;
    id: string;
    attributes: Record<string, any>;
    relationships?: Record<string, any>;
    links?: Record<string, any>;
  }>;
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

export interface EpisodeAttributes {
  title?: string;
  description?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string;
  duration?: number;
  video_url?: string;
  audio_url?: string;
  church_center_published?: boolean;
}

export interface Episode {
  id: string;
  type: "Episode";
  attributes: EpisodeAttributes;
}

export interface SeriesAttributes {
  title?: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Series {
  id: string;
  type: "Series";
  attributes: SeriesAttributes;
}

export interface SignupAttributes {
  name?: string;
  description?: string;
  image_url?: string;
  starts_at?: string;
  ends_at?: string;
  created_at?: string;
  updated_at?: string;
  archived_at?: string;
  published_at?: string;
  listed?: boolean;
  active?: boolean;
}

export interface Signup {
  id: string;
  type: "Signup";
  attributes: SignupAttributes;
}

export interface CategoryAttributes {
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  type: "Category";
  attributes: CategoryAttributes;
}

export interface RegistrationsCampusAttributes {
  name?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RegistrationsCampus {
  id: string;
  type: "Campus";
  attributes: RegistrationsCampusAttributes;
}

export interface EventAttributes {
  name?: string;
  description?: string;
  approval_status?: string;
  created_at?: string;
  updated_at?: string;
  percent_approved?: number;
  percent_rejected?: number;
  visible_in_church_center?: boolean;
  image_url?: string;
  starts_at?: string;
  ends_at?: string;
}

export interface Event {
  id: string;
  type: "Event";
  attributes: EventAttributes;
}

export interface CalendarTagAttributes {
  name?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
  position?: number;
}

export interface CalendarTag {
  id: string;
  type: "Tag";
  attributes: CalendarTagAttributes;
}

export interface EventInstanceAttributes {
  starts_at?: string;
  ends_at?: string;
  all_day?: boolean;
  location?: string;
  notes?: string;
  approval_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventInstance {
  id: string;
  type: "EventInstance";
  attributes: EventInstanceAttributes;
}

export interface MessageTemplateAttributes {
  body?: string;
  subject?: string;
}

export interface MessageTemplate {
  id: string;
  type: "MessageTemplate";
  attributes: MessageTemplateAttributes;
}

export interface NoteAttributes {
  note?: string;
  created_at?: string;
  updated_at?: string;
  display_date?: string;
  note_category_id?: string;
  organization_id?: string;
  person_id?: string;
  created_by_id?: string;
}

export interface NoteCreateAttributes {
  note: string;
  note_category_id: string;
  created_at?: string;
  updated_at?: string;
  display_date?: string;
}

export interface NoteUpdateAttributes {
  note?: string;
  note_category_id?: string;
  created_at?: string;
  updated_at?: string;
  display_date?: string;
}

export interface Note {
  id: string;
  type: "Note";
  attributes: NoteAttributes;
  relationships?: {
    note_category?: {
      data: { type: "NoteCategory"; id: string };
    };
    organization?: {
      data: { type: "Organization"; id: string };
    };
    person?: {
      data: { type: "Person"; id: string };
    };
    created_by?: {
      data: { type: "Person"; id: string };
    };
  };
}

export interface NoteCategoryAttributes {
  name?: string;
  locked?: boolean;
  created_at?: string;
  updated_at?: string;
  organization_id?: string;
}

export interface NoteCategoryCreateAttributes {
  name: string;
}

export interface NoteCategoryUpdateAttributes {
  name?: string;
}

export interface NoteCategory {
  id: string;
  type: "NoteCategory";
  attributes: NoteCategoryAttributes;
  relationships?: {
    organization?: {
      data: { type: "Organization"; id: string };
    };
  };
}
