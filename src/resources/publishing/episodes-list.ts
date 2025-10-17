import { PlanningCenter } from "../../client.js";
import { Episode, ApiResponse } from "../../types.js";

export interface EpisodesListOptions {
  per_page?: number; // default: 25, min: 1, max: 100
  offset?: number;
  where?: {
    search?: string;
    series_id?: number;
    services_plan_remote_identifier?: string;
    services_service_type_remote_identifier?: string;
  };
  order?: string;
  include?: string;
  filter?:
    | "published_live"
    | "not_published_live"
    | "connected_to_services"
    | "not_connected_to_services"
    | "published_on_church_center"
    | string;
}

export class EpisodesListResource {
  constructor(private client: PlanningCenter) {}

  async list(options?: EpisodesListOptions): Promise<ApiResponse<Episode[]>> {
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
    const path = `/publishing/v2/episodes${queryString ? `?${queryString}` : ""}`;

    return this.client.request<Episode[]>("GET", path);
  }
}
