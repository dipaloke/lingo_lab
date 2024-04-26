import { Button } from "@/components/ui/button";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center p-4 gap-2">
      {/* container for holding img */}
      <div className="relative w-[240px] h-[240px] lg:w-[424px] lg:h-[424px] mb-8 lg:mb-0">
        <Image src="/hero.svg" fill alt="Hero" />
      </div>
      <div className="flex flex-col items-center gap-y-8">
        <h1 className="text-xl lg:text-3xl font-bold text-neutral-600 max-w-[480px] text-center">
          Learn, practice and master new language with Lingo-Lab.
        </h1>
        <div className=" flex flex-col items-center gap-y-3 max-w-[330px] w-full">
          {/* spacial cases for if we are logged in or not */}
          <ClerkLoading>
            <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            {/* when user is signed out */}
            <SignedOut>
              <SignUpButton
                mode="modal"
                signInFallbackRedirectUrl="/learn"
                signInForceRedirectUrl="/learn"
              >
                <Button className="w-full" variant="secondary" size="lg">
                  Get Started
                </Button>
              </SignUpButton>

              <SignInButton
                mode="modal"
                signUpFallbackRedirectUrl="/learn"
                fallbackRedirectUrl="/learn"
              >
                <Button className="w-full" variant="primaryOutline" size="lg">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>
            {/* when user is signed-in */}
            <SignedIn>
              <Button size="lg" variant="secondary" asChild className="w-full">
                <Link href="/learn">Continue learning</Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}
