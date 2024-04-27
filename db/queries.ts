import { cache } from "react";
import db from "./drizzle";

//need to store the courses as cache so we don't have to pass the data as props
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});
