import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString);

//passing schema as second argument. This will allow us to use drizzle query API similar to prisma.
//https://orm.drizzle.team/docs/rqb#drizzle-queries

const db = drizzle(client, { schema });

export default db;
