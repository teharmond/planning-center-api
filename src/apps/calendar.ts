import { PlanningCenter } from "../client.js";
import { EventsListResource, EventsListOptions } from "../resources/calendar/events-list.js";
import { CalendarTagsListResource, CalendarTagsListOptions } from "../resources/calendar/tags-list.js";
import { EventInstancesListResource, EventInstancesListOptions } from "../resources/calendar/event-instances-list.js";
import { ApiResponse, Event, CalendarTag, EventInstance } from "../types.js";

export class CalendarApp {
  constructor(private client: PlanningCenter) {}

  async listEvents(options?: EventsListOptions): Promise<ApiResponse<Event[]>> {
    const listResource = new EventsListResource(this.client);
    return listResource.list(options);
  }

  async listTags(options?: CalendarTagsListOptions): Promise<ApiResponse<CalendarTag[]>> {
    const listResource = new CalendarTagsListResource(this.client);
    return listResource.list(options);
  }

  async listEventInstances(options?: EventInstancesListOptions): Promise<ApiResponse<EventInstance[]>> {
    const listResource = new EventInstancesListResource(this.client);
    return listResource.list(options);
  }
}
