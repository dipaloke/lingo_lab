import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "../db/schema";

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);

const db = drizzle(client, { schema });

const main = async () => {
  try {
    console.log("Seeding the DataBase");

    //remove all existing elements
    await db.delete(schema.courses);
    await db.delete(schema.userProgress);

    //inserting courses
    await db.insert(schema.courses).values([
      {
        //providing id is not mandatory because it's a serial in our db schema.
        id: 1,
        title: "Bangladeshi",
        imageSrc: "/bd.svg",
      },
      {
        id: 2,
        title: "Spanish",
        imageSrc: "/es.svg",
      },
      {
        id: 3,
        title: "French",
        imageSrc: "/fr.svg",
      },
      {
        id: 4,
        title: "Italian",
        imageSrc: "/it.svg",
      },
      {
        id: 5,
        title: "Croatian",
        imageSrc: "/hr.svg",
      },
    ]);

    console.log("Seeding Finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the Database");
  }
};

main();
