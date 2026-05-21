"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Award, BadgeCheck, MapPin } from "lucide-react";
import { ClaimProfileButton } from "@/components/ClaimProfileButton";
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

function normalizeOrganizationType(value?: string): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim();
  if (!normalized) return undefined;
  const upper = normalized.toUpperCase();

  if (upper.includes("UN")) return "UN";
  if (upper.includes("INGO") || upper.includes("INT.")) return "INGO";
  if (
    upper.includes("DERNEK") ||
    upper.includes("VAKIF") ||
    upper.includes("CEMIYET") ||
    upper.includes("COMMUNITY") ||
    upper.includes("LOCAL") ||
    upper.includes("SYRIAN-LED")
  ) {
    return "Local";
  }
  if (upper.includes("DONOR") || upper.includes("BILATERAL")) return "Donor";
  if (upper.includes("BANK") || upper.includes("MULTILATERAL") || upper.includes("FINANCE")) {
    return "Multilateral";
  }

  return normalized;
}

function extractLocationTags(value?: string): string[] {
  if (!value) return [];
  return Array.from(
    new Set(
      value
        .split(",")
        .map((part) => part.replace(/\(.*?\)/g, "").trim())
        .map((part) => part.split("/")[0]?.trim() ?? "")
        .filter(Boolean),
    ),
  );
}

function parseFilterParam(value: string | null): string {
  if (!value) return "all";
  const normalized = value.trim();
  return normalized || "all";
}

/** Deep links to `/organizations#org-…` (bookmark / email) scroll the directory list. */

