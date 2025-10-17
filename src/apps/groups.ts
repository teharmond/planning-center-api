import { PlanningCenter } from "../client.js";
import { GroupsListResource, GroupsListOptions } from "../resources/groups/groups-list.js";
import { ApiResponse, Group } from "../types.js";

export class GroupsApp {
  constructor(private client: PlanningCenter) {}

  async list(options?: GroupsListOptions): Promise<ApiResponse<Group[]>> {
    const listResource = new GroupsListResource(this.client);
    return listResource.list(options);
  }
}
