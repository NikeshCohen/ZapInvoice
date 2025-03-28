import { Suspense } from "react";

import { GenWithAI } from "@/components/global/GenWithAI";
import Logo from "@/components/global/Logo";

async function Header() {
  return (
    <Suspense fallback={<HeaderSuspense />}>
      <HeaderContent />
    </Suspense>
  );
}

async function HeaderContent() {
  return (
    <header className="fixed top-2 right-0 left-0 z-50 mx-auto max-w-[1600px]">
      <div className="bg-background/40 border-border/40 flex items-center justify-between rounded-lg border px-4 py-2 shadow-sm backdrop-blur-md">
        <Logo />
        <div>
          <div className="flex gap-4">
            <div>
              <GenWithAI />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderSuspense() {
  return (
    <header className="fixed top-5 right-0 left-0 z-50 mx-auto max-w-[1600px]">
      <div className="bg-background/40 border-border/40 flex items-center justify-between rounded-lg border px-4 py-2 shadow-sm backdrop-blur-md">
        <Logo />
        <ButtonSkeleton />
      </div>
    </header>
  );
}

function ButtonSkeleton() {
  return (
    <div className="h-10 w-10 animate-pulse rounded-full bg-neutral-500" />
  );
}

export default Header;
