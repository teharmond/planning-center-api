import { PeopleApp } from "./apps/people";
export class PlanningCenter {
    constructor(config = {}) {
        this.baseUrl = "https://api.planningcenteronline.com";
        this.lastRequestTime = 0;
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
        }
    }
    getDefaultAuth() {
        const clientId = process.env.PCO_API_CLIENT_ID;
        const clientSecret = process.env.PCO_API_SECRET;
        if (!clientId || !clientSecret) {
            throw new Error("Authentication required: Either provide auth config or set PCO_API_CLIENT_ID and PCO_API_SECRET environment variables");
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
    async request(method, path, body) {
        await this.handleRateLimit();
        let retries = 0;
        const maxRetries = this.config.maxRetries;
        while (retries <= maxRetries) {
            try {
                const headers = await this.getHeaders();
                const url = `${this.baseUrl}${path}`;
                const options = {
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
                let data;
                if (response.status === 204 ||
                    response.headers.get("content-length") === "0") {
                    data = undefined;
                }
                else {
                    data = (await response.json());
                }
                return {
                    data,
                    tokens: this.getRefreshedTokens(),
                };
            }
            catch (error) {
                if (retries >= maxRetries) {
                    throw error;
                }
                retries++;
                await this.sleep(1000 * retries);
            }
        }
        throw new Error("Request failed after all retries");
    }
    async getHeaders() {
        const headers = {
            "Content-Type": "application/json",
        };
        if (this.auth.type === "basic") {
            const credentials = Buffer.from(`${this.auth.clientId}:${this.auth.clientSecret}`).toString("base64");
            headers["Authorization"] = `Basic ${credentials}`;
        }
        else if (this.auth.type === "bearer" && this.currentTokens) {
            headers["Authorization"] = `Bearer ${this.currentTokens.access}`;
        }
        return headers;
    }
    async handleRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        const delay = this.config.rateLimitDelay;
        if (timeSinceLastRequest < delay) {
            await this.sleep(delay - timeSinceLastRequest);
        }
        this.lastRequestTime = Date.now();
    }
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    shouldAutoRefresh() {
        return (this.auth.type === "bearer" &&
            this.auth.autoRefresh === true &&
            !!this.currentTokens?.refresh);
    }
    async refreshAccessToken() {
        if (!this.currentTokens?.refresh) {
            return false;
        }
        try {
            const response = await fetch("https://api.planningcenteronline.com/oauth/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    grant_type: "refresh_token",
                    refresh_token: this.currentTokens.refresh,
                }),
            });
            if (!response.ok) {
                return false;
            }
            const data = (await response.json());
            this.currentTokens = {
                access: data.access_token,
                refresh: data.refresh_token || this.currentTokens.refresh,
            };
            return true;
        }
        catch {
            return false;
        }
    }
    getRefreshedTokens() {
        if (this.auth.type === "bearer" && this.currentTokens) {
            return {
                accessToken: this.currentTokens.access,
                refreshToken: this.currentTokens.refresh,
            };
        }
        return undefined;
    }
}
