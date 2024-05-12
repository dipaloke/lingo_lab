import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../db/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

const db = drizzle(client, { schema });

const main = async () => {
  try {
    console.log("Resetting the DataBase");

    //remove all existing elements
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);
    await db.delete(schema.userSubscription);

    console.log("Resetting Finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to reset the Database");
  }
};

main();
