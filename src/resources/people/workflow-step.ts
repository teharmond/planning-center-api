import { PlanningCenter } from "../../client.js";
import { ApiResponse, Person } from "../../types.js";

export interface WorkflowStep {
  type: "WorkflowStep";
  id: string;
  attributes: {
    sequence?: number;
    name?: string;
    description?: string;
    expected_response_time_in_days?: number | null;
    auto_snooze_value?: number | null;
    auto_snooze_interval?: "day" | "week" | "month" | null;
    created_at?: string;
    updated_at?: string;
    auto_snooze_days?: number | null;
    my_ready_card_count?: number;
    total_ready_card_count?: number;
    default_assignee_id?: string | null;
  };
  relationships?: {
    default_assignee?: { data: { type: string; id: string } | null };
    workflow?: { data: { type: string; id: string } };
  };
}

export interface WorkflowStepCreateAttributes {
  sequence?: number;
  name: string;
  description?: string;
  expected_response_time_in_days?: number;
  default_assignee_id?: string;
  auto_snooze_value?: number;
  auto_snooze_interval?: "day" | "week" | "month";
}

export interface WorkflowStepUpdateAttributes {
  sequence?: number;
  name?: string;
  description?: string;
  expected_response_time_in_days?: number;
  default_assignee_id?: string;
  auto_snooze_value?: number;
  auto_snooze_interval?: "day" | "week" | "month";
}

export interface WorkflowStepListOptions {
  include?: "default_assignee"[];
  order?: "created_at" | "-created_at" | "name" | "-name" | "sequence" | "-sequence" | "updated_at" | "-updated_at";
  where?: {
    created_at?: string;
    name?: string;
    updated_at?: string;
  };
  per_page?: number;
  offset?: number;
}

export interface WorkflowStepAssigneeSummary {
  type: "WorkflowStepAssigneeSummary";
  id: string;
  attributes: {
    ready_count?: number;
    snoozed_count?: number;
  };
  relationships?: {
    person?: { data: { type: string; id: string } };
  };
}

export class WorkflowStepResource {
  constructor(
    private client: PlanningCenter,
    private workflowId: string,
    private stepId?: string
  ) {}

  async list(options?: WorkflowStepListOptions): Promise<ApiResponse<WorkflowStep[]>> {
    const params: Record<string, string> = {};

    if (options?.include) {
      params.include = options.include.join(",");
    }
    if (options?.order) {
      params.order = options.order;
    }
    if (options?.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        if (value !== undefined) {
          params[`where[${key}]`] = value;
        }
      });
    }
    if (options?.per_page !== undefined) {
      params.per_page = String(options.per_page);
    }
    if (options?.offset !== undefined) {
      params.offset = String(options.offset);
    }

    const queryString = Object.keys(params).length
      ? "?" + new URLSearchParams(params).toString()
      : "";

    return this.client.request<WorkflowStep[]>(
      "GET",
      `/people/v2/workflows/${this.workflowId}/steps${queryString}`
    );
  }

  async get(): Promise<ApiResponse<WorkflowStep>> {
    if (!this.stepId) {
      throw new Error("Step ID is required for get operation");
    }

    return this.client.request<WorkflowStep>(
      "GET",
      `/people/v2/workflows/${this.workflowId}/steps/${this.stepId}`
    );
  }

  async create(
    attributes: WorkflowStepCreateAttributes
  ): Promise<ApiResponse<WorkflowStep>> {
    const body = {
      data: {
        type: "WorkflowStep",
        attributes,
      },
    };

    return this.client.request<WorkflowStep>(
      "POST",
      `/people/v2/workflows/${this.workflowId}/steps`,
      body
    );
  }

  async update(
    attributes: WorkflowStepUpdateAttributes
  ): Promise<ApiResponse<WorkflowStep>> {
    if (!this.stepId) {
      throw new Error("Step ID is required for update operation");
    }

    const body = {
      data: {
        type: "WorkflowStep",
        id: this.stepId,
        attributes,
      },
    };

    return this.client.request<WorkflowStep>(
      "PATCH",
      `/people/v2/workflows/${this.workflowId}/steps/${this.stepId}`,
      body
    );
  }

  async delete(): Promise<ApiResponse<void>> {
    if (!this.stepId) {
      throw new Error("Step ID is required for delete operation");
    }

    return this.client.request<void>(
      "DELETE",
      `/people/v2/workflows/${this.workflowId}/steps/${this.stepId}`
    );
  }

  async getDefaultAssignee(): Promise<ApiResponse<Person>> {
    if (!this.stepId) {
      throw new Error("Step ID is required for getting default assignee");
    }

    return this.client.request<Person>(
      "GET",
      `/people/v2/workflows/${this.workflowId}/steps/${this.stepId}/default_assignee`
    );
  }

  async listAssigneeSummaries(): Promise<ApiResponse<WorkflowStepAssigneeSummary[]>> {
    if (!this.stepId) {
      throw new Error("Step ID is required for listing assignee summaries");
    }

    return this.client.request<WorkflowStepAssigneeSummary[]>(
      "GET",
      `/people/v2/workflows/${this.workflowId}/steps/${this.stepId}/assignee_summaries`
    );
  }
}
