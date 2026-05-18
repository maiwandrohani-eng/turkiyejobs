"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { HOW_IT_WORKS_TRANSLATIONS } from "@/lib/i18n/how-it-works-translations";
import { PageIntro } from "@/components/PageShell";

export function HowItWorksContent() {
  const { locale } = useLanguage();
  const t = HOW_IT_WORKS_TRANSLATIONS[locale];

  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.title} description={t.description} />
      <div className="space-y-10 text-sm leading-relaxed text-foreground/80">
        <section>
          <h2 className="text-lg font-bold text-brand-navy">{t.applicantsHeading}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              {t.applicant1Before}{" "}
              <Link href="/dashboard/user" className="font-semibold text-brand-gold underline">
                {t.applicant1LinkLabel}
              </Link>
              {t.applicant1After}
            </li>
            <li>{t.applicant2}</li>
            <li>
              {t.applicant3Before} <strong>{t.applicant3Bold}</strong> {t.applicant3After}
            </li>
          </ul>
          <p className="mt-4">
            <Link
              href="/resources/internal-application-checklist-turkiyejobs"
              className="font-semibold text-brand-gold underline"
            >
              {t.checklistLink}
            </Link>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brand-navy">{t.employersHeading}</h2>
          <ol className="mt-3 list-decimal space-y-3 pl-5">
            <li>{t.employer1}</li>
            <li>{t.employer2}</li>
            <li>{t.employer3}</li>
          </ol>
          <p className="mt-4">{t.employerTwoStage}</p>
          <p className="mt-4">{t.employer48h}</p>
          <p className="mt-4">
            <Link href="/posting-guidelines" className="font-semibold text-brand-gold underline">
              {t.postingGuidelinesLink}
            </Link>
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brand-navy">{t.trustHeading}</h2>
          <p className="mt-3">
            {t.trustBefore ? <>{t.trustBefore} </> : null}
            <Link href="/organizations" className="font-semibold text-brand-gold underline">
              {t.trustLinkLabel}
            </Link>{" "}
            {t.trustAfter}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-brand-navy">{t.exploreHeading}</h2>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link href="/sectors" className="font-semibold text-brand-gold underline">
                {t.exploreSectors}
              </Link>
            </li>
            <li>
              <Link href="/events" className="font-semibold text-brand-gold underline">
                {t.exploreEvents}
              </Link>
            </li>
            <li>
              <Link href="/spotlights" className="font-semibold text-brand-gold underline">
                {t.exploreSpotlights}
              </Link>
            </li>
            <li>
              <Link href="/impact" className="font-semibold text-brand-gold underline">
                {t.exploreImpact}
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
