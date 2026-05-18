"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { btnPrimaryLg } from "@/lib/brand-ui";

export function HomeEmployerCta() {
  const { t } = useLanguage();

  return (
    <section className="surface-teal border-t border-brand-teal/15 py-14">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl font-bold text-brand-teal">{t("employerHeading")}</h2>
        <p className="mt-4 text-base leading-relaxed text-brand-teal/80">{t("employerBody")}</p>
        <Link href="/dashboard/organization" className={btnPrimaryLg + " mt-8"}>
          {t("employerButton")}
        </Link>
        <p className="mt-4 text-sm text-brand-teal/60">{t("employerSupport")}</p>
      </div>
    </section>
  );
}
