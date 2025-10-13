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
}
export type AuthConfig = BasicAuthConfig | BearerAuthConfig;
export interface PlanningCenterConfig {
    auth?: AuthConfig;
    rateLimitDelay?: number;
    maxRetries?: number;
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
export interface Person {
    id: string;
    type: "Person";
    attributes: PersonAttributes;
}
