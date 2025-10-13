export class PersonResource {
    constructor(client, personId) {
        this.client = client;
        this.personId = personId;
    }
    async get() {
        if (!this.personId) {
            throw new Error("Person ID is required for get operation");
        }
        return this.client.request("GET", `/people/v2/people/${this.personId}`);
    }
    async update(attributes) {
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
        return this.client.request("PATCH", `/people/v2/people/${this.personId}`, body);
    }
    async delete() {
        if (!this.personId) {
            throw new Error("Person ID is required for delete operation");
        }
        return this.client.request("DELETE", `/people/v2/people/${this.personId}`);
    }
    async create(attributes) {
        const body = {
            data: {
                type: "Person",
                attributes,
            },
        };
        return this.client.request("POST", "/people/v2/people", body);
    }
}
