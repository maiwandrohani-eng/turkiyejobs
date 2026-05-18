import Link from "next/link";
import { PageIntro, PageShell } from "@/components/PageShell";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[50vh] bg-background">
      <PageShell>
        <PageIntro
          title="Access denied"
          description="You do not have permission to open this workspace. Sign in with the correct account type or return to the public site."
        />
        <div className="flex flex-wrap gap-3">
          <Link
            href="/login"
            className="btn-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Sign in
          </Link>
          <Link
            href="/"
            className="rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted"
          >
            Home
          </Link>
        </div>
      </PageShell>
    </div>
  );
}
