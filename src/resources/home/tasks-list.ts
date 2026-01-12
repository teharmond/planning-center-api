import { PlanningCenter } from "../../client.js";
import { HomeTask, ApiResponse } from "../../types.js";

export interface HomeTasksListWhereOptions {
  /** Query by task title */
  search_title?: string;
  /** Allow additional where parameters */
  [key: string]: string | undefined;
}

export type HomeTasksListFilter =
  | "incomplete"
  | "complete"
  | "incomplete_or_completed_today"
  | "incomplete_or_completed_last_7_days"
  | "due_today"
  | "upcoming";

export type HomeTasksListInclude =
  | "assignee"
  | "created_by"
  | "repeating_task"
  | "task_list";

export type HomeTasksListOrder = "title" | "-title" | "position" | "-position" | "due_at" | "-due_at";

export interface HomeTasksListOptions {
  /** Number of results per page (default: 25, min: 1, max: 100) */
  per_page?: number;
  /** Offset for pagination */
  offset?: number;
  /** Where conditions for filtering */
  where?: HomeTasksListWhereOptions;
  /** Order results by field (prefix with - for descending) */
  order?: HomeTasksListOrder | string;
  /** Include related resources (comma-separated or array) */
  include?: HomeTasksListInclude | HomeTasksListInclude[] | string;
  /** Filter by predefined filter */
  filter?: HomeTasksListFilter | HomeTasksListFilter[] | string;
  /** Override the default autoPaginate setting */
  autoPaginate?: boolean;
}

export class HomeTasksListResource {
  constructor(private client: PlanningCenter) {}

  /**
   * List tasks for the current user.
   *
   * **Note:** The Home API only supports Personal Access Token authentication,
   * not OAuth. Make sure you're using basic auth with your personal API credentials.
   *
   * @param options - Options for filtering, sorting, and pagination
   * @returns A list of tasks for the authenticated user
   */
  async list(options?: HomeTasksListOptions): Promise<ApiResponse<HomeTask[]>> {
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
    const path = `/home/v2/me/tasks${queryString ? `?${queryString}` : ""}`;

    return this.client.request<HomeTask[]>("GET", path, undefined, {
      autoPaginate: options?.autoPaginate,
    });
  }
}
