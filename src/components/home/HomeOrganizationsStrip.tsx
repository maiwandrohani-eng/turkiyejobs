"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VerifiedOrgStripItem } from "@/lib/home-page-data";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  organizations: VerifiedOrgStripItem[];
};

function OrganizationLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const [broken, setBroken] = useState(false);
  if (!logoUrl || broken) {
    return (
      <span className="flex h-14 w-14 items-center justify-center rounded-xl border border-brand-border bg-brand-muted/60 text-lg font-bold text-brand-navy shadow-sm">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-brand-border bg-white p-1 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt=""
        loading="lazy"
        className="max-h-full max-w-full object-contain"
        onError={() => setBroken(true)}
      />
    </span>
  );
}

export function HomeOrganizationsStrip({ organizations }: Props) {
  const { t } = useLanguage();
  const sliderRef = useRef<HTMLUListElement | null>(null);

  if (organizations.length === 0) return null;

  const slideBy = (direction: "prev" | "next") => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = Math.max(240, Math.floor(el.clientWidth * 0.8));
    el.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  return (
    <section className="border-t border-brand-teal/10 bg-brand-muted/40 py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide text-brand-teal/80">
            {t("orgsOnTurkiyejobs")}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => slideBy("prev")}
              aria-label="Previous organizations"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white text-brand-navy shadow-sm hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => slideBy("next")}
              aria-label="Next organizations"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-border bg-white text-brand-navy shadow-sm hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
        <ul
          ref={sliderRef}
          className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:thin] md:gap-6"
        >
          {organizations.map((org) => (
            <li key={org.id} className="snap-start shrink-0">
              <Link
                href={`/organizations/${encodeURIComponent(org.slug)}`}
                className="group flex w-[11rem] flex-col items-center gap-2 rounded-2xl border border-brand-border bg-white px-3 py-3 text-center shadow-sm hover:border-brand-gold/40"
              >
                <OrganizationLogo name={org.name} logoUrl={org.logoUrl} />
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
