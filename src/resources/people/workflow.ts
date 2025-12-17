import { PlanningCenter } from "../../client.js";
import { ApiResponse, Person } from "../../types.js";
import { WorkflowShare } from "./workflow-share.js";
import { WorkflowCard } from "./workflow-card.js";
import { WorkflowStepResource, WorkflowStep } from "./workflow-step.js";

export interface Workflow {
  type: "Workflow";
  id: string;
  attributes: {
    name?: string;
    my_ready_card_count?: number;
    total_ready_card_count?: number;
    completed_card_count?: number;
    total_cards_count?: number;
    total_ready_and_snoozed_card_count?: number;
    overdue_card_count?: number;
    stages?: string[];
    category_id?: string | null;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string | null;
    my_overdue_card_count?: number;
    my_due_soon_card_count?: number;
    name_or_child_name?: string;
    recently_viewed?: boolean;
    total_orphaned_card_count?: number;
  };
}

export interface WorkflowCreateAttributes {
  name: string;
  campus_id?: string;
  workflow_category_id?: string;
}

export interface WorkflowUpdateAttributes {
  name?: string;
  campus_id?: string;
  workflow_category_id?: string;
}

export interface WorkflowShareCreateAttributes {
  group?: string;
  permission?: string;
  person_id?: string;
}

export interface WorkflowCategory {
  type: "WorkflowCategory";
  id: string;
  attributes: {
    name?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface WorkflowListWhereOptions {
  /** Query on a specific archived_at */
  archived_at?: string;
  /** Query on a specific campus_id */
  campus_id?: string;
  /** Query on a specific created_at */
  created_at?: string;
  /** Query on a specific deleted_at */
  deleted_at?: string;
  /** Query on a specific id */
  id?: string;
  /** Query on a specific name */
  name?: string;
  /** Query on a specific updated_at */
  updated_at?: string;
  /** Query on a specific workflow_category_id */
  workflow_category_id?: string;
  /** Allow additional where parameters */
  [key: string]: string | undefined;
}

export interface WorkflowListOptions {
  /** Number of records per page (default: 25, min: 1, max: 100) */
  per_page?: number;
  /** Number of records to skip for pagination */
  offset?: number;
  /** Filter conditions */
  where?: WorkflowListWhereOptions;
  /** Sort order (e.g., 'name', '-created_at') */
  order?: string;
  /** Comma-separated string of related resources to include */
  include?: string;
}

export interface WorkflowCardsListWhereOptions {
  /** Query on a related assignee */
  assignee_id?: string;
  /** Query on a specific overdue status */
  overdue?: string;
  /** Query on a specific stage */
  stage?: string;
  /** Allow additional where parameters */
  [key: string]: string | undefined;
}

export interface WorkflowCardsListOptions {
  /** Number of records per page (default: 25, min: 1, max: 100) */
  per_page?: number;
  /** Number of records to skip for pagination */
  offset?: number;
  /** Filter conditions */
  where?: WorkflowCardsListWhereOptions;
  /** Sort order (e.g., 'created_at', '-updated_at', 'stage') */
  order?: string;
  /** Comma-separated string of related resources to include (assignee, current_step, person, workflow) */
  include?: string;
}

export class WorkflowResource {
  constructor(
    private client: PlanningCenter,
    private workflowId?: string
  ) {}

  async list(options?: WorkflowListOptions): Promise<ApiResponse<Workflow[]>> {
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
    const path = `/people/v2/workflows${queryString ? `?${queryString}` : ""}`;

    return this.client.request<Workflow[]>("GET", path);
  }

  async get(): Promise<ApiResponse<Workflow>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for get operation");
    }

    return this.client.request<Workflow>(
      "GET",
      `/people/v2/workflows/${this.workflowId}`
    );
  }

  async create(
    attributes: WorkflowCreateAttributes
  ): Promise<ApiResponse<Workflow>> {
    const body = {
      data: {
        type: "Workflow",
        attributes,
      },
    };

    return this.client.request<Workflow>("POST", "/people/v2/workflows", body);
  }

  async update(
    attributes: WorkflowUpdateAttributes
  ): Promise<ApiResponse<Workflow>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for update operation");
    }

    const body = {
      data: {
        type: "Workflow",
        id: this.workflowId,
        attributes,
      },
    };

    return this.client.request<Workflow>(
      "PATCH",
      `/people/v2/workflows/${this.workflowId}`,
      body
    );
  }

  async delete(): Promise<ApiResponse<void>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for delete operation");
    }

    return this.client.request<void>(
      "DELETE",
      `/people/v2/workflows/${this.workflowId}`
    );
  }

  async listCards(options?: WorkflowCardsListOptions): Promise<ApiResponse<WorkflowCard[]>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for listing cards");
    }

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
    const path = `/people/v2/workflows/${this.workflowId}/cards${queryString ? `?${queryString}` : ""}`;

    return this.client.request<WorkflowCard[]>("GET", path);
  }

  async createCard(attributes: {
    person_id: string;
    assignee_id?: string;
    sticky_assignment?: boolean;
  }): Promise<ApiResponse<WorkflowCard>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for creating card");
    }

    const body = {
      data: {
        type: "WorkflowCard",
        attributes,
      },
    };

    return this.client.request<WorkflowCard>(
      "POST",
      `/people/v2/workflows/${this.workflowId}/cards`,
      body
    );
  }

  async getCategory(): Promise<ApiResponse<WorkflowCategory>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for getting category");
    }

    return this.client.request<WorkflowCategory>(
      "GET",
      `/people/v2/workflows/${this.workflowId}/category`
    );
  }

  async listSteps(): Promise<ApiResponse<WorkflowStep[]>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for listing steps");
    }

    return this.client.request<WorkflowStep[]>(
      "GET",
      `/people/v2/workflows/${this.workflowId}/steps`
    );
  }

  step(stepId?: string): WorkflowStepResource {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for accessing steps");
    }

    return new WorkflowStepResource(this.client, this.workflowId, stepId);
  }

  async listSharedPeople(): Promise<ApiResponse<Person[]>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for listing shared people");
    }

    return this.client.request<Person[]>(
      "GET",
      `/people/v2/workflows/${this.workflowId}/shared_people`
    );
  }

  async createShare(
    attributes: WorkflowShareCreateAttributes
  ): Promise<ApiResponse<WorkflowShare>> {
    if (!this.workflowId) {
      throw new Error("Workflow ID is required for creating share");
    }

    const body = {
      data: {
        type: "WorkflowShare",
        attributes,
      },
    };

    return this.client.request<WorkflowShare>(
      "POST",
      `/people/v2/workflows/${this.workflowId}/shares`,
      body
    );
  }
}
