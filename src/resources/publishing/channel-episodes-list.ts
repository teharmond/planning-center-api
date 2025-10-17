import { PlanningCenter } from "../../client.js";
import { Episode, ApiResponse } from "../../types.js";

export interface ChannelEpisodesListOptions {
  per_page?: number; // default: 25, min: 1, max: 100
  offset?: number;
  where?: {
    series_id?: number;
    published_to_church_center?: boolean;
  };
  order?: string;
  include?: string;
}

export class ChannelEpisodesListResource {
  constructor(
    private client: PlanningCenter,
    private channelId: string
  ) {}

  async list(options?: ChannelEpisodesListOptions): Promise<ApiResponse<Episode[]>> {
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
        params.append(`where[${key}]`, String(value));
      });
    }

    if (options?.order) {
      params.append("order", options.order);
    }

    if (options?.include) {
      params.append("include", options.include);
    }

    const queryString = params.toString();
    const path = `/publishing/v2/channels/${this.channelId}/episodes${queryString ? `?${queryString}` : ""}`;

    return this.client.request<Episode[]>("GET", path);
  }
}
