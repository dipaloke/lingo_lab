import { cache } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { asc, eq } from "drizzle-orm";
import {
  challengeProgress,
  challenges,
  courses,
  lessons,
  units,
  userProgress,
  userSubscription,
} from "./schema";

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
  const { userId } = await auth();
  const userProgress = await getUserProgress();

  if (!userId || !userProgress?.activeCourseId) {
    return [];
  }

  const data = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(units.order)],
    where: eq(units.courseId, userProgress.activeCourseId),
    //adding challengeProgress with lessons
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          challenges: {
            orderBy: (challenges, { asc }) => [asc(challenges.order)],
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
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
      //if lessons don't contain challenges then make completed status to false
      if (lesson.challenges.length === 0) {
        return { ...lesson, completed: false };
      }
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
    with: {
      units: {
        orderBy: (units, { asc }) => [asc(units.order)],
        with: {
          lessons: {
            orderBy: (lesson, { asc }) => [asc(lesson.order)],
          },
        },
      },
    },
  });
  return data;
});

export const getCourseProgress = cache(async () => {
  const { userId } = await auth();
  const userPRogress = await getUserProgress();

  if (!userId || !userPRogress?.activeCourseId) {
    return null;
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    orderBy: (units, { asc }) => [asc(lessons.order)],
    where: eq(units.courseId, userPRogress.activeCourseId),
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
          unit: true,
          challenges: {
            with: {
              challengeProgress: {
                where: eq(challengeProgress.userId, userId),
              },
            },
          },
        },
      },
    },
  });
  //First uncompleted lesson that will be shown in frontend so users can start from there.
  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((units) => units.lessons)
    .find((lesson) => {
      return lesson.challenges.some((challenge) => {
        return (
          !challenge.challengeProgress ||
          challenge.challengeProgress.length === 0 ||
          challenge.challengeProgress.some(
            (progress) => progress.completed === false
          )
        );
      });
    });
  return {
    activeLesson: firstUncompletedLesson,
    activeLessonId: firstUncompletedLesson?.id,
  };
});

//If user provide an id for lesson(user clicked on a specific lesson) then we are going to load it, otherwise we load the first uncompleted lesson from getCourseProgress.
export const getLesson = cache(async (id?: number) => {
  const { userId } = await auth();

  if (!userId) return null;

  const courseProgress = await getCourseProgress();
  const lessonId = id || courseProgress?.activeLessonId;

  if (!lessonId) return null;

  const data = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgress: {
            where: eq(challengeProgress.userId, userId),
          },
        },
      },
    },
  });

  if (!data || !data.challenges) return null;

  //normalizing for frontEnd

  const normalizedChallenges = data.challenges.map((challenge) => {
    const completed =
      challenge.challengeProgress &&
      challenge.challengeProgress.length > 0 &&
      challenge.challengeProgress.every((progress) => progress.completed);

    return { ...challenge, completed };
  });

  return { ...data, challenges: normalizedChallenges };
});

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress();

  if (!courseProgress?.activeLessonId) return 0;

  const lesson = await getLesson(courseProgress.activeLessonId);

  if (!lesson) return 0;

  const CompletedChallenges = lesson.challenges.filter(
    (challenge) => challenge.completed
  );
  const percentage = Math.round(
    (CompletedChallenges.length / lesson.challenges.length) * 100
  );
  return percentage;
});

const DAY_IN_MS = 86_400_000;

export const getUserSubscription = cache(async () => {
  const { userId } = await auth();
  if (!userId) return null;
  const data = await db.query.userSubscription.findFirst({
    where: eq(userSubscription.userId, userId),
  });

  if (!data) return null;

  //stripe user subscription depends on is stripe current period(dateTime) of subscription is valid or not
  const isActive =
    data.stripePriceId &&
    data.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

  return {
    ...data,
    isActive: !!isActive,
  };
});

export const getTopTenUsers = cache(async () => {
  const { userId } = auth();

  if (!userId) return [];

  const data = await db.query.userProgress.findMany({
    orderBy: (userProgress, { desc }) => [desc(userProgress.points)],
    limit: 10,
    columns: {
      userId: true,
      userName: true,
      userImageSrc: true,
      points: true,
    },
  });
  return data;
});
