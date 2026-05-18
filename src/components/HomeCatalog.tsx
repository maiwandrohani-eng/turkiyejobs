"use client";

import Link from "next/link";
import { HomeCtaRow, HomeFeatured } from "@/components/HomeFeatured";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";
import { useLanguage } from "@/context/LanguageContext";

export function HomeCatalog() {
  const { opportunities, hydrated } = useTurkiyeJobs();
  const { t } = useLanguage();
  const { mode: homeViewMode, setMode: setHomeViewMode } = usePersistedViewMode(
    "turkiyejobs:v1:viewHomeOpportunities",
  );

  if (!hydrated) {
    return (
      <>
        <section className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm text-foreground/60">{t("catalogLoading")}</p>
        </section>
      </>
    );
  }
  const featured = opportunities.filter((o) => o.featured).slice(0, 3);
  const latest = [...opportunities]
    .sort((a, b) => b.deadline.localeCompare(a.deadline))
    .slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-bold text-brand-navy">
              {t("catalogFeaturedHeading")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-foreground/70">
              {t("catalogFeaturedSubtext")}
            </p>
          </div>
          <ViewModeToggle
            value={homeViewMode}
            onChange={setHomeViewMode}
            groupAriaLabel={t("catalogLayoutLabel")}
            className="self-stretch sm:self-auto"
          />
        </div>
        <div className="mt-8">
          <HomeFeatured
            items={featured}
            viewMode={homeViewMode}
            emptyMessage={t("catalogFeaturedEmpty")}
          />
        </div>
        <HomeCtaRow />
      </section>

      <section className="border-t border-brand-border bg-brand-muted/50 py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy">
                {t("catalogLatestHeading")}
              </h2>
              <p className="mt-2 text-sm text-foreground/70">
                {t("catalogLatestSubtext")}
              </p>
            </div>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
              <ViewModeToggle
                value={homeViewMode}
                onChange={setHomeViewMode}
                groupAriaLabel={t("catalogLayoutLabel")}
                className="self-stretch sm:self-auto"
              />
              <Link
                href="/opportunities"
                className="text-center text-sm font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2 sm:text-left"
              >
                {t("catalogSeeFullList")}
              </Link>
            </div>
          </div>
          <div className="mt-8">
            <HomeFeatured
              items={latest}
              viewMode={homeViewMode}
              emptyMessage={t("catalogLatestEmpty")}
            />
          </div>
        </div>
      </section>
    </>
  );
}
