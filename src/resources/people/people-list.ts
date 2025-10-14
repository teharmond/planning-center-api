import { PlanningCenter } from "../../client.js";
import { Person, ApiResponse } from "../../types.js";

export interface PeopleListOptions {
  per_page?: number; // default: 100, min: 1, max: 100
  offset?: number;
  where?: Record<string, any>;
  order?: string;
  include?: string;
  filter?: "created_since" | "admins" | "organization_admins" | string;
}

export class PeopleListResource {
  constructor(private client: PlanningCenter) {}

  async list(options?: PeopleListOptions): Promise<ApiResponse<Person[]>> {
    const params = new URLSearchParams();

    const perPage = options?.per_page ?? 100;
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
    const path = `/people/v2/people${queryString ? `?${queryString}` : ""}`;

    return this.client.request<Person[]>("GET", path);
  }
}
