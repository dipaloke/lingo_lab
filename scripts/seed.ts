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
    await db.delete(schema.units);
    await db.delete(schema.lessons);
    await db.delete(schema.challenges);
    await db.delete(schema.challengeOptions);
    await db.delete(schema.challengeProgress);

    //inserting courses
    await db.insert(schema.courses).values([
      {
        id: 1,
        title: "Spanish",
        imageSrc: "/es.svg",
      },
      {
        //providing id is not mandatory because it's a serial in our db schema.
        id: 2,
        title: "Bengali",
        imageSrc: "/bd.svg",
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

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1, //spanish
        title: "Unit 1",
        description: "Learn the basics of Spanish.",
        order: 1,
      },
    ]);

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1, //Unit 1 (Learn the basics...),
        order: 1,
        title: "Nouns",
      },
      {
        id: 2,
        unitId: 1, //Unit 1 (Learn the basics...),
        order: 2,
        title: "Verbs",
      },
      {
        id: 3,
        unitId: 1, //Unit 1 (Learn the basics...),
        order: 3,
        title: "Pronoun",
      },
      {
        id: 4,
        unitId: 1, //Unit 1 (Learn the basics...),
        order: 4,
        title: "Adjective",
      },
      {
        id: 5,
        unitId: 1, //Unit 1 (Learn the basics...),
        order: 5,
        title: "Adverb",
      },
    ]);

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1, //nouns
        type: "SELECT",
        order: 1,
        question: 'Which one of these is the "the man"?',
      },
    ]);

    await db.insert(schema.challengeOptions).values([
      {
        id: 1,
        challengeId: 1,
        imageSrc: "/man.svg", //which of the following is the man
        correct: true,
        text: "el hombre",
        audioSrc: "/es_man.mp3",
      },
      {
        id: 2,
        challengeId: 1, //which of the following is the man
        imageSrc: "/woman.svg",
        correct: false,
        text: "la mujer",
        audioSrc: "/es_woman.mp3",
      },
      {
        id: 3,
        challengeId: 1, //which of the following is the man
        imageSrc: "/robot.svg",
        correct: false,
        text: "el robot",
        audioSrc: "/es_robot.mp3",
      },
    ]);

    console.log("Seeding Finished");
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed the Database");
  }
};

main();
