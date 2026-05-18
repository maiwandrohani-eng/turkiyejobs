"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const EXPLORE_CARDS = [
  { href: "/how-it-works", titleKey: "exploreCard1Title", textKey: "exploreCard1Text" },
  { href: "/sectors", titleKey: "exploreCard2Title", textKey: "exploreCard2Text" },
  {
    href: "/resources/internal-application-checklist-turkiyejobs",
    titleKey: "exploreCard3Title",
    textKey: "exploreCard3Text",
  },
  { href: "/events", titleKey: "exploreCard4Title", textKey: "exploreCard4Text" },
  { href: "/spotlights", titleKey: "exploreCard5Title", textKey: "exploreCard5Text" },
  { href: "/impact", titleKey: "exploreCard6Title", textKey: "exploreCard6Text" },
] as const;

export function HomeExplore() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-brand-border bg-white py-14 md:bg-gradient-to-b md:from-white md:to-brand-muted/60">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-bold text-brand-navy">{t("exploreHeading")}</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">{t("exploreSubtext")}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EXPLORE_CARDS.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className="flex h-full flex-col rounded-2xl border border-brand-border bg-white p-5 shadow-sm transition-shadow hover:border-brand-red/35 hover:shadow-md hover:shadow-brand-teal/5"
              >
                <span className="text-base font-bold text-brand-teal">{t(c.titleKey)}</span>
                <span className="mt-2 text-sm text-foreground/75">{t(c.textKey)}</span>
                <span className="mt-4 text-sm font-semibold text-brand-red">{t("readMore")}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-4 text-sm">
          <Link
            href="/posting-guidelines"
            className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
          >
            {t("explorePostingGuidelines")}
          </Link>
          <Link
            href="/partners"
            className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
          >
            {t("explorePartnersLink")}
          </Link>
        </div>
      </div>
    </section>
  );
}
