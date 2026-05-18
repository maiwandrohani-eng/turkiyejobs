"use client";

import { SessionProvider } from "next-auth/react";
import { LanguageProvider } from "@/context/LanguageContext";
import { TurkiyeJobsProvider } from "@/context/TurkiyeJobsProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      <LanguageProvider>
        <TurkiyeJobsProvider>{children}</TurkiyeJobsProvider>
      </LanguageProvider>
    </SessionProvider>
  );
}
