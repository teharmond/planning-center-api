import { PlanningCenterConfig, AuthConfig, RefreshedTokens } from "./types.js";
import { PeopleApp } from "./apps/people.js";
import { ServicesApp } from "./apps/services.js";
import { GroupsApp } from "./apps/groups.js";
import { CheckInsApp } from "./apps/check-ins.js";
import { HomeApp } from "./apps/home.js";
import { ChatApp } from "./apps/chat.js";
import { RegistrationsApp } from "./apps/registrations.js";
import { CalendarApp } from "./apps/calendar.js";
import { GivingApp } from "./apps/giving.js";
import { ApiApp } from "./apps/api.js";
import { PublishingApp } from "./apps/publishing.js";
import { WebhooksApp } from "./apps/webhooks.js";

export class PlanningCenter {
  private config: PlanningCenterConfig;
  private auth: AuthConfig;
  private baseUrl = "https://api.planningcenteronline.com";
  private currentTokens?: { access: string; refresh?: string };
  private lastRequestTime = 0;
  private tokenRefreshedAt?: number;
  private tokenExpiryMs: number = 7200000; // 2 hours default

  constructor(config: PlanningCenterConfig = {}) {
    this.config = {
      rateLimitDelay: 100,
      maxRetries: 3,
      autoPaginate: true,
      ...config,
    };

    // Use provided auth or default to ENV variables for basic auth
    this.auth = config.auth || this.getDefaultAuth();

    if (this.auth.type === "bearer") {
      this.currentTokens = {
        access: this.auth.bearerToken,
        refresh: this.auth.refreshToken,
      };

      // Set token refresh time if provided
      if (this.auth.lastRefreshedAt) {
        this.tokenRefreshedAt = this.parseTimestamp(this.auth.lastRefreshedAt);
      }

      // Set custom expiry time if provided
      if (this.auth.tokenExpiryMs) {
        this.tokenExpiryMs = this.auth.tokenExpiryMs;
      }
    }
  }

  private parseTimestamp(timestamp: Date | string | number): number {
    if (timestamp instanceof Date) {
      return timestamp.getTime();
    }
    if (typeof timestamp === "string") {
      return new Date(timestamp).getTime();
    }
    return timestamp;
  }

  private getDefaultAuth(): AuthConfig {
    const clientId = process.env.PCO_API_CLIENT_ID;
    const clientSecret = process.env.PCO_API_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error(
        "Authentication required: Either provide auth config or set PCO_API_CLIENT_ID and PCO_API_SECRET environment variables"
      );
    }

