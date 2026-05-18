"use client";

import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { TurkiyeJobsProvider } from "@/context/TurkiyeJobsProvider";

type ProvidersProps = {
  children: React.ReactNode;
  /** From `getServerSession` in root layout — avoids client session stuck on "loading". */
  session?: Session | null;
};

export function Providers({ children, session = null }: ProvidersProps) {
  return (
    <SessionProvider
      session={session}
      refetchInterval={0}
      refetchOnWindowFocus={false}
    >
      <LanguageProvider>
        <TurkiyeJobsProvider>{children}</TurkiyeJobsProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
