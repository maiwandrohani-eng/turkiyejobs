"use client";

import Link from "next/link";
import { Bookmark, MapPin } from "lucide-react";
import type { Opportunity } from "@/lib/types";
import { formatOpportunityDeadline } from "@/lib/opportunity-display";
import { cn } from "@/lib/cn";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { toggleSave, isSaved, hydrated } = useTurkiyeJobs();
  const saved = hydrated && isSaved(opportunity.id);
  const detailPath = opportunity.slug ?? opportunity.id;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-brand-border bg-white p-5 shadow-sm transition-all hover:border-brand-gold/45 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            {opportunity.category}
          </p>
          <h2 className="mt-1 text-lg font-bold text-brand-navy">
            <Link
              href={`/opportunities/${detailPath}`}
              className="rounded-sm hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45 focus-visible:ring-offset-2"
            >
              {opportunity.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm font-medium text-foreground/80">
            {opportunity.organizationName}
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleSave(opportunity.id)}
          className={cn(
            "shrink-0 rounded-lg border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50",
            saved
              ? "border-brand-gold bg-brand-gold/10 text-brand-navy"
              : "border-brand-border bg-brand-muted text-foreground/70 hover:border-brand-gold/50",
          )}
          aria-label={saved ? "Remove from saved" : "Save opportunity"}
          title={saved ? "Saved" : "Save"}
        >
          <Bookmark className={cn("h-5 w-5", saved && "fill-brand-gold")} aria-hidden />
        </button>
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70 line-clamp-3">
        {opportunity.shortDescription}
      </p>

      <dl className="mt-4 grid gap-2 text-sm text-foreground/75 sm:grid-cols-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
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

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/opportunities/${detailPath}`}
          className="inline-flex flex-1 items-center justify-center btn-primary px-4 py-2.5 text-sm font-semibold text-white  sm:flex-none"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
