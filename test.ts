import { PlanningCenter } from "./dist/index.js";
import "dotenv/config";

async function test() {
  // Initialize client with your credentials
  const client = new PlanningCenter();

  try {
    console.log("Testing People List...");
    const people = await client.people.list({
      filter: "organization_admins",
    });
    console.log(`Found ${people.data.length} people`);
    console.log("First person:", people.data[0]?.attributes);
    console.log("Meta:", people.meta);
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
