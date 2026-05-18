"use client";

import Link from "next/link";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useAuthT } from "@/lib/i18n/use-auth-translations";

type Props = {
  demo: boolean;
  token: string;
};

export function ResetPasswordPageView({ demo, token }: Props) {
  const t = useAuthT();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow={t("resetEyebrow")}
          title={t("resetTitle")}
          description={t("resetDescription")}
        />
        {demo ? (
          <div className="rounded-2xl border border-brand-border bg-white p-6 text-sm text-foreground/70 shadow-sm">
            <p>{t("demoResetUnavailable")}</p>
            <p className="mt-4">
              <Link href="/login" className="font-semibold text-brand-gold underline">
                {t("backToSignIn")}
              </Link>
            </p>
          </div>
        ) : (
          <ResetPasswordForm token={token} />
        )}
      </PageShell>
    </div>
  );
}
