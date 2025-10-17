import { PlanningCenter } from "../client.js";
import { GroupsListResource, GroupsListOptions } from "../resources/groups/groups-list.js";
import { TagsListResource, TagsListOptions } from "../resources/groups/tags-list.js";
import { CampusesListResource, CampusesListOptions } from "../resources/groups/campuses-list.js";
import { GroupTypesListResource, GroupTypesListOptions } from "../resources/groups/group-types-list.js";
import { ApiResponse, Group, Tag, Campus, GroupType } from "../types.js";

export class GroupsApp {
  constructor(private client: PlanningCenter) {}

  async list(options?: GroupsListOptions): Promise<ApiResponse<Group[]>> {
    const listResource = new GroupsListResource(this.client);
    return listResource.list(options);
  }

  async listTags(options?: TagsListOptions): Promise<ApiResponse<Tag[]>> {
    const listResource = new TagsListResource(this.client);
    return listResource.list(options);
  }

  async listCampuses(options?: CampusesListOptions): Promise<ApiResponse<Campus[]>> {
    const listResource = new CampusesListResource(this.client);
    return listResource.list(options);
  }

  async listGroupTypes(options?: GroupTypesListOptions): Promise<ApiResponse<GroupType[]>> {
    const listResource = new GroupTypesListResource(this.client);
    return listResource.list(options);
  }
}
