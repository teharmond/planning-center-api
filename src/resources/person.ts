import { PlanningCenter } from "../client";
import {
  Person,
  PersonAttributes,
  PersonCreateAttributes,
  PersonUpdateAttributes,
  ApiResponse,
} from "../types";

export type PersonInclude =
  | "addresses"
  | "emails"
  | "field_data"
  | "households"
  | "inactive_reason"
  | "marital_status"
  | "name_prefix"
  | "name_suffix"
  | "organization"
  | "person_apps"
  | "phone_numbers"
  | "platform_notifications"
  | "primary_campus"
  | "school"
  | "social_profiles";

type ArrayOfPersonInclude<T> = T extends readonly [infer First, ...infer Rest]
  ? First extends PersonInclude
    ? [First, ...ArrayOfPersonInclude<Rest>]
    : never
  : T extends readonly []
  ? []
  : T extends readonly (infer Item)[]
  ? Item extends PersonInclude
    ? readonly Item[]
    : never
  : never;

export type PersonQueryOptions = {
  include?: PersonInclude | readonly PersonInclude[];
};

export class PersonResource {
  constructor(private client: PlanningCenter, private personId?: string) {}

  private buildQueryString(options?: PersonQueryOptions): string {
    if (!options?.include) return "";

    const validIncludes: PersonInclude[] = [
      "addresses",
      "emails",
      "field_data",
      "households",
      "inactive_reason",
      "marital_status",
      "name_prefix",
      "name_suffix",
      "organization",
      "person_apps",
      "phone_numbers",
      "platform_notifications",
      "primary_campus",
      "school",
      "social_profiles",
    ];

    const validateInclude = (value: string): void => {
      if (!validIncludes.includes(value as PersonInclude)) {
        throw new Error(
          `Invalid include value: "${value}". Valid options are: ${validIncludes.join(", ")}`
        );
      }
    };

    if (Array.isArray(options.include)) {
      options.include.forEach(validateInclude);
      return `?include=${options.include.join(",")}`;
    } else {
      validateInclude(options.include as string);
      return `?include=${options.include}`;
    }
  }

  async get<const T extends readonly PersonInclude[]>(
    options?: { include?: PersonInclude | ArrayOfPersonInclude<T> }
  ): Promise<ApiResponse<Person>> {
    if (!this.personId) {
      throw new Error("Person ID is required for get operation");
    }

    return this.client.request<Person>(
      "GET",
      `/people/v2/people/${this.personId}${this.buildQueryString(options)}`
    );
  }

  async update(
    attributes: PersonUpdateAttributes
  ): Promise<ApiResponse<Person>> {
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

  async create(
    attributes: PersonCreateAttributes
  ): Promise<ApiResponse<Person>> {
    const body = {
      data: {
        type: "Person",
        attributes,
      },
    };

    return this.client.request<Person>("POST", "/people/v2/people", body);
  }
}
