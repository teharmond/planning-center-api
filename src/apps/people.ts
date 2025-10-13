import { PlanningCenter } from "../client";
import { PersonResource } from "../resources/person";

export class PeopleApp {
  constructor(private client: PlanningCenter) {}

  person(id?: string): PersonResource {
    return new PersonResource(this.client, id);
  }
}
