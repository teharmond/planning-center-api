import { PlanningCenter } from "../../client.js";
import { Group, ApiResponse } from "../../types.js";

export interface GroupsListOptions {
  per_page?: number; // default: 25, min: 1, max: 100
  offset?: number;
  where?: {
    archive_status?: "not_archived" | "only" | "include";
  };
  order?: string;
  include?: string;
  filter?: {
    group_type?: number[];
    campus?: number[];
  };
  autoPaginate?: boolean; // Override the default autoPaginate setting
}

export class GroupsListResource {
  constructor(private client: PlanningCenter) {}

  async list(options?: GroupsListOptions): Promise<ApiResponse<Group[]>> {
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

    // Handle filter parameter
    if (options?.filter) {
      if (options.filter.group_type && options.filter.group_type.length > 0) {
        params.append("filter", "group_type");
        params.append("group_type_id", options.filter.group_type.join(","));
      }

      if (options.filter.campus && options.filter.campus.length > 0) {
        params.append("filter", "campus");
        params.append("campus_id", options.filter.campus.join(","));
      }
    }

    const queryString = params.toString();
    const path = `/groups/v2/groups${queryString ? `?${queryString}` : ""}`;

    return this.client.request<Group[]>("GET", path, undefined, {
      autoPaginate: options?.autoPaginate,
    });
  }
}
