"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { IMPACT_TRANSLATIONS } from "@/lib/i18n/impact-translations";
import { PageIntro } from "@/components/PageShell";

export function ImpactContent() {
  const { locale } = useLanguage();
  const t = IMPACT_TRANSLATIONS[locale] ?? IMPACT_TRANSLATIONS.en;

  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="space-y-8 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-bold text-brand-navy">{t.commitmentsHeading}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t.commitment1}</li>
            <li>{t.commitment2}</li>
            <li>{t.commitment3}</li>
            <li>{t.commitment4}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brand-navy">{t.verificationHeading}</h2>
          <p className="mt-3">{t.verificationBody}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brand-navy">{t.optimizeHeading}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>{t.optimize1Label}</strong>
              {t.optimize1}
            </li>
            <li>
              <strong>{t.optimize2Label}</strong>
              {t.optimize2}
            </li>
            <li>
              <strong>{t.optimize3Label}</strong>
              {t.optimize3}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brand-navy">{t.growingHeading}</h2>
          <p className="mt-3">
            {t.growingBefore}{" "}
            <Link href="/contact" className="font-semibold text-brand-gold underline">
              {t.growingContactLabel}
            </Link>
            {t.growingAfter}
          </p>
        </section>
      </div>
    </>
  );
}
