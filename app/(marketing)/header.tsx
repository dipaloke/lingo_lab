import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  RedirectToSignIn,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import React from "react";

export const Header = () => {
  return (
    <header className="h-20 w-full border-b-2 border-slate-200 px-4">
      <div className="lg:max-w-screen-lg mx-auto flex items-center justify-between h-full ">
        <div className="pt-8 pl-4 pb-7 flex items-center gap-x-3">
          <Image src="/mascot1.svg" height={40} width={40} alt="Mascot" />
          <h1 className="text-2xl font-extrabold text-green-600 tracking-wide">
            LingoLab
          </h1>
        </div>
        {/* loading state */}
        <ClerkLoading>
          <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        {/* after loaded */}
        <ClerkLoaded>
          <SignedIn>
            {/* after sign-in show user button and specify after sign-out  */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            {/* if signed-out show signIN which will be a modal. After signed-in redirect */}
            <SignInButton
              mode="modal"
              signUpFallbackRedirectUrl="/learn"
              fallbackRedirectUrl="/learn"
            >
              <Button variant="ghost" size="lg">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
        </ClerkLoaded>
      </div>
    </header>
  );
};
