"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { EVENTS_TRANSLATIONS } from "@/lib/i18n/events-translations";
import { PageIntro } from "@/components/PageShell";
import type { CommunityEventRow } from "@/lib/community-events";

type Props = {
  events: CommunityEventRow[];
};

export function EventsContent({ events }: Props) {
  const { locale } = useLanguage();
  const t = EVENTS_TRANSLATIONS[locale] ?? EVENTS_TRANSLATIONS.en;
  const hasUnconfirmed = events.some((e) => !e.confirmed);

  return (
    <>
      <PageIntro eyebrow={t.eyebrow} title={t.title} description={t.description} />
      {hasUnconfirmed ? (
        <p
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          role="status"
        >
          {t.unconfirmedNotice}
        </p>
      ) : null}
      <ul className="space-y-4">
        {events.map((e) => (
          <li
            key={e.id}
            className="rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {e.eventDate}
              </p>
              {!e.confirmed ? (
                <span className="rounded-md border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-900">
                  {t.unconfirmedBadge}
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-base font-bold text-brand-navy">{e.title}</p>
            <p className="mt-2 text-sm text-foreground/75">{e.detail}</p>
            {e.href ? (
              <Link
                href={e.href}
                className="mt-3 inline-block text-sm font-semibold text-brand-gold underline"
              >
                {t.relatedLink}
              </Link>
            ) : null}
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-foreground/65">
        {t.wantListedBefore}{" "}
        <Link href="/contact" className="font-semibold text-brand-gold underline">
          {t.contactTeamLabel}
        </Link>
        {t.wantListedAfter}
      </p>
    </>
  );
}
