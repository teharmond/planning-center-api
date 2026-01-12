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

// Home App Types

export interface HomeTaskAttributes {
  /** The associated resource (if linked to another PCO resource) */
  associated_resource?: string | null;
  /** URL to the associated resource */
  associated_url?: string | null;
  /** URL for automation (e.g., repeating task) */
  automation_url?: string | null;
  /** HTML description of the task */
  description?: string | null;
  /** Due date in YYYY-MM-DD format */
  due_at?: string | null;
  /** Position of the task in the list */
  position?: number;
  /** Status of the task: "incomplete" or "complete" */
  status?: "incomplete" | "complete";
  /** When the status was last updated */
  status_updated_at?: string | null;
  /** Title of the task */
  title?: string;
}

export interface HomeTask {
  id: string;
  type: "Task";
  attributes: HomeTaskAttributes;
  relationships?: {
    created_by?: {
      data: { type: "Collaborator"; id: string } | null;
    };
    assignee?: {
      data: { type: "Collaborator"; id: string } | null;
    };
    task_list?: {
      data: { type: "TaskList"; id: string } | null;
    };
  };
  links?: {
    self?: string;
    html?: string;
    assignee?: string | null;
    created_by?: string;
    repeating_task?: string;
    task_list?: string;
  };
}

export interface HomeTaskCreateAttributes {
  /** Title of the task (required) */
  title: string;
  /** HTML description of the task */
  description?: string | null;
  /** Due date in YYYY-MM-DD format */
  due_at?: string | null;
  /** Status of the task: "incomplete" or "complete" */
  status?: "incomplete" | "complete";
  /** URL to associate with the task */
  associated_url?: string | null;
  /** Task list ID to add the task to */
  task_list_id?: string;
}

export interface HomeTaskUpdateAttributes {
  /** Title of the task */
  title?: string;
  /** HTML description of the task */
  description?: string | null;
  /** Due date in YYYY-MM-DD format */
  due_at?: string | null;
  /** Status of the task: "incomplete" or "complete" */
  status?: "incomplete" | "complete";
  /** Position of the task in the list */
  position?: number;
  /** URL to associate with the task */
  associated_url?: string | null;
}

// Task List Types

export interface HomeTaskListAttributes {
  /** Color name for the task list */
  color_name?: string | null;
  /** CSS color value */
  css_color?: string;
  /** Type of list: "InboxTaskList" or "TaskList" */
  list_type?: "InboxTaskList" | "TaskList";
  /** Position of the list */
  position?: number;
  /** Title of the task list */
  title?: string;
  /** When the task list was last updated */
  updated_at?: string;
}

export interface HomeTaskList {
  id: string;
  type: "TaskList";
  attributes: HomeTaskListAttributes;
  relationships?: {
    created_by?: {
      data: { type: "Collaborator"; id: string } | null;
    };
  };
  links?: {
    self?: string;
    html?: string;
  };
}

export interface HomeTaskListCreateAttributes {
  /** Title of the task list (required) */
  title: string;
  /** Color name for the task list */
  color_name?: string | null;
}

export interface HomeTaskListUpdateAttributes {
  /** Title of the task list */
  title?: string;
  /** Color name for the task list */
  color_name?: string | null;
  /** Position of the list */
  position?: number;
}

// Collaborator Types

export interface HomeCollaboratorAttributes {
  /** URL to the collaborator's avatar */
  avatar_url?: string;
  /** First name of the collaborator */
  first_name?: string;
  /** Full name of the collaborator */
  name?: string;
}

export interface HomeCollaborator {
  id: string;
  type: "Collaborator";
  attributes: HomeCollaboratorAttributes;
  links?: {
    self?: string;
  };
}
