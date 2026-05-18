"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect } from "react";
import { Award, BadgeCheck, MapPin } from "lucide-react";
import type { Organization } from "@/lib/types";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";
import { useLanguage } from "@/context/LanguageContext";

/** Stable fragment id across organization renames (slug and public name can change). */
function orgAnchorId(organizationId: string) {
  return `org-${organizationId}`;
}

function scrollToOrgAnchor(anchorId: string): boolean {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(anchorId);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/** Deep links to `/organizations#org-…` (bookmark / email) scroll the directory list. */

export function OrganizationsDirectory({ organizations }: { organizations: Organization[] }) {
  const { mode, setMode } = usePersistedViewMode("turkiyejobs:v1:viewOrganizationsDirectory");
  const { t } = useLanguage();

  const scrollFromLocationHash = useCallback(() => {
    if (typeof window === "undefined" || organizations.length === 0) return;
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw.startsWith("org-")) return;
    const tryScroll = () => scrollToOrgAnchor(raw);
    tryScroll();
    requestAnimationFrame(tryScroll);
    setTimeout(tryScroll, 0);
    setTimeout(tryScroll, 80);
  }, [organizations]);

  useLayoutEffect(() => {
    scrollFromLocationHash();
  }, [scrollFromLocationHash]);

  useEffect(() => {
    const onHashChange = () => scrollFromLocationHash();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [scrollFromLocationHash]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/70">
          <span className="font-semibold text-brand-navy">{organizations.length}</span>{" "}
          {t("orgDirectoryCount")}
        </p>
        <ViewModeToggle
          value={mode}
          onChange={setMode}
          groupAriaLabel={t("orgDirectoryLayoutLabel")}
          className="self-stretch sm:self-auto"
        />
      </div>

      {mode === "card" ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {organizations.map((org) => (
            <article
              key={org.id}
              id={orgAnchorId(org.id)}
              className="flex h-full scroll-mt-24 flex-col rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    {org.sector ?? t("orgDirectorySocialImpact")}
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-brand-navy">{org.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/70">
                    <MapPin className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
                    {org.location}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  {org.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/20 px-2.5 py-0.5 text-xs font-semibold text-brand-navy">
                      <Award className="h-3.5 w-3.5" aria-hidden /> {t("orgDirectoryFeatured")}
                    </span>
                  ) : null}
                  {org.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-muted px-2.5 py-0.5 text-xs font-semibold text-brand-navy ring-1 ring-brand-gold/35">
                      <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> {t("orgDirectoryVerified")}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-foreground/50">
                      {t("orgDirectoryPendingVerification")}
                    </span>
                  )}
                </div>
              </div>
              <p
                className="mt-4 flex-1 text-sm leading-relaxed text-foreground/75 line-clamp-10"
                title={org.description.length > 400 ? org.description : undefined}
              >
                {org.description}
              </p>
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <Link
                  href={`/organizations/${encodeURIComponent(org.slug)}`}
                  className="inline-flex min-h-[2.75rem] cursor-pointer items-center justify-center btn-primary px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm  sm:min-h-0"
                >
                  {t("orgDirectoryViewProfile")}
                </Link>
                <Link
                  href={`/opportunities?orgId=${encodeURIComponent(org.id)}`}
                  className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-4 py-2.5 text-center text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 sm:min-h-0"
                >
                  {t("orgDirectoryViewOpportunities")}
                </Link>
                {org.website ? (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-4 py-2.5 text-center text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 sm:min-h-0"
                  >
                    {t("orgDirectoryWebsite")}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ul className="divide-y divide-brand-border rounded-2xl border border-brand-border bg-white shadow-sm">
          {organizations.map((org) => (
            <li
              key={org.id}
              id={orgAnchorId(org.id)}
              className="scroll-mt-24 px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                  {org.sector ?? t("orgDirectorySocialImpact")}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-bold text-brand-navy">{org.name}</h2>
                  {org.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-navy">
                      {t("orgDirectoryFeatured")}
                    </span>
                  ) : null}
                  {org.verified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-navy ring-1 ring-brand-gold/35">
                      {t("orgDirectoryVerified")}
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium uppercase text-foreground/50">
                      {t("orgDirectoryPendingVerificationShort")}
                    </span>
                  )}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/65">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden />
                  {org.location}
                </p>
                <p
                  className="mt-2 line-clamp-4 text-sm text-foreground/70"
                  title={org.description.length > 220 ? org.description : undefined}
                >
                  {org.description}
                </p>
              </div>
              <div className="mt-3 flex shrink-0 flex-col gap-2 sm:mt-0 sm:items-end">
                <Link
                  href={`/organizations/${encodeURIComponent(org.slug)}`}
                  className="inline-flex min-h-[2.75rem] w-full cursor-pointer items-center justify-center btn-primary px-3 py-2 text-center text-xs font-semibold text-white shadow-sm  sm:w-auto sm:min-h-0"
                >
                  {t("orgDirectoryViewProfile")}
                </Link>
                <Link
                  href={`/opportunities?orgId=${encodeURIComponent(org.id)}`}
                  className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 sm:w-auto sm:min-h-0"
                >
                  {t("orgDirectoryViewOpportunities")}
                </Link>
                {org.website ? (
                  <a
                    href={org.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[2.75rem] w-full items-center justify-center rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 sm:w-auto sm:min-h-0"
                  >
                    {t("orgDirectoryWebsite")}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
