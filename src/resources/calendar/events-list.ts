import { PlanningCenter } from "../../client.js";
import { Event, ApiResponse } from "../../types.js";

export interface EventsListOptions {
  per_page?: number; // default: 25, min: 1, max: 100
  offset?: number;
  where?: {
    approval_status?: string;
    created_at?: string;
    name?: string;
    feed_id?: string;
    percent_approved?: number;
    percent_rejected?: number;
    updated_at?: string;
    visible_in_church_center?: boolean;
  };
  order?: string;
  include?: string;
  filter?: "future" | string;
}

export class EventsListResource {
  constructor(private client: PlanningCenter) {}

  async list(options?: EventsListOptions): Promise<ApiResponse<Event[]>> {
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
    const path = `/calendar/v2/events${queryString ? `?${queryString}` : ""}`;

    return this.client.request<Event[]>("GET", path);
  }
}
