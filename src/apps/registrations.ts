import { PlanningCenter } from "../client.js";
import { SignupsListResource, SignupsListOptions } from "../resources/registrations/signups-list.js";
import { CategoriesListResource, CategoriesListOptions } from "../resources/registrations/categories-list.js";
import { RegistrationsCampusesListResource, RegistrationsCampusesListOptions } from "../resources/registrations/campuses-list.js";
import { ApiResponse, Signup, Category, RegistrationsCampus } from "../types.js";

export class RegistrationsApp {
  constructor(private client: PlanningCenter) {}

  async listSignups(options?: SignupsListOptions): Promise<ApiResponse<Signup[]>> {
    const listResource = new SignupsListResource(this.client);
    return listResource.list(options);
  }

  async listCategories(options?: CategoriesListOptions): Promise<ApiResponse<Category[]>> {
    const listResource = new CategoriesListResource(this.client);
    return listResource.list(options);
  }

  async listCampuses(options?: RegistrationsCampusesListOptions): Promise<ApiResponse<RegistrationsCampus[]>> {
    const listResource = new RegistrationsCampusesListResource(this.client);
    return listResource.list(options);
  }
}
