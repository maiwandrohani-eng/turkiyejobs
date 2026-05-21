import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, MapPin } from "lucide-react";
import { ClaimProfileButton } from "@/components/ClaimProfileButton";
import { PageShell } from "@/components/PageShell";
import {
  loadPublicOrganizationByRef,
  loadPublishedOpportunitiesForOrganization,
} from "@/lib/db/catalog-queries";
import { mapOrganizationRecord, mapOpportunityRecord } from "@/lib/db/map-prisma-catalog";
import { formatOpportunityDeadline } from "@/lib/opportunity-display";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ orgRef: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orgRef } = await params;
  const prisma = getPrisma();
  if (!prisma) {
    return { title: "Organization | TürkiyeJobs.org" };
  }
  const row = await loadPublicOrganizationByRef(
    prisma,
    decodeURIComponent(orgRef),
  );
  if (!row) {
    return { title: "Organization | TürkiyeJobs.org" };
  }
  const desc =
    row.description && row.description.length > 155
      ? `${row.description.slice(0, 152).trimEnd()}…`
      : (row.description ?? undefined);
  return {
    title: `${row.name} | Organizations | TürkiyeJobs.org`,
    description: desc,
  };
}

export default async function OrganizationProfilePage({ params }: Props) {
  const { orgRef } = await params;
  const prisma = getPrisma();
  if (!prisma) notFound();

  const row = await loadPublicOrganizationByRef(
    prisma,
    decodeURIComponent(orgRef),
  );
  if (!row) notFound();

  const org = mapOrganizationRecord(row);
  const showCuratedNotice =
    org.verificationStatus === "CURATED_PUBLIC_PROFILE" ||
    org.verificationStatus === "UNCLAIMED_PROFILE";

  const oppRows = await loadPublishedOpportunitiesForOrganization(prisma, org.id);
  const listings = oppRows.flatMap((r) => {
    try {
      return [mapOpportunityRecord(r)];
    } catch {
      return [];
    }
  });

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <nav className="mb-6 text-sm text-foreground/70">
          <Link
            href="/organizations"
            className="font-semibold text-brand-gold underline underline-offset-2 hover:text-brand-navy"
          >
            Organization directory
          </Link>
          <span className="mx-2 text-foreground/45" aria-hidden>
            /
          </span>
          <span className="font-medium text-brand-navy">{org.name}</span>
        </nav>

        <article className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                {org.sector ?? "Social impact"}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-brand-navy md:text-4xl">
                {org.name}
              </h1>
              <p className="mt-2 flex items-center gap-2 text-sm text-foreground/75">
                <MapPin className="h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
                {org.location || "Location not listed"}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {org.featured ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-brand-navy">
                  <Award className="h-3.5 w-3.5" aria-hidden /> Featured employer
                </span>
              ) : null}
              {org.verificationStatus === "VERIFIED" ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-muted px-3 py-1 text-xs font-semibold text-brand-navy ring-1 ring-brand-gold/35">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden /> Verified Employer
                </span>
              ) : showCuratedNotice ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-900 ring-1 ring-sky-200">
                  Curated Public Profile
                </span>
              ) : (
                <span className="text-xs font-medium text-foreground/50">
                  Verification pending
                </span>
              )}
            </div>
          </div>

          {showCuratedNotice ? (
            <div className="mt-6 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-relaxed text-sky-900">
              This organization profile was created from publicly available or admin-provided information. The organization has not yet claimed this profile. Organizations may contact TurkiyeJobs.org to claim or update their profile.
            </div>
          ) : null}

          {org.claimed === false ? (
            <div className="mt-4">
              <ClaimProfileButton
                organizationId={org.id}
                organizationName={org.name}
                returnPath={`/organizations/${encodeURIComponent(org.slug)}`}
              />
            </div>
          ) : null}

          {org.description ? (
            <div className="mt-8 border-t border-brand-border pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
                About
              </h2>
              <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                {org.description}
              </div>
            </div>
          ) : (
            <p className="mt-8 text-sm text-foreground/60">No public description yet.</p>
          )}

          <section className="mt-10 border-t border-brand-border pt-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-gold">
              Live opportunities on TürkiyeJobs.org
            </h2>
            {listings.length === 0 ? (
              <p className="mt-3 text-sm text-foreground/65">
                No published listings right now. Use{" "}
                <Link
                  href="/opportunities"
                  className="font-semibold text-brand-gold underline underline-offset-2"
                >
                  Browse all opportunities
                </Link>{" "}
                to see every open role on the platform.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-brand-border rounded-xl border border-brand-border bg-brand-muted/30">
                {listings.map((o) => (
                  <li key={o.id} className="px-4 py-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
                        {o.category}
                      </p>
                      <Link
                        href={`/opportunities/${o.slug ?? o.id}`}
                        className="mt-1 block text-base font-bold text-brand-navy hover:text-brand-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                      >
                        {o.title}
                      </Link>
                      <p className="mt-1 text-sm text-foreground/65">
                        Deadline {formatOpportunityDeadline(o.deadline)} · {o.location || "Location TBC"}
                      </p>
                    </div>
                    <Link
                      href={`/opportunities/${o.slug ?? o.id}`}
                      className="mt-3 inline-flex shrink-0 rounded-lg border border-brand-border bg-white px-4 py-2 text-xs font-semibold text-brand-navy shadow-sm hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 sm:mt-0"
                    >
                      Open listing
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="mt-8 flex flex-col gap-3 border-t border-brand-border pt-8 sm:flex-row sm:flex-wrap">
            <Link
              href={`/opportunities?orgId=${encodeURIComponent(org.id)}`}
              className="inline-flex min-h-[2.75rem] items-center justify-center btn-primary px-5 py-2.5 text-center text-sm font-semibold text-white shadow-sm "
            >
              View opportunities
            </Link>
            {org.website ? (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-5 py-2.5 text-center text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
              >
                Website
              </a>
            ) : null}
            <Link
              href="/organizations"
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-5 py-2.5 text-center text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              Back to directory
            </Link>
          </div>
        </article>
      </PageShell>
    </div>
  );
}
