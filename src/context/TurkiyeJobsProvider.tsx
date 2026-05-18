"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { signOut, useSession } from "next-auth/react";
import {
  SAMPLE_OPPORTUNITIES,
  SAMPLE_ORGANIZATIONS,
  SAMPLE_PENDING_OPPORTUNITIES,
  SAMPLE_PENDING_ORGS,
} from "@/lib/demo/catalog";
import { buildOpportunityFromSubmission } from "@/lib/build-submitted-opportunity";
import { resolveOpportunity } from "@/lib/resolve-opportunity";
import {
  isApplicationOpenForOpportunity,
  isPublishedCatalogOpportunity,
  suppressedCatalogIdsForBrowse,
} from "@/lib/opportunity-visibility";
import { getOpportunityApplicationMethod } from "@/lib/opportunity-apply";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import { sessionUserFromNextAuth } from "@/lib/session-bridge";
import type {
  ApplicantProfile,
  ApplicationRecord,
  ApplicationStatus,
  ExternalApplyIntentRecord,
  InternalApplyPayload,
  ListingStatus,
  TürkiyeJobsNotification,
  Opportunity,
  Organization,
  OrgListingRecord,
  OrgOpportunitySubmissionInput,
  PendingOppApproval,
  PendingOrgRecord,
  RegisteredUserSnapshot,
  SessionUser,
} from "@/lib/types";

const STORAGE = {
  session: "turkiyejobs:v1:session",
  saved: "turkiyejobs:v1:saved",
  applications: "turkiyejobs:v1:applications",
  orgListings: "turkiyejobs:v1:orgListings",
  pendingOrgs: "turkiyejobs:v1:pendingOrgs",
  pendingOpps: "turkiyejobs:v1:pendingOpps",
  extraOpps: "turkiyejobs:v1:extraOpportunities",
  notifications: "turkiyejobs:v1:notifications",
  approvedOrgEmails: "turkiyejobs:v1:approvedOrgEmails",
  registeredUsers: "turkiyejobs:v1:registeredUsers",
  applicantProfiles: "turkiyejobs:v1:applicantProfiles",
  suppressedCatalogIds: "turkiyejobs:v1:suppressedCatalogIds",
  externalApplyIntents: "turkiyejobs:v1:externalApplyIntents",
} as const;

function normEmail(e: string) {
  return e.trim().toLowerCase();
}

function postTransactionalEmail(path: string, body: unknown) {
  if (typeof window === "undefined" || isDemoAuthEnabled()) return;
  void fetch(path, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).catch(() => {});
}

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function buildInitialOrgListings(): OrgListingRecord[] {
  return SAMPLE_OPPORTUNITIES.slice(0, 4).map((o, i) => ({
    id: `ol-${o.id}`,
    opportunityId: o.id,
    title: o.title,
    category: o.category,
    status: (["Published", "Published", "Draft", "Closed"] as const)[
      i % 4
    ] as ListingStatus,
    submittedAt: "2026-05-01",
    applicantCount: [3, 12, 0, 8][i % 4] ?? 0,
    submittedByOrgId: o.organizationId,
  }));
}

function notificationVisibleForSession(
  n: TürkiyeJobsNotification,
  session: SessionUser | null,
): boolean {
  if (n.audience.kind === "admin") return session?.role === "admin";
  if (n.audience.kind === "org")
    return (
      session?.role === "organization" &&
      normEmail(session.email) === normEmail(n.audience.email)
    );
  return (
    session?.role === "individual" &&
    normEmail(session.email) === normEmail(n.audience.email)
  );
}

type TürkiyeJobsContextValue = {
  session: SessionUser | null;
  login: (user: SessionUser) => void;
  /** Clears browser preview sign-in only; use before signing in with a database account while preview auth is enabled. */
  exitPreviewSession: () => void;
  logout: () => void;
  /** Browser storage + catalog bootstrap finished (public pages can render). */
  bootReady: boolean;
  /** Session resolution finished (use for auth-gated UI). */
  sessionReady: boolean;
  hydrated: boolean;

  opportunities: Opportunity[];
  /** Directory organizations (Neon) or local preview fixtures. */
  organizations: Organization[];
  getOpportunityById: (id: string) => Opportunity | undefined;
  savedIds: Set<string>;
  toggleSave: (opportunityId: string) => void;
  isSaved: (opportunityId: string) => boolean;

  applications: ApplicationRecord[];
  applyToOpportunity: (
    opportunityId: string,
    payload: InternalApplyPayload,
  ) => Promise<{ ok: boolean; message: string }>;
  recordExternalApplyIntent: (
    opportunityId: string,
    channel: "email" | "external_link",
  ) => Promise<{ ok: boolean; message: string }>;
  externalApplyIntents: ExternalApplyIntentRecord[];
  submitOrgOpportunity: (input: OrgOpportunitySubmissionInput) => void;
  organizationCanPost: boolean;
  orgListings: OrgListingRecord[];

  pendingOrganizations: PendingOrgRecord[];
  approveOrganization: (id: string) => void;
  rejectOrganization: (id: string) => void;
  registerPendingOrganization: (record: PendingOrgRecord) => void;
  registerUserProfile: (record: RegisteredUserSnapshot) => void;
  registeredUsers: RegisteredUserSnapshot[];

  pendingOpportunityApprovals: PendingOppApproval[];
  approveOpportunitySubmission: (queueId: string, opportunityId?: string) => Promise<boolean>;
  rejectOpportunitySubmission: (queueId: string, opportunityId?: string) => Promise<boolean>;
  deleteOpportunitySubmission: (queueId: string, opportunityId?: string) => Promise<boolean>;
  adminCloseOpportunity: (opportunityId: string) => void;
  toggleOpportunityFeatured: (opportunityId: string) => void;

  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus,
  ) => void;
  closeOwnPublishedListing: (opportunityId: string) => void;

  notifications: TürkiyeJobsNotification[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  applicantProfile: ApplicantProfile | null;
  setApplicantProfile: (profile: ApplicantProfile) => void;

  /** Sample opportunity IDs removed from public browse after close (preview catalog). */
  suppressedCatalogIds: readonly string[];

  /** Organization-submitted opportunities (all visibilities) for admin / detail resolve. */
  orgSubmittedOpportunities: Opportunity[];

  /** Re-fetch published catalog from the API (e.g. after updating organization directory fields). */
  refreshPublicCatalog: () => void;
  /** Production: reload employer “Posted opportunities” table from Neon. */
  refreshOrgPostedListings: () => void;
};

const TürkiyeJobsContext = createContext<TürkiyeJobsContextValue | null>(null);

