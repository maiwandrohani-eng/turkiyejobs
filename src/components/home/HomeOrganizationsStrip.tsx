"use client";

import Link from "next/link";
import type { VerifiedOrgStripItem } from "@/lib/home-page-data";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  organizations: VerifiedOrgStripItem[];
};

export function HomeOrganizationsStrip({ organizations }: Props) {
  const { t } = useLanguage();

  if (organizations.length === 0) return null;

  return (
    <section className="border-t border-brand-teal/10 bg-brand-muted/40 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-sm font-bold uppercase tracking-wide text-brand-teal/80">
          {t("orgsOnTurkiyejobs")}
        </h2>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {organizations.map((org) => (
            <li key={org.id}>
              <Link
                href={`/organizations/${encodeURIComponent(org.slug)}`}
                className="group flex flex-col items-center gap-2 text-center"
              >
                {org.logoUrl ? (
                  <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-brand-border bg-white p-1 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={org.logoUrl}
                      alt=""
                      className="max-h-full max-w-full object-contain"
                    />
                  </span>
                ) : (
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand-border bg-brand-muted/60 text-lg font-bold text-brand-navy shadow-sm">
                    {org.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="max-w-[10rem] text-xs font-semibold text-brand-navy group-hover:text-brand-gold">
                  {org.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
