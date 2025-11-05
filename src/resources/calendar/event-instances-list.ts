import { PlanningCenter } from "../../client.js";
import { EventInstance, ApiResponse } from "../../types.js";

type ComparisonValue = string | { gt?: string; lt?: string; gte?: string; lte?: string };

export interface EventInstancesListOptions {
  per_page?: number; // default: 25, min: 1, max: 100
  offset?: number;
  where?: {
    created_at?: ComparisonValue;
    ends_at?: ComparisonValue;
    event_name?: string;
    starts_at?: ComparisonValue;
    tag_ids?: string;
    updated_at?: ComparisonValue;
  };
  order?: string;
  include?: string;
  filter?:
    | "future"
    | "not_pending_event_requests"
    | "all"
    | "approver"
    | "approver_subscriber"
    | "manager"
    | "manager_approver"
    | "manager_approver_subscriber"
    | "manager_subscriber"
    | "owner"
    | "owner_approver"
    | "owner_approver_subscriber"
    | "owner_manager_approver"
    | "owner_manager_subscriber"
    | "owner_manager_approver_subscriber"
    | "owner_manager"
    | "owner_subscriber"
    | "subscriber"
    | "approved"
    | "pending"
    | "rejected"
    | "unresolved"
    | "lost"
    | "shared"
    | "approved_pending"
    | "approved_rejected"
    | "pending_rejected"
    | "approved_pending_rejected"
    | string;
}

export class EventInstancesListResource {
  constructor(private client: PlanningCenter) {}

  async list(options?: EventInstancesListOptions): Promise<ApiResponse<EventInstance[]>> {
    const params = new URLSearchParams();

    const perPage = options?.per_page ?? 25;
    if (perPage < 1 || perPage > 100) {
      throw new Error("per_page must be between 1 and 100");
    }
    params.append("per_page", perPage.toString());

    if (options?.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }

    if (options?.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // Handle comparison operators (gt, lt, gte, lte)
          Object.entries(value).forEach(([operator, operatorValue]) => {
            params.append(`where[${key}][${operator}]`, String(operatorValue));
          });
        } else {
          params.append(`where[${key}]`, String(value));
        }
      });
    }

    if (options?.order) {
      params.append("order", options.order);
    }

    if (options?.include) {
      params.append("include", options.include);
    }

    if (options?.filter) {
      params.append("filter", options.filter);
    }

    const queryString = params.toString();
    const path = `/calendar/v2/event_instances${queryString ? `?${queryString}` : ""}`;

    return this.client.request<EventInstance[]>("GET", path);
  }
}
