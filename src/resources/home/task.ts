import { PlanningCenter } from "../../client.js";
import {
  HomeTask,
  HomeTaskCreateAttributes,
  HomeTaskUpdateAttributes,
  ApiResponse,
} from "../../types.js";

export type HomeTaskInclude =
  | "assignee"
  | "created_by"
  | "repeating_task"
  | "task_list";

export interface HomeTaskQueryOptions {
  /** Include related resources */
  include?: HomeTaskInclude | HomeTaskInclude[];
}

/**
 * Resource for managing individual tasks in Planning Center Home.
 *
 * **Note:** The Home API only supports Personal Access Token authentication,
 * not OAuth. Make sure you're using basic auth with your personal API credentials.
 */
export class HomeTaskResource {
  constructor(private client: PlanningCenter, private taskId?: string) {}

  private buildQueryString(options?: HomeTaskQueryOptions): string {
    if (!options?.include) return "";

    const includeValue = Array.isArray(options.include)
      ? options.include.join(",")
      : options.include;

    return `?include=${includeValue}`;
  }

  /**
   * Get a task by ID.
   *
   * @param options - Query options for including related resources
   * @returns The task data
   *
   * @example
   * ```typescript
   * const { data } = await pc.home.task("123").get();
   * console.log(data.attributes.title);
   *
   * // With includes
   * const { data, included } = await pc.home.task("123").get({
   *   include: ["task_list", "created_by"],
   * });
   * ```
   */
  async get(options?: HomeTaskQueryOptions): Promise<ApiResponse<HomeTask>> {
    if (!this.taskId) {
      throw new Error("Task ID is required for get operation");
    }

    return this.client.request<HomeTask>(
      "GET",
      `/home/v2/me/tasks/${this.taskId}${this.buildQueryString(options)}`
    );
  }

  /**
   * Create a new task.
   *
   * @param attributes - The task attributes
   * @returns The created task
   *
   * @example
   * ```typescript
   * const { data } = await pc.home.task().create({
   *   title: "Follow up with team",
   *   description: "<div>Discuss project timeline</div>",
   *   due_at: "2025-01-15",
   *   task_list_id: "123456",
   * });
   * ```
   */
  async create(
    attributes: HomeTaskCreateAttributes
  ): Promise<ApiResponse<HomeTask>> {
    const body = {
      data: {
        type: "Task",
        attributes,
      },
    };

    return this.client.request<HomeTask>("POST", "/home/v2/me/tasks", body);
  }

  /**
   * Update a task.
   *
   * @param attributes - The attributes to update
   * @returns The updated task
   *
   * @example
   * ```typescript
   * // Update title and mark as complete
   * const { data } = await pc.home.task("123").update({
   *   title: "Updated task title",
   *   status: "complete",
   * });
   *
   * // Change due date
   * await pc.home.task("123").update({
   *   due_at: "2025-02-01",
   * });
   * ```
   */
  async update(
    attributes: HomeTaskUpdateAttributes
  ): Promise<ApiResponse<HomeTask>> {
    if (!this.taskId) {
      throw new Error("Task ID is required for update operation");
    }

    const body = {
      data: {
        type: "Task",
        id: this.taskId,
        attributes,
      },
    };

    return this.client.request<HomeTask>(
      "PATCH",
      `/home/v2/me/tasks/${this.taskId}`,
      body
    );
  }

  /**
   * Delete a task.
   *
   * @returns void
   *
   * @example
   * ```typescript
   * await pc.home.task("123").delete();
   * ```
   */
  async delete(): Promise<ApiResponse<void>> {
    if (!this.taskId) {
      throw new Error("Task ID is required for delete operation");
    }

    return this.client.request<void>(
      "DELETE",
      `/home/v2/me/tasks/${this.taskId}`
    );
  }
}
