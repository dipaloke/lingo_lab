"use client";
import { challengeOptions, challenges } from "@/db/schema";
import { useState, useTransition } from "react";
import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";

type QuizProps = {
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialHearts: number;
  initialPercentage: number;
  userSubscription: any; //TODO: Replace with db subscription type
};

export const Quiz = ({
  initialHearts,
  initialLessonChallenges,
  initialLessonId,
  initialPercentage,
  userSubscription,
}: QuizProps) => {
  const [pending, startTransition] = useTransition();

  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(initialPercentage);

  //Accessing challenges to show dynamically
  //first we get the current challenge
  const [challenges] = useState(initialLessonChallenges);
  //using active index to find the challenge
  const [activeIndex, setActiveIndex] = useState(() => {
    const unCompletedIndex = challenges.findIndex(
      (challenge) => !challenge.completed
    );
    //load the first active challenge or first uncompleted challenge
    return unCompletedIndex === -1 ? 0 : unCompletedIndex;
  });

  //Finally get the active challenge
  const challenge = challenges[activeIndex];
  //get the options
  const options = challenge?.challengeOptions ?? [];

  const [selectedOption, setSelectedOption] = useState<number>();

  const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");

  const onSelect = (id: number) => {
    if (status !== "none") return; //none means user did not submitted the answer yet.In other cases user can't select ans once submitted

    setSelectedOption(id);
  };

  const onNext = () => {
    setActiveIndex((current) => current + 1);
  };

  const onContinue = () => {
    if (!selectedOption) return;

    //if answer is wrong try again
    if (status === "wrong") {
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }
    if (status === "correct") {
      onNext();
      setStatus("none");
      setSelectedOption(undefined);
      return;
    }

    const correctOption = options.find((option) => option.correct);

    if (!correctOption) return;

    if (correctOption && correctOption.id === selectedOption) {
      startTransition(() => {
        upsertChallengeProgress(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              //TODO: Modal to show the error
              toast.error("Missing hearts");
              console.error("Missing hearts");
              return;
            }
            setStatus("correct");
            setPercentage((prev) => prev + 100 / challenges.length);

            //if all challenges are completed in a lesson.means this is practice
            if (initialPercentage === 100) {
              setHearts((prev) => Math.min(prev + 1, 5)); //increase 1 but max 5
            }
          })
          .catch(() => toast.error("Something went Wrong!! Please try again."));
      });
    } else {
      // Reducing hearts
      startTransition(() => {
        reduceHearts(challenge.id)
          .then((response) => {
            if (response?.error === "hearts") {
              toast.error("Missing Hearts");
              console.error("missing hearts");
              return;
            }
            setStatus("wrong");
            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. PLease try again!"));
      });
    }
  }
    const title =
      challenge.type === "ASSISTS"
        ? "Select the correct meaning."
        : challenge.question;

    return (
      <>
        <Header
          hearts={hearts}
          percentage={percentage}
          hasActiveSubscription={!!userSubscription?.isActive}
        />
        <div className="flex-1">
          <div className="h-full flex items-center justify-center">
            <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
              <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700">
                {title}
              </h1>
              <div className="">
                {challenge.type === "ASSISTS" && (
                  <QuestionBubble question={challenge.question} />
                )}
                <Challenge
                  options={options}
                  onSelect={onSelect}
                  status={status}
                  selectedOption={selectedOption}
                  disabled={pending}
                  type={challenge.type}
                />
              </div>
            </div>
          </div>
        </div>
        <Footer
          disabled={pending || !selectedOption}
          status={status}
          onCheck={onContinue}
        />
      </>
    );
  };
