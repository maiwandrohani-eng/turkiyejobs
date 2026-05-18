"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Opportunity, OpportunityCategory } from "@/lib/types";
import { OpportunityCard } from "@/components/OpportunityCard";
import { OpportunityListRow } from "@/components/OpportunityListRow";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/context/LanguageContext";
import {
  labelOpportunityCategory,
  labelOpportunityType,
} from "@/lib/i18n/opportunity-labels";

const CATEGORIES: OpportunityCategory[] = [
  "Jobs",
  "Consultancies",
  "Trainings",
  "Volunteer Roles",
  "Tenders",
  "Grants",
];

type Props = {
  opportunities: Opportunity[];
  /** Legacy `?org=` filter by exact public organization name (still supported). */
  initialOrganization?: string;
  /** Preferred `?orgId=` filter by organization primary key (stable across renames). */
  initialOrganizationId?: string;
  /** From URL `?category=` — must match an OpportunityCategory label or ignored. */
  initialCategory?: string | null;
};

function categoryFromParam(raw: string | null | undefined): OpportunityCategory | "All" {
  if (!raw?.trim()) return "All";
  const decoded = decodeURIComponent(raw.trim());
  return CATEGORIES.includes(decoded as OpportunityCategory)
    ? (decoded as OpportunityCategory)
    : "All";
}

export function OpportunitiesExplorer({
  opportunities,
  initialOrganization = "",
  initialOrganizationId = "",
  initialCategory = null,
}: Props) {
  const { t, locale } = useLanguage();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<OpportunityCategory | "All">(() =>
    categoryFromParam(initialCategory),
  );
  const [location, setLocation] = useState("");
  const [orgIdFilter, setOrgIdFilter] = useState(() => initialOrganizationId.trim());
  const [orgNameFilter, setOrgNameFilter] = useState(() =>
    initialOrganizationId.trim() ? "" : initialOrganization.trim(),
  );
  const [type, setType] = useState("");
  const [work, setWork] = useState<string>("All");
  const [paid, setPaid] = useState<string>("All");
  const [deadlineBefore, setDeadlineBefore] = useState("");
  const { mode: viewMode, setMode: setViewMode } = usePersistedViewMode(
    "turkiyejobs:v1:viewOpportunitiesBrowse",
  );

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCategory(categoryFromParam(initialCategory));
    }, 0);
    return () => window.clearTimeout(id);
  }, [initialCategory]);

  useEffect(() => {
    const tid = window.setTimeout(() => {
      const id = initialOrganizationId.trim();
      setOrgIdFilter(id);
      setOrgNameFilter(id ? "" : initialOrganization.trim());
    }, 0);
    return () => window.clearTimeout(tid);
  }, [initialOrganizationId, initialOrganization]);

  const orgOptions = useMemo(() => {
    const m = new Map<string, string>();
    for (const o of opportunities) {
      if (!m.has(o.organizationId)) m.set(o.organizationId, o.organizationName);
    }
    return [...m.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [opportunities]);

  const types = useMemo(() => {
    const s = new Set(opportunities.map((o) => o.type));
    return [...s].sort();
  }, [opportunities]);

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (category !== "All" && o.category !== category) return false;
      if (location && !o.location.toLowerCase().includes(location.toLowerCase()))
        return false;
      if (orgIdFilter && o.organizationId !== orgIdFilter) return false;
      if (!orgIdFilter && orgNameFilter && o.organizationName !== orgNameFilter) return false;
      if (type && o.type !== type) return false;
      if (work !== "All" && o.workArrangement !== work) return false;
      if (paid === "Paid" && o.compensation !== "Paid") return false;
      if (paid === "Unpaid" && o.compensation !== "Unpaid") return false;
      if (deadlineBefore && o.deadline > deadlineBefore) return false;
      if (q) {
        const hay = `${o.title} ${o.organizationName} ${o.shortDescription} ${o.category}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [
    opportunities,
    q,
    category,
    location,
    orgIdFilter,
    orgNameFilter,
    type,
    work,
    paid,
    deadlineBefore,
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit space-y-4 rounded-2xl border border-brand-border bg-white p-5 shadow-sm lg:sticky lg:top-24">
        <div>
          <label className="text-xs font-semibold text-brand-navy">{t("filterKeyword")}</label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("filterKeywordPlaceholder")}
              className="w-full rounded-lg border border-brand-border bg-brand-muted py-2.5 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">{t("filterCategory")}</label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as OpportunityCategory | "All")
            }
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="All">{t("filterAllCategories")}</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {labelOpportunityCategory(locale, c)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">{t("filterOrganization")}</label>
          <select
            value={orgIdFilter}
            onChange={(e) => {
              const v = e.target.value;
              setOrgIdFilter(v);
              setOrgNameFilter("");
            }}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="">{t("filterAllOrganizations")}</option>
            {orgOptions.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">{t("filterLocation")}</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("filterLocationPlaceholder")}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">{t("filterType")}</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="">{t("filterAllTypes")}</option>
            {types.map((tp) => (
              <option key={tp} value={tp}>
                {labelOpportunityType(locale, tp)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">{t("filterWorkArrangement")}</label>
          <select
            value={work}
            onChange={(e) => setWork(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="All">{t("filterAny")}</option>
            <option value="Remote">{t("filterRemote")}</option>
            <option value="Hybrid">{t("filterHybrid")}</option>
            <option value="On-site">{t("filterOnSite")}</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">{t("filterCompensation")}</label>
          <select
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          >
            <option value="All">{t("filterAny")}</option>
            <option value="Paid">{t("filterPaid")}</option>
            <option value="Unpaid">{t("filterUnpaid")}</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy">{t("filterDeadline")}</label>
          <input
            type="date"
            value={deadlineBefore}
            onChange={(e) => setDeadlineBefore(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-border bg-white py-2.5 px-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setQ("");
            setCategory("All");
            setLocation("");
            setOrgIdFilter("");
            setOrgNameFilter("");
            setType("");
            setWork("All");
            setPaid("All");
            setDeadlineBefore("");
          }}
          className="w-full rounded-lg border border-brand-border py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-muted"
        >
          {t("filterClearAll")}
        </button>
      </aside>

      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground/70">
            {t("filterShowing")}{" "}
            <span className="font-semibold text-brand-navy">{filtered.length}</span>{" "}
            {t("filterOpportunitiesCount")}
          </p>
          <ViewModeToggle
            value={viewMode}
            onChange={setViewMode}
            groupAriaLabel={t("filterLayoutLabel")}
            className="self-stretch sm:self-auto"
          />
        </div>
        <div
          className={cn(
            viewMode === "card" && "grid gap-5 sm:grid-cols-2",
            viewMode === "card" && filtered.length === 0 && "sm:grid-cols-1",
            viewMode === "list" && "flex flex-col gap-3",
          )}
        >
          {filtered.map((o) =>
            viewMode === "card" ? (
              <OpportunityCard key={o.id} opportunity={o} />
            ) : (
              <OpportunityListRow key={o.id} opportunity={o} />
            ),
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-brand-border bg-white px-6 py-10 text-center text-sm text-foreground/70 shadow-sm">
            {t("filterNoMatch")}
          </p>
        ) : null}
      </div>
    </div>
  );
}
