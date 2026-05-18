import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { PageIntro, PageShell } from "@/components/PageShell";

type LoginPageProps = {
  searchParams: Promise<{
    reset?: string;
    callbackUrl?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = await searchParams;
  const resetOk = sp.reset === "1";
  const callbackUrl =
    sp.callbackUrl?.startsWith("/") && !sp.callbackUrl.startsWith("//")
      ? sp.callbackUrl
      : "/dashboard/user";

  return (
    <div className="min-h-[60vh] surface-hero">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow="Welcome back"
          title="Sign in to TürkiyeJobs.org"
          description="Sign in with your TürkiyeJobs.org account to open your applicant workspace, employer tools, or administrator console."
        />
        <LoginForm resetOk={resetOk} callbackUrl={callbackUrl} />
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
