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
    content?: string;
    type?: string;
    created_at?: string;
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
  type: "Note";
  id: string;
  attributes: {
    note?: string;
    created_at?: string;
    updated_at?: string;
  };
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

  async list(): Promise<ApiResponse<WorkflowCard[]>> {
    return this.client.request<WorkflowCard[]>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_cards`
    );
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
