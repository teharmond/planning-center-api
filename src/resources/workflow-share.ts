import { PlanningCenter } from "../client.js";
import { ApiResponse } from "../types.js";

export interface WorkflowShare {
  type: "WorkflowShare";
  id: string;
  attributes: {
    group?: string;
    permission?: string;
    person_id?: string;
  };
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
}
