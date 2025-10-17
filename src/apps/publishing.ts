import { PlanningCenter } from "../client.js";
import { EpisodesListResource, EpisodesListOptions } from "../resources/publishing/episodes-list.js";
import { SeriesListResource, SeriesListOptions } from "../resources/publishing/series-list.js";
import { ChannelEpisodesListResource, ChannelEpisodesListOptions } from "../resources/publishing/channel-episodes-list.js";
import { ApiResponse, Episode, Series } from "../types.js";

export class PublishingApp {
  constructor(private client: PlanningCenter) {}

  async listEpisodes(options?: EpisodesListOptions): Promise<ApiResponse<Episode[]>> {
    const listResource = new EpisodesListResource(this.client);
    return listResource.list(options);
  }

  async listSeries(options?: SeriesListOptions): Promise<ApiResponse<Series[]>> {
    const listResource = new SeriesListResource(this.client);
    return listResource.list(options);
  }

  async listChannelEpisodes(channelId: string, options?: ChannelEpisodesListOptions): Promise<ApiResponse<Episode[]>> {
    const listResource = new ChannelEpisodesListResource(this.client, channelId);
    return listResource.list(options);
  }
}
