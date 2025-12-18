import { PlanningCenter } from "../../client.js";
import {
  Note,
  NoteCreateAttributes,
  NoteUpdateAttributes,
  NoteCategory,
  Person,
  ApiResponse,
} from "../../types.js";

export type NoteInclude = "category" | "created_by" | "person";

export interface NoteListWhereOptions {
  /** Query on a specific note */
  note?: string;
  /** Query on a specific note_category_id */
  note_category_id?: string;
}

export interface NoteListOptions {
  /** Number of records per page (default: 25, min: 1, max: 100) */
  per_page?: number;
  /** Number of records to skip for pagination */
  offset?: number;
  /** Filter conditions */
  where?: NoteListWhereOptions;
  /** Sort order (e.g., 'created_at', '-display_date', 'note') */
  order?:
    | "created_at"
    | "-created_at"
    | "display_date"
    | "-display_date"
    | "id"
    | "-id"
    | "note"
    | "-note"
    | "note_category_id"
    | "-note_category_id"
    | "updated_at"
    | "-updated_at";
  /** Related resources to include */
  include?: NoteInclude | NoteInclude[];
}

export class NoteResource {
  constructor(
    private client: PlanningCenter,
    private personId?: string,
    private noteId?: string
  ) {}

  private buildQueryString(options?: NoteListOptions): string {
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
   * List all notes for a person
   */
  async list(options?: NoteListOptions): Promise<ApiResponse<Note[]>> {
    if (!this.personId) {
      throw new Error("Person ID is required for listing notes");
    }

    const path = `/people/v2/people/${this.personId}/notes${this.buildQueryString(options)}`;
    return this.client.request<Note[]>("GET", path);
  }

  /**
   * Get a single note by ID
   */
  async get(options?: {
    include?: NoteInclude | NoteInclude[];
  }): Promise<ApiResponse<Note>> {
    if (!this.noteId) {
      throw new Error("Note ID is required for get operation");
    }

    let queryString = "";
    if (options?.include) {
      const includes = Array.isArray(options.include)
        ? options.include.join(",")
        : options.include;
      queryString = `?include=${includes}`;
    }

    return this.client.request<Note>(
      "GET",
      `/people/v2/notes/${this.noteId}${queryString}`
    );
  }

  /**
   * Create a new note for a person
   */
  async create(attributes: NoteCreateAttributes): Promise<ApiResponse<Note>> {
    if (!this.personId) {
      throw new Error("Person ID is required for creating notes");
    }

    const body = {
      data: {
        type: "Note",
        attributes,
      },
    };

    return this.client.request<Note>(
      "POST",
      `/people/v2/people/${this.personId}/notes`,
      body
    );
  }

  /**
   * Update an existing note
   */
  async update(attributes: NoteUpdateAttributes): Promise<ApiResponse<Note>> {
    if (!this.noteId) {
      throw new Error("Note ID is required for update operation");
    }

    const body = {
      data: {
        type: "Note",
        id: this.noteId,
        attributes,
      },
    };

    return this.client.request<Note>(
      "PATCH",
      `/people/v2/notes/${this.noteId}`,
      body
    );
  }

  /**
   * Delete a note
   */
  async delete(): Promise<ApiResponse<void>> {
    if (!this.noteId) {
      throw new Error("Note ID is required for delete operation");
    }

    return this.client.request<void>(
      "DELETE",
      `/people/v2/notes/${this.noteId}`
    );
  }

  /**
   * Get the category for this note
   */
  async getCategory(): Promise<ApiResponse<NoteCategory>> {
    if (!this.noteId) {
      throw new Error("Note ID is required for getting category");
    }

    return this.client.request<NoteCategory>(
      "GET",
      `/people/v2/notes/${this.noteId}/category`
    );
  }

  /**
   * Get the person who created this note
   */
  async getCreatedBy(): Promise<ApiResponse<Person>> {
    if (!this.noteId) {
      throw new Error("Note ID is required for getting created_by");
    }

    return this.client.request<Person>(
      "GET",
      `/people/v2/notes/${this.noteId}/created_by`
    );
  }

  /**
   * Get the person this note belongs to
   */
  async getPerson(): Promise<ApiResponse<Person>> {
    if (!this.noteId) {
      throw new Error("Note ID is required for getting person");
    }

    return this.client.request<Person>(
      "GET",
      `/people/v2/notes/${this.noteId}/person`
    );
  }
}

/**
 * Resource for listing all notes across the organization
 */
export class NotesListResource {
  constructor(private client: PlanningCenter) {}

  private buildQueryString(options?: NoteListOptions): string {
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
   * List all notes across the organization
   */
  async list(options?: NoteListOptions): Promise<ApiResponse<Note[]>> {
    const path = `/people/v2/notes${this.buildQueryString(options)}`;
    return this.client.request<Note[]>("GET", path);
  }

  /**
   * Get a specific note by ID
   */
  note(noteId: string): NoteResource {
    return new NoteResource(this.client, undefined, noteId);
  }
}
