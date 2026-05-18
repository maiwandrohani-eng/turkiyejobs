"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { OpportunityDetailActions } from "@/components/OpportunityDetailActions";
import { OpportunityDetailFields } from "@/components/OpportunityDetailFields";
import { PageShell } from "@/components/PageShell";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { canUserViewOpportunityDetail, suppressedCatalogIdsForBrowse } from "@/lib/opportunity-visibility";
import {
  applicationMethodLabel,
  getOpportunityApplicationMethod,
} from "@/lib/opportunity-apply";

import type { Opportunity } from "@/lib/types";

function formatDeadline(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type Props = {
  /** From Neon when DATABASE_URL is set; `null` means not in DB; `undefined` means server skipped DB. */
  initialOpportunity?: Opportunity | null;
  pathParam: string;
};

export default function OpportunityDetailPageClient({
  initialOpportunity,
  pathParam,
}: Props) {
  const params = useParams();
  const raw = typeof params?.id === "string" ? params.id : pathParam;
  const { getOpportunityById, bootReady, session, suppressedCatalogIds } =
    useTurkiyeJobs();

  const waitingHydration =
    (initialOpportunity === undefined && !bootReady) ||
    (initialOpportunity === null && !bootReady);

  if (waitingHydration) {
    return (
      <div className="min-h-[40vh] bg-background">
        <PageShell>
          <p className="text-sm text-foreground/60">Loading…</p>
        </PageShell>
      </div>
    );
  }

  const resolved =
    initialOpportunity !== undefined && initialOpportunity !== null
      ? initialOpportunity
      : getOpportunityById(raw);

  if (!resolved) {
    return (
      <div className="min-h-[40vh] bg-background">
        <PageShell>
          <p className="text-brand-navy font-semibold">Opportunity not found.</p>
          <p className="mt-2 text-sm text-foreground/70">
            This link may be out of date, or the listing may have been removed.
          </p>
          <Link
            href="/opportunities"
            className="mt-4 inline-block text-sm font-semibold text-brand-gold underline"
          >
            Back to opportunities
          </Link>
        </PageShell>
      </div>
    );
  }

  const opportunity = resolved;

  const canView = canUserViewOpportunityDetail(session, opportunity, {
    suppressedCatalogIds: suppressedCatalogIdsForBrowse(suppressedCatalogIds),
  });

  if (!canView) {
    return (
      <div className="min-h-[40vh] bg-background">
        <PageShell>
          <p className="text-brand-navy font-semibold">This listing is not available.</p>
          <p className="mt-2 text-sm text-foreground/70">
            It may be awaiting approval, closed, or restricted to the employer workspace.
          </p>
          <Link
            href="/opportunities"
            className="mt-4 inline-block text-sm font-semibold text-brand-gold underline"
          >
            Browse published opportunities
          </Link>
        </PageShell>
      </div>
    );
  }

  const pending = opportunity.visibility === "pending_approval";
  const rejected = opportunity.visibility === "rejected";
  const closed = opportunity.visibility === "closed";
  const applyMethod = getOpportunityApplicationMethod(opportunity);

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <nav className="mb-6 text-sm text-foreground/65">
          <Link href="/opportunities" className="hover:text-brand-navy">
            Opportunities
          </Link>
          <span className="mx-2">/</span>
          <span className="text-brand-navy">{opportunity.title}</span>
        </nav>

        {pending ? (
          <div className="mb-6 rounded-xl border border-brand-gold/50 bg-brand-gold-muted px-4 py-3 text-sm text-brand-navy">
            <strong>Pending review:</strong> This listing is waiting for platform
            admin approval. It is visible to your team for preview; applicants cannot
            apply until it is published.
          </div>
        ) : null}
        {rejected ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            This listing was not approved for publication. It remains visible to your
            organization for reference.
          </div>
        ) : null}
        {closed ? (
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
            This listing is closed. It is hidden from public search but still visible
            here for administrators and the posting organization.
          </div>
        ) : null}

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <article className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              {opportunity.category}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
              {opportunity.title}
            </h1>
            <p className="mt-2 text-lg font-medium text-foreground/80">
              {opportunity.organizationName}
            </p>

            <div className="mt-4 rounded-xl border border-brand-border bg-brand-muted/40 px-4 py-3 text-sm">
              <dl className="grid gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    Organization
                  </dt>
                  <dd className="mt-0.5 font-medium text-brand-navy">
                    {opportunity.organizationName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    Deadline
                  </dt>
                  <dd className="mt-0.5 font-medium text-brand-navy">
                    {formatDeadline(opportunity.deadline)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    Application type
                  </dt>
                  <dd className="mt-0.5 text-foreground/85">
                    {applicationMethodLabel(applyMethod)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                    Apply method
                  </dt>
                  <dd className="mt-0.5 text-foreground/85">
                    {applyMethod === "internal"
                      ? "Submit through TürkiyeJobs.org (stored when you apply)."
                      : applyMethod === "email"
                        ? `Apply by email to ${opportunity.applicationEmail ?? "the address shown in Apply"}.`
                        : "Follow the employer’s external application link in the Apply panel."}
                  </dd>
                </div>
              </dl>
            </div>

            <dl className="mt-6 grid gap-3 text-sm text-foreground/80 sm:grid-cols-2">
              <div>
                <dt className="font-semibold text-brand-navy">Location</dt>
                <dd>{opportunity.location}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-navy">Deadline</dt>
                <dd>{opportunity.deadline}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-navy">Type</dt>
                <dd>{opportunity.type}</dd>
              </div>
              <div>
                <dt className="font-semibold text-brand-navy">Arrangement</dt>
                <dd>
                  {opportunity.workArrangement} · {opportunity.compensation}
                </dd>
              </div>
            </dl>

            <section className="mt-8 space-y-4 text-foreground/80">
              <h2 className="text-base font-bold text-brand-navy">Summary</h2>
              <p className="leading-relaxed">{opportunity.shortDescription}</p>
            </section>

            <section className="mt-8 space-y-4 text-foreground/80">
              <h2 className="text-base font-bold text-brand-navy">Full description</h2>
              <p className="leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </section>

            <section className="mt-8 space-y-4 text-foreground/80">
              <h2 className="text-base font-bold text-brand-navy">Requirements</h2>
              <p className="leading-relaxed whitespace-pre-line">
                {opportunity.requirements}
              </p>
            </section>

            <section className="mt-8 space-y-4 text-foreground/80">
              <h2 className="text-base font-bold text-brand-navy">How to apply</h2>
              <p className="leading-relaxed whitespace-pre-line">
                {opportunity.howToApply}
              </p>
            </section>

            <OpportunityDetailFields o={opportunity} />
          </article>

          <aside>
            <OpportunityDetailActions opportunity={opportunity} />
          </aside>
        </div>
      </PageShell>
    </div>
  );
}
