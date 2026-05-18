"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { AdminNeonRegistryPanel } from "@/components/AdminNeonRegistryPanel";
import { AdminSiteContactPanel } from "@/components/AdminSiteContactPanel";
import { PageIntro, PageShell } from "@/components/PageShell";
import { ListingStatusBadge } from "@/components/StatusBadge";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import type { Opportunity, Organization, ApplicationRecord, OpportunityCategory } from "@/lib/types";

const CATEGORY_PRESETS: OpportunityCategory[] = [
  "Jobs",
  "Consultancies",
  "Trainings",
  "Volunteer Roles",
  "Tenders",
  "Grants",
];

function toCsvRow(cells: (string | number | boolean | null | undefined)[]): string {
  return cells
    .map((c) => {
      const s = c == null ? "" : String(c);
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    })
    .join(",");
}

function downloadCsv(filename: string, rows: string[]): void {
  const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportListingsCsv(opportunities: Opportunity[]): void {
  const header = toCsvRow([
    "ID", "Title", "Organization", "Category", "Location", "Type",
    "Work Arrangement", "Compensation", "Deadline", "Visibility", "Featured",
  ]);
  const rows = opportunities.map((o) =>
    toCsvRow([
      o.id, o.title, o.organizationName, o.category, o.location, o.type,
      o.workArrangement, o.compensation, o.deadline,
      o.visibility ?? "published", o.featured ? "Yes" : "No",
    ]),
  );
  downloadCsv(`turkiyejobs-listings-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
}

function exportOrganizationsCsv(organizations: Organization[]): void {
  const header = toCsvRow(["ID", "Name", "Slug", "Location", "Sector", "Verified", "Featured", "Website"]);
  const rows = organizations.map((o) =>
    toCsvRow([
      o.id, o.name, o.slug, o.location, o.sector ?? "",
      o.verified ? "Yes" : "No", o.featured ? "Yes" : "No", o.website ?? "",
    ]),
  );
  downloadCsv(`turkiyejobs-organizations-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
}

function exportApplicationsCsv(applications: ApplicationRecord[]): void {
  const header = toCsvRow([
    "ID", "Opportunity ID", "Opportunity Title", "Organization", "Applicant Email",
    "Applicant Name", "Status", "Submitted At",
  ]);
  const rows = applications.map((a) =>
    toCsvRow([
      a.id, a.opportunityId, a.opportunityTitle, a.organizationName,
      a.applicantEmail ?? "", a.applicantDisplayName ?? a.applicantFullName ?? "",
      a.status, a.submittedAt,
    ]),
  );
  downloadCsv(`turkiyejobs-applications-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...rows]);
}

type AuditRow = {
  id: string;
  action: string;
  createdAt: string;
  actorUser: { id: string; email: string | null } | null;
};

export default function AdminDashboardPage() {
  const {
    session,
    hydrated,
    applications,
    opportunities,
    organizations,
    orgListings,
    orgSubmittedOpportunities,
    pendingOrganizations,
    pendingOpportunityApprovals,
    registeredUsers,
    approveOrganization,
    rejectOrganization,
    approveOpportunitySubmission,
    rejectOpportunitySubmission,
    deleteOpportunitySubmission,
    adminCloseOpportunity,
    toggleOpportunityFeatured,
    refreshPublicCatalog,
  } = useTurkiyeJobs();

  const [auditRows, setAuditRows] = useState<AuditRow[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditMessage, setAuditMessage] = useState<string | null>(null);

  const [categories, setCategories] = useState<string[]>([...CATEGORY_PRESETS]);
  const [categoryEditing, setCategoryEditing] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const newCategoryInputRef = useRef<HTMLInputElement>(null);

  type OrgProfileChangeRow = {
    id: string;
    organizationId: string;
    currentName: string;
    currentSlug: string;
    verificationStatus: string;
    proposedName: string;
    proposedEmail: string | null;
    proposedPhone: string | null;
    proposedWebsite: string | null;
    proposedLocation: string | null;
    proposedDescription: string | null;
    submittedAt: string;
  };

  const [profileRows, setProfileRows] = useState<OrgProfileChangeRow[]>([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<string | null>(null);

  const previewAuth = isDemoAuthEnabled();

  useEffect(() => {
    if (!hydrated || session?.role !== "admin") return;
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      setAuditLoading(true);
      setAuditMessage(null);
    });
    void fetch("/api/admin/audit-logs")
      .then(async (res) => {
        const body = (await res.json()) as { items?: AuditRow[]; error?: string };
        if (cancelled) return;
        if (!res.ok) {
          setAuditRows([]);
          setAuditMessage(
            res.status === 403
              ? "Sign in with an administrator account that can read audit logs."
              : typeof body.error === "string"
                ? body.error
                : "Could not load audit logs.",
          );
          return;
        }
        setAuditRows(body.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setAuditMessage("Could not load audit logs.");
      })
      .finally(() => {
        if (!cancelled) setAuditLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, session?.role]);

  useEffect(() => {
    if (!hydrated || session?.role !== "admin" || previewAuth) return;
    let cancelled = false;
    void Promise.resolve().then(() => {
      if (cancelled) return;
      setProfileLoading(true);
      setProfileMsg(null);
      void fetch("/api/admin/organization-profile-changes", { credentials: "include" })
        .then(async (res) => {
          const body = (await res.json()) as { ok?: boolean; items?: OrgProfileChangeRow[] };
          if (cancelled) return;
          if (!res.ok || !body.ok) {
            setProfileRows([]);
            setProfileMsg("Could not load pending organization profile updates.");
            return;
          }
          setProfileRows(body.items ?? []);
        })
        .catch(() => {
          if (!cancelled) setProfileMsg("Could not load pending organization profile updates.");
        })
        .finally(() => {
          if (!cancelled) setProfileLoading(false);
        });
      });
    return () => {
      cancelled = true;
    };
  }, [hydrated, session?.role, previewAuth]);

  const moderateOrgProfile = async (changeId: string, action: "approve" | "reject") => {
    if (action === "approve") {
      if (!confirm("Apply these changes to the live organization profile and public directory?"))
        return;
    } else if (!confirm("Reject this profile update? The employer keeps the current live details.")) {
      return;
    }
    try {
      const res = await fetch("/api/admin/organization-profile-changes/moderate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ changeId, action }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        alert(data.error ?? "Update failed.");
        return;
      }
      setProfileRows((prev) => prev.filter((r) => r.id !== changeId));
      refreshPublicCatalog();
    } catch {
      alert("Network error.");
    }
  };
  const rejectedCount = orgListings.filter((l) => l.status === "Rejected").length;
  const closedCount = orgListings.filter((l) => l.status === "Closed").length;
  const totalUsersDisplay = 1240 + registeredUsers.length;

  const managedExtras = orgSubmittedOpportunities.filter(
    (o) => o.visibility === "published" || o.visibility === "closed",
  );

  if (!hydrated) {
    return (
      <PageShell className="!py-0">
        <p className="text-sm text-foreground/60">Loading…</p>
      </PageShell>
    );
  }

  if (!session || session.role !== "admin") {
    return (
      <PageShell className="!py-0">
        <PageIntro
          title="Admin console"
          description={
            previewAuth
              ? "Restricted to administrators. With preview auth enabled, sign in using an email address that contains “admin”."
              : "Restricted to platform administrators. Sign in with an administrator account issued for TürkiyeJobs.org."
          }
        />
        {!previewAuth ? (
          <div className="mt-6 max-w-2xl rounded-2xl border border-brand-border bg-brand-muted/40 p-5 text-sm text-foreground/85">
            <p className="font-semibold text-brand-navy">Why your Gmail might show “Invalid email or password”</p>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>
                <strong>Registration never creates admins.</strong> If you only registered at{" "}
                <Link href="/register" className="font-semibold text-brand-gold underline">
                  Register
                </Link>
                , your account is an applicant or employer, not an administrator.
              </li>
              <li>
                After running <code className="rounded bg-white px-1 py-0.5 text-xs">npx prisma db seed</code>
                , you can sign in as{" "}
                <code className="rounded bg-white px-1 py-0.5 text-xs">admin@turkiyejobs.local</code> with
                password <code className="rounded bg-white px-1 py-0.5 text-xs">TurkiyeJobsSeedPass123</code>{" "}
                (change it after first login).
              </li>
              <li>
                To use <strong>your own email</strong> (e.g. Gmail) as admin, run once from the project folder
                (with <code className="rounded bg-white px-1 py-0.5 text-xs">DATABASE_URL</code> set):{" "}
                <code className="mt-2 block whitespace-pre-wrap break-all rounded bg-white p-2 text-xs text-brand-navy">
                  {`BOOTSTRAP_ROLE=ADMIN BOOTSTRAP_EMAIL=you@gmail.com BOOTSTRAP_PASSWORD='YourSecurePass12+' npx tsx scripts/bootstrap-user.ts`}
                </code>
              </li>
            </ul>
          </div>
        ) : null}
        <div className="mt-6">
          <Link
            href="/login"
            className="inline-flex btn-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            Admin sign in
          </Link>
        </div>
      </PageShell>
    );
  }

  const publishedCount = opportunities.length;

  const stats = [
    {
      label: previewAuth
        ? "Users shown (sample baseline + registrations)"
        : "Users shown (reference total + registrations)",
      value: String(totalUsersDisplay),
    },
    {
      label: "Organizations in directory",
      value: String(organizations.length),
    },
    {
      label: "Pending organization accounts",
      value: String(pendingOrganizations.length),
    },
    {
      label: "Pending opportunity reviews",
      value: String(pendingOpportunityApprovals.length),
    },
    { label: "Published opportunities (public)", value: String(publishedCount) },
    { label: "Applications (dashboard view)", value: String(applications.length) },
    { label: "Rejected listings (employer view)", value: String(rejectedCount) },
    { label: "Closed listings (employer view)", value: String(closedCount) },
  ];

  return (
    <PageShell className="!py-0">
      <PageIntro
        eyebrow="Administration"
        title={`Hello, ${session.displayName}`}
        description={
          previewAuth
            ? "Statistics, moderation queues, and listing controls. With preview auth, some actions are stored only in this browser."
            : "Statistics, moderation queues, and listing controls. Data is loaded from your TürkiyeJobs.org database."
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-brand-border border-l-4 border-l-brand-gold bg-white p-5 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              {s.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-brand-navy">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">Pending organizations</h2>
        {pendingOrganizations.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/70">No pending registrations.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-muted/60 text-xs uppercase text-foreground/55">
                <tr>
                  <th className="px-4 py-3 font-semibold">Organization</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOrganizations.map((o) => (
                  <tr key={o.id} className="border-b border-brand-border last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-navy">{o.name}</td>
                    <td className="px-4 py-3 text-foreground/75">{o.email}</td>
                    <td className="px-4 py-3 text-foreground/75">{o.submittedAt}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            approveOrganization(o.id);
                            alert(
                              previewAuth
                                ? "Organization approved for this preview session."
                                : "Organization approved.",
                            );
                          }}
                          className="rounded-lg bg-brand-gold px-3 py-2 text-xs font-semibold text-brand-navy shadow-sm hover:bg-brand-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Reject this registration?")) rejectOrganization(o.id);
                          }}
                          className="rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">Organization profile updates</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Employers can submit edits to their public directory details. Approve to apply them to the live
          organization record; reject to keep the current published profile.
        </p>
        {profileMsg ? (
          <p className="mt-3 text-sm text-amber-800">{profileMsg}</p>
        ) : null}
        {profileLoading ? (
          <p className="mt-3 text-sm text-foreground/60">Loading pending profile updates…</p>
        ) : profileRows.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/70">No pending profile updates.</p>
        ) : (
          <div className="mt-4 space-y-6">
            {profileRows.map((row) => (
              <div
                key={row.id}
                className="rounded-xl border border-brand-border bg-brand-muted/30 p-4 text-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-brand-navy">
                      {row.currentName}{" "}
                      <span className="font-normal text-foreground/55">({row.currentSlug})</span>
                    </p>
                    <p className="mt-1 text-xs text-foreground/55">
                      Status: {row.verificationStatus} · Submitted{" "}
                      {new Date(row.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void moderateOrgProfile(row.id, "approve")}
                      className="rounded-lg bg-brand-gold px-3 py-2 text-xs font-semibold text-brand-navy shadow-sm hover:bg-brand-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => void moderateOrgProfile(row.id, "reject")}
                      className="rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-brand-navy hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase text-foreground/50">Organization name</dt>
                    <dd className="mt-1 text-foreground/80">
                      <span className="text-foreground/55">Live: </span>
                      {row.currentName}
                      <br />
                      <span className="text-foreground/55">Proposed: </span>
                      <span className="font-medium text-brand-navy">{row.proposedName}</span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-foreground/50">Public contact email</dt>
                    <dd className="mt-1 break-all text-foreground/80">
                      {row.proposedEmail ?? "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-foreground/50">Phone</dt>
                    <dd className="mt-1 text-foreground/80">{row.proposedPhone ?? "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase text-foreground/50">Website</dt>
                    <dd className="mt-1 break-all text-foreground/80">{row.proposedWebsite ?? "—"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase text-foreground/50">Location</dt>
                    <dd className="mt-1 text-foreground/80">{row.proposedLocation ?? "—"}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase text-foreground/50">About / description</dt>
                    <dd className="mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap text-foreground/80">
                      {row.proposedDescription?.trim() ? row.proposedDescription : "—"}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">Pending opportunities</h2>
        {pendingOpportunityApprovals.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/70">
            No listings awaiting approval.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-muted/60 text-xs uppercase text-foreground/55">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Employer</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOpportunityApprovals.map((p) => (
                  <tr key={p.id} className="border-b border-brand-border last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-navy">{p.title}</td>
                    <td className="px-4 py-3 text-foreground/75">{p.organizationName}</td>
                    <td className="px-4 py-3 text-foreground/75">{p.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {p.opportunityId ? (
                          <Link
                            href={`/opportunities/${p.opportunityId}`}
                            className="text-xs font-semibold text-brand-gold underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 rounded-sm"
                          >
                            Preview
                          </Link>
                        ) : null}
                        <button
                          type="button"
                          onClick={() => {
                            void approveOpportunitySubmission(p.id, p.opportunityId).then((ok) => {
                              if (ok) {
                                alert(
                                  "Listing approved — it now appears on the public opportunities page.",
                                );
                              } else {
                                alert(
                                  "Approval did not save. Check you are signed in as admin, then retry or inspect the approve request in the browser network tab.",
                                );
                              }
                            });
                          }}
                          className="rounded-lg bg-brand-gold px-3 py-2 text-xs font-semibold text-brand-navy shadow-sm hover:bg-brand-gold-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/60"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("Reject this submission?")) {
                              void rejectOpportunitySubmission(p.id, p.opportunityId).then((ok) => {
                                if (ok) {
                                  alert("Listing rejected — visible to employer only.");
                                } else {
                                  alert("Reject did not save. Check your connection and try again.");
                                }
                              });
                            }
                          }}
                          className="rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (
                              confirm(
                                "Delete this submission from the queue? This removes the draft opportunity.",
                              )
                            )
                              void deleteOpportunitySubmission(p.id, p.opportunityId).then((ok) => {
                                if (!ok) {
                                  alert("Delete did not complete. Check your connection and try again.");
                                }
                              });
                          }}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">
          Employer-submitted listings (published / closed)
        </h2>
        <p className="mt-2 text-sm text-foreground/70">
          Feature or close organization-submitted opportunities. Sample catalogue
          listings are managed separately via the public opportunities page workflow.
        </p>
        {managedExtras.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/70">
            No employer-submitted listings yet.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-brand-border bg-brand-muted/60 text-xs uppercase text-foreground/55">
                <tr>
                  <th className="px-4 py-3 font-semibold">Title</th>
                  <th className="px-4 py-3 font-semibold">Visibility</th>
                  <th className="px-4 py-3 font-semibold">Featured</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {managedExtras.map((o) => (
                  <tr key={o.id} className="border-b border-brand-border last:border-0">
                    <td className="px-4 py-3 font-medium text-brand-navy">{o.title}</td>
                    <td className="px-4 py-3 text-foreground/75">
                      {o.visibility === "published" ? (
                        <ListingStatusBadge status="Published" />
                      ) : (
                        <ListingStatusBadge status="Closed" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-foreground/75">
                      {o.featured ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/opportunities/${o.id}`}
                          className="text-xs font-semibold text-brand-gold underline"
                        >
                          Open
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleOpportunityFeatured(o.id)}
                          className="rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-brand-navy"
                        >
                          Toggle featured
                        </button>
                        {o.visibility === "published" ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm("Close this listing for public search?")) {
                                adminCloseOpportunity(o.id);
                                alert("Listing closed.");
                              }
                            }}
                            className="rounded-lg border border-brand-border px-3 py-2 text-xs font-semibold text-brand-navy"
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
        )}
      </section>

      <div className="mt-8">
        <AdminNeonRegistryPanel disabled={previewAuth} />
      </div>

      <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-brand-navy">Manage categories</h2>
          <button
            type="button"
            className="rounded-lg border border-brand-border px-3 py-1 text-xs font-semibold text-brand-navy hover:bg-brand-muted"
            onClick={() => {
              setCategoryEditing((v) => !v);
              setNewCategory("");
            }}
          >
            {categoryEditing ? "Done" : "Edit"}
          </button>
        </div>
        <p className="mt-2 text-sm text-foreground/70">
          These labels match the categories used on the public site. Changes here are
          session-only until a category API is wired to persist them to the database.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <span
              key={c}
              className="flex items-center gap-1 rounded-full border border-brand-border bg-brand-muted/50 px-3 py-1 text-xs font-semibold text-brand-navy"
            >
              {c}
              {categoryEditing && (
                <button
                  type="button"
                  aria-label={`Remove ${c}`}
                  className="ml-1 rounded-full text-foreground/50 hover:text-red-500"
                  onClick={() => setCategories((prev) => prev.filter((x) => x !== c))}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>
        {categoryEditing && (
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const label = newCategory.trim();
              if (label && !categories.includes(label)) {
                setCategories((prev) => [...prev, label]);
              }
              setNewCategory("");
              newCategoryInputRef.current?.focus();
            }}
          >
            <input
              ref={newCategoryInputRef}
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category label"
              className="flex-1 rounded-lg border border-brand-border px-3 py-1.5 text-sm text-brand-navy outline-none focus:ring-2 focus:ring-brand-gold"
            />
            <button
              type="submit"
              disabled={!newCategory.trim()}
              className="rounded-lg bg-brand-navy px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-40"
            >
              Add
            </button>
          </form>
        )}
      </section>

      <AdminSiteContactPanel disabled={previewAuth} />

      <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">Audit log (Neon)</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Recent admin actions stored in{" "}
          <code className="rounded bg-brand-muted px-1 py-0.5 text-xs">AdminActionLog</code>.
        </p>
        {auditLoading ? (
          <p className="mt-4 text-sm text-foreground/60">Loading…</p>
        ) : auditMessage ? (
          <p className="mt-4 text-sm text-foreground/70">{auditMessage}</p>
        ) : auditRows.length === 0 ? (
          <p className="mt-4 text-sm text-foreground/60">No audit entries yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-brand-border text-xs font-semibold uppercase tracking-wide text-brand-gold">
                  <th className="py-2 pr-3">Time</th>
                  <th className="py-2 pr-3">Action</th>
                  <th className="py-2">Actor</th>
                </tr>
              </thead>
              <tbody>
                {auditRows.map((row) => (
                  <tr key={row.id} className="border-b border-brand-border/70">
                    <td className="py-2 pr-3 text-foreground/75">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 font-medium text-brand-navy">{row.action}</td>
                    <td className="py-2 text-foreground/70">
                      {row.actorUser?.email ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-brand-border bg-brand-muted/40 p-6">
        <h2 className="text-base font-bold text-brand-navy">Reports export</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Download CSV snapshots of current platform data for leadership dashboards or
          offline analysis.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted"
            onClick={() => exportListingsCsv(opportunities)}
          >
            Export listings ({opportunities.length})
          </button>
          <button
            type="button"
            className="rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted"
            onClick={() => exportOrganizationsCsv(organizations)}
          >
            Export organizations ({organizations.length})
          </button>
          <button
            type="button"
            className="rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted"
            onClick={() => exportApplicationsCsv(applications)}
          >
            Export applications ({applications.length})
          </button>
        </div>
      </section>

      {!previewAuth ? (
        <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-brand-navy">Account security</h2>
          <p className="mt-1 text-sm text-foreground/70">
            Change the password for your TürkiyeJobs admin sign-in (Neon user account).
          </p>
          <ChangePasswordForm />
        </section>
      ) : null}
    </PageShell>
  );
}
