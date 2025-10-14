import { PlanningCenter } from "../client.js";
import { PersonResource } from "../resources/people/person.js";
import { PeopleListResource, PeopleListOptions } from "../resources/people/people-list.js";
import { ApiResponse, Person } from "../types.js";

export class PeopleApp {
  constructor(private client: PlanningCenter) {}

  person(id?: string): PersonResource {
    return new PersonResource(this.client, id);
  }

  async list(options?: PeopleListOptions): Promise<ApiResponse<Person[]>> {
    const listResource = new PeopleListResource(this.client);
    return listResource.list(options);
  }
}
