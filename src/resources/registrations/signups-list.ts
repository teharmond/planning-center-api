import { PlanningCenter } from "../../client.js";
import { Signup, ApiResponse } from "../../types.js";

export interface SignupsListOptions {
  per_page?: number; // default: 25, min: 1, max: 100
  offset?: number;
  where?: Record<string, any>;
  order?: string;
  include?: string;
  filter?:
    | "between"
    | "published"
    | "unarchived"
    | "future"
    | "with_event_times"
    | "active"
    | "listed"
    | "detailed"
    | string;
}

export class SignupsListResource {
  constructor(private client: PlanningCenter) {}

  async list(options?: SignupsListOptions): Promise<ApiResponse<Signup[]>> {
    const params = new URLSearchParams();

    const perPage = options?.per_page ?? 25;
    if (perPage < 1 || perPage > 100) {
      throw new Error("per_page must be between 1 and 100");
    }
    params.append("per_page", perPage.toString());

    if (options?.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }

    if (options?.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        params.append(`where[${key}]`, String(value));
      });
    }

    if (options?.order) {
      params.append("order", options.order);
    }

    if (options?.include) {
      params.append("include", options.include);
    }

    if (options?.filter) {
      params.append("filter", options.filter);
    }

    const queryString = params.toString();
    const path = `/registrations/v2/signups${queryString ? `?${queryString}` : ""}`;

    return this.client.request<Signup[]>("GET", path);
  }
}