export function OrganizationsDirectory({ organizations }: { organizations: Organization[] }) {
  const { mode, setMode } = usePersistedViewMode("turkiyejobs:v1:viewOrganizationsDirectory");
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [sectorFilter, setSectorFilter] = useState(parseFilterParam(searchParams.get("sector")));
  const [typeFilter, setTypeFilter] = useState(parseFilterParam(searchParams.get("type")));
  const [locationFilter, setLocationFilter] = useState(parseFilterParam(searchParams.get("location")));
  const [profileFilter, setProfileFilter] = useState(parseFilterParam(searchParams.get("profile")));

  const statusLabel = (org: Organization): string => {
    if (org.verificationStatus === "VERIFIED") return t("orgDirectoryVerifiedEmployer");
    if (org.verificationStatus === "CURATED_PUBLIC_PROFILE") return t("orgDirectoryCuratedPublicProfile");
    if (org.verificationStatus === "UNCLAIMED_PROFILE") return t("orgDirectoryUnclaimedProfile");
    return t("orgDirectoryPendingVerification");
  };

  const sectorOptions = useMemo(
    () => Array.from(new Set(organizations.map((org) => org.sector).filter(Boolean))).sort(),
    [organizations],
  );

  const typeOptions = useMemo(
    () =>
      Array.from(
        new Set(organizations.map((org) => normalizeOrganizationType(org.organizationType)).filter(Boolean)),
      ).sort(),
    [organizations],
  );

  const locationOptions = useMemo(
    () => Array.from(new Set(organizations.flatMap((org) => extractLocationTags(org.location)))).sort(),
    [organizations],
  );

  const filteredOrganizations = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return organizations.filter((org) => {
      const orgType = normalizeOrganizationType(org.organizationType);
      const orgLocations = extractLocationTags(org.location);
      const profileType =
        org.verificationStatus === "VERIFIED"
          ? "verified"
          : org.claimed
            ? "claimed"
            : "not-claimed";

      if (searchTerm) {
        const haystack = [org.name, org.description, org.location, org.sector, org.organizationType]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(searchTerm)) return false;
      }

      if (sectorFilter !== "all" && org.sector !== sectorFilter) return false;
      if (typeFilter !== "all" && orgType !== typeFilter) return false;
      if (locationFilter !== "all" && !orgLocations.includes(locationFilter)) return false;
      if (profileFilter !== "all" && profileType !== profileFilter) return false;

      return true;
    });
  }, [locationFilter, organizations, profileFilter, search, sectorFilter, typeFilter]);

  useEffect(() => {
    const nextSearch = searchParams.get("search") ?? "";
    const nextSector = parseFilterParam(searchParams.get("sector"));
    const nextType = parseFilterParam(searchParams.get("type"));
    const nextLocation = parseFilterParam(searchParams.get("location"));
    const nextProfile = parseFilterParam(searchParams.get("profile"));

    if (nextSearch !== search) setSearch(nextSearch);
    if (nextSector !== sectorFilter) setSectorFilter(nextSector);
    if (nextType !== typeFilter) setTypeFilter(nextType);
    if (nextLocation !== locationFilter) setLocationFilter(nextLocation);
    if (nextProfile !== profileFilter) setProfileFilter(nextProfile);
  }, [searchParamsString]);

  useEffect(() => {
    const params = new URLSearchParams(searchParamsString);
    const normalizedSearch = search.trim();

    if (normalizedSearch) params.set("search", normalizedSearch);
    else params.delete("search");

    if (sectorFilter !== "all") params.set("sector", sectorFilter);
    else params.delete("sector");

    if (typeFilter !== "all") params.set("type", typeFilter);
    else params.delete("type");

    if (locationFilter !== "all") params.set("location", locationFilter);
    else params.delete("location");

    if (profileFilter !== "all") params.set("profile", profileFilter);
    else params.delete("profile");

    const current = searchParamsString;
    const next = params.toString();
    if (current !== next) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [locationFilter, pathname, profileFilter, router, search, searchParamsString, sectorFilter, typeFilter]);

  const scrollFromLocationHash = useCallback(() => {
    if (typeof window === "undefined" || filteredOrganizations.length === 0) return;
    const raw = window.location.hash.replace(/^#/, "");
    if (!raw.startsWith("org-")) return;
    const tryScroll = () => scrollToOrgAnchor(raw);
    tryScroll();
    requestAnimationFrame(tryScroll);
    setTimeout(tryScroll, 0);
    setTimeout(tryScroll, 80);
  }, [filteredOrganizations]);

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
      <div className="mb-4 rounded-2xl border border-brand-border bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))]">
          <label className="text-sm font-medium text-brand-navy">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {t("filterKeyword")}
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("orgDirectorySearchPlaceholder")}
              className="w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </label>

          <label className="text-sm font-medium text-brand-navy">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {t("orgDirectorySector")}
            </span>
            <select
              value={sectorFilter}
              onChange={(event) => setSectorFilter(event.target.value)}
              className="w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <option value="all">{t("orgDirectoryAllSectors")}</option>
              {sectorOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-brand-navy">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {t("filterType")}
            </span>
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <option value="all">{t("filterAllTypes")}</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-brand-navy">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {t("filterLocation")}
            </span>
            <select
              value={locationFilter}
              onChange={(event) => setLocationFilter(event.target.value)}
              className="w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <option value="all">{t("orgDirectoryAllLocations")}</option>
              {locationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-brand-navy">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-foreground/55">
              {t("orgDirectoryProfileType")}
            </span>
            <select
              value={profileFilter}
              onChange={(event) => setProfileFilter(event.target.value)}
              className="w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            >
              <option value="all">{t("orgDirectoryAllProfiles")}</option>
              <option value="verified">{t("orgDirectoryVerifiedEmployer")}</option>
              <option value="claimed">{t("orgDirectoryClaimed")}</option>
              <option value="not-claimed">{t("orgDirectoryNotClaimed")}</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground/70">
          <span className="font-semibold text-brand-navy">{filteredOrganizations.length}</span>{" "}
          {t("orgDirectoryCount")}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {(search || sectorFilter !== "all" || typeFilter !== "all" || locationFilter !== "all" || profileFilter !== "all") ? (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSectorFilter("all");
                setTypeFilter("all");
                setLocationFilter("all");
                setProfileFilter("all");
              }}
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              {t("filterClearAll")}
            </button>
          ) : null}
          <ViewModeToggle
            value={mode}
            onChange={setMode}
            groupAriaLabel={t("orgDirectoryLayoutLabel")}
            className="self-stretch sm:self-auto"
          />
        </div>
      </div>

      {filteredOrganizations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-border bg-white px-6 py-10 text-center text-sm text-foreground/70 shadow-sm">
          {t("orgDirectoryNoMatch")}
        </div>
      ) : mode === "card" ? (
        <div className="space-y-4">
          {filteredOrganizations.map((org) => {
            const showCuratedNotice =
              org.verificationStatus === "CURATED_PUBLIC_PROFILE" ||
              org.verificationStatus === "UNCLAIMED_PROFILE";

            return (
              <article
                key={org.id}
                id={orgAnchorId(org.id)}
                className="scroll-mt-24 rounded-2xl border border-brand-border bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                        {org.sector ?? t("orgDirectorySocialImpact")}
                      </p>
                      {org.verificationStatus === "VERIFIED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-muted px-2.5 py-0.5 text-[11px] font-semibold uppercase text-brand-navy ring-1 ring-brand-gold/35">
                          <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                          {statusLabel(org)}
                        </span>
                      ) : showCuratedNotice ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#d8d1c7] bg-[#f4efe8] px-2.5 py-0.5 text-[11px] font-semibold uppercase text-brand-navy">
                          {statusLabel(org)}
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium uppercase text-foreground/50">
                          {statusLabel(org)}
                        </span>
                      )}
                      {org.featured ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase text-brand-navy">
                          <Award className="h-3.5 w-3.5" aria-hidden />
                          {t("orgDirectoryFeatured")}
                        </span>
                      ) : null}
                    </div>

                    <h2 className="mt-1 text-2xl font-bold leading-tight text-brand-navy">{org.name}</h2>

                    <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground/70">
                      <MapPin className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
                      {org.location}
                    </p>

                    <p
                      className="mt-3 text-[22px] leading-relaxed text-foreground/80"
                      title={org.description.length > 420 ? org.description : undefined}
                    >
                      {org.description}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col gap-2 sm:w-48 sm:items-end">
                    <Link
                      href={`/organizations/${encodeURIComponent(org.slug)}`}
                      className="inline-flex min-h-[2.5rem] w-full cursor-pointer items-center justify-center rounded-xl bg-brand-navy px-4 py-2 text-sm font-semibold text-white hover:bg-brand-navy-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/35"
                    >
                      {t("orgDirectoryViewProfile")}
                    </Link>
                    <Link
                      href={`/opportunities?orgId=${encodeURIComponent(org.id)}`}
                      className="inline-flex min-h-[2.5rem] w-full items-center justify-center rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                    >
                      {t("orgDirectoryViewOpportunities")}
                    </Link>
                    {org.website ? (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[2.5rem] w-full items-center justify-center rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                      >
                        {t("orgDirectoryWebsite")}
                      </a>
                    ) : null}
                    {org.claimed === false ? (
                      <ClaimProfileButton
                        organizationId={org.id}
                        organizationName={org.name}
                        className="inline-flex min-h-[2.5rem] w-full items-center justify-center rounded-xl border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 disabled:opacity-60"
                      />
                    ) : null}
                  </div>
                </div>

                {showCuratedNotice ? (
                  <div className="mt-4 rounded-xl border border-[#d8d1c7] bg-[#faf8f5] px-3 py-2.5 text-sm leading-relaxed text-foreground/75">
                    This organization profile was created from publicly available or admin-provided information. The organization has not yet claimed this profile. Organizations may contact us to claim or update their profile.
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <ul className="divide-y divide-brand-border rounded-2xl border border-brand-border bg-white shadow-sm">
          {filteredOrganizations.map((org) => (
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
                  {org.verificationStatus === "VERIFIED" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-muted px-2 py-0.5 text-[10px] font-semibold uppercase text-brand-navy ring-1 ring-brand-gold/35">
                      {t("orgDirectoryVerifiedEmployer")}
                    </span>
                  ) : org.verificationStatus === "CURATED_PUBLIC_PROFILE" ||
                    org.verificationStatus === "UNCLAIMED_PROFILE" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold uppercase text-sky-900 ring-1 ring-sky-200">
                      {statusLabel(org)}
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
                {org.claimed === false ? (
                  <ClaimProfileButton
                    organizationId={org.id}
                    organizationName={org.name}
                    className="mt-2 inline-flex min-h-[2.25rem] items-center justify-center rounded-lg border border-brand-border px-3 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 disabled:opacity-60"
                  />
                ) : null}
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
