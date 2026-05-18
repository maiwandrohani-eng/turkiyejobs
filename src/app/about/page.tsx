"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ABOUT_TRANSLATIONS } from "@/lib/i18n/about-translations";
import { PageIntro, PageShell } from "@/components/PageShell";

export default function AboutPage() {
  const { locale } = useLanguage();
  const t = ABOUT_TRANSLATIONS[locale] ?? ABOUT_TRANSLATIONS.en;

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <div className="max-w-none space-y-10">
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">{t.missionHeading}</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">{t.missionBody}</p>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">{t.serveHeading}</h2>
            <ul className="mt-4 list-inside list-disc space-y-2 text-foreground/80">
              <li>{t.serve1}</li>
              <li>{t.serve2}</li>
              <li>{t.serve3}</li>
              <li>{t.serve4}</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">{t.qualityHeading}</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">{t.qualityBody}</p>
          </section>

          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-brand-navy">{t.builtHeading}</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              {t.builtPara1Before}
              <Link
                href="https://inara.org"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-brand-gold underline"
              >
                INARA
              </Link>
              {t.builtPara1After}
            </p>
            <p className="mt-4 text-foreground/80 leading-relaxed">{t.builtPara2}</p>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
