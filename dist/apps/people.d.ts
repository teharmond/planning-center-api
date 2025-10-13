import { PlanningCenter } from "../client";
import { PersonResource } from "../resources/person";
export declare class PeopleApp {
    private client;
    constructor(client: PlanningCenter);
    person(id?: string): PersonResource;
}
