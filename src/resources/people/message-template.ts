import { PlanningCenter } from "../../client.js";
import { MessageTemplate, ApiResponse } from "../../types.js";

export interface MessageTemplateListOptions {
  per_page?: number;
  offset?: number;
  order?: "subject" | "-subject";
  autoPaginate?: boolean;
}

export class MessageTemplateResource {
  constructor(private client: PlanningCenter) {}

  /**
   * List all message templates
   */
  async list(
    options?: MessageTemplateListOptions
  ): Promise<ApiResponse<MessageTemplate[]>> {
    const params = new URLSearchParams();

    const perPage = options?.per_page ?? 100;
    if (perPage < 1 || perPage > 100) {
      throw new Error("per_page must be between 1 and 100");
    }
    params.append("per_page", perPage.toString());

    if (options?.offset !== undefined) {
      params.append("offset", options.offset.toString());
    }

    if (options?.order) {
      params.append("order", options.order);
    }

    const queryString = params.toString();
    const path = `/people/v2/message_templates${queryString ? `?${queryString}` : ""}`;

    return this.client.request<MessageTemplate[]>("GET", path, undefined, {
      autoPaginate: options?.autoPaginate,
    });
  }

  /**
   * Get a single message template by ID
   */
  async get(id: string): Promise<ApiResponse<MessageTemplate>> {
    return this.client.request<MessageTemplate>(
      "GET",
      `/people/v2/message_templates/${id}`
    );
  }
}
