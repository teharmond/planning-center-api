import { PlanningCenterConfig, AuthConfig, RefreshedTokens } from "./types";
import { PeopleApp } from "./apps/people";

export class PlanningCenter {
  private config: PlanningCenterConfig;
  private auth: AuthConfig;
  private baseUrl = "https://api.planningcenteronline.com";
  private currentTokens?: { access: string; refresh?: string };
  private lastRequestTime = 0;
  private tokenRefreshedAt?: number;
  private tokenExpiryMs: number = 7200000; // 2 hours default
  private wasTokenRefreshed = false;

  constructor(config: PlanningCenterConfig = {}) {
    this.config = {
      rateLimitDelay: 100,
      maxRetries: 3,
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

  async request<T = any>(
    method: string,
    path: string,
    body?: any
  ): Promise<{ data: T; tokens?: RefreshedTokens }> {
    this.wasTokenRefreshed = false;

    // Check if token needs proactive refresh
    if (this.shouldProactivelyRefresh()) {
      await this.refreshAccessToken();
    }

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
        let data: T;
        if (
          response.status === 204 ||
          response.headers.get("content-length") === "0"
        ) {
          data = undefined as T;
        } else {
          data = (await response.json()) as T;
        }

        return {
          data,
          tokens: this.wasTokenRefreshed
            ? this.getRefreshedTokens()
            : undefined,
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
      this.wasTokenRefreshed = true;

      return true;
    } catch {
      return false;
    }
  }

  private getRefreshedTokens(): RefreshedTokens | undefined {
    if (this.auth.type === "bearer" && this.currentTokens) {
      return {
        accessToken: this.currentTokens.access,
        refreshToken: this.currentTokens.refresh!,
      };
    }
    return undefined;
  }
}
