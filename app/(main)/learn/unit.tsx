import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./unit-banner";
import { LessonButton } from "./lesson-button";

type UnitProps = {
  id: number;
  order: number;
  title: string;
  description: string;
  lessons: (typeof lessons.$inferSelect & {
    completed: boolean;
  })[];
  activeLesson:
    | (typeof lessons.$inferSelect & {
        unit: typeof units.$inferSelect;
      })
    | undefined;
  activeLessonPercentage: number;
};

export const Unit = ({
  id,
  order,
  title,
  description,
  lessons,
  activeLesson,
  activeLessonPercentage,
}: UnitProps) => {
  return (
    <>
      <UnitBanner title={title} description={description} />
      <div className="flex items-center flex-col relative">
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id;
          const isLocked = !lesson.completed && !isCurrent;
          //Not going to let user access of a lesson if lesson is not finished previously or is not current lesson
          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              percentage={activeLessonPercentage}
              current={isCurrent}
              locked={isLocked}
            />
          );
        })}
      </div>
    </>
  );
};
