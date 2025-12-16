import { PlanningCenter } from "../../client.js";
import { Person, ApiResponse } from "../../types.js";

export interface PeopleListWhereOptions {
  /** Query on a specific search_name */
  search_name?: string;
  /** Query on a specific search_name_or_email */
  search_name_or_email?: string;
  /** Query on a specific search_name_or_email_or_phone_number */
  search_name_or_email_or_phone_number?: string;
  /** Query on a specific search_phone_number */
  search_phone_number?: string;
  /** Query on a specific first_name */
  first_name?: string;
  /** Query on a specific last_name */
  last_name?: string;
  /** Query on a specific middle_name */
  middle_name?: string;
  /** Query on a specific nickname */
  nickname?: string;
  /** Query on a specific given_name */
  given_name?: string;
  /** Query on a specific gender */
  gender?: string;
  /** Query on a specific birthdate */
  birthdate?: string;
  /** Query on a specific anniversary */
  anniversary?: string;
  /** Query on a specific membership */
  membership?: string;
  /** Query on a specific status */
  status?: string;
  /** Query on a specific remote_id */
  remote_id?: string;
  /** Query on a specific id */
  id?: string;
  /** Query on a specific created_at */
  created_at?: string;
  /** Query on a specific updated_at */
  updated_at?: string;
  /** Allow additional where parameters */
  [key: string]: string | undefined;
}

export interface PeopleListOptions {
  per_page?: number; // default: 100, min: 1, max: 100
  offset?: number;
  where?: PeopleListWhereOptions;
  order?: string;
  include?: string;
  filter?: "created_since" | "admins" | "organization_admins" | string;
  autoPaginate?: boolean; // Override the default autoPaginate setting
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

    return this.client.request<Person[]>("GET", path, undefined, {
      autoPaginate: options?.autoPaginate,
    });
  }
}
