import { PlanningCenter } from "../client.js";
import {
  HomeTasksListResource,
  HomeTasksListOptions,
} from "../resources/home/tasks-list.js";
import { HomeTaskResource } from "../resources/home/task.js";
import {
  HomeTaskListsListResource,
  HomeTaskListsListOptions,
} from "../resources/home/task-lists-list.js";
import { HomeTaskListResource } from "../resources/home/task-list.js";
import { ApiResponse, HomeTask, HomeTaskList } from "../types.js";

/**
 * Planning Center Home API
 *
 * **Important:** The Home API only supports Personal Access Token (basic) authentication,
 * not OAuth. Make sure you're using basic auth with your personal API credentials.
 *
 * @example
 * ```typescript
 * const pc = new PlanningCenter({
 *   auth: {
 *     type: "basic",
 *     clientId: "your-app-id",
 *     clientSecret: "your-secret",
 *   },
 * });
 *
 * // List all incomplete tasks
 * const tasks = await pc.home.listTasks({
 *   filter: "incomplete",
 *   include: ["assignee", "task_list"],
 * });
 *
 * // Get a single task
 * const task = await pc.home.task("123").get();
 *
 * // Create a task
 * const newTask = await pc.home.task().create({
 *   title: "New task",
 *   due_at: "2025-01-15",
 * });
 *
 * // Update a task
 * await pc.home.task("123").update({ status: "complete" });
 *
 * // Delete a task
 * await pc.home.task("123").delete();
 *
 * // List task lists
 * const taskLists = await pc.home.listTaskLists();
 *
 * // Get tasks in a specific task list
 * const tasks = await pc.home.taskList("456").listTasks();
 *
 * // Get collaborators for a task list
 * const collaborators = await pc.home.taskList("456").listCollaborators();
 * ```
 */
export class HomeApp {
  constructor(private client: PlanningCenter) {}

  /**
   * List tasks for the current user.
   *
   * @param options - Options for filtering, sorting, and pagination
   * @returns A list of tasks for the authenticated user
   *
   * @example
   * ```typescript
   * // Get incomplete tasks
   * const tasks = await pc.home.listTasks({
   *   filter: "incomplete",
   * });
   *
   * // Search for tasks by title
   * const tasks = await pc.home.listTasks({
   *   where: { search_title: "meeting" },
   * });
   *
   * // Get tasks due today with related data
   * const tasks = await pc.home.listTasks({
   *   filter: "due_today",
   *   include: ["assignee", "task_list"],
   *   order: "due_at",
   * });
   * ```
   */
  async listTasks(
    options?: HomeTasksListOptions
  ): Promise<ApiResponse<HomeTask[]>> {
    const listResource = new HomeTasksListResource(this.client);
    return listResource.list(options);
  }

  /**
   * Access a task resource for CRUD operations.
   *
   * @param id - The task ID (optional for create operations)
   * @returns A HomeTaskResource for the specified task
   *
   * @example
   * ```typescript
   * // Get a task
   * const { data } = await pc.home.task("123").get();
   *
   * // Get a task with includes
   * const { data, included } = await pc.home.task("123").get({
   *   include: ["task_list", "created_by"],
   * });
   *
   * // Create a task
   * const { data } = await pc.home.task().create({
   *   title: "New task",
   *   description: "<div>Task details</div>",
   *   due_at: "2025-01-15",
   *   task_list_id: "456",
   * });
   *
   * // Update a task
   * await pc.home.task("123").update({
   *   title: "Updated title",
   *   status: "complete",
   * });
   *
   * // Delete a task
   * await pc.home.task("123").delete();
   * ```
   */
  task(id?: string): HomeTaskResource {
    return new HomeTaskResource(this.client, id);
  }

  /**
   * List task lists for the current user.
   *
   * @param options - Options for filtering, sorting, and pagination
   * @returns A list of task lists for the authenticated user
   *
   * @example
   * ```typescript
   * // Get all task lists
   * const { data } = await pc.home.listTaskLists();
   *
   * // Get standard (non-archived) task lists
   * const { data } = await pc.home.listTaskLists({
   *   filter: "standard",
   * });
   *
   * // Search for task lists by title
   * const { data } = await pc.home.listTaskLists({
   *   where: { search_title: "Project" },
   * });
   *
   * // Get task lists with collaborators
   * const { data, included } = await pc.home.listTaskLists({
   *   include: ["collaborators", "created_by"],
   * });
   * ```
   */
  async listTaskLists(
    options?: HomeTaskListsListOptions
  ): Promise<ApiResponse<HomeTaskList[]>> {
    const listResource = new HomeTaskListsListResource(this.client);
    return listResource.list(options);
  }

  /**
   * Access a task list resource for CRUD operations.
   *
   * @param id - The task list ID (optional for create operations)
   * @returns A HomeTaskListResource for the specified task list
   *
   * @example
   * ```typescript
   * // Get a task list
   * const { data } = await pc.home.taskList("456").get();
   *
   * // Get a task list with includes
   * const { data, included } = await pc.home.taskList("456").get({
   *   include: ["collaborators", "created_by"],
   * });
   *
   * // Create a task list
   * const { data } = await pc.home.taskList().create({
   *   title: "New Project",
   *   color_name: "blue-base",
   * });
   *
   * // Update a task list
   * await pc.home.taskList("456").update({
   *   title: "Updated Project Name",
   * });
   *
   * // Delete a task list
   * await pc.home.taskList("456").delete();
   *
   * // List tasks in a task list
   * const { data } = await pc.home.taskList("456").listTasks({
   *   filter: "incomplete",
   * });
   *
   * // List collaborators for a task list
   * const { data } = await pc.home.taskList("456").listCollaborators();
   * ```
   */
  taskList(id?: string): HomeTaskListResource {
    return new HomeTaskListResource(this.client, id);
  }
}
