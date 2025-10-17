import { PlanningCenter } from "../../client.js";
import { RegistrationsCampus, ApiResponse } from "../../types.js";

export interface RegistrationsCampusesListOptions {
  per_page?: number; // default: 25, min: 1, max: 100
  offset?: number;
  order?: string;
  include?: string;
}

export class RegistrationsCampusesListResource {
  constructor(private client: PlanningCenter) {}

  async list(options?: RegistrationsCampusesListOptions): Promise<ApiResponse<RegistrationsCampus[]>> {
    const params = new URLSearchParams();

    const perPage = options?.per_page ?? 25;
    if (perPage < 1 || perPage > 100) {
      throw new Error("per_page must be between 1 and 100");
    }
    params.append("per_page", perPage.toString());

    if (options?.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }

    if (options?.order) {
      params.append("order", options.order);
    }

    if (options?.include) {
      params.append("include", options.include);
    }

    const queryString = params.toString();
    const path = `/registrations/v2/campuses${queryString ? `?${queryString}` : ""}`;

    return this.client.request<RegistrationsCampus[]>("GET", path);
  }
}