    return {
      type: "basic",
      clientId,
      clientSecret,
    };
  }

  get people() {
    return new PeopleApp(this);
  }

  get services() {
    return new ServicesApp(this);
  }

  get groups() {
    return new GroupsApp(this);
  }

  get checkIns() {
    return new CheckInsApp(this);
  }

  get home() {
    return new HomeApp(this);
  }

  get chat() {
    return new ChatApp(this);
  }

  get registrations() {
    return new RegistrationsApp(this);
  }

  get calendar() {
    return new CalendarApp(this);
  }

  get giving() {
    return new GivingApp(this);
  }

  get api() {
    return new ApiApp(this);
  }

  get publishing() {
    return new PublishingApp(this);
  }

  get webhooks() {
    return new WebhooksApp(this);
  }

  async request<T = any>(
    method: string,
    path: string,
    body?: any,
    options?: { autoPaginate?: boolean; per_page?: number; offset?: number }
  ): Promise<{ data: T; meta?: any; links?: any }> {
    // Check if token needs proactive refresh
    if (this.shouldProactivelyRefresh()) {
      await this.refreshAccessToken();
    }

    // Add query parameters if provided
    let finalPath = path;
    if (options?.per_page || options?.offset !== undefined) {
      const url = new URL(finalPath, this.baseUrl);
      if (options.per_page) {
        url.searchParams.set("per_page", options.per_page.toString());
      }
      if (options.offset !== undefined) {
        url.searchParams.set("offset", options.offset.toString());
      }
      finalPath = url.pathname + url.search;
    }

    const autoPaginate =
      options?.autoPaginate !== undefined
        ? options.autoPaginate
        : this.config.autoPaginate;

    // For GET requests with autoPaginate, collect all pages
    if (method === "GET" && autoPaginate) {
      return this.requestWithPagination<T>(finalPath);
    }

    return this.singleRequest<T>(method, finalPath, body);
  }

  private async singleRequest<T = any>(
    method: string,
    path: string,
    body?: any
  ): Promise<{ data: T; meta?: any; links?: any }> {
    await this.handleRateLimit();

    let retries = 0;
    const maxRetries = this.config.maxRetries!;

    while (retries <= maxRetries) {
      try {
        const headers = await this.getHeaders();
        const url = `${this.baseUrl}${path}`;

        const options: RequestInit = {
          method,
          headers,
        };

        if (body) {
          options.body = JSON.stringify(body);
        }

        const response = await fetch(url, options);

        // Handle rate limiting
        if (response.status === 429) {
          retries++;
          if (retries > maxRetries) {
            throw new Error("Max retries exceeded for rate limiting");
          }
          const retryAfter = response.headers.get("Retry-After");
          const delay = retryAfter
            ? parseInt(retryAfter) * 1000
            : 2000 * retries;
          await this.sleep(delay);
          continue;
        }

        // Handle token refresh for 401
        if (response.status === 401 && this.shouldAutoRefresh()) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            retries++;
            continue;
          }
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        // Handle empty responses (like 204 No Content for DELETE)
        if (
          response.status === 204 ||
          response.headers.get("content-length") === "0"
        ) {
          return {
            data: undefined as T,
          };
        }

        const jsonResponse = (await response.json()) as any;

        return {
          data: jsonResponse.data as T,
          meta: jsonResponse.meta,
          links: jsonResponse.links,
        };
      } catch (error) {
        if (retries >= maxRetries) {
          throw error;
        }
        retries++;
        await this.sleep(1000 * retries);
      }
    }

    throw new Error("Request failed after all retries");
  }

  private async requestWithPagination<T = any>(
    path: string
  ): Promise<{ data: T; meta?: any; links?: any }> {
    const allData: any[] = [];
    let nextUrl: string | null = path;
    let lastMeta: any;
    let lastLinks: any;

    while (nextUrl) {
      const response: {
        data: any;
        meta?: any;
        links?: any;
      } = await this.singleRequest<any>("GET", nextUrl);

      if (Array.isArray(response.data)) {
        allData.push(...response.data);
      } else {
        // Single item response, return as-is
        return response as any;
      }

      lastMeta = response.meta;
      lastLinks = response.links;

      // Check for next page
      if (response.links?.next) {
        // Extract path from full URL
        const url: URL = new URL(response.links.next);
        nextUrl = url.pathname + url.search;
      } else {
        nextUrl = null;
      }
    }

    return {
      data: allData as T,
      meta: lastMeta,
      links: lastLinks,
    };
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (this.auth.type === "basic") {
      const credentials = Buffer.from(
        `${this.auth.clientId}:${this.auth.clientSecret}`
      ).toString("base64");
      headers["Authorization"] = `Basic ${credentials}`;
    } else if (this.auth.type === "bearer" && this.currentTokens) {
      headers["Authorization"] = `Bearer ${this.currentTokens.access}`;
    }

    return headers;
  }

  private async handleRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const delay = this.config.rateLimitDelay!;

    if (timeSinceLastRequest < delay) {
      await this.sleep(delay - timeSinceLastRequest);
    }

    this.lastRequestTime = Date.now();
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private shouldAutoRefresh(): boolean {
    return (
      this.auth.type === "bearer" &&
      this.auth.autoRefresh === true &&
      !!this.currentTokens?.refresh
    );
  }

  private shouldProactivelyRefresh(): boolean {
    if (!this.shouldAutoRefresh() || !this.tokenRefreshedAt) {
      return false;
    }

    const now = Date.now();
    const timeSinceRefresh = now - this.tokenRefreshedAt;

    // Refresh if token is within 5 minutes of expiring
    const bufferMs = 5 * 60 * 1000; // 5 minutes
    return timeSinceRefresh >= this.tokenExpiryMs - bufferMs;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.currentTokens?.refresh) {
      return false;
    }

    try {
      const response = await fetch(
        "https://api.planningcenteronline.com/oauth/token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            grant_type: "refresh_token",
            refresh_token: this.currentTokens.refresh,
          }),
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = (await response.json()) as {
        access_token: string;
        refresh_token?: string;
      };

      this.currentTokens = {
        access: data.access_token,
        refresh: data.refresh_token || this.currentTokens.refresh,
      };

      this.tokenRefreshedAt = Date.now();

      // Call the onTokenRefresh callback if provided
      if (this.auth.type === "bearer" && this.auth.onTokenRefresh) {
        const tokens: RefreshedTokens = {
          accessToken: this.currentTokens.access,
          refreshToken: this.currentTokens.refresh!,
        };
        await this.auth.onTokenRefresh(tokens);
      }

      return true;
    } catch {
      return false;
    }
  }
}
