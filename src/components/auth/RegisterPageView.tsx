"use client";

import { RegisterForm } from "@/components/RegisterForm";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useAuthT } from "@/lib/i18n/use-auth-translations";

export function RegisterPageView() {
  const t = useAuthT();

  return (
    <div className="min-h-[60vh] surface-hero">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow={t("registerEyebrow")}
          title={t("registerTitle")}
          description={t("registerDescription")}
        />
        <RegisterForm />
      </PageShell>
    </div>
  );
}
