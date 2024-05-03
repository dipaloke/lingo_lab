import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { courses, units, userProgress } from "./schema";

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

export const getUnits = cache(async () => {
  const userProgress = await getUserProgress();

  if (!userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    //adding challengeProgress with lessons
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgress: true,
            },
          },
        },
      },
    },
  });

  // Mapping over the 'data' array to normalize its structure so we can easily use in frontend.
  const normalizedData = data.map((unit) => {
    // For each 'unit' in 'data', map over its 'lessons' array
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      // Checking if all challenges in a 'lesson' are completed
      const allCompletedChallenges = lesson.challenges.every((challenge) => {
        // Verifying that each challenge has progress and all progress is marked as completed
        return (
          challenge.challengeProgress && // Ensure 'challengeProgress' exists
          challenge.challengeProgress.length > 0 && // Ensure 'challengeProgress' is not empty
          challenge.challengeProgress.every((progress) => progress.completed) // Check if all 'completed' flags are true
        );
      });
      // Returning the lesson with an added 'completed' property based on challenges status
      return { ...lesson, completed: allCompletedChallenges };
    });
    // Returning the unit with updated lessons containing 'completed' status
    return { ...unit, lessons: lessonsWithCompletedStatus };
  });
  // Returning the normalized data after processing
  return normalizedData;
});

export const getCoursesById = cache(async (courseId: number) => {
  const data = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
    //TODO: Populate units & lessons
  });
  return data;
});
