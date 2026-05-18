"use client";

import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useLanguage } from "@/context/LanguageContext";
import { useAuthT } from "@/lib/i18n/use-auth-translations";

type Props = {
  resetOk: boolean;
  callbackUrl: string;
};

export function LoginPageView({ resetOk, callbackUrl }: Props) {
  const t = useAuthT();
  const { t: tHome } = useLanguage();

  return (
    <div className="min-h-[60vh] surface-hero">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow={t("loginEyebrow")}
          title={t("loginTitle")}
          description={t("loginDescription")}
        />
        <LoginForm resetOk={resetOk} callbackUrl={callbackUrl} />
        <p className="mt-6 text-center text-xs text-foreground/55">
          <Link href="/privacy" className="underline hover:text-brand-navy">
            {tHome("footerPrivacy")}
          </Link>
          {" · "}
          <Link href="/terms" className="underline hover:text-brand-navy">
            {tHome("footerTerms")}
          </Link>
        </p>
      </PageShell>
    </div>
  );
}