export function TurkiyeJobsProvider({ children }: { children: React.ReactNode }) {
  const nextAuth = useSession();
  const [localStorageReady, setLocalStorageReady] = useState(false);
  const [demoSession, setDemoSession] = useState<SessionUser | null>(null);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [orgListings, setOrgListings] = useState<OrgListingRecord[]>(
    () => (isDemoAuthEnabled() ? buildInitialOrgListings() : []),
  );
  const [pendingOrganizations, setPendingOrganizations] = useState<
    PendingOrgRecord[]
  >(() => (isDemoAuthEnabled() ? [...SAMPLE_PENDING_ORGS] : []));
  const [pendingOpportunityApprovals, setPendingOpportunityApprovals] =
    useState<PendingOppApproval[]>(() =>
      isDemoAuthEnabled() ? [...SAMPLE_PENDING_OPPORTUNITIES] : [],
    );
  const [extraOpportunities, setExtraOpportunities] = useState<Opportunity[]>(
    [],
  );
  const [notifications, setNotifications] = useState<TürkiyeJobsNotification[]>(
    [],
  );
  const [approvedOrgEmails, setApprovedOrgEmails] = useState<string[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<
    RegisteredUserSnapshot[]
  >([]);
  const [applicantProfile, setApplicantProfileState] =
    useState<ApplicantProfile | null>(null);
  const [suppressedCatalogIds, setSuppressedCatalogIds] = useState<string[]>(
    [],
  );
  const [externalApplyIntents, setExternalApplyIntents] = useState<
    ExternalApplyIntentRecord[]
  >([]);

  /** Production: live DB check so employer UI is not stuck on stale catalog cache. */
  const [orgPostingAllowed, setOrgPostingAllowed] = useState<boolean | null>(null);

  const [neonCatalog, setNeonCatalog] = useState<{
    opportunities: Opportunity[];
    organizations: Organization[];
  } | null>(null);

  const demoMode = isDemoAuthEnabled();

  const catalogOpportunities = useMemo(
    () => (demoMode ? SAMPLE_OPPORTUNITIES : neonCatalog?.opportunities ?? []),
    [demoMode, neonCatalog],
  );

  const catalogOrganizations = useMemo(
    () => (demoMode ? SAMPLE_ORGANIZATIONS : neonCatalog?.organizations ?? []),
    [demoMode, neonCatalog],
  );

  const verifiedOrgIds = useMemo(
    () =>
      new Set(
        catalogOrganizations.filter((o) => o.verified).map((o) => o.id),
      ),
    [catalogOrganizations],
  );

  const refreshNeonCatalog = useCallback(() => {
    if (demoMode) return;
    void fetch("/api/catalog", { cache: "no-store", credentials: "same-origin" })
      .then(async (res) => {
        const d = (await res.json().catch(() => ({}))) as {
          opportunities?: Opportunity[];
          organizations?: Organization[];
          error?: string;
        };
        if (!res.ok) {
          console.warn("[catalog] /api/catalog failed", res.status, d?.error);
          return;
        }
        setNeonCatalog({
          opportunities: d.opportunities ?? [],
          organizations: d.organizations ?? [],
        });
      })
      .catch((err) => {
        console.warn("[catalog] /api/catalog network error", err);
      });
  }, [demoMode]);

  const refreshPendingOpportunities = useCallback(() => {
    if (demoMode) return;
    void fetch("/api/admin/pending-opportunities", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { items?: PendingOppApproval[] } | null) => {
        if (d?.items) setPendingOpportunityApprovals(d.items);
      })
      .catch(() => {});
  }, [demoMode]);

  const refreshOrgPostedListings = useCallback(() => {
    if (demoMode) return;
    void fetch("/api/organization/opportunities", {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok?: boolean; listings?: OrgListingRecord[] } | null) => {
        if (d?.ok && Array.isArray(d.listings)) setOrgListings(d.listings);
      })
      .catch(() => {});
  }, [demoMode]);

  const refreshMyApplications = useCallback(() => {
    if (demoMode) return;
    void fetch("/api/me/applications", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok?: boolean; applications?: ApplicationRecord[] } | null) => {
        if (d?.ok && Array.isArray(d.applications)) setApplications(d.applications);
      })
      .catch(() => {});
  }, [demoMode]);

  const refreshMyExternalIntents = useCallback(() => {
    if (demoMode) return;
    void fetch("/api/me/external-apply-intents", {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok?: boolean; intents?: ExternalApplyIntentRecord[] } | null) => {
        if (d?.ok && Array.isArray(d.intents)) setExternalApplyIntents(d.intents);
      })
      .catch(() => {});
  }, [demoMode]);

  const refreshOrgApplicationsFromNeon = useCallback(() => {
    if (demoMode) return;
    void fetch("/api/organization/applications", {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { ok?: boolean; applications?: ApplicationRecord[] } | null) => {
        if (d?.ok && Array.isArray(d.applications)) setApplications(d.applications);
      })
      .catch(() => {});
  }, [demoMode]);

  useEffect(() => {
    if (demoMode) return;
    refreshNeonCatalog();
  }, [demoMode, refreshNeonCatalog]);

  const pushNotification = useCallback((n: Omit<TürkiyeJobsNotification, "id">) => {
    const full: TürkiyeJobsNotification = {
      ...n,
      id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    setNotifications((prev) => [full, ...prev].slice(0, 200));
  }, []);

  const session = useMemo((): SessionUser | null => {
    if (isDemoAuthEnabled() && demoSession) return demoSession;
    if (nextAuth.status === "loading") return null;
    return sessionUserFromNextAuth(nextAuth.data);
  }, [demoSession, nextAuth.status, nextAuth.data]);

  const refreshOrgPostingAllowed = useCallback(() => {
    if (demoMode) return;
    void fetch("/api/organization/posting-status", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { canPost?: boolean }) => {
        setOrgPostingAllowed(typeof d.canPost === "boolean" ? d.canPost : null);
      })
      .catch(() => {
        setOrgPostingAllowed(null);
      });
  }, [demoMode]);

  useEffect(() => {
    if (demoMode || !session || session.role !== "organization") {
      void Promise.resolve().then(() => {
        setOrgPostingAllowed(null);
      });
      return;
    }
    refreshOrgPostingAllowed();
  }, [demoMode, session, refreshOrgPostingAllowed]);

  useEffect(() => {
    if (demoMode || session?.role !== "organization") return;
    const onFocus = () => refreshOrgPostingAllowed();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [demoMode, session?.role, refreshOrgPostingAllowed]);

  /** True on the client immediately after hydration — must not wait on localStorage or auth. */
  const bootReady = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const [authSettled, setAuthSettled] = useState(isDemoAuthEnabled());

  useEffect(() => {
    if (isDemoAuthEnabled()) return;
    if (nextAuth.status !== "loading") {
      setAuthSettled(true);
      return;
    }
    const timer = window.setTimeout(() => setAuthSettled(true), 2000);
    return () => window.clearTimeout(timer);
  }, [nextAuth.status]);

  const sessionReady = isDemoAuthEnabled() || authSettled;

  const hydrated = bootReady && sessionReady;

  /* eslint-disable react-hooks/set-state-in-effect -- single-pass browser restore */
  useLayoutEffect(() => {
    const demo = isDemoAuthEnabled();
    if (demo) {
      setDemoSession(loadJson<SessionUser | null>(STORAGE.session, null));
      const savedArr = loadJson<string[]>(STORAGE.saved, []);
      setSavedIds(new Set(savedArr));
    }
    const rawExtra = demo ? loadJson<Opportunity[]>(STORAGE.extraOpps, []) : [];
    setExtraOpportunities(rawExtra);
    if (demo) {
      const rawApps = loadJson<ApplicationRecord[]>(STORAGE.applications, []);
      setApplications(
        rawApps.map((a) => {
          if (a.organizationId) return a;
          const opp = resolveOpportunity(
            a.opportunityId,
            rawExtra,
            demo ? SAMPLE_OPPORTUNITIES : [],
          );
          return {
            ...a,
            organizationId: opp?.organizationId ?? "",
          };
        }),
      );
    }
    const storedListings = loadJson<OrgListingRecord[] | null>(
      STORAGE.orgListings,
      null,
    );
    if (demo && storedListings?.length) setOrgListings(storedListings);
    const pOrgs = loadJson<PendingOrgRecord[] | null>(
      STORAGE.pendingOrgs,
      null,
    );
    if (demo && pOrgs?.length) setPendingOrganizations(pOrgs);
    if (demo) {
      const pOpps = loadJson<PendingOppApproval[] | null>(
        STORAGE.pendingOpps,
        null,
      );
      if (pOpps) setPendingOpportunityApprovals(pOpps);
    }
    setSuppressedCatalogIds(
      demo ? loadJson<string[]>(STORAGE.suppressedCatalogIds, []) : [],
    );
    setNotifications(loadJson<TürkiyeJobsNotification[]>(STORAGE.notifications, []));
    setApprovedOrgEmails(
      loadJson<string[]>(STORAGE.approvedOrgEmails, []).map(normEmail),
    );
    setRegisteredUsers(
      loadJson<RegisteredUserSnapshot[]>(STORAGE.registeredUsers, []),
    );
    if (demo) {
      setExternalApplyIntents(
        loadJson<ExternalApplyIntentRecord[]>(STORAGE.externalApplyIntents, []),
      );
    }
    setLocalStorageReady(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* Restore applicant CV profile when session email is known. */
  /* eslint-disable react-hooks/set-state-in-effect -- single read from localStorage */
  useEffect(() => {
    if (!hydrated || !session?.email) return;
    const map = loadJson<Record<string, ApplicantProfile>>(
      STORAGE.applicantProfiles,
      {},
    );
    const raw = map[normEmail(session.email)] as Partial<ApplicantProfile> | undefined;
    if (!raw) {
      setApplicantProfileState(null);
      return;
    }
    setApplicantProfileState({
      fullName: (raw.fullName ?? session.displayName ?? "").trim() || session.displayName,
      email: (raw.email ?? session.email).trim(),
      phone: (raw.phone ?? "").trim(),
      cvUrl: (raw.cvUrl ?? "").trim(),
      linkedinUrl: raw.linkedinUrl?.trim() || undefined,
      portfolioUrl: raw.portfolioUrl?.trim() || undefined,
    });
  }, [session?.email, session?.displayName, hydrated]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated || !isDemoAuthEnabled()) return;
    if (demoSession)
      localStorage.setItem(STORAGE.session, JSON.stringify(demoSession));
    else localStorage.removeItem(STORAGE.session);
  }, [demoSession, hydrated]);

  useEffect(() => {
    if (!hydrated || !demoMode) return;
    localStorage.setItem(STORAGE.saved, JSON.stringify([...savedIds]));
  }, [savedIds, hydrated, demoMode]);

  useEffect(() => {
    if (!hydrated || demoMode || session?.role !== "individual") return;
    refreshMyApplications();
    refreshMyExternalIntents();
  }, [
    hydrated,
    demoMode,
    session?.role,
    session?.email,
    refreshMyApplications,
    refreshMyExternalIntents,
  ]);

  useEffect(() => {
    if (demoMode || !hydrated || session?.role !== "individual") return;
    void fetch("/api/me/saved-opportunities", { credentials: "include", cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { opportunityIds?: string[] } | null) => {
        if (d?.opportunityIds) setSavedIds(new Set(d.opportunityIds));
      });
  }, [demoMode, hydrated, session?.role, session?.email]);

  useEffect(() => {
    if (!hydrated || demoMode || session?.role !== "admin") return;
    let cancelled = false;
    void fetch("/api/admin/pending-organizations", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { items?: PendingOrgRecord[] } | null) => {
        if (!cancelled && d?.items) setPendingOrganizations(d.items);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [hydrated, demoMode, session?.role, session?.email]);

  useEffect(() => {
    if (!hydrated || demoMode || session?.role !== "organization") return;
    refreshOrgPostedListings();
    refreshOrgApplicationsFromNeon();
  }, [
    hydrated,
    demoMode,
    session?.role,
    session?.organizationId,
    refreshOrgPostedListings,
    refreshOrgApplicationsFromNeon,
  ]);

  useEffect(() => {
    if (!hydrated || demoMode || session?.role !== "admin") return;
    refreshPendingOpportunities();
  }, [hydrated, demoMode, session?.role, session?.email, refreshPendingOpportunities]);

  useEffect(() => {
    if (!hydrated || !demoMode) return;
    localStorage.setItem(STORAGE.applications, JSON.stringify(applications));
  }, [applications, hydrated, demoMode]);

  useEffect(() => {
    if (!hydrated || !demoMode) return;
    localStorage.setItem(STORAGE.orgListings, JSON.stringify(orgListings));
  }, [orgListings, hydrated, demoMode]);

  useEffect(() => {
    if (!hydrated || !demoMode) return;
    localStorage.setItem(
      STORAGE.pendingOrgs,
      JSON.stringify(pendingOrganizations),
    );
  }, [pendingOrganizations, hydrated, demoMode]);

  useEffect(() => {
    if (!hydrated || !demoMode) return;
    localStorage.setItem(
      STORAGE.pendingOpps,
      JSON.stringify(pendingOpportunityApprovals),
    );
  }, [pendingOpportunityApprovals, hydrated, demoMode]);

  useEffect(() => {
    if (!hydrated || !demoMode) return;
    localStorage.setItem(
      STORAGE.extraOpps,
      JSON.stringify(extraOpportunities),
    );
  }, [extraOpportunities, hydrated, demoMode]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE.notifications,
      JSON.stringify(notifications),
    );
  }, [notifications, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE.approvedOrgEmails,
      JSON.stringify(approvedOrgEmails),
    );
  }, [approvedOrgEmails, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE.registeredUsers,
      JSON.stringify(registeredUsers),
    );
  }, [registeredUsers, hydrated]);

  useEffect(() => {
    if (!hydrated || !demoMode) return;
    localStorage.setItem(
      STORAGE.externalApplyIntents,
      JSON.stringify(externalApplyIntents),
    );
  }, [externalApplyIntents, hydrated, demoMode]);

  useEffect(() => {
    if (!hydrated || !isDemoAuthEnabled()) return;
    localStorage.setItem(
      STORAGE.suppressedCatalogIds,
      JSON.stringify(suppressedCatalogIds),
    );
  }, [suppressedCatalogIds, hydrated]);

  const organizationCanPost = useMemo(() => {
    if (!session || session.role !== "organization") return false;
    if (demoMode) {
      const id = session.organizationId;
      if (id && verifiedOrgIds.has(id)) return true;
      return approvedOrgEmails.includes(normEmail(session.email));
    }
    if (orgPostingAllowed === true) return true;
    if (orgPostingAllowed === false) return false;
    const id = session.organizationId;
    if (id && verifiedOrgIds.has(id)) return true;
    return approvedOrgEmails.includes(normEmail(session.email));
  }, [
    session,
    demoMode,
    approvedOrgEmails,
    verifiedOrgIds,
    orgPostingAllowed,
  ]);

  const visibleNotifications = useMemo(() => {
    return notifications.filter((n) => notificationVisibleForSession(n, session));
  }, [notifications, session]);

  const unreadNotificationCount = useMemo(
    () => visibleNotifications.filter((n) => !n.read).length,
    [visibleNotifications],
  );

  const login = useCallback((user: SessionUser) => {
    setDemoSession(user);
  }, []);

  const exitPreviewSession = useCallback(() => {
    setDemoSession(null);
    try {
      localStorage.removeItem(STORAGE.session);
    } catch {
      /* ignore */
    }
  }, []);

  const logout = useCallback(() => {
    setDemoSession(null);
    setApplicantProfileState(null);
    try {
      localStorage.removeItem(STORAGE.session);
    } catch {
      /* ignore */
    }
    void signOut({ redirect: false });
  }, []);

  const setApplicantProfile = useCallback(
    (profile: ApplicantProfile) => {
      if (!session?.email) return;
      const key = normEmail(session.email);
      const map = loadJson<Record<string, ApplicantProfile>>(
        STORAGE.applicantProfiles,
        {},
      );
      map[key] = profile;
      localStorage.setItem(STORAGE.applicantProfiles, JSON.stringify(map));
      setApplicantProfileState(profile);
    },
    [session],
  );

  const registerPendingOrganization = useCallback(
    (record: PendingOrgRecord) => {
      setPendingOrganizations((prev) => {
        if (prev.some((p) => normEmail(p.email) === normEmail(record.email)))
          return prev;
        return [record, ...prev];
      });
      pushNotification({
        createdAt: new Date().toISOString(),
        read: false,
        audience: { kind: "admin" },
        title: "Organization registration",
        message: `${record.name} (${record.email}) is awaiting account approval.`,
      });
    },
    [pushNotification],
  );

  const registerUserProfile = useCallback((record: RegisteredUserSnapshot) => {
    setRegisteredUsers((prev) => {
      const next = prev.filter(
        (u) => normEmail(u.email) !== normEmail(record.email),
      );
      return [record, ...next];
    });
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    if (!session) return;
    setNotifications((prev) =>
      prev.map((n) =>
        notificationVisibleForSession(n, session) ? { ...n, read: true } : n,
      ),
    );
  }, [session]);

  const toggleSave = useCallback(
    (opportunityId: string) => {
      if (!demoMode) {
        if (session?.role !== "individual") return;
        const save = !savedIds.has(opportunityId);
        void fetch("/api/me/saved-opportunities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ opportunityId, save }),
        }).then((res) => {
          if (res.ok) {
            setSavedIds((prev) => {
              const next = new Set(prev);
              if (save) next.add(opportunityId);
              else next.delete(opportunityId);
              return next;
            });
          }
        });
        return;
      }
      setSavedIds((prev) => {
        const next = new Set(prev);
        if (next.has(opportunityId)) next.delete(opportunityId);
        else next.add(opportunityId);
        return next;
      });
    },
    [demoMode, session?.role, savedIds],
  );

  const isSaved = useCallback(
    (opportunityId: string) => savedIds.has(opportunityId),
    [savedIds],
  );

  const publishedOpportunities = useMemo(() => {
    const suppressed = new Set(suppressedCatalogIdsForBrowse(suppressedCatalogIds));
    const fromCatalog = catalogOpportunities.filter(
      (o) => isPublishedCatalogOpportunity(o) && !suppressed.has(o.id),
    );
    const fromExtras = extraOpportunities.filter(isPublishedCatalogOpportunity);
    const byId = new Map<string, Opportunity>();
    for (const o of fromExtras) byId.set(o.id, o);
    for (const o of fromCatalog) byId.set(o.id, o);
    return [...byId.values()];
  }, [catalogOpportunities, extraOpportunities, suppressedCatalogIds]);

  const getOpportunityById = useCallback(
    (id: string) => resolveOpportunity(id, extraOpportunities, catalogOpportunities),
    [extraOpportunities, catalogOpportunities],
  );

  const applyToOpportunity = useCallback(
    async (opportunityId: string, payload: InternalApplyPayload) => {
      const opp = resolveOpportunity(opportunityId, extraOpportunities, catalogOpportunities);
      if (!opp) return { ok: false, message: "Opportunity not found." };
      if (getOpportunityApplicationMethod(opp) !== "internal") {
        return {
          ok: false,
          message: "This listing does not accept applications through TürkiyeJobs.org.",
        };
      }
      if (suppressedCatalogIdsForBrowse(suppressedCatalogIds).includes(opp.id)) {
        return {
          ok: false,
          message:
            "This listing has been closed and is no longer accepting applications.",
        };
      }
      if (!isApplicationOpenForOpportunity(opp)) {
        return {
          ok: false,
          message:
            "This listing is not open for applications (pending approval, closed, or unpublished).",
        };
      }
      if (!session || session.role !== "individual") {
        return {
          ok: false,
          message: "Please sign in as an individual applicant to apply.",
        };
      }
      if (!applicantProfile) {
        return {
          ok: false,
          message: "Complete your applicant profile (name, phone, CV) before applying.",
        };
      }
      const phoneOk = applicantProfile.phone?.trim();
      if (!phoneOk) {
        return {
          ok: false,
          message: "Add your phone number in your applicant profile before applying.",
        };
      }
      const cvOk = applicantProfile.cvUrl?.trim();
      if (!cvOk || !cvOk.startsWith("http")) {
        return {
          ok: false,
          message: "Add a valid CV or resume URL (https) in your applicant profile before applying.",
        };
      }
      const applicantPhone = applicantProfile.phone.trim();
      const cvUrl = applicantProfile.cvUrl.trim();
      const me = normEmail(session.email);
      const already = applications.some((a) => {
        if (a.opportunityId !== opp.id) return false;
        if (!a.applicantEmail) return false;
        return normEmail(a.applicantEmail) === me;
      });
      if (already) {
        return { ok: false, message: "You have already applied to this role." };
      }

      if (!demoMode) {
        try {
          const res = await fetch("/api/applications/internal", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              listingId: opp.id,
              organizationId: opp.organizationId,
              opportunityTitle: opp.title,
              applicantFullName: payload.fullName.trim(),
              applicantPhone,
              cvUrl,
              linkedinUrl: applicantProfile.linkedinUrl?.trim() || undefined,
              portfolioUrl: applicantProfile.portfolioUrl?.trim() || undefined,
              coverLetter: payload.coverLetter?.trim() || undefined,
            }),
          });
          const data = (await res.json().catch(() => ({}))) as {
            ok?: boolean;
            id?: string;
            error?: unknown;
          };
          if (!res.ok) {
            const err =
              typeof data.error === "string"
                ? data.error
                : "Could not submit application. Please try again.";
            return { ok: false, message: err };
          }
          refreshMyApplications();
          const orgEmailNeon = opp.contactEmail?.trim();
          if (orgEmailNeon) {
            pushNotification({
              createdAt: new Date().toISOString(),
              read: false,
              audience: { kind: "org", email: normEmail(orgEmailNeon) },
              title: "New application",
              message: `Someone applied to “${opp.title}” via TürkiyeJobs.org.`,
            });
          }
          return {
            ok: true,
            message: data.id
              ? "Application submitted and saved to the database."
              : "Application submitted successfully.",
          };
        } catch {
          return {
            ok: false,
            message:
              "Network error submitting application. Check your connection and try again.",
          };
        }
      }

      let serverId: string | undefined;
      try {
        const res = await fetch("/api/applications/internal", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            listingId: opp.id,
            organizationId: opp.organizationId,
            opportunityTitle: opp.title,
            applicantFullName: payload.fullName.trim(),
            applicantPhone,
            cvUrl,
            linkedinUrl: applicantProfile.linkedinUrl?.trim() || undefined,
            portfolioUrl: payload.portfolioUrl?.trim() || undefined,
            coverLetter: payload.coverLetter?.trim() || undefined,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { id?: string };
          serverId = data.id;
        }
      } catch {
        /* Neon optional — local preview still works */
      }

      const rec: ApplicationRecord = {
        id: `app-${Date.now()}`,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        organizationName: opp.organizationName,
        organizationId: opp.organizationId,
        status: "Submitted",
        submittedAt: new Date().toISOString().slice(0, 10),
        coverLetter: payload.coverLetter?.trim() || undefined,
        applicantEmail: session.email,
        applicantDisplayName: session.displayName,
        applicantFullName: payload.fullName.trim(),
        applicantPhone,
        cvUrl,
        linkedinUrl: applicantProfile.linkedinUrl?.trim() || undefined,
        portfolioUrl: payload.portfolioUrl?.trim() || undefined,
        serverId,
        channel: "internal",
      };
      setApplications((prev) => [...prev, rec]);
      setOrgListings((prev) =>
        prev.map((row) =>
          row.opportunityId === opp.id
            ? { ...row, applicantCount: row.applicantCount + 1 }
            : row,
        ),
      );
      const orgEmail = opp.contactEmail?.trim();
      if (orgEmail) {
        pushNotification({
          createdAt: new Date().toISOString(),
          read: false,
          audience: { kind: "org", email: normEmail(orgEmail) },
          title: "New application",
          message: `Someone applied to “${opp.title}” via TürkiyeJobs.org.`,
        });
      }
      return {
        ok: true,
        message: serverId
          ? "Application submitted and saved to the database."
          : "Application submitted successfully.",
      };
    },
    [
      session,
      applications,
      extraOpportunities,
      catalogOpportunities,
      applicantProfile,
      pushNotification,
      suppressedCatalogIds,
      demoMode,
      refreshMyApplications,
    ],
  );

  const recordExternalApplyIntent = useCallback(
    async (opportunityId: string, channel: "email" | "external_link") => {
      const opp = resolveOpportunity(opportunityId, extraOpportunities, catalogOpportunities);
      if (!opp) return { ok: false, message: "Opportunity not found." };
      if (!session || session.role !== "individual") {
        return {
          ok: false,
          message: "Please sign in as an individual to track external applications.",
        };
      }
      const me = normEmail(session.email);
      const exists = externalApplyIntents.some(
        (x) =>
          x.opportunityId === opp.id &&
          normEmail(x.applicantEmail) === me &&
          x.channel === channel,
      );
      if (exists) {
        return {
          ok: false,
          message: "You have already recorded this action for this listing.",
        };
      }
      if (!demoMode) {
        try {
          const res = await fetch("/api/applications/external-intent", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              listingId: opp.id,
              channel: channel === "email" ? "EMAIL" : "EXTERNAL_LINK",
            }),
          });
          const data = (await res.json().catch(() => ({}))) as {
            ok?: boolean;
            error?: unknown;
          };
          if (!res.ok) {
            const err =
              typeof data.error === "string"
                ? data.error
                : "Could not record your application. Please try again.";
            return { ok: false, message: err };
          }
          refreshMyExternalIntents();
          return { ok: true, message: "Recorded — see your applicant dashboard." };
        } catch {
          return {
            ok: false,
            message:
              "Network error recording your application. Check your connection and try again.",
          };
        }
      }
      const row: ExternalApplyIntentRecord = {
        id: `ext-${Date.now()}`,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        organizationName: opp.organizationName,
        applicantEmail: session.email,
        channel,
        recordedAt: new Date().toISOString().slice(0, 10),
      };
      setExternalApplyIntents((prev) => [row, ...prev]);
      setOrgListings((prev) =>
        prev.map((r) =>
          r.opportunityId === opp.id
            ? { ...r, applicantCount: r.applicantCount + 1 }
            : r,
        ),
      );
      return { ok: true, message: "Recorded — see your applicant dashboard." };
    },
    [
      session,
      externalApplyIntents,
      extraOpportunities,
      catalogOpportunities,
      demoMode,
      refreshMyExternalIntents,
    ],
  );

  const submitOrgOpportunity = useCallback(
    (input: OrgOpportunitySubmissionInput) => {
      if (!session || session.role !== "organization") return;
      if (!organizationCanPost) return;

      if (!demoMode) {
        void (async () => {
          try {
            const res = await fetch("/api/organization/opportunities", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(input),
            });
            const data = (await res.json().catch(() => ({}))) as {
              ok?: boolean;
              listing?: {
                opportunityId: string;
                title: string;
                category: Opportunity["category"];
                submittedAt: string;
              };
            };
            if (!res.ok || !data.ok || !data.listing) return;
            const listing = data.listing;
            refreshOrgPostedListings();
            refreshNeonCatalog();
            refreshPendingOpportunities();
            pushNotification({
              createdAt: new Date().toISOString(),
              read: false,
              audience: { kind: "admin" },
              title: "Listing pending approval",
              message: `${session.organizationName ?? "An organization"} submitted “${listing.title}”.`,
            });
          } catch {
            /* ignore */
          }
        })();
        return;
      }

      const oppId = `opp-${Date.now()}`;
      const queueId = `popp-q-${Date.now()}`;
      const built = buildOpportunityFromSubmission(session, input, oppId);
      const today = new Date().toISOString().slice(0, 10);

      setExtraOpportunities((prev) => [...prev, built]);
      setPendingOpportunityApprovals((prev) => [
        {
          id: queueId,
          opportunityId: oppId,
          title: built.title,
          organizationName: built.organizationName,
          category: built.category,
          submittedAt: today,
        },
        ...prev,
      ]);
      setOrgListings((prev) => [
        {
          id: `ol-${oppId}`,
          opportunityId: oppId,
          title: built.title,
          category: built.category,
          status: "Pending approval",
          submittedAt: today,
          applicantCount: 0,
          submittedByOrgId: session.organizationId ?? undefined,
        },
        ...prev,
      ]);
      pushNotification({
        createdAt: new Date().toISOString(),
        read: false,
        audience: { kind: "admin" },
        title: "Listing pending approval",
        message: `${built.organizationName} submitted “${built.title}”.`,
      });
    },
    [session, organizationCanPost, pushNotification, demoMode, refreshNeonCatalog, refreshPendingOpportunities, refreshOrgPostedListings],
  );

  const approveOrganization = useCallback(
    (id: string) => {
      if (!demoMode) {
        void (async () => {
          try {
            const res = await fetch("/api/admin/organizations/moderate", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ organizationId: id, action: "approve" }),
            });
            if (!res.ok) return;
            setPendingOrganizations((prev) => prev.filter((p) => p.id !== id));
            refreshNeonCatalog();
          } catch {
            /* ignore */
          }
        })();
        return;
      }
      setPendingOrganizations((prev) => {
        const row = prev.find((p) => p.id === id);
        if (!row) return prev;
        setApprovedOrgEmails((emails) =>
          emails.includes(normEmail(row.email))
            ? emails
            : [...emails, normEmail(row.email)],
        );
        pushNotification({
          createdAt: new Date().toISOString(),
          read: false,
          audience: { kind: "org", email: normEmail(row.email) },
          title: "Account approved",
          message:
            "Your organization can now post opportunities on TürkiyeJobs.org for this preview session.",
        });
        queueMicrotask(() => {
          postTransactionalEmail("/api/admin/transactional-email", {
            kind: "organization-approved",
            to: row.email.trim(),
            organizationName: row.name,
          });
        });
        return prev.filter((p) => p.id !== id);
      });
    },
    [demoMode, pushNotification, refreshNeonCatalog],
  );

  const rejectOrganization = useCallback(
    (id: string) => {
      if (!demoMode) {
        void (async () => {
          try {
            const res = await fetch("/api/admin/organizations/moderate", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ organizationId: id, action: "reject" }),
            });
            if (!res.ok) return;
            setPendingOrganizations((prev) => prev.filter((p) => p.id !== id));
            refreshNeonCatalog();
          } catch {
            /* ignore */
          }
        })();
        return;
      }
      setPendingOrganizations((prev) => {
        const row = prev.find((p) => p.id === id);
        if (!row) return prev;
        pushNotification({
          createdAt: new Date().toISOString(),
          read: false,
          audience: { kind: "org", email: normEmail(row.email) },
          title: "Account not approved",
          message:
            "Your organization registration was not approved in this preview session.",
        });
        queueMicrotask(() => {
          postTransactionalEmail("/api/admin/transactional-email", {
            kind: "organization-rejected",
            to: row.email.trim(),
            organizationName: row.name,
          });
        });
        return prev.filter((p) => p.id !== id);
      });
    },
    [demoMode, pushNotification, refreshNeonCatalog],
  );

  const approveOpportunitySubmission = useCallback(
    (queueId: string, opportunityId?: string): Promise<boolean> => {
      if (!demoMode) {
        const oid =
          opportunityId?.trim() ||
          (queueId.startsWith("popp-") && !queueId.startsWith("popp-q-")
            ? queueId.slice("popp-".length)
            : queueId.trim());
        if (!oid) return Promise.resolve(false);
        return (async () => {
          try {
            const res = await fetch(
              `/api/admin/opportunities/${encodeURIComponent(oid)}/approve`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
              },
            );
            const data = (await res.json().catch(() => ({}))) as {
              ok?: boolean;
              title?: string;
              organizationName?: string;
              contactEmail?: string | null;
            };
            if (!res.ok || !data.ok) return false;
            setPendingOpportunityApprovals((prev) => prev.filter((p) => p.id !== queueId));
            setOrgListings((listings) =>
              listings.map((l) =>
                l.opportunityId === oid && l.status === "Pending approval"
                  ? { ...l, status: "Published" as ListingStatus }
                  : l,
              ),
            );
            refreshPendingOpportunities();
            refreshNeonCatalog();
            const em = data.contactEmail?.trim();
            if (em) {
              queueMicrotask(() =>
                pushNotification({
                  createdAt: new Date().toISOString(),
                  read: false,
                  audience: { kind: "org", email: normEmail(em) },
                  title: "Listing published",
                  message: `“${data.title ?? "Your listing"}” is now live on the public opportunities page.`,
                }),
              );
              queueMicrotask(() => {
                postTransactionalEmail("/api/admin/transactional-email", {
                  kind: "opportunity-approved",
                  to: em,
                  opportunityTitle: data.title ?? "Your listing",
                  organizationName: data.organizationName ?? "Organization",
                });
              });
            }
            return true;
          } catch {
            return false;
          }
        })();
      }

      setPendingOpportunityApprovals((prev) => {
        const item = prev.find((p) => p.id === queueId);
        if (!item) return prev;

        if (item.opportunityId) {
          setExtraOpportunities((extras) => {
            const next = extras.map((o) =>
              o.id === item.opportunityId
                ? { ...o, visibility: "published" as const }
                : o,
            );
            const pub = next.find((o) => o.id === item.opportunityId);
            const em = pub?.contactEmail?.trim();
            if (em) {
              queueMicrotask(() =>
                pushNotification({
                  createdAt: new Date().toISOString(),
                  read: false,
                  audience: { kind: "org", email: normEmail(em) },
                  title: "Listing published",
                  message: `“${item.title}” is now live on the public opportunities page.`,
                }),
              );
              queueMicrotask(() => {
                postTransactionalEmail("/api/admin/transactional-email", {
                  kind: "opportunity-approved",
                  to: em,
                  opportunityTitle: item.title,
                  organizationName: item.organizationName,
                });
              });
            }
            return next;
          });
          setOrgListings((listings) =>
            listings.map((l) =>
              l.opportunityId === item.opportunityId &&
              l.status === "Pending approval"
                ? { ...l, status: "Published" as ListingStatus }
                : l,
            ),
          );
        } else {
          setOrgListings((listings) =>
            listings.map((l) =>
              l.title === item.title && l.status === "Pending approval"
                ? { ...l, status: "Published" as ListingStatus }
                : l,
            ),
          );
        }
        return prev.filter((p) => p.id !== queueId);
      });
      return Promise.resolve(true);
    },
    [pushNotification, demoMode, refreshPendingOpportunities, refreshNeonCatalog],
  );

  const rejectOpportunitySubmission = useCallback(
    (queueId: string, opportunityId?: string): Promise<boolean> => {
      if (!demoMode) {
        const oid =
          opportunityId?.trim() ||
          (queueId.startsWith("popp-") && !queueId.startsWith("popp-q-")
            ? queueId.slice("popp-".length)
            : queueId.trim());
        if (!oid) return Promise.resolve(false);
        return (async () => {
          try {
            const res = await fetch(
              `/api/admin/opportunities/${encodeURIComponent(oid)}/reject`,
              {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
              },
            );
            const data = (await res.json().catch(() => ({}))) as {
              ok?: boolean;
              title?: string;
              organizationName?: string;
              contactEmail?: string | null;
            };
            if (!res.ok || !data.ok) return false;
            setPendingOpportunityApprovals((prev) => prev.filter((p) => p.id !== queueId));
            setOrgListings((listings) =>
              listings.map((l) =>
                l.opportunityId === oid ? { ...l, status: "Rejected" as ListingStatus } : l,
              ),
            );
            refreshPendingOpportunities();
            refreshNeonCatalog();
            const em = data.contactEmail?.trim();
            if (em) {
              queueMicrotask(() =>
                pushNotification({
                  createdAt: new Date().toISOString(),
                  read: false,
                  audience: { kind: "org", email: normEmail(em) },
                  title: "Listing not approved",
                  message: `“${data.title ?? "Your listing"}” was not approved for public listing.`,
                }),
              );
              queueMicrotask(() => {
                postTransactionalEmail("/api/admin/transactional-email", {
                  kind: "opportunity-rejected",
                  to: em,
                  opportunityTitle: data.title ?? "Your listing",
                  organizationName: data.organizationName ?? "Organization",
                });
              });
            }
            return true;
          } catch {
            return false;
          }
        })();
      }

      setPendingOpportunityApprovals((prev) => {
        const row = prev.find((p) => p.id === queueId);
        if (!row) return prev;

        if (row.opportunityId) {
          setExtraOpportunities((extras) => {
            const next = extras.map((o) =>
              o.id === row.opportunityId
                ? { ...o, visibility: "rejected" as const }
                : o,
            );
            const rej = next.find((o) => o.id === row.opportunityId);
            const em = rej?.contactEmail?.trim();
            if (em) {
              queueMicrotask(() =>
                pushNotification({
                  createdAt: new Date().toISOString(),
                  read: false,
                  audience: { kind: "org", email: normEmail(em) },
                  title: "Listing not approved",
                  message: `“${row.title}” was not approved for public listing.`,
                }),
              );
              queueMicrotask(() => {
                postTransactionalEmail("/api/admin/transactional-email", {
                  kind: "opportunity-rejected",
                  to: em,
                  opportunityTitle: row.title,
                  organizationName: row.organizationName,
                });
              });
            }
            return next;
          });
          setOrgListings((listings) =>
            listings.map((l) =>
              l.opportunityId === row.opportunityId
                ? { ...l, status: "Rejected" as ListingStatus }
                : l,
            ),
          );
        } else {
          setOrgListings((listings) =>
            listings.map((l) =>
              l.title === row.title && l.status === "Pending approval"
                ? { ...l, status: "Rejected" as ListingStatus }
                : l,
            ),
          );
        }
        return prev.filter((p) => p.id !== queueId);
      });
      return Promise.resolve(true);
    },
    [pushNotification, demoMode, refreshPendingOpportunities, refreshNeonCatalog],
  );

  const deleteOpportunitySubmission = useCallback(
    (queueId: string, opportunityId?: string): Promise<boolean> => {
      if (!demoMode) {
        const oid =
          opportunityId?.trim() ||
          (queueId.startsWith("popp-") && !queueId.startsWith("popp-q-")
            ? queueId.slice("popp-".length)
            : queueId.trim());
        if (!oid) return Promise.resolve(false);
        return (async () => {
          try {
            const res = await fetch("/api/admin/opportunities/delete", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ opportunityId: oid }),
            });
            const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
            if (!res.ok || !data.ok) return false;
            setPendingOpportunityApprovals((prev) => prev.filter((p) => p.id !== queueId));
            setOrgListings((listings) => listings.filter((l) => l.opportunityId !== oid));
            refreshPendingOpportunities();
            refreshNeonCatalog();
            return true;
          } catch {
            return false;
          }
        })();
      }

      setPendingOpportunityApprovals((prev) => {
        const row = prev.find((p) => p.id === queueId);
        if (!row) return prev;
        if (row.opportunityId) {
          setExtraOpportunities((extras) =>
            extras.filter((o) => o.id !== row.opportunityId),
          );
          setOrgListings((listings) =>
            listings.filter((l) => l.opportunityId !== row.opportunityId),
          );
        }
        return prev.filter((p) => p.id !== queueId);
      });
      return Promise.resolve(true);
    },
    [demoMode, refreshPendingOpportunities, refreshNeonCatalog],
  );

  const adminCloseOpportunity = useCallback(
    async (opportunityId: string) => {
      const inDemoCatalog =
        demoMode && SAMPLE_OPPORTUNITIES.some((o) => o.id === opportunityId);
      const inNeonCatalog =
        !demoMode && catalogOpportunities.some((o) => o.id === opportunityId);
      if (inDemoCatalog) {
        setSuppressedCatalogIds((prev) =>
          prev.includes(opportunityId) ? prev : [...prev, opportunityId],
        );
      } else if (inNeonCatalog) {
        try {
          const res = await fetch("/api/admin/opportunities/close", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ opportunityId }),
          });
          if (res.ok) {
            refreshNeonCatalog();
            refreshOrgPostedListings();
          }
        } catch {
          /* ignore */
        }
      } else {
        setExtraOpportunities((extras) =>
          extras.map((o) =>
            o.id === opportunityId ? { ...o, visibility: "closed" as const } : o,
          ),
        );
      }
      setOrgListings((listings) =>
        listings.map((l) =>
          l.opportunityId === opportunityId
            ? { ...l, status: "Closed" as ListingStatus }
            : l,
        ),
      );
    },
    [demoMode, catalogOpportunities, refreshNeonCatalog, refreshOrgPostedListings],
  );

  const toggleOpportunityFeatured = useCallback((opportunityId: string) => {
    setExtraOpportunities((extras) =>
      extras.map((o) =>
        o.id === opportunityId ? { ...o, featured: !o.featured } : o,
      ),
    );
  }, []);

  const updateApplicationStatus = useCallback(
    (applicationId: string, status: ApplicationStatus) => {
      if (!session || session.role !== "organization") return;
      const target = applications.find((a) => a.id === applicationId);
      if (!target || target.organizationId !== session.organizationId) return;

      if (!demoMode) {
        void (async () => {
          try {
            const res = await fetch("/api/organization/applications", {
              method: "PATCH",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ applicationId, status }),
            });
            if (!res.ok) return;
            const em = target.applicantEmail?.trim();
            if (em) {
              queueMicrotask(() =>
                pushNotification({
                  createdAt: new Date().toISOString(),
                  read: false,
                  audience: { kind: "user", email: normEmail(em) },
                  title: "Application status updated",
                  message: `Your application to “${target.opportunityTitle}” is now: ${status}.`,
                }),
              );
            }
            const sid = target.serverId ?? target.id;
            if (sid) {
              queueMicrotask(() => {
                void fetch("/api/organization/transactional-email", {
                  method: "POST",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    kind: "application-status-updated",
                    applicationServerId: sid,
                    statusLabel: status,
                  }),
                }).catch(() => {});
              });
            }
            refreshOrgApplicationsFromNeon();
          } catch {
            /* ignore */
          }
        })();
        return;
      }

      setApplications((prev) => {
        const t = prev.find((a) => a.id === applicationId);
        if (!t) return prev;
        if (t.organizationId !== session.organizationId) return prev;
        const next = prev.map((a) => (a.id === applicationId ? { ...a, status } : a));
        const em = t.applicantEmail?.trim();
        if (em) {
          queueMicrotask(() =>
            pushNotification({
              createdAt: new Date().toISOString(),
              read: false,
              audience: { kind: "user", email: normEmail(em) },
              title: "Application status updated",
              message: `Your application to “${t.opportunityTitle}” is now: ${status}.`,
            }),
          );
        }
        if (t.serverId && !isDemoAuthEnabled()) {
          queueMicrotask(() => {
            void fetch("/api/organization/transactional-email", {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                kind: "application-status-updated",
                applicationServerId: t.serverId,
                statusLabel: status,
              }),
            }).catch(() => {});
          });
        }
        return next;
      });
    },
    [session, pushNotification, demoMode, applications, refreshOrgApplicationsFromNeon],
  );

  const closeOwnPublishedListing = useCallback(
    async (opportunityId: string) => {
      if (!session || session.role !== "organization") return;
      const inDemoCatalog =
        demoMode && SAMPLE_OPPORTUNITIES.some((o) => o.id === opportunityId);
      const neonOwn =
        !demoMode &&
        catalogOpportunities.some(
          (o) =>
            o.id === opportunityId &&
            o.organizationId === session.organizationId,
        );
      setOrgListings((listings) => {
        const row = listings.find(
          (l) =>
            l.opportunityId === opportunityId &&
            l.submittedByOrgId === session.organizationId,
        );
        if (!row || row.status !== "Published") return listings;
        return listings.map((l) =>
          l.opportunityId === opportunityId &&
          l.submittedByOrgId === session.organizationId
            ? { ...l, status: "Closed" as ListingStatus }
            : l,
        );
      });
      if (inDemoCatalog) {
        setSuppressedCatalogIds((prev) =>
          prev.includes(opportunityId) ? prev : [...prev, opportunityId],
        );
      } else if (neonOwn) {
        try {
          const res = await fetch("/api/organization/opportunities/close", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ opportunityId }),
          });
          if (res.ok) {
            refreshNeonCatalog();
            refreshOrgPostedListings();
          }
        } catch {
          /* ignore */
        }
      } else {
        setExtraOpportunities((extras) =>
          extras.map((o) =>
            o.id === opportunityId &&
            o.organizationId === session.organizationId
              ? { ...o, visibility: "closed" as const }
              : o,
          ),
        );
      }
    },
    [session, demoMode, catalogOpportunities, refreshNeonCatalog, refreshOrgPostedListings],
  );

  const value = useMemo<TürkiyeJobsContextValue>(
    () => ({
      session,
      login,
      exitPreviewSession,
      logout,
      bootReady,
      sessionReady,
      hydrated,
      opportunities: publishedOpportunities,
      organizations: catalogOrganizations,
      getOpportunityById,
      savedIds,
      toggleSave,
      isSaved,
      applications,
      applyToOpportunity,
      recordExternalApplyIntent,
      externalApplyIntents,
      orgListings,
      submitOrgOpportunity,
      organizationCanPost,
      pendingOrganizations,
      approveOrganization,
      rejectOrganization,
      registerPendingOrganization,
      registerUserProfile,
      registeredUsers,
      pendingOpportunityApprovals,
      approveOpportunitySubmission,
      rejectOpportunitySubmission,
      deleteOpportunitySubmission,
      adminCloseOpportunity,
      toggleOpportunityFeatured,
      updateApplicationStatus,
      closeOwnPublishedListing,
      notifications: visibleNotifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
      applicantProfile,
      setApplicantProfile,
      suppressedCatalogIds,
      orgSubmittedOpportunities: extraOpportunities,
      refreshPublicCatalog: refreshNeonCatalog,
      refreshOrgPostedListings,
    }),
    [
      session,
      login,
      exitPreviewSession,
      logout,
      bootReady,
      sessionReady,
      hydrated,
      publishedOpportunities,
      catalogOrganizations,
      getOpportunityById,
      savedIds,
      toggleSave,
      isSaved,
      applications,
      applyToOpportunity,
      recordExternalApplyIntent,
      externalApplyIntents,
      orgListings,
      submitOrgOpportunity,
      organizationCanPost,
      pendingOrganizations,
      approveOrganization,
      rejectOrganization,
      registerPendingOrganization,
      registerUserProfile,
      registeredUsers,
      pendingOpportunityApprovals,
      approveOpportunitySubmission,
      rejectOpportunitySubmission,
      deleteOpportunitySubmission,
      adminCloseOpportunity,
      toggleOpportunityFeatured,
      updateApplicationStatus,
      closeOwnPublishedListing,
      visibleNotifications,
      unreadNotificationCount,
      markNotificationRead,
      markAllNotificationsRead,
      applicantProfile,
      setApplicantProfile,
      suppressedCatalogIds,
      extraOpportunities,
      refreshNeonCatalog,
      refreshOrgPostedListings,
    ],
  );

  return (
    <TürkiyeJobsContext.Provider value={value}>{children}</TürkiyeJobsContext.Provider>
  );
}

export function useTurkiyeJobs() {
  const ctx = useContext(TürkiyeJobsContext);
  if (!ctx) {
    throw new Error("useTurkiyeJobs must be used within TurkiyeJobsProvider");
  }
  return ctx;
}
