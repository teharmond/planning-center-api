import { PersonResource } from "../resources/person";
export class PeopleApp {
    constructor(client) {
        this.client = client;
    }
    person(id) {
        return new PersonResource(this.client, id);
    }
}
