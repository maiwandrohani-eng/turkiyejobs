"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { PageIntro, PageShell } from "@/components/PageShell";
import { ApplicationStatusBadge } from "@/components/StatusBadge";
import { OpportunityListRow } from "@/components/OpportunityListRow";
import { OpportunityCard } from "@/components/OpportunityCard";
import { ViewModeToggle } from "@/components/ViewModeToggle";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { usePersistedViewMode } from "@/hooks/usePersistedViewMode";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import { isPublishedCatalogOpportunity, suppressedCatalogIdsForBrowse } from "@/lib/opportunity-visibility";
import type { ApplicationStatus, Opportunity } from "@/lib/types";

const STATUS_STEPS: ApplicationStatus[] = [
  "Submitted",
  "Under review",
  "Shortlisted",
  "Rejected",
  "Accepted",
];

function normEmail(e: string) {
  return e.trim().toLowerCase();
}

export default function UserDashboardPage() {
  const {
    session,
    hydrated,
    savedIds,
    applications,
    getOpportunityById,
    suppressedCatalogIds,
    applicantProfile,
    setApplicantProfile,
    externalApplyIntents,
  } = useTurkiyeJobs();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [cvUrl, setCvUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  /* Sync local form fields when profile loads from storage (hydration / login). */
  /* eslint-disable react-hooks/set-state-in-effect -- one-way sync from context to inputs */
  useEffect(() => {
    if (applicantProfile) {
      setFullName(applicantProfile.fullName ?? "");
      setPhone(applicantProfile.phone ?? "");
      setCvUrl(applicantProfile.cvUrl ?? "");
      setLinkedinUrl(applicantProfile.linkedinUrl ?? "");
      setPortfolioUrl(applicantProfile.portfolioUrl ?? "");
    } else if (session) {
      setFullName(session.displayName ?? "");
      setPhone("");
      setCvUrl("");
      setLinkedinUrl("");
      setPortfolioUrl("");
    }
  }, [applicantProfile, session]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const savedList: Opportunity[] = [];
  for (const id of savedIds) {
    const o = getOpportunityById(id);
    if (!o || !isPublishedCatalogOpportunity(o)) continue;
    if (suppressedCatalogIdsForBrowse(suppressedCatalogIds).includes(o.id)) continue;
    savedList.push(o);
  }

  const myApplications = applications.filter(
    (a) => a.applicantEmail && normEmail(a.applicantEmail) === normEmail(session?.email ?? ""),
  );

  const myExternalIntents = externalApplyIntents.filter(
    (i) => normEmail(i.applicantEmail) === normEmail(session?.email ?? ""),
  );

  const { mode: savedViewMode, setMode: setSavedViewMode } = usePersistedViewMode(
    "turkiyejobs:v1:viewUserSavedOpportunities",
  );
  const { mode: trackedViewMode, setMode: setTrackedViewMode } = usePersistedViewMode(
    "turkiyejobs:v1:viewUserTrackedExternal",
  );

  if (!hydrated) {
    return (
      <PageShell className="!py-0">
        <p className="text-sm text-foreground/60">Loading…</p>
      </PageShell>
    );
  }

  if (!session || session.role !== "individual") {
    return (
      <PageShell className="!py-0">
        <PageIntro
          title="Applicant workspace"
          description="Register or sign in as an individual to track saved listings and applications."
        />
        <div className="flex flex-wrap gap-3">
          <Link
            href="/register"
            className="btn-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Create applicant account
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy"
          >
            Sign in
          </Link>
        </div>
      </PageShell>
    );
  }

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    if (!fullName.trim()) {
      setProfileMsg("Please enter your full name as it should appear on applications.");
      return;
    }
    if (!phone.trim()) {
      setProfileMsg("Please enter a phone number employers can reach you on.");
      return;
    }
    if (!cvUrl.trim() || !cvUrl.trim().startsWith("http")) {
      setProfileMsg("Please enter a valid https link to your CV (Google Drive, Dropbox, or personal site).");
      return;
    }
    if (!session?.email) return;
    setApplicantProfile({
      fullName: fullName.trim(),
      email: session.email.trim(),
      phone: phone.trim(),
      cvUrl: cvUrl.trim(),
      linkedinUrl: linkedinUrl.trim() || undefined,
      portfolioUrl: portfolioUrl.trim() || undefined,
    });
    setProfileMsg("Profile details saved. They will be attached when you apply to new opportunities.");
  };

  return (
    <PageShell className="!py-0">
      <PageIntro
        eyebrow="Applicant"
        title={`Welcome, ${session.displayName}`}
        description={
          isDemoAuthEnabled()
            ? "Your profile summary, saved opportunities, and application tracker. With preview auth, you can still use the form below; sign in with a database account to change your password."
            : "Your profile summary, saved opportunities, and application activity for your TürkiyeJobs.org account."
        }
      />

      <p className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <a
          href="#edit-applicant-profile"
          className="inline-flex btn-primary px-4 py-2 font-semibold text-white "
        >
          Edit profile
        </a>
        <span className="text-foreground/65">
          Update name, phone, CV link, and optional portfolio links used when you apply.
        </span>
      </p>

      <section
        id="edit-applicant-profile"
        className="scroll-mt-24 rounded-2xl border border-brand-border bg-white p-6 shadow-sm"
      >
        <h2 className="text-base font-bold text-brand-navy">Edit your applicant profile</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-foreground/55">Account email</dt>
            <dd className="font-medium text-brand-navy">{session.email}</dd>
          </div>
        </dl>
        <form onSubmit={saveProfile} className="mt-6 border-t border-brand-border pt-6">
          <p className="text-sm text-foreground/70">
            These details are used for internal applications on TürkiyeJobs.org. They are
            stored with your session on this device and should be kept up to date. CV and
            LinkedIn links are required when an opportunity asks for them on the apply form.
          </p>
          <label className="mt-4 block text-xs font-semibold text-brand-navy">
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            placeholder="As on your CV"
          />
          <label className="mt-4 block text-xs font-semibold text-brand-navy">
            Phone <span className="text-red-600">*</span>
          </label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            placeholder="+20 …"
          />
          <label className="mt-4 block text-xs font-semibold text-brand-navy">
            CV or resume URL <span className="text-red-600">*</span>
          </label>
          <input
            value={cvUrl}
            onChange={(e) => setCvUrl(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            placeholder="https://…"
          />
          <label className="mt-4 block text-xs font-semibold text-brand-navy">
            LinkedIn (optional)
          </label>
          <input
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            placeholder="https://linkedin.com/in/…"
          />
          <label className="mt-4 block text-xs font-semibold text-brand-navy">
            Portfolio or other link (optional)
          </label>
          <input
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            placeholder="https://…"
          />
          {profileMsg ? (
            <p
              className={`mt-3 text-sm font-medium ${profileMsg.includes("saved") ? "text-brand-navy" : "text-red-700"}`}
            >
              {profileMsg}
            </p>
          ) : null}
          <button
            type="submit"
            className="mt-4 rounded-xl bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-gold-soft"
          >
            Save profile
          </button>
        </form>
      </section>

      {session?.userId ? (
        <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-navy">Account security</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Change the password you use to sign in to TürkiyeJobs.org (stored in the database).
          </p>
          <ChangePasswordForm />
        </section>
      ) : null}

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-brand-navy">Saved opportunities</h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <ViewModeToggle
              value={savedViewMode}
              onChange={setSavedViewMode}
              groupAriaLabel="Saved opportunities layout"
            />
            <Link
              href="/opportunities"
              className="text-center text-sm font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2 sm:text-left"
            >
              Browse
            </Link>
          </div>
        </div>
        {savedList.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-border bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm text-foreground/70">
              No saved listings yet. Open an opportunity and use <strong>Save</strong> to add it here.
            </p>
            <Link
              href="/opportunities"
              className="mt-4 inline-block text-sm font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
            >
              Browse opportunities
            </Link>
          </div>
        ) : savedViewMode === "list" ? (
          <div className="flex flex-col gap-3">
            {savedList.map((o) => (
              <OpportunityListRow key={o.id} opportunity={o} />
            ))}
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {savedList.map((o) => (
              <li key={o.id} className="min-w-0">
                <OpportunityCard opportunity={o} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-brand-navy">Applied externally (tracked)</h2>
          {myExternalIntents.length > 0 ? (
            <ViewModeToggle
              value={trackedViewMode}
              onChange={setTrackedViewMode}
              groupAriaLabel="Tracked external applications layout"
            />
          ) : null}
        </div>
        <p className="mt-2 text-sm text-foreground/70">
          After you use “Apply via email” or the employer’s external application link, you
          can optionally mark that you applied externally so it appears here.
        </p>
        {myExternalIntents.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-brand-border bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm text-foreground/70">
              Nothing tracked yet. After you apply by email or an external link, use{" "}
              <strong>I applied externally — track in my dashboard</strong> on the listing.
            </p>
          </div>
        ) : trackedViewMode === "list" ? (
          <ul className="mt-4 divide-y divide-brand-border rounded-2xl border border-brand-border bg-white shadow-sm">
            {myExternalIntents.map((i) => (
              <li
                key={i.id}
                className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase text-brand-gold">
                    Applied externally · {i.channel === "email" ? "Via email" : "Via external link"}
                  </p>
                  <p className="font-semibold text-brand-navy">{i.opportunityTitle}</p>
                  <p className="text-sm text-foreground/65">{i.organizationName}</p>
                  <p className="mt-1 text-xs text-foreground/55">Recorded {i.recordedAt}</p>
                </div>
                <Link
                  href={`/opportunities/${i.opportunityId}`}
                  className="inline-flex min-h-[2.75rem] shrink-0 items-center justify-center self-start btn-primary px-4 py-2 text-xs font-semibold text-white  sm:self-center sm:min-h-0"
                >
                  View listing
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {myExternalIntents.map((i) => (
              <li
                key={i.id}
                className="rounded-2xl border border-brand-border bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-semibold uppercase text-brand-gold">
                  Applied externally
                </p>
                <p className="text-xs text-foreground/55">
                  {i.channel === "email" ? "Via email" : "Via external link"}
                </p>
                <p className="mt-1 font-semibold text-brand-navy">{i.opportunityTitle}</p>
                <p className="text-sm text-foreground/65">{i.organizationName}</p>
                <p className="mt-2 text-xs text-foreground/55">Recorded {i.recordedAt}</p>
                <Link
                  href={`/opportunities/${i.opportunityId}`}
                  className="mt-3 inline-flex min-h-[2.75rem] w-full items-center justify-center btn-primary px-4 py-2 text-xs font-semibold text-white  sm:min-h-0"
                >
                  View listing
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-base font-bold text-brand-navy">My applications (TürkiyeJobs.org)</h2>
        {myApplications.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-brand-border bg-white px-6 py-10 text-center shadow-sm">
            <p className="text-sm text-foreground/70">
              You have not applied on TürkiyeJobs.org yet. Open a listing and submit when the employer accepts internal applications.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-brand-border bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-muted/60 text-xs uppercase text-foreground/55">
                <tr>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Organization</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {myApplications.map((a) => (
                  <tr key={a.id} className="border-b border-brand-border last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-navy">
                      <Link
                        href={`/opportunities/${a.opportunityId}`}
                        className="hover:text-brand-gold"
                      >
                        {a.opportunityTitle}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground/75">
                      {a.organizationName}
                    </td>
                    <td className="px-4 py-3 text-foreground/75">
                      {a.submittedAt}
                    </td>
                    <td className="px-4 py-3">
                      <ApplicationStatusBadge status={a.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-brand-border bg-brand-muted/40 p-6">
        <h2 className="text-base font-bold text-brand-navy">Status reference</h2>
        <ol className="mt-4 flex flex-wrap gap-2">
          {STATUS_STEPS.map((s) => (
            <li
              key={s}
              className="rounded-full border border-brand-border bg-white px-3 py-1 text-xs font-medium text-brand-navy"
            >
              {s}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-foreground/70">
          Employers update your status as they review applications. You will see in-app
          notifications in the workspace sidebar when your status changes.
        </p>
      </section>
    </PageShell>
  );
}
