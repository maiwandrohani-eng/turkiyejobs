"use client";

import Link from "next/link";
import { OpportunityCard } from "@/components/OpportunityCard";
import { OpportunityListRow } from "@/components/OpportunityListRow";
import type { Opportunity } from "@/lib/types";
import type { BrowseViewMode } from "@/hooks/usePersistedViewMode";
import { useLanguage } from "@/context/LanguageContext";

export function HomeFeatured({
  items,
  viewMode = "card",
  emptyMessage,
}: {
  items: Opportunity[];
  viewMode?: BrowseViewMode;
  emptyMessage?: string;
}) {
  const { t } = useLanguage();
  const empty = emptyMessage ?? t("catalogLatestEmpty");

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-border bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm text-foreground/70">{empty}</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-3">
        {items.map((o) => (
          <OpportunityListRow key={o.id} opportunity={o} />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((o) => (
        <OpportunityCard key={o.id} opportunity={o} />
      ))}
    </div>
  );
}

export function HomeCtaRow() {
  const { t } = useLanguage();

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link
        href="/opportunities"
        className="inline-flex h-11 items-center justify-center btn-primary px-6 text-sm font-semibold text-white "
      >
        {t("catalogViewAll")}
      </Link>
      <Link
        href="/register"
        className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-brand-gold/70 bg-white px-6 text-sm font-semibold text-brand-navy hover:border-brand-gold hover:bg-brand-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
      >
        {t("catalogCreateAccount")}
      </Link>
    </div>
  );
}
