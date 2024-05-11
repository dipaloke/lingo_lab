"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

import { reduceHearts } from "@/actions/user-progress";
import { challengeOptions, challenges, userSubscription } from "@/db/schema";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { useHeartsModal } from "@/store/use-hearts-modal";
import { usePracticeModal } from "@/store/use-practice-modal";

import { Header } from "./header";
import { QuestionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { ResultCard } from "./result-card";
import { InfinityIcon } from "lucide-react";

type QuizProps = {
  initialLessonId: number;
  initialLessonChallenges: (typeof challenges.$inferSelect & {
    completed: boolean;
    challengeOptions: (typeof challengeOptions.$inferSelect)[];
  })[];
  initialHearts: number;
  initialPercentage: number;
  userSubscription:
    | (typeof userSubscription.$inferSelect & {
        isActive: boolean;
      })
    | null;
};

export const Quiz = ({
  initialHearts,
  initialLessonChallenges,
  initialLessonId,
  initialPercentage,
  userSubscription,
}: QuizProps) => {
  //* functionality to import hearts modal
  const { open: openHeartsModal } = useHeartsModal();

  const { open: openPracticeModal } = usePracticeModal();

  useMount(() => {
    if (initialPercentage === 100) {
      openPracticeModal();
    }
  });

  const { height, width } = useWindowSize();

  const router = useRouter();

  //? Sound feedback for correct, incorrect & finished answer.

  const [finishAudio] = useAudio({ src: "/finish.mp3", autoPlay: true });
  const [correctAudio, _c, correctControls] = useAudio({ src: "/correct.wav" });
  const [incorrectAudio, _i, incorrectControls] = useAudio({
    src: "/incorrect.wav",
  });

  const [pending, startTransition] = useTransition();

  const [hearts, setHearts] = useState(initialHearts);
  const [percentage, setPercentage] = useState(() => {
    //? We pretend the percentage to be 0 when user is practicing meaning initial percentage is already 100%
    return initialPercentage === 100 ? 0 : initialPercentage;
  });
  const [lessonId] = useState(initialLessonId);

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
    setActiveIndex((current) => current + 1); //there will be error after finishing a challenge. coz if last challenge index is 3. then next index will be 4 . but we don't have anything on index 4. handled below after onContinue.
  };

  //? when user reach at the last section of a lesson challenge before finish screen
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
              toast.error("Missing hearts");
              openHeartsModal();
              return;
            }
            correctControls.play();
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
              openHeartsModal();
              return;
            }
            incorrectControls.play();
            setStatus("wrong");
            if (!response?.error) {
              setHearts((prev) => Math.max(prev - 1, 0));
            }
          })
          .catch(() => toast.error("Something went wrong. PLease try again!"));
      });
    }
  };

  //! handling onNext index error. Now shows this div after a challenge completion

  if (!challenge) {
    return (
      <>
        {finishAudio}
        {/* glitter */}
        <Confetti
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
          width={width}
          height={height}
        />

        <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
          <Image
            src="/finish.svg"
            alt="finish"
            height={100}
            width={100}
            className="hidden lg:block"
          />
          <Image
            src="/finish.svg"
            alt="finish"
            height={50}
            width={50}
            className="lg:hidden block"
          />
          <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
            Great job! <br />
            You&apos;ve completed the lesson
          </h1>
          <div className="flex items-center gap-x-4 w-full">
            {/* we will know how many points user earned by counting th amount of challenges   */}
            <ResultCard variant="points" value={challenges.length * 10} />
            <ResultCard
              variant="hearts"
              value={
                userSubscription?.isActive ? (
                  <InfinityIcon className="h-6 w-6 shrink-0" />
                ) : (
                  hearts
                )
              }
            />
          </div>
        </div>
        <Footer
          lessonId={lessonId}
          status="completed"
          onCheck={() => router.push("/learn")}
        />
      </>
    );
  }

  const title =
    challenge.type === "ASSISTS"
      ? "Select the correct meaning."
      : challenge.question;

  return (
    <>
      {incorrectAudio}
      {correctAudio}
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
