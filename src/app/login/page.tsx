import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/LoginForm";
import { PageIntro, PageShell } from "@/components/PageShell";

export default function LoginPage() {
  return (
    <div className="min-h-[60vh] surface-hero">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow="Welcome back"
          title="Sign in to TürkiyeJobs.org"
          description="Sign in with your TürkiyeJobs.org account to open your applicant workspace, employer tools, or administrator console."
        />
        <Suspense fallback={<p className="text-sm text-foreground/60">Loading…</p>}>
          <LoginForm />
        </Suspense>
        <p className="mt-6 text-center text-xs text-foreground/55">
          <Link href="/privacy" className="underline hover:text-brand-navy">
            Privacy
          </Link>
          {" · "}
          <Link href="/terms" className="underline hover:text-brand-navy">
            Terms
          </Link>
        </p>
      </PageShell>
    </div>
  );
}
