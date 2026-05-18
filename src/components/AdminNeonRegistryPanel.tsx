"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";

type RegistryUser = {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  firstName: string | null;
  lastName: string | null;
  organizationId: string | null;
  createdAt: string;
  organization: { name: string } | null;
};

type RegistryOrg = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  verificationStatus: string;
  isActive: boolean;
  _count: { users: number; opportunities: number };
};

type RegistryOpp = {
  id: string;
  title: string;
  slug: string | null;
  status: string;
  organizationId: string;
  organization: { name: string; isActive: boolean };
};

async function postJson<T>(url: string, body: unknown): Promise<{ res: Response; data: T }> {
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T;
  return { res, data };
}

export function AdminNeonRegistryPanel({ disabled }: { disabled: boolean }) {
  const { session, refreshPublicCatalog } = useTurkiyeJobs();
  const currentUserId = session?.userId;

  const [loading, setLoading] = useState(!disabled);
  const [message, setMessage] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [users, setUsers] = useState<RegistryUser[]>([]);
  const [organizations, setOrganizations] = useState<RegistryOrg[]>([]);
  const [opportunities, setOpportunities] = useState<RegistryOpp[]>([]);

  const load = useCallback(async () => {
    if (disabled) return;
    await Promise.resolve();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/registry", { credentials: "include" });
      const body = (await res.json()) as {
        ok?: boolean;
        users?: RegistryUser[];
        organizations?: RegistryOrg[];
        opportunities?: RegistryOpp[];
        error?: string;
      };
      if (!res.ok || !body.ok) {
        setMessage(body.error ?? "Could not load registry.");
        return;
      }
      setUsers(body.users ?? []);
      setOrganizations(body.organizations ?? []);
      setOpportunities(body.opportunities ?? []);
    } catch {
      setMessage("Could not load registry.");
    } finally {
      setLoading(false);
    }
  }, [disabled]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const runMutation = async (key: string, fn: () => Promise<boolean>) => {
    setBusyKey(key);
    setMessage(null);
    try {
      const ok = await fn();
      if (ok) {
        setMessage("Updated.");
        await load();
        refreshPublicCatalog();
      }
    } finally {
      setBusyKey(null);
    }
  };

  if (disabled) {
    return (
      <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">Users, organizations & listings (Neon)</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Deactivate, reactivate, or delete records in the database from this panel when preview
          auth is off. With demo preview enabled, use the database or turn off demo auth to manage
          live accounts safely.
        </p>
      </section>
    );
  }

  const btn =
    "rounded-lg border border-brand-border px-2.5 py-1.5 text-xs font-semibold text-brand-navy hover:bg-brand-muted disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50";
  const danger = "rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200";

  return (
    <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-bold text-brand-navy">Users, organizations & listings (Neon)</h2>
        <button type="button" className={btn} disabled={!!busyKey || loading} onClick={() => void load()}>
          Refresh
        </button>
      </div>
      <p className="mt-2 text-sm text-foreground/70">
        Deactivate users or organizations to block sign-in and hide employers from the public
        directory. Deleting an organization removes all its listings and employer accounts in that
        org. Listing delete is permanent (applications and saves are removed with the row).
      </p>
      {message ? <p className="mt-3 text-sm text-emerald-800">{message}</p> : null}

      {loading ? (
        <p className="mt-6 text-sm text-foreground/60">Loading…</p>
      ) : (
        <div className="mt-8 space-y-10">
          <div>
            <h3 className="text-sm font-bold text-brand-navy">Users</h3>
            <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-brand-border">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="sticky top-0 border-b border-brand-border bg-brand-muted/80 text-xs uppercase text-foreground/55">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Email / name</th>
                    <th className="px-3 py-2 font-semibold">Role</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Organization</th>
                    <th className="px-3 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const name = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
                    const isSelf = currentUserId && u.id === currentUserId;
                    return (
                      <tr key={u.id} className="border-b border-brand-border/80">
                        <td className="px-3 py-2">
                          <div className="font-medium text-brand-navy">{u.email}</div>
                          {name ? <div className="text-xs text-foreground/55">{name}</div> : null}
                        </td>
                        <td className="px-3 py-2 text-foreground/75">{u.role}</td>
                        <td className="px-3 py-2">
                          {u.isActive ? (
                            <span className="text-emerald-800">Active</span>
                          ) : (
                            <span className="text-amber-800">Inactive</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-foreground/75">
                          {u.organization?.name ?? "—"}
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex flex-wrap gap-1.5">
                            {u.isActive && !isSelf ? (
                              <button
                                type="button"
                                className={btn}
                                disabled={!!busyKey}
                                onClick={() =>
                                  void runMutation(`u-d-${u.id}`, async () => {
                                    const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                      "/api/admin/users/mutate",
                                      { userId: u.id, action: "deactivate" },
                                    );
                                    if (!res.ok || !data.ok) {
                                      setMessage(typeof data.error === "string" ? data.error : "Failed.");
                                      return false;
                                    }
                                    return true;
                                  })
                                }
                              >
                                Deactivate
                              </button>
                            ) : null}
                            {!u.isActive ? (
                              <button
                                type="button"
                                className={btn}
                                disabled={!!busyKey}
                                onClick={() =>
                                  void runMutation(`u-r-${u.id}`, async () => {
                                    const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                      "/api/admin/users/mutate",
                                      { userId: u.id, action: "reactivate" },
                                    );
                                    if (!res.ok || !data.ok) {
                                      setMessage(typeof data.error === "string" ? data.error : "Failed.");
                                      return false;
                                    }
                                    return true;
                                  })
                                }
                              >
                                Reactivate
                              </button>
                            ) : null}
                            {!isSelf ? (
                              <button
                                type="button"
                                className={danger}
                                disabled={!!busyKey}
                                onClick={() => {
                                  if (
                                    !confirm(
                                      `Permanently delete user ${u.email}? This removes their applications, saved jobs, and notifications.`,
                                    )
                                  )
                                    return;
                                  void runMutation(`u-x-${u.id}`, async () => {
                                    const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                      "/api/admin/users/mutate",
                                      { userId: u.id, action: "delete" },
                                    );
                                    if (!res.ok || !data.ok) {
                                      setMessage(typeof data.error === "string" ? data.error : "Failed.");
                                      return false;
                                    }
                                    return true;
                                  });
                                }}
                              >
                                Delete
                              </button>
                            ) : (
                              <span className="text-xs text-foreground/50">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-brand-navy">Organizations</h3>
            <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-brand-border">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="sticky top-0 border-b border-brand-border bg-brand-muted/80 text-xs uppercase text-foreground/55">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Name</th>
                    <th className="px-3 py-2 font-semibold">Verification</th>
                    <th className="px-3 py-2 font-semibold">Directory</th>
                    <th className="px-3 py-2 font-semibold">Users / listings</th>
                    <th className="px-3 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((o) => (
                    <tr key={o.id} className="border-b border-brand-border/80">
                      <td className="px-3 py-2">
                        <div className="font-medium text-brand-navy">{o.name}</div>
                        <div className="text-xs text-foreground/55">{o.slug}</div>
                      </td>
                      <td className="px-3 py-2 text-foreground/75">{o.verificationStatus}</td>
                      <td className="px-3 py-2">
                        {o.isActive ? (
                          <span className="text-emerald-800">Active</span>
                        ) : (
                          <span className="text-amber-800">Suspended</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-foreground/75">
                        {o._count.users} / {o._count.opportunities}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1.5">
                          {o.isActive ? (
                            <button
                              type="button"
                              className={btn}
                              disabled={!!busyKey}
                              onClick={() =>
                                void runMutation(`o-d-${o.id}`, async () => {
                                  const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                    "/api/admin/organizations/mutate",
                                    { organizationId: o.id, action: "deactivate" },
                                  );
                                  if (!res.ok || !data.ok) {
                                    setMessage(typeof data.error === "string" ? data.error : "Failed.");
                                    return false;
                                  }
                                  return true;
                                })
                              }
                            >
                              Suspend
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={btn}
                              disabled={!!busyKey}
                              onClick={() =>
                                void runMutation(`o-r-${o.id}`, async () => {
                                  const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                    "/api/admin/organizations/mutate",
                                    { organizationId: o.id, action: "reactivate" },
                                  );
                                  if (!res.ok || !data.ok) {
                                    setMessage(typeof data.error === "string" ? data.error : "Failed.");
                                    return false;
                                  }
                                  return true;
                                })
                              }
                            >
                              Reactivate
                            </button>
                          )}
                          <button
                            type="button"
                            className={danger}
                            disabled={!!busyKey}
                            onClick={() => {
                              if (
                                !confirm(
                                  `DELETE organization “${o.name}”? This removes every listing, deletes all ${o._count.users} linked employer accounts, and cannot be undone.`,
                                )
                              )
                                return;
                              void runMutation(`o-x-${o.id}`, async () => {
                                const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                  "/api/admin/organizations/mutate",
                                  { organizationId: o.id, action: "delete" },
                                );
                                if (!res.ok || !data.ok) {
                                  setMessage(typeof data.error === "string" ? data.error : "Failed.");
                                  return false;
                                }
                                return true;
                              });
                            }}
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
            <Link
              href="/organizations"
              className="mt-2 inline-block text-xs font-semibold text-brand-gold underline"
            >
              Open public directory
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-bold text-brand-navy">All listings (opportunities)</h3>
            <div className="mt-3 max-h-80 overflow-auto rounded-xl border border-brand-border">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="sticky top-0 border-b border-brand-border bg-brand-muted/80 text-xs uppercase text-foreground/55">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Title</th>
                    <th className="px-3 py-2 font-semibold">Employer</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.map((o) => (
                    <tr key={o.id} className="border-b border-brand-border/80">
                      <td className="px-3 py-2 font-medium text-brand-navy">{o.title}</td>
                      <td className="px-3 py-2 text-foreground/75">
                        <span className={!o.organization.isActive ? "text-amber-800" : undefined}>
                          {o.organization.name}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-foreground/75">{o.status}</td>
                      <td className="px-3 py-2">
                        <div className="flex flex-wrap gap-1.5">
                          <Link
                            href={`/opportunities/${o.slug ?? o.id}`}
                            className="text-xs font-semibold text-brand-gold underline"
                          >
                            View
                          </Link>
                          {o.status === "PENDING_APPROVAL" ? (
                            <>
                              <button
                                type="button"
                                className={btn}
                                disabled={!!busyKey}
                                onClick={() =>
                                  void runMutation(`p-a-${o.id}`, async () => {
                                    const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                      `/api/admin/opportunities/${encodeURIComponent(o.id)}/approve`,
                                      {},
                                    );
                                    if (!res.ok || !data.ok) {
                                      setMessage(
                                        typeof (data as { error?: unknown }).error === "string"
                                          ? String((data as { error?: string }).error)
                                          : "Approve failed.",
                                      );
                                      return false;
                                    }
                                    return true;
                                  })
                                }
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className={btn}
                                disabled={!!busyKey}
                                onClick={() => {
                                  if (!confirm(`Reject listing “${o.title}”? It will not appear publicly.`))
                                    return;
                                  void runMutation(`p-rj-${o.id}`, async () => {
                                    const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                      `/api/admin/opportunities/${encodeURIComponent(o.id)}/reject`,
                                      {},
                                    );
                                    if (!res.ok || !data.ok) {
                                      setMessage(
                                        typeof (data as { error?: unknown }).error === "string"
                                          ? String((data as { error?: string }).error)
                                          : "Reject failed.",
                                      );
                                      return false;
                                    }
                                    return true;
                                  });
                                }}
                              >
                                Reject
                              </button>
                            </>
                          ) : null}
                          {o.status === "PUBLISHED" || o.status === "PENDING_APPROVAL" ? (
                            <button
                              type="button"
                              className={btn}
                              disabled={!!busyKey}
                              onClick={() =>
                                void runMutation(`p-c-${o.id}`, async () => {
                                  const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                    "/api/admin/opportunities/close",
                                    { opportunityId: o.id },
                                  );
                                  if (!res.ok || !data.ok) {
                                    setMessage(
                                      typeof (data as { error?: unknown }).error === "string"
                                        ? String((data as { error?: string }).error)
                                        : "Close failed.",
                                    );
                                    return false;
                                  }
                                  return true;
                                })
                              }
                            >
                              Close (deactivate)
                            </button>
                          ) : null}
                          <button
                            type="button"
                            className={danger}
                            disabled={!!busyKey}
                            onClick={() => {
                              if (
                                !confirm(
                                  `Permanently delete listing “${o.title}”? Applications and saved references will be removed.`,
                                )
                              )
                                return;
                              void runMutation(`p-x-${o.id}`, async () => {
                                const { res, data } = await postJson<{ ok?: boolean; error?: string }>(
                                  "/api/admin/opportunities/delete",
                                  { opportunityId: o.id },
                                );
                                if (!res.ok || !data.ok) {
                                  setMessage(typeof data.error === "string" ? data.error : "Delete failed.");
                                  return false;
                                }
                                return true;
                              });
                            }}
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
          </div>
        </div>
      )}
    </section>
  );
}
