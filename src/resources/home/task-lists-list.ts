import { PlanningCenter } from "../../client.js";
import { HomeTaskList, ApiResponse } from "../../types.js";

export interface HomeTaskListsListWhereOptions {
  /** Query by task list ID */
  id?: string;
  /** Query by task list title */
  search_title?: string;
  /** Allow additional where parameters */
  [key: string]: string | undefined;
}

export type HomeTaskListsListFilter = "archived" | "standard";

export type HomeTaskListsListInclude = "collaborators" | "created_by";

export type HomeTaskListsListOrder =
  | "position"
  | "-position"
  | "archived_at"
  | "-archived_at"
  | "updated_at"
  | "-updated_at";

export interface HomeTaskListsListOptions {
  /** Number of results per page (default: 25, min: 1, max: 100) */
  per_page?: number;
  /** Offset for pagination */
  offset?: number;
  /** Where conditions for filtering */
  where?: HomeTaskListsListWhereOptions;
  /** Order results by field (prefix with - for descending) */
  order?: HomeTaskListsListOrder | string;
  /** Include related resources (comma-separated or array) */
  include?: HomeTaskListsListInclude | HomeTaskListsListInclude[] | string;
  /** Filter by predefined filter */
  filter?: HomeTaskListsListFilter | HomeTaskListsListFilter[] | string;
  /** Override the default autoPaginate setting */
  autoPaginate?: boolean;
}

export class HomeTaskListsListResource {
  constructor(private client: PlanningCenter) {}

  /**
   * List task lists for the current user.
   *
   * @param options - Options for filtering, sorting, and pagination
   * @returns A list of task lists for the authenticated user
   */
  async list(
    options?: HomeTaskListsListOptions
  ): Promise<ApiResponse<HomeTaskList[]>> {
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
        if (value !== undefined) {
          params.append(`where[${key}]`, String(value));
        }
      });
    }

    if (options?.order) {
      params.append("order", options.order);
    }

    if (options?.include) {
      const includeValue = Array.isArray(options.include)
        ? options.include.join(",")
        : options.include;
      params.append("include", includeValue);
    }

    if (options?.filter) {
      const filterValue = Array.isArray(options.filter)
        ? options.filter.join(",")
        : options.filter;
      params.append("filter", filterValue);
    }

    const queryString = params.toString();
    const path = `/home/v2/me/task_lists${queryString ? `?${queryString}` : ""}`;

    return this.client.request<HomeTaskList[]>("GET", path, undefined, {
      autoPaginate: options?.autoPaginate,
    });
  }
}
