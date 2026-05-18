"use client";

import Link from "next/link";
import { Bookmark, MapPin } from "lucide-react";
import type { Opportunity } from "@/lib/types";
import { formatOpportunityDeadline } from "@/lib/opportunity-display";
import { cn } from "@/lib/cn";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";

export function OpportunityListRow({ opportunity }: { opportunity: Opportunity }) {
  const { toggleSave, isSaved, hydrated } = useTurkiyeJobs();
  const saved = hydrated && isSaved(opportunity.id);
  const detailPath = opportunity.slug ?? opportunity.id;

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-brand-border bg-white px-4 py-3 shadow-sm transition-colors hover:border-brand-gold/40 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4 sm:py-4">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
          {opportunity.category}
        </p>
        <h2 className="mt-0.5 text-base font-bold text-brand-navy">
          <Link
            href={`/opportunities/${detailPath}`}
            className="hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 focus-visible:ring-offset-2 rounded-sm"
          >
            {opportunity.title}
          </Link>
        </h2>
        <p className="truncate text-sm font-medium text-foreground/80">{opportunity.organizationName}</p>
        <dl className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground/70">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-gold" aria-hidden />
            <span>{opportunity.location}</span>
          </div>
          <div>
            <span className="font-medium text-brand-navy">Deadline: </span>
            {formatOpportunityDeadline(opportunity.deadline)}
          </div>
          <div>
            <span className="font-medium text-brand-navy">Type: </span>
            {opportunity.type}
          </div>
          <div>
            <span className="font-medium text-brand-navy">Work: </span>
            {opportunity.workArrangement} · {opportunity.compensation}
          </div>
        </dl>
      </div>
      <div className="flex shrink-0 items-center justify-end gap-2 border-t border-brand-border pt-3 sm:flex-col sm:justify-center sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0 md:flex-row md:pl-4">
        <button
          type="button"
          onClick={() => toggleSave(opportunity.id)}
          className={cn(
            "rounded-lg border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50",
            saved
              ? "border-brand-gold bg-brand-gold/10 text-brand-navy"
              : "border-brand-border bg-brand-muted text-foreground/70 hover:border-brand-gold/50",
          )}
          aria-label={saved ? "Remove from saved" : "Save opportunity"}
          title={saved ? "Saved" : "Save"}
        >
          <Bookmark className={cn("h-5 w-5", saved && "fill-brand-gold")} aria-hidden />
        </button>
        <Link
          href={`/opportunities/${detailPath}`}
          className="inline-flex min-h-[2.75rem] items-center justify-center btn-primary px-4 py-2 text-xs font-semibold text-white  sm:min-h-0"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
