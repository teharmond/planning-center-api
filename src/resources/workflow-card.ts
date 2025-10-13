import { PlanningCenter } from "../client.js";
import { ApiResponse } from "../types.js";

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
