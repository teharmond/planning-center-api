import { PlanningCenterConfig, RefreshedTokens } from "./types";
import { PeopleApp } from "./apps/people";
export declare class PlanningCenter {
    private config;
    private auth;
    private baseUrl;
    private currentTokens?;
    private lastRequestTime;
    constructor(config?: PlanningCenterConfig);
    private getDefaultAuth;
    get people(): PeopleApp;
    request<T = any>(method: string, path: string, body?: any): Promise<{
        data: T;
        tokens?: RefreshedTokens;
    }>;
    private getHeaders;
    private handleRateLimit;
    private sleep;
    private shouldAutoRefresh;
    private refreshAccessToken;
    private getRefreshedTokens;
}
