import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { courses, userProgress } from "./schema";

//need to store the courses as cache so we don't have to pass the data as props
export const getCourses = cache(async () => {
  const data = await db.query.courses.findMany();

  return data;
});

export const getUserProgress = cache(async () => {
  const { userId } = await auth();

  if (!userId) return null;

  const data = await db.query.userProgress.findFirst({
    where: eq(userProgress.userId, userId), //user id from userProgress and from clerk auth are equal
    with: {
      activeCourse: true, //also populate activeCourse relation
    },
  });
  return data;
});

export const getCoursesById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    //TODO: Populate units & lessons
  });
  return data;
});
