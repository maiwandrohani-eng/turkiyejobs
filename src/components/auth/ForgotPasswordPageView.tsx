"use client";

import Link from "next/link";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useAuthT } from "@/lib/i18n/use-auth-translations";

type Props = {
  demo: boolean;
};

export function ForgotPasswordPageView({ demo }: Props) {
  const t = useAuthT();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow={t("forgotEyebrow")}
          title={t("forgotTitle")}
          description={t("forgotDescription")}
        />
        {demo ? (
          <div className="rounded-2xl border border-brand-border bg-white p-6 text-sm text-foreground/70 shadow-sm">
            <p>{t("demoForgotUnavailable")}</p>
            <p className="mt-4">
              <Link href="/login" className="font-semibold text-brand-gold underline">
                {t("backToSignIn")}
              </Link>
            </p>
          </div>
        ) : (
          <ForgotPasswordForm />
        )}
      </PageShell>
    </div>
  );
}
