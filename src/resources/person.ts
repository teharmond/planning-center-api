import { PlanningCenter } from "../client";
import { Person, PersonAttributes, ApiResponse } from "../types";

export class PersonResource {
  constructor(private client: PlanningCenter, private personId?: string) {}

  async get(): Promise<ApiResponse<Person>> {
    if (!this.personId) {
      throw new Error("Person ID is required for get operation");
    }

    return this.client.request<Person>(
      "GET",
      `/people/v2/people/${this.personId}`
    );
  }

  async update(attributes: PersonAttributes): Promise<ApiResponse<Person>> {
    if (!this.personId) {
      throw new Error("Person ID is required for update operation");
    }

    const body = {
      data: {
        type: "Person",
        id: this.personId,
        attributes,
      },
    };

    return this.client.request<Person>(
      "PATCH",
      `/people/v2/people/${this.personId}`,
      body
    );
  }

  async delete(): Promise<ApiResponse<void>> {
    if (!this.personId) {
      throw new Error("Person ID is required for delete operation");
    }

    return this.client.request<void>(
      "DELETE",
      `/people/v2/people/${this.personId}`
    );
  }

  async create(attributes: PersonAttributes): Promise<ApiResponse<Person>> {
    const body = {
      data: {
        type: "Person",
        attributes,
      },
    };

    return this.client.request<Person>("POST", "/people/v2/people", body);
  }
}
