"use client";

import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";
import { HomeCategorySection } from "@/components/home/HomeCategorySection";
import { HomeOrganizationsStrip } from "@/components/home/HomeOrganizationsStrip";
import { useLanguage } from "@/context/LanguageContext";
import type { VerifiedOrgStripItem } from "@/lib/home-page-data";
import { btnOutline, btnPrimaryLg, btnSecondaryLg } from "@/lib/brand-ui";

type Props = {
  publishedOpportunityCount: number;
  verifiedOrganizations: VerifiedOrgStripItem[];
};

export function HomeHero({ publishedOpportunityCount, verifiedOrganizations }: Props) {
  const { t } = useLanguage();

  return (
    <section className="surface-hero border-b border-brand-border">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
        <div>
          <p className="eyebrow-pill">
            <span className="h-2 w-2 rounded-full bg-brand-red" />
            {t("heroBadge")}
          </p>
          <h1 className="mt-5 text-balance text-3xl font-bold tracking-tight text-brand-teal md:text-5xl md:leading-tight">
            {t("heroHeading")}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
            {t("heroLine1")}
          </p>
          <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-foreground/75 md:text-lg">
            {t("heroLine2")}
          </p>
          <p className="mt-3 text-sm text-foreground/55">{t("heroTrust")}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/opportunities" className={btnPrimaryLg}>
              {t("ctaPrimary")}
            </Link>
            <Link href="/dashboard/organization" className={btnOutline + " h-12 px-6"}>
              {t("ctaSecondary")}
            </Link>
          </div>
        </div>

        <div className="relative rounded-3xl border border-brand-teal/15 bg-white p-8 shadow-md shadow-brand-teal/5">
          <div className="absolute inset-x-8 top-0 h-1 rounded-full bg-gradient-to-r from-brand-red via-brand-gold-soft to-brand-teal opacity-95" />
          <div className="flex flex-col items-center text-center">
            <LogoMark />
            <p className="mt-6 text-sm font-semibold text-brand-teal">{t("heroCardTitle")}</p>
            <p className="mt-2 text-sm text-foreground/65">{t("heroCardBody")}</p>
            <Link href="/opportunities" className={btnSecondaryLg + " mt-6 w-full"}>
              {t("heroCardCta")}
            </Link>
          </div>
        </div>
      </div>
      <HomeOrganizationsStrip organizations={verifiedOrganizations} />
      <HomeCategorySection publishedOpportunityCount={publishedOpportunityCount} />
    </section>
  );
}
