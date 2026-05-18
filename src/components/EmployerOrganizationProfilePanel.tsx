"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { isDemoAuthEnabled } from "@/lib/demo-auth";

type PublishedProfile = {
  organizationName: string;
  contactEmail: string;
  about: string;
  location: string;
  website: string;
  logoUrl: string;
  phone: string;
  verificationStatus: string;
};

type PendingProfile = {
  id: string;
  organizationName: string;
  contactEmail: string;
  about: string;
  location: string;
  website: string;
  logoUrl: string;
  phone: string;
  submittedAt: string;
};

type ProfileApiData = {
  published: PublishedProfile;
  pending: PendingProfile | null;
};

function formatSaveError(body: unknown): string {
  if (!body || typeof body !== "object") return "Save failed.";
  const err = (body as { error?: unknown }).error;
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const parts: string[] = [];
    for (const [, v] of Object.entries(err as Record<string, unknown>)) {
      if (Array.isArray(v) && v.length) parts.push(String(v[0]));
    }
    if (parts.length) return parts.join(" ");
  }
  return "Save failed.";
}

export function EmployerOrganizationProfilePanel() {
  const { refreshPublicCatalog } = useTurkiyeJobs();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [authBlocked, setAuthBlocked] = useState(false);
  const [published, setPublished] = useState<PublishedProfile | null>(null);
  const [pending, setPending] = useState<PendingProfile | null>(null);

  const [organizationName, setOrganizationName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [phone, setPhone] = useState("");

  const load = useCallback(async () => {
    await Promise.resolve();
    setLoading(true);
    setMsg(null);
    setAuthBlocked(false);
    try {
      const res = await fetch("/api/organization/profile", { credentials: "include" });
      const data = (await res.json()) as {
        ok?: boolean;
        data?: ProfileApiData;
        error?: string;
      };
      if (res.status === 401) {
        setAuthBlocked(true);
        return;
      }
      if (res.status === 403 && typeof data.error === "string") {
        setMsg(data.error);
        setAuthBlocked(true);
        return;
      }
      if (!res.ok || !data.ok || !data.data) {
        throw new Error(data.error || "Could not load your organization profile.");
      }
      const { published: pub, pending: pend } = data.data;
      setPublished(pub);
      setPending(pend);
      const src = pend ?? pub;
      setOrganizationName(src.organizationName);
      setContactEmail(src.contactEmail);
      setAbout(src.about);
      setLocation(src.location);
      setWebsite(src.website);
      setLogoUrl(src.logoUrl);
      setPhone(src.phone);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Could not load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, [load]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/organization/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName,
          contactEmail,
          about,
          location,
          website,
          logoUrl,
          phone,
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        error?: unknown;
      };
      if (!res.ok || !body?.ok) {
        setMsg(formatSaveError(body));
        return;
      }
      setMsg(
        body.message ??
          "Submitted for review. An administrator will apply or reject your updates.",
      );
      await load();
      refreshPublicCatalog();
    } catch {
      setMsg("Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const isSuccessMsg = (m: string | null) =>
    !!m &&
    (m.toLowerCase().includes("submitted") ||
      m.toLowerCase().includes("review") ||
      m.toLowerCase().includes("approval"));

  return (
    <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <h2 className="text-base font-bold text-brand-navy">Organization profile &amp; directory details</h2>
        {!authBlocked && !loading ? (
          <span className="shrink-0 rounded-full bg-brand-gold/15 px-3 py-1 text-xs font-semibold text-brand-navy">
            {pending ? "Update pending review" : "No pending changes"}
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-foreground/70">
        Changes to your public name, contact details, and description are{" "}
        <strong>submitted for administrator approval</strong> before they appear on the{" "}
        <Link className="font-semibold text-brand-gold underline" href="/organizations">
          organization directory
        </Link>{" "}
        and listings. Your current approved details stay visible until an admin approves a new
        submission.
      </p>

      {pending && published ? (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-semibold text-brand-navy">Awaiting administrator review</p>
          <p className="mt-1 text-xs text-amber-900/90">
            Submitted {new Date(pending.submittedAt).toLocaleString()}. You can revise and submit
            again — that replaces the pending request.
          </p>
        </div>
      ) : null}

      {published && !pending ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs text-emerald-900">
          <span className="font-semibold">Live on site:</span> {published.organizationName}
          {published.contactEmail ? ` · ${published.contactEmail}` : ""}
        </div>
      ) : null}

      {authBlocked ? (
        <div className="mt-4 rounded-xl border border-brand-border bg-brand-muted/50 px-4 py-3 text-sm text-foreground/85">
          <p className="font-semibold text-brand-navy">Cannot load profile for editing</p>
          <p className="mt-2">
            Sign in with your organization email and password from registration.
            {isDemoAuthEnabled() ? (
              <>
                {" "}
                With <strong>preview sign-in</strong> enabled, open{" "}
                <Link href="/login" className="font-semibold text-brand-gold underline">
                  Login
                </Link>{" "}
                and choose <strong>Database account (Neon)</strong> before entering your credentials.
              </>
            ) : (
              <>
                {" "}
                Open{" "}
                <Link href="/login" className="font-semibold text-brand-gold underline">
                  Login
                </Link>{" "}
                if you need to switch accounts.
              </>
            )}
          </p>
          {msg ? <p className="mt-2 text-red-800">{msg}</p> : null}
        </div>
      ) : null}

      {authBlocked ? null : (
        <div className="mt-4 rounded-xl border border-brand-border bg-brand-muted/40 p-4 text-sm text-foreground/80">
          <p className="font-semibold text-brand-navy">About text — what to include</p>
          <ul className="mt-2 list-inside list-disc space-y-1.5">
            <li>Mission and main programme areas (e.g. health, education, livelihoods).</li>
            <li>Where you work in Türkiye or regionally, and typical roles you hire for.</li>
            <li>Registration or partnership context if helpful (without sharing sensitive IDs).</li>
            <li>Safeguarding, equal opportunity, or language requirements if relevant.</li>
          </ul>
          <p className="mt-2 text-xs text-foreground/60">
            Plain text only; line breaks are preserved. Up to 12,000 characters.
          </p>
        </div>
      )}

      {authBlocked ? null : loading ? (
        <p className="mt-6 text-sm text-foreground/60">Loading profile…</p>
      ) : (
        <form className="mt-6 space-y-5" onSubmit={onSave}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="org-name" className="block text-sm font-semibold text-brand-navy">
                Organization name (public) <span className="text-red-600">*</span>
              </label>
              <input
                id="org-name"
                name="organizationName"
                type="text"
                maxLength={200}
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="Legal or public name as it should appear in the directory"
              />
              <p className="mt-1 text-xs text-foreground/55">
                Shown on every public listing and in the organizations directory—not your personal name.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="org-contact-email" className="block text-sm font-semibold text-brand-navy">
                Public contact email
              </label>
              <input
                id="org-contact-email"
                name="contactEmail"
                type="email"
                maxLength={254}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="careers@yourorg.org (shown to candidates when relevant)"
              />
              <p className="mt-1 text-xs text-foreground/55">
                This is not your TürkiyeJobs sign-in email; it is the address you want published for
                inquiries.
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="org-about" className="block text-sm font-semibold text-brand-navy">
              About your organization
            </label>
            <textarea
              id="org-about"
              name="about"
              rows={12}
              maxLength={12000}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-navy shadow-inner outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
              placeholder="Mission, programmes, locations, and how you hire…"
            />
            <p className="mt-1 text-xs text-foreground/55 tabular-nums">
              {about.length.toLocaleString()} / 12,000 characters
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="org-location" className="block text-sm font-semibold text-brand-navy">
                Headquarters or primary location
              </label>
              <input
                id="org-location"
                name="location"
                type="text"
                maxLength={200}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="e.g. Ankara, Türkiye · hybrid with field visits"
              />
            </div>
            <div>
              <label htmlFor="org-website" className="block text-sm font-semibold text-brand-navy">
                Official website
              </label>
              <input
                id="org-website"
                name="website"
                type="url"
                inputMode="url"
                maxLength={500}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="https://www.example.org"
              />
              <p className="mt-1 text-xs text-foreground/55">Must start with https:// if provided</p>
            </div>
            <div>
              <label htmlFor="org-logo-url" className="block text-sm font-semibold text-brand-navy">
                Logo image URL (optional)
              </label>
              <input
                id="org-logo-url"
                name="logoUrl"
                type="url"
                inputMode="url"
                maxLength={500}
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="https://www.example.org/logo.png"
              />
              <p className="mt-1 text-xs text-foreground/55">
                Direct link to a PNG or SVG on your website. Used on the homepage organizations strip. Must start with https://.
              </p>
            </div>
            <div>
              <label htmlFor="org-phone" className="block text-sm font-semibold text-brand-navy">
                Main switchboard (optional)
              </label>
              <input
                id="org-phone"
                name="phone"
                type="tel"
                maxLength={40}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-navy outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/45"
                placeholder="+20 …"
              />
            </div>
          </div>

          {msg ? (
            <p
              className={`text-sm ${isSuccessMsg(msg) ? "text-emerald-800" : "text-red-700"}`}
              role={isSuccessMsg(msg) ? "status" : "alert"}
            >
              {msg}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex btn-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              {saving ? "Submitting…" : "Submit for administrator approval"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void load()}
              className="inline-flex rounded-xl border border-brand-border bg-white px-5 py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
            >
              Reload from server
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
