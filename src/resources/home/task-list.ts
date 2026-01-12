import { PlanningCenter } from "../../client.js";
import {
  HomeTaskList,
  HomeTaskListCreateAttributes,
  HomeTaskListUpdateAttributes,
  HomeTask,
  HomeCollaborator,
  ApiResponse,
} from "../../types.js";

export type HomeTaskListInclude = "collaborators" | "created_by";

export interface HomeTaskListQueryOptions {
  /** Include related resources */
  include?: HomeTaskListInclude | HomeTaskListInclude[];
}

// Task list scoped task options
export type HomeTaskListTasksFilter =
  | "incomplete"
  | "complete"
  | "incomplete_or_completed_today"
  | "completed_today"
  | "completed_this_week"
  | "incomplete_or_completed_last_7_days"
  | "completed_last_7_days"
  | "due_today"
  | "due_this_week"
  | "upcoming"
  | "incomplete_or_completed";

export type HomeTaskListTasksInclude =
  | "assignee"
  | "created_by"
  | "repeating_task"
  | "task_list";

export type HomeTaskListTasksOrder =
  | "title"
  | "-title"
  | "position"
  | "-position"
  | "due_at"
  | "-due_at";

export interface HomeTaskListTasksWhereOptions {
  /** Query by task title */
  search_title?: string;
  /** Allow additional where parameters */
  [key: string]: string | undefined;
}

export interface HomeTaskListTasksOptions {
  /** Number of results per page (default: 25, min: 1, max: 100) */
  per_page?: number;
  /** Offset for pagination */
  offset?: number;
  /** Where conditions for filtering */
  where?: HomeTaskListTasksWhereOptions;
  /** Order results by field (prefix with - for descending) */
  order?: HomeTaskListTasksOrder | string;
  /** Include related resources */
  include?: HomeTaskListTasksInclude | HomeTaskListTasksInclude[] | string;
  /** Filter by predefined filter */
  filter?: HomeTaskListTasksFilter | HomeTaskListTasksFilter[] | string;
  /** Override the default autoPaginate setting */
  autoPaginate?: boolean;
}

/**
 * Resource for managing task lists in Planning Center Home.
 */
export class HomeTaskListResource {
  constructor(private client: PlanningCenter, private taskListId?: string) {}

  private buildQueryString(options?: HomeTaskListQueryOptions): string {
    if (!options?.include) return "";

    const includeValue = Array.isArray(options.include)
      ? options.include.join(",")
      : options.include;

    return `?include=${includeValue}`;
  }

  /**
   * Get a task list by ID.
   */
  async get(
    options?: HomeTaskListQueryOptions
  ): Promise<ApiResponse<HomeTaskList>> {
    if (!this.taskListId) {
      throw new Error("Task list ID is required for get operation");
    }

    return this.client.request<HomeTaskList>(
      "GET",
      `/home/v2/me/task_lists/${this.taskListId}${this.buildQueryString(options)}`
    );
  }

  /**
   * Create a new task list.
   */
  async create(
    attributes: HomeTaskListCreateAttributes
  ): Promise<ApiResponse<HomeTaskList>> {
    const body = {
      data: {
        type: "TaskList",
        attributes,
      },
    };

    return this.client.request<HomeTaskList>(
      "POST",
      "/home/v2/me/task_lists",
      body
    );
  }

  /**
   * Update a task list.
   */
  async update(
    attributes: HomeTaskListUpdateAttributes
  ): Promise<ApiResponse<HomeTaskList>> {
    if (!this.taskListId) {
      throw new Error("Task list ID is required for update operation");
    }

    const body = {
      data: {
        type: "TaskList",
        id: this.taskListId,
        attributes,
      },
    };

    return this.client.request<HomeTaskList>(
      "PATCH",
      `/home/v2/me/task_lists/${this.taskListId}`,
      body
    );
  }

  /**
   * Delete a task list.
   */
  async delete(): Promise<ApiResponse<void>> {
    if (!this.taskListId) {
      throw new Error("Task list ID is required for delete operation");
    }

    return this.client.request<void>(
      "DELETE",
      `/home/v2/me/task_lists/${this.taskListId}`
    );
  }

  /**
   * List tasks in this task list.
   */
  async listTasks(
    options?: HomeTaskListTasksOptions
  ): Promise<ApiResponse<HomeTask[]>> {
    if (!this.taskListId) {
      throw new Error("Task list ID is required for listTasks operation");
    }

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
    const path = `/home/v2/me/task_lists/${this.taskListId}/tasks${queryString ? `?${queryString}` : ""}`;

    return this.client.request<HomeTask[]>("GET", path, undefined, {
      autoPaginate: options?.autoPaginate,
    });
  }

  /**
   * List collaborators for this task list.
   */
  async listCollaborators(options?: {
    per_page?: number;
    offset?: number;
    autoPaginate?: boolean;
  }): Promise<ApiResponse<HomeCollaborator[]>> {
    if (!this.taskListId) {
      throw new Error("Task list ID is required for listCollaborators operation");
    }

    const params = new URLSearchParams();

    const perPage = options?.per_page ?? 25;
    if (perPage < 1 || perPage > 100) {
      throw new Error("per_page must be between 1 and 100");
    }
    params.append("per_page", perPage.toString());

    if (options?.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }

    const queryString = params.toString();
    const path = `/home/v2/me/task_lists/${this.taskListId}/collaborators${queryString ? `?${queryString}` : ""}`;

    return this.client.request<HomeCollaborator[]>("GET", path, undefined, {
      autoPaginate: options?.autoPaginate,
    });
  }
}
