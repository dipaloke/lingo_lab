import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";
import { quests } from "@/constants";
import { Progress } from "./ui/progress";

type Props = {
  points: number;
};

export const Quests = ({ points }: Props) => {
  return (
    <div className="border-2 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between w-full space-y-2 ">
        <h3 className="font-bold text-lg">Quests</h3>
        <Link href="/quests">
          <Button size="sm" variant="primaryOutline">
            {" "}
            view all
          </Button>
        </Link>
      </div>
      <ul className="w-full space-y-4">
      {quests.map((quests) => {
              const progress = (points / quests.value) * 100;

              return (
                <div
                  className="flex items-center w-full pb-4 gap-x-3"
                  key={quests.title}
                >
                  <Image
                    src="/points.svg"
                    alt="Points"
                    height={40}
                    width={40}
                  />
                  <div className="flex flex-col gap-y-2 w-full">
                    <p className="text-neutral-700 text-sm font-bold">
                      {quests.title}
                    </p>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              );
            })}
      </ul>
    </div>
  );
};
