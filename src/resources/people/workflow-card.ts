import { PlanningCenter } from "../../client.js";
import { ApiResponse, Person } from "../../types.js";

export interface WorkflowCard {
  type: "WorkflowCard";
  id: string;
  attributes: {
    snooze_until?: string | null;
    overdue?: boolean;
    stage?: string;
    calculated_due_at_in_days_ago?: number | null;
    sticky_assignment?: boolean | null;
    created_at?: string;
    updated_at?: string;
    completed_at?: string | null;
    flagged_for_notification_at?: string | null;
    removed_at?: string | null;
    moved_to_step_at?: string;
  };
  relationships?: {
    assignee?: { data: { type: string; id: string } };
    person?: { data: { type: string; id: string } };
    workflow?: { data: { type: string; id: string } };
    current_step?: { data: { type: string; id: string } };
  };
  links?: {
    self?: string;
    html?: string;
  };
}

export interface WorkflowCardUpdateAttributes {
  sticky_assignment?: boolean;
  assignee_id?: string;
  person_id?: string;
}

export interface WorkflowCardActivity {
  type: "WorkflowCardActivity";
  id: string;
  attributes: {
    comment?: string;
    content?: string;
    form_submission_url?: string;
    automation_url?: string;
    person_avatar_url?: string;
    person_name?: string;
    reassigned_to_avatar_url?: string;
    reassigned_to_name?: string;
    subject?: string;
    type?: string;
    content_is_html?: boolean;
    created_at?: string;
  };
  relationships?: {
    workflow_card?: { data: { type: string; id: string } };
    workflow_step?: { data: { type: string; id: string } | null };
  };
}

export interface WorkflowStep {
  type: "WorkflowStep";
  id: string;
  attributes: {
    name?: string;
    sequence?: number;
    description?: string;
    expected_response_time_in_days?: number | null;
    default_assignee_id?: string | null;
    created_at?: string;
    updated_at?: string;
  };
}

export interface WorkflowCardNote {
  type: "WorkflowCardNote";
  id: string;
  attributes: {
    note?: string;
    created_at?: string;
  };
  relationships?: {
    note_category?: { data: { type: string; id: string } | null };
  };
}

export interface WorkflowCardNoteCreateAttributes {
  note: string;
}

export interface WorkflowCardListWhereOptions {
  /** Query on a related assignee */
  assignee_id?: string;
  /** Query on a specific overdue status */
  overdue?: string;
  /** Query on a specific stage */
  stage?: string;
  /** Query on a specific created_at */
  created_at?: string;
  /** Query on a specific updated_at */
  updated_at?: string;
  /** Allow additional where parameters */
  [key: string]: string | undefined;
}

export interface WorkflowCardListOptions {
  /** Number of records per page (default: 25, min: 1, max: 100) */
  per_page?: number;
  /** Number of records to skip for pagination */
  offset?: number;
  /** Filter conditions */
  where?: WorkflowCardListWhereOptions;
  /** Sort order (e.g., 'created_at', '-updated_at', 'stage') */
  order?: string;
  /** Comma-separated string of related resources to include */
  include?: string;
}

export interface Workflow {
  type: "Workflow";
  id: string;
  attributes: {
    name?: string;
    [key: string]: any;
  };
}

export class WorkflowCardResource {
  constructor(
    private client: PlanningCenter,
    private personId: string
  ) {}

