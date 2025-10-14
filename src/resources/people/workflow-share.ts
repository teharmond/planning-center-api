import { PlanningCenter } from "../../client.js";
import { ApiResponse } from "../../types.js";

export interface WorkflowShare {
  type: "WorkflowShare";
  id: string;
  attributes: {
    group?: string;
    permission?: string;
    person_id?: string;
  };
}

export interface WorkflowShareUpdateAttributes {
  group?: string;
  permission?: string;
}

export class WorkflowShareResource {
  constructor(
    private client: PlanningCenter,
    private personId: string
  ) {}

  async list(): Promise<ApiResponse<WorkflowShare[]>> {
    return this.client.request<WorkflowShare[]>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_shares`
    );
  }

  async get(workflowShareId: string): Promise<ApiResponse<WorkflowShare>> {
    return this.client.request<WorkflowShare>(
      "GET",
      `/people/v2/people/${this.personId}/workflow_shares/${workflowShareId}`
    );
  }

  async update(
    workflowShareId: string,
    attributes: WorkflowShareUpdateAttributes
  ): Promise<ApiResponse<WorkflowShare>> {
    const body = {
      data: {
        type: "WorkflowShare",
        id: workflowShareId,
        attributes,
      },
    };

    return this.client.request<WorkflowShare>(
      "PATCH",
      `/people/v2/people/${this.personId}/workflow_shares/${workflowShareId}`,
      body
    );
  }

  async delete(workflowShareId: string): Promise<ApiResponse<void>> {
    return this.client.request<void>(
      "DELETE",
      `/people/v2/people/${this.personId}/workflow_shares/${workflowShareId}`
    );
  }
}
