import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import {
  ClerkLoading,
  ClerkLoaded,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import { Loader, LogOut } from "lucide-react";
import { SidebarItems } from "./sidebar-items";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  // sidebar will collapse in mobile or small devises
  return (
    <div
      className={cn(
        "flex h-full lg:w-[256px] lg:fixed left-0 top-0 px-4 border-r-2 flex-col",
        className
      )}
    >
      <Link href="/learn">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot1.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            LingoLab
          </h1>
        </div>
      </Link>
      {/* all routes */}
      <div className="flex flex-col gap-y-2 flex-1">
        <SidebarItems label="Learn" href="/learn" iconSrc="/learn.svg" />
        <SidebarItems
          label="Leader Board"
          href="/leaderboard"
          iconSrc="/leaderboard.svg"
        />
        <SidebarItems label="Quests" href="/quests" iconSrc="/quests.svg" />
        <SidebarItems label="Shop" href="/shop" iconSrc="/shop.svg" />
      </div>
      {/* for user button and logout */}
      <div className="p-4">
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <div className="flex justify-between">
            <UserButton afterSignOutUrl="/" />
            <SignOutButton redirectUrl="/">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button variant="ghost">
                      <LogOut className="h-5 w-5 text-muted-foreground stroke-red-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-destructive/10">
                    <p className="text-muted-foreground">Log Out</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SignOutButton>
          </div>
        </ClerkLoaded>
      </div>
    </div>
  );
};
