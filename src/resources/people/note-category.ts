import { PlanningCenter } from "../../client.js";
import {
  NoteCategory,
  NoteCategoryCreateAttributes,
  NoteCategoryUpdateAttributes,
  Person,
  ApiResponse,
} from "../../types.js";

export type NoteCategoryInclude = "shares" | "subscribers" | "subscriptions";

export interface NoteCategoryListWhereOptions {
  /** Query on a specific created_at */
  created_at?: string;
  /** Query on a specific locked */
  locked?: string;
  /** Query on a specific name */
  name?: string;
  /** Query on a specific organization_id */
  organization_id?: string;
  /** Query on a specific updated_at */
  updated_at?: string;
}

export interface NoteCategoryListOptions {
  /** Number of records per page (default: 25, min: 1, max: 100) */
  per_page?: number;
  /** Number of records to skip for pagination */
  offset?: number;
  /** Filter conditions */
  where?: NoteCategoryListWhereOptions;
  /** Sort order (e.g., 'name', '-created_at') */
  order?:
    | "created_at"
    | "-created_at"
    | "locked"
    | "-locked"
    | "name"
    | "-name"
    | "organization_id"
    | "-organization_id"
    | "updated_at"
    | "-updated_at";
  /** Related resources to include */
  include?: NoteCategoryInclude | NoteCategoryInclude[];
}

export interface NoteCategoryShare {
  id: string;
  type: "NoteCategoryShare";
  attributes: {
    group?: string;
    permission?: string;
    person_id?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface NoteCategorySubscription {
  id: string;
  type: "NoteCategorySubscription";
  attributes: {
    created_at?: string;
    updated_at?: string;
  };
}

export class NoteCategoryResource {
  constructor(
    private client: PlanningCenter,
    private categoryId?: string
  ) {}

  private buildQueryString(options?: NoteCategoryListOptions): string {
    if (!options) return "";

    const params = new URLSearchParams();

    if (options.per_page !== undefined) {
      params.append("per_page", options.per_page.toString());
    }

    if (options.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }

    if (options.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(`where[${key}]`, value);
        }
      });
    }

    if (options.order) {
      params.append("order", options.order);
    }

    if (options.include) {
      const includes = Array.isArray(options.include)
        ? options.include.join(",")
        : options.include;
      params.append("include", includes);
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  }

  /**
   * List all note categories
   */
  async list(
    options?: NoteCategoryListOptions
  ): Promise<ApiResponse<NoteCategory[]>> {
    const path = `/people/v2/note_categories${this.buildQueryString(options)}`;
    return this.client.request<NoteCategory[]>("GET", path);
  }

  /**
   * Get a single note category by ID
   */
  async get(options?: {
    include?: NoteCategoryInclude | NoteCategoryInclude[];
  }): Promise<ApiResponse<NoteCategory>> {
    if (!this.categoryId) {
      throw new Error("Note Category ID is required for get operation");
    }

    let queryString = "";
    if (options?.include) {
      const includes = Array.isArray(options.include)
        ? options.include.join(",")
        : options.include;
      queryString = `?include=${includes}`;
    }

    return this.client.request<NoteCategory>(
      "GET",
      `/people/v2/note_categories/${this.categoryId}${queryString}`
    );
  }

  /**
   * Create a new note category
   */
  async create(
    attributes: NoteCategoryCreateAttributes
  ): Promise<ApiResponse<NoteCategory>> {
    const body = {
      data: {
        type: "NoteCategory",
        attributes,
      },
    };

    return this.client.request<NoteCategory>(
      "POST",
      "/people/v2/note_categories",
      body
    );
  }

  /**
   * Update an existing note category
   */
  async update(
    attributes: NoteCategoryUpdateAttributes
  ): Promise<ApiResponse<NoteCategory>> {
    if (!this.categoryId) {
      throw new Error("Note Category ID is required for update operation");
    }

    const body = {
      data: {
        type: "NoteCategory",
        id: this.categoryId,
        attributes,
      },
    };

    return this.client.request<NoteCategory>(
      "PATCH",
      `/people/v2/note_categories/${this.categoryId}`,
      body
    );
  }

  /**
   * Delete a note category
   * Note: Deleting a note category will also delete all associated notes
   */
  async delete(): Promise<ApiResponse<void>> {
    if (!this.categoryId) {
      throw new Error("Note Category ID is required for delete operation");
    }

    return this.client.request<void>(
      "DELETE",
      `/people/v2/note_categories/${this.categoryId}`
    );
  }

  /**
   * List shares for this note category
   */
  async listShares(): Promise<ApiResponse<NoteCategoryShare[]>> {
    if (!this.categoryId) {
      throw new Error("Note Category ID is required for listing shares");
    }

    return this.client.request<NoteCategoryShare[]>(
      "GET",
      `/people/v2/note_categories/${this.categoryId}/shares`
    );
  }

  /**
   * List subscribers for this note category
   */
  async listSubscribers(): Promise<ApiResponse<Person[]>> {
    if (!this.categoryId) {
      throw new Error("Note Category ID is required for listing subscribers");
    }

    return this.client.request<Person[]>(
      "GET",
      `/people/v2/note_categories/${this.categoryId}/subscribers`
    );
  }

  /**
   * List subscriptions for this note category
   */
  async listSubscriptions(): Promise<ApiResponse<NoteCategorySubscription[]>> {
    if (!this.categoryId) {
      throw new Error(
        "Note Category ID is required for listing subscriptions"
      );
    }

    return this.client.request<NoteCategorySubscription[]>(
      "GET",
      `/people/v2/note_categories/${this.categoryId}/subscriptions`
    );
  }
}
