"use client";

import Link from "next/link";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { EmployerOrganizationProfilePanel } from "@/components/EmployerOrganizationProfilePanel";
import { PageIntro, PageShell } from "@/components/PageShell";
import { OrgSubmitOpportunityForm } from "@/components/OrgSubmitOpportunityForm";
import {
  ApplicationStatusBadge,
  ListingStatusBadge,
} from "@/components/StatusBadge";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import type { ApplicationStatus } from "@/lib/types";

export default function OrganizationDashboardPage() {
  const {
    session,
    hydrated,
    orgListings,
    applications,
    updateApplicationStatus,
    closeOwnPublishedListing,
    organizationCanPost,
    externalApplyIntents,
  } = useTurkiyeJobs();

  const { mode: postedViewMode, setMode: setPostedViewMode } = usePersistedViewMode(
    "turkiyejobs:v1:viewOrgPostedListings",
  );

  if (!hydrated) {
    return (
      <PageShell className="!py-0">
        <p className="text-sm text-foreground/60">Loading…</p>
      </PageShell>
    );
  }

  if (!session || session.role !== "organization") {
    return (
      <PageShell className="!py-0">
        <PageIntro
          title="Organization workspace"
          description="Sign in with an organization account to post opportunities and review applicants."
        />
        <Link
          href="/register"
          className="inline-flex btn-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Register organization
        </Link>
      </PageShell>
    );
  }

  const myListings = orgListings.filter(
    (row) => row.submittedByOrgId === session.organizationId,
  );
  const myOppIds = new Set(myListings.map((l) => l.opportunityId));
  const orgApps = applications.filter(
    (a) =>
      session.organizationId &&
      a.organizationId === session.organizationId &&
      myOppIds.has(a.opportunityId),
  );

  const orgExternalIntents = externalApplyIntents.filter((i) =>
    myOppIds.has(i.opportunityId),
  );

  return (
    <PageShell className="!py-0">
      <PageIntro
        eyebrow="Employer"
        title={session.organizationName ?? session.displayName}
        description="Post jobs, consultancies, trainings, volunteer roles, tenders, and grants. Submissions are reviewed before publication. Track listings and applicants below."
      />

      {!organizationCanPost ? (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Account pending:</strong> Your organization registration must be
          approved by TürkiyeJobs.org administrators before you can publish new listings.
          {isDemoAuthEnabled() ? (
            <>
              {" "}
              Optional local preview: approve a pending organization from the admin
              console, or sign in with a seeded employer account (e.g. Care Türkiye Foundation)
              if your database includes sample data.
            </>
          ) : (
            <>
              {" "}
              An administrator will review your account in the admin console; you can
              refresh this page after approval.
            </>
          )}
        </div>
      ) : null}

      <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">Organization account</h2>
        <p className="mt-1 text-sm text-foreground/70">
          Sign-in details and approval status. Edit how your organization appears publicly in the
          section below.
        </p>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-foreground/55">Primary contact</dt>
            <dd className="font-medium text-brand-navy">{session.displayName}</dd>
          </div>
          <div>
            <dt className="text-foreground/55">Email</dt>
            <dd className="font-medium text-brand-navy">{session.email}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-foreground/55">Posting access</dt>
            <dd className="font-medium text-brand-navy">
              {organizationCanPost ? (
                <span className="text-emerald-700">Approved — you can submit listings.</span>
              ) : (
                <span className="text-amber-800">Awaiting administrator approval.</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      <div className="mt-8">
        <EmployerOrganizationProfilePanel />
      </div>

      {session?.userId ? (
        <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-navy">Account security</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Change the password for your organization sign-in (Neon user account).
          </p>
          <ChangePasswordForm />
        </section>
      ) : null}

      <div className="mt-8">
        <OrgSubmitOpportunityForm />
      </div>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-brand-navy">Posted opportunities</h2>
          {myListings.length > 0 ? (
            <ViewModeToggle
              value={postedViewMode}
              onChange={setPostedViewMode}
              groupAriaLabel="Posted employer listings layout"
            />
          ) : null}
        </div>
        {myListings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-border bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm text-foreground/70">
              No listings yet. Use the form above to post a job, consultancy, training,
              volunteer role, tender, or grant.
            </p>
          </div>
        ) : postedViewMode === "list" ? (
          <div className="overflow-x-auto rounded-2xl border border-brand-border bg-white shadow-sm">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-muted/60 text-xs uppercase text-foreground/55">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Applicants</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((row) => (
                  <tr key={row.id} className="border-b border-brand-border last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-navy">{row.title}</td>
                    <td className="px-4 py-3 text-foreground/75">{row.category}</td>
                    <td className="px-4 py-3">
                      <ListingStatusBadge status={row.status} />
                    </td>
                    <td className="px-4 py-3 text-foreground/75">{row.applicantCount}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/opportunities/${row.opportunityId}`}
                          className="text-xs font-semibold text-brand-gold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 rounded-sm"
                        >
                          View
                        </Link>
                        {row.status === "Published" ? (
                          <button
                            type="button"
                            className="text-xs font-semibold text-brand-navy underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 rounded-sm"
                            onClick={() => {
                              if (
                                confirm(
                                  "Close this listing? It will be hidden from public search.",
                                )
                              )
                                closeOwnPublishedListing(row.opportunityId);
                            }}
                          >
                            Close listing
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {myListings.map((row) => (
              <li
                key={row.id}
                className="flex flex-col rounded-2xl border border-brand-border bg-white p-5 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase text-brand-gold">{row.category}</p>
                <h3 className="mt-1 text-base font-bold text-brand-navy">{row.title}</h3>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <ListingStatusBadge status={row.status} />
                </div>
                <p className="mt-3 text-sm text-foreground/80">
                  <span className="font-semibold text-brand-navy">Applicants</span>
                  <span className="ml-2 inline-flex min-w-[1.75rem] items-center justify-center rounded-full bg-brand-muted px-2 py-0.5 text-sm font-bold tabular-nums text-brand-navy">
                    {row.applicantCount}
                  </span>
                </p>
                <div className="mt-4 flex flex-col gap-2 border-t border-brand-border pt-4 sm:flex-row sm:flex-wrap">
                  <Link
                    href={`/opportunities/${row.opportunityId}`}
                    className="inline-flex min-h-[2.75rem] items-center justify-center btn-primary px-3 py-2 text-center text-xs font-semibold text-white  sm:min-h-0"
                  >
                    View
                  </Link>
                  {row.status === "Published" ? (
                    <button
                      type="button"
                      className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-3 py-2 text-center text-xs font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 sm:min-h-0"
                      onClick={() => {
                        if (
                          confirm(
                            "Close this listing? It will be hidden from public search.",
                          )
                        )
                          closeOwnPublishedListing(row.opportunityId);
                      }}
                    >
                      Close listing
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-bold text-brand-navy">
          Internal applications (TürkiyeJobs.org)
        </h2>
        {orgApps.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-brand-border bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm text-foreground/70">
              Applications appear here when candidates apply through TürkiyeJobs.org to your
              published listings. Ask applicants to use an individual account and apply to
              your live roles from the opportunities directory.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-border bg-white shadow-sm">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-muted/60 text-xs uppercase text-foreground/55">
                <tr>
                  <th className="px-4 py-3 font-semibold">Applicant</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orgApps.map((a) => (
                  <tr key={a.id} className="border-b border-brand-border last:border-0">
                    <td className="px-4 py-3 text-foreground/75">
                      <div className="font-medium text-brand-navy">
                        {a.applicantFullName?.trim() ||
                          a.applicantDisplayName?.trim() ||
                          "Applicant"}
                      </div>
                      {a.applicantEmail ? (
                        <div className="text-xs text-foreground/55">{a.applicantEmail}</div>
                      ) : null}
                      {a.applicantPhone ? (
                        <div className="text-xs text-foreground/55">{a.applicantPhone}</div>
                      ) : null}
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                        {a.cvUrl ? (
                          <a
                            href={a.cvUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-brand-gold underline"
                          >
                            CV
                          </a>
                        ) : null}
                        {a.linkedinUrl ? (
                          <a
                            href={a.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-brand-gold underline"
                          >
                            LinkedIn
                          </a>
                        ) : null}
                        {a.portfolioUrl ? (
                          <a
                            href={a.portfolioUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-semibold text-brand-gold underline"
                          >
                            Portfolio
                          </a>
                        ) : null}
                      </div>
                      {a.coverLetter ? (
                        <p className="mt-2 max-w-md text-xs text-foreground/60 line-clamp-3">
                          {a.coverLetter}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-navy">
                      {a.opportunityTitle}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <ApplicationStatusBadge status={a.status} />
                        <select
                          value={a.status}
                          onChange={(e) =>
                            updateApplicationStatus(
                              a.id,
                              e.target.value as ApplicationStatus,
                            )
                          }
                          className="rounded-lg border border-brand-border bg-white px-2 py-1 text-xs font-medium"
                        >
                          {(
                            [
                              "Submitted",
                              "Under review",
                              "Shortlisted",
                              "Rejected",
                              "Accepted",
                            ] as ApplicationStatus[]
                          ).map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-bold text-brand-navy">
          Tracked off-platform interest
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          Candidates who clicked “I applied by email” or “I applied externally” on listings
          that use email or external apply. This is self-reported and not a full application
          in TürkiyeJobs.org.
        </p>
        {orgExternalIntents.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-brand-border bg-white p-6 text-sm text-foreground/70">
            No tracked off-platform applications yet for your listings.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-border bg-white shadow-sm">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-muted/60 text-xs uppercase text-foreground/55">
                <tr>
                  <th className="px-4 py-3 font-semibold">Listing</th>
                  <th className="px-4 py-3 font-semibold">Channel</th>
                  <th className="px-4 py-3 font-semibold">Applicant email</th>
                  <th className="px-4 py-3 font-semibold">Recorded</th>
                </tr>
              </thead>
              <tbody>
                {orgExternalIntents.map((i) => (
                  <tr key={i.id} className="border-b border-brand-border last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-navy">
                      {i.opportunityTitle}
                    </td>
                    <td className="px-4 py-3 text-foreground/75">
                      {i.channel === "email" ? "Email" : "External link"}
                    </td>
                    <td className="px-4 py-3 text-foreground/75">{i.applicantEmail}</td>
                    <td className="px-4 py-3 text-foreground/75">{i.recordedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </PageShell>
  );
}
