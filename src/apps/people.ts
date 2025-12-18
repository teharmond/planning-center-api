import { PlanningCenter } from "../client.js";
import { PersonResource } from "../resources/people/person.js";
import { PeopleListResource, PeopleListOptions } from "../resources/people/people-list.js";
import { WorkflowResource } from "../resources/people/workflow.js";
import { MessageTemplateResource } from "../resources/people/message-template.js";
import { NotesListResource, NoteResource, NoteListOptions } from "../resources/people/note.js";
import { NoteCategoryResource, NoteCategoryListOptions } from "../resources/people/note-category.js";
import { ApiResponse, Person, Note, NoteCategory } from "../types.js";

export class PeopleApp {
  constructor(private client: PlanningCenter) {}

  person(id?: string): PersonResource {
    return new PersonResource(this.client, id);
  }

  workflow(id?: string): WorkflowResource {
    return new WorkflowResource(this.client, id);
  }

  async list(options?: PeopleListOptions): Promise<ApiResponse<Person[]>> {
    const listResource = new PeopleListResource(this.client);
    return listResource.list(options);
  }

  messageTemplates(): MessageTemplateResource {
    return new MessageTemplateResource(this.client);
  }

  /**
   * Access notes resource for listing all notes or getting a specific note
   */
  notes(): NotesListResource {
    return new NotesListResource(this.client);
  }

  /**
   * Get a specific note by ID
   */
  note(id: string): NoteResource {
    return new NoteResource(this.client, undefined, id);
  }

  /**
   * List all notes with optional filtering
   */
  async listNotes(options?: NoteListOptions): Promise<ApiResponse<Note[]>> {
    const notesResource = new NotesListResource(this.client);
    return notesResource.list(options);
  }

  /**
   * Access note categories resource
   */
  noteCategory(id?: string): NoteCategoryResource {
    return new NoteCategoryResource(this.client, id);
  }

  /**
   * List all note categories with optional filtering
   */
  async listNoteCategories(
    options?: NoteCategoryListOptions
  ): Promise<ApiResponse<NoteCategory[]>> {
    const categoryResource = new NoteCategoryResource(this.client);
    return categoryResource.list(options);
  }
}
