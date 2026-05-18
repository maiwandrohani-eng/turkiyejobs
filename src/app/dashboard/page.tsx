"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";

export default function DashboardHubPage() {
  const { session, sessionReady } = useTurkiyeJobs();
  const router = useRouter();

  useEffect(() => {
    if (!sessionReady || !session) return;
    if (session.role === "admin") router.replace("/dashboard/admin");
    else if (session.role === "organization")
      router.replace("/dashboard/organization");
    else if (session.role === "individual") router.replace("/dashboard/user");
  }, [sessionReady, session, router]);

  return (
    <PageShell className="!py-0">
      <PageIntro
        eyebrow="Dashboard"
        title="Choose your workspace"
        description="TürkiyeJobs.org separates experiences for applicants, employers, and platform administrators. Sign in with the account type you registered, then pick the matching workspace below."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/user"
          className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-bold text-brand-navy">Individual</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Saved listings, applications, and status tracking.
          </p>
        </Link>
        <Link
          href="/dashboard/organization"
          className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-bold text-brand-navy">Organization</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Post opportunities, manage listings, review applicants.
          </p>
        </Link>
        <Link
          href="/dashboard/admin"
          className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <h2 className="text-lg font-bold text-brand-navy">Admin</h2>
          <p className="mt-2 text-sm text-foreground/70">
            Approvals, moderation, categories, and analytics.
          </p>
        </Link>
      </div>
    </PageShell>
  );
}
