"use client";

import Link from "next/link";
import { DEFAULT_SOCIAL_LINKS, type SocialLink } from "@/lib/site-contact-defaults";
import { useLanguage } from "@/context/LanguageContext";

type SiteFooterProps = {
  /** When set (e.g. from DB via layout), overrides default social icons. */
  social?: SocialLink[];
};

export function SiteFooter({ social }: SiteFooterProps) {
  const { t } = useLanguage();
  const links = social?.length ? social : DEFAULT_SOCIAL_LINKS;

  return (
    <footer className="border-t border-brand-teal-deep/30 bg-brand-teal text-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="text-base font-semibold">
              <span className="text-brand-gold-soft">Türkiye</span>
              <span className="text-white">Jobs</span>
              <span className="text-brand-gray">.org</span>
            </div>
            <p className="mt-2 text-sm text-white/80">{t("footerTagline")}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {links.map((s) => (
                <a
                  key={`${s.href}-${s.label}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/20 px-2 text-xs font-semibold text-white/90 transition-colors hover:border-brand-gold-soft hover:text-brand-gold-soft"
                  aria-label={s.label}
                  title={s.label}
                >
                  {s.abbr}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-brand-gold-soft">{t("footerPlatformCol")}</div>
              <Link href="/opportunities" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerOpportunities")}
              </Link>
              <Link href="/organizations" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerOrganizations")}
              </Link>
              <Link href="/resources" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerResources")}
              </Link>
              <Link href="/how-it-works" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerHowItWorks")}
              </Link>
              <Link href="/sectors" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerBrowseTheme")}
              </Link>
              <Link href="/posting-guidelines" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerPostingGuidelines")}
              </Link>
              <Link href="/events" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerEvents")}
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-brand-gold-soft">{t("footerCompanyCol")}</div>
              <Link href="/about" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerAbout")}
              </Link>
              <Link href="/contact" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerContact")}
              </Link>
              <Link href="/partners" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerPartners")}
              </Link>
              <Link href="/impact" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerTransparency")}
              </Link>
              <Link href="/spotlights" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerSpotlights")}
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold text-brand-gold-soft">{t("footerLegalCol")}</div>
              <Link href="/terms" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerTerms")}
              </Link>
              <Link href="/privacy" className="text-white/75 hover:text-brand-gold-soft">
                {t("footerPrivacy")}
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <div>{t("footerCopyright")}</div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-red" />
            <span className="text-white/70">{t("footerBuiltFor")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
