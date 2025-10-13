import { PlanningCenter } from "../client";
import { Person, PersonAttributes, ApiResponse } from "../types";
export declare class PersonResource {
    private client;
    private personId?;
    constructor(client: PlanningCenter, personId?: string | undefined);
    get(): Promise<ApiResponse<Person>>;
    update(attributes: PersonAttributes): Promise<ApiResponse<Person>>;
    delete(): Promise<ApiResponse<void>>;
    create(attributes: PersonAttributes): Promise<ApiResponse<Person>>;
}