  async list(options?: WorkflowCardListOptions): Promise<ApiResponse<WorkflowCard[]>> {
    const params = new URLSearchParams();

    if (options?.per_page !== undefined) {
      params.append("per_page", options.per_page.toString());
    }

    if (options?.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }

    if (options?.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(`where[${key}]`, value);
        }
      });
    }

    if (options?.order) {
      params.append("order", options.order);
    }

    if (options?.include) {
      params.append("include", options.include);
    }

    const queryString = params.toString();
    const path = `/people/v2/people/${this.personId}/workflow_cards${queryString ? `?${queryString}` : ""}`;

    return this.client.request<WorkflowCard[]>("GET", path);
  }

  async get(workflowCardId: string): Promise<ApiResponse<WorkflowCard>> {
    return this.client.request<WorkflowCard>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}`
    );
  }

  async update(
    workflowCardId: string,
    attributes: WorkflowCardUpdateAttributes
  ): Promise<ApiResponse<WorkflowCard>> {
    const body = {
      data: {
        type: "WorkflowCard",
        id: workflowCardId,
        attributes,
      },
    };

    return this.client.request<WorkflowCard>(
      "PATCH",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}`,
      body
    );
  }

  async delete(workflowCardId: string): Promise<ApiResponse<void>> {
    return this.client.request<void>(
      "DELETE",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}`
    );
  }

  async goBack(workflowCardId: string): Promise<ApiResponse<WorkflowCard>> {
    return this.client.request<WorkflowCard>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/go_back`
    );
  }

  async promote(workflowCardId: string): Promise<ApiResponse<WorkflowCard>> {
    return this.client.request<WorkflowCard>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/promote`
    );
  }

  async remove(workflowCardId: string): Promise<ApiResponse<WorkflowCard>> {
    return this.client.request<WorkflowCard>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/remove`
    );
  }

  async restore(workflowCardId: string): Promise<ApiResponse<WorkflowCard>> {
    return this.client.request<WorkflowCard>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/restore`
    );
  }

  async sendEmail(
    workflowCardId: string,
    subject: string,
    note: string
  ): Promise<ApiResponse<void>> {
    const body = {
      data: {
        attributes: {
          subject,
          note,
        },
      },
    };

    return this.client.request<void>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/send_email`,
      body
    );
  }

  async skipStep(workflowCardId: string): Promise<ApiResponse<WorkflowCard>> {
    return this.client.request<WorkflowCard>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/skip_step`
    );
  }

  async snooze(
    workflowCardId: string,
    duration: number
  ): Promise<ApiResponse<WorkflowCard>> {
    const body = {
      data: {
        attributes: {
          duration,
        },
      },
    };

    return this.client.request<WorkflowCard>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/snooze`,
      body
    );
  }

  async unsnooze(workflowCardId: string): Promise<ApiResponse<WorkflowCard>> {
    return this.client.request<WorkflowCard>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/unsnooze`
    );
  }

  async listActivities(
    workflowCardId: string
  ): Promise<ApiResponse<WorkflowCardActivity[]>> {
    return this.client.request<WorkflowCardActivity[]>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/activities`
    );
  }

  async getActivity(
    workflowCardId: string,
    activityId: string
  ): Promise<ApiResponse<WorkflowCardActivity>> {
    return this.client.request<WorkflowCardActivity>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/activities/${activityId}`
    );
  }

  async deleteActivity(
    workflowCardId: string,
    activityId: string
  ): Promise<ApiResponse<void>> {
    return this.client.request<void>(
      "DELETE",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/activities/${activityId}`
    );
  }

  async getCurrentStep(
    workflowCardId: string
  ): Promise<ApiResponse<WorkflowStep>> {
    return this.client.request<WorkflowStep>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/current_step`
    );
  }

  async listNotes(
    workflowCardId: string
  ): Promise<ApiResponse<WorkflowCardNote[]>> {
    return this.client.request<WorkflowCardNote[]>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/notes`
    );
  }

  async getNote(
    workflowCardId: string,
    noteId: string
  ): Promise<ApiResponse<WorkflowCardNote>> {
    return this.client.request<WorkflowCardNote>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/notes/${noteId}`
    );
  }

  async createNote(
    workflowCardId: string,
    attributes: WorkflowCardNoteCreateAttributes
  ): Promise<ApiResponse<WorkflowCardNote>> {
    const body = {
      data: {
        type: "WorkflowCardNote",
        attributes,
      },
    };

    return this.client.request<WorkflowCardNote>(
      "POST",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/notes`,
      body
    );
  }

  async getPerson(workflowCardId: string): Promise<ApiResponse<Person>> {
    return this.client.request<Person>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/person`
    );
  }

  async getWorkflow(workflowCardId: string): Promise<ApiResponse<Workflow>> {
    return this.client.request<Workflow>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${workflowCardId}/workflow`
    );
  }

  assignee(workflowCardId: string) {
    return new WorkflowCardAssigneeResource(
      this.client,
      this.personId,
      workflowCardId
    );
  }
}

export interface Assignee {
  type: "Person";
  id: string;
  attributes: {
    first_name?: string;
    last_name?: string;
    [key: string]: any;
  };
}

export class WorkflowCardAssigneeResource {
  constructor(
    private client: PlanningCenter,
    private personId: string,
    private workflowCardId: string
  ) {}

  async get(): Promise<ApiResponse<Assignee>> {
    return this.client.request<Assignee>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards/${this.workflowCardId}/assignee`
    );
  }
}
