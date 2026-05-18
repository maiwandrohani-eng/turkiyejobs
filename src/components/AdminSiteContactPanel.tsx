"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { ContactPublicData } from "@/lib/site-contact";
import type { SocialLink } from "@/lib/site-contact-defaults";

type Props = {
  /** Hide when browser-only preview auth is on (no Neon writes). */
  disabled: boolean;
};

export function AdminSiteContactPanel({ disabled }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [officeTitle, setOfficeTitle] = useState("");
  const [body, setBody] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [social, setSocial] = useState<SocialLink[]>([]);

  const load = useCallback(async () => {
    if (disabled) {
      setLoading(false);
      return;
    }
    await Promise.resolve();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/admin/site-settings/contact", { credentials: "include" });
      const j = (await res.json()) as { ok?: boolean; data?: ContactPublicData; error?: string };
      if (!res.ok || !j.ok || !j.data) {
        setErr(typeof j.error === "string" ? j.error : "Could not load contact settings.");
        return;
      }
      setOfficeTitle(j.data.officeTitle);
      setBody(j.data.body);
      setMapEmbedUrl(j.data.mapEmbedUrl);
      setSocial(j.data.social.length ? j.data.social : []);
    } catch {
      setErr("Could not load contact settings.");
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

  const updateSocial = (i: number, patch: Partial<SocialLink>) => {
    setSocial((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  };

  const addSocial = () => {
    setSocial((prev) => [
      ...prev,
      { href: "https://", label: "New link", abbr: "•" },
    ]);
  };

  const removeSocial = (i: number) => {
    setSocial((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    setSaving(true);
    setMsg(null);
    setErr(null);
    void fetch("/api/admin/site-settings/contact", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        officeTitle,
        body,
        mapEmbedUrl: mapEmbedUrl.trim(),
        social: social.filter((s) => s.href.trim().startsWith("https://") && s.label.trim()),
      }),
    })
      .then(async (res) => {
        const j = (await res.json()) as {
          ok?: boolean;
          data?: ContactPublicData;
          error?: unknown;
        };
        if (!res.ok || !j.ok) {
          const emsg =
            typeof j.error === "string"
              ? j.error
              : j.error && typeof j.error === "object"
                ? JSON.stringify(j.error)
                : "Save failed.";
          setErr(emsg);
          return;
        }
        if (j.data) {
          setOfficeTitle(j.data.officeTitle);
          setBody(j.data.body);
          setMapEmbedUrl(j.data.mapEmbedUrl);
          setSocial(j.data.social);
        }
        setMsg("Saved. Public contact page and footer will show these values after refresh.");
      })
      .catch(() => setErr("Network error while saving."))
      .finally(() => setSaving(false));
  };

  if (disabled) {
    return (
      <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">Public contact card</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Contact and social links are saved in the database in production. Turn off preview
          auth and use an admin account to edit them here.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-brand-navy">Public contact card</h2>
        <p className="mt-3 text-sm text-foreground/60">Loading…</p>
      </section>
    );
  }

  return (
    <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">Public contact card</h2>
      <p className="mt-2 text-sm text-foreground/70">
        Updates the sidebar on the{" "}
        <Link href="/contact" className="font-semibold text-brand-gold underline">
          Contact
        </Link>{" "}
        page and the social icons in the site footer.
      </p>

      <form onSubmit={(e) => void onSave(e)} className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-semibold text-brand-navy" htmlFor="officeTitle">
            Section title
          </label>
          <input
            id="officeTitle"
            value={officeTitle}
            onChange={(e) => setOfficeTitle(e.target.value)}
            className="mt-1 w-full max-w-md rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy" htmlFor="body">
            Address & details (use line breaks)
          </label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="mt-1 w-full max-w-2xl rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-brand-navy" htmlFor="mapEmbedUrl">
            Map embed URL (optional, https only)
          </label>
          <input
            id="mapEmbedUrl"
            type="url"
            value={mapEmbedUrl}
            onChange={(e) => setMapEmbedUrl(e.target.value)}
            placeholder="https://www.google.com/maps/embed?pb=…"
            className="mt-1 w-full max-w-2xl rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
          />
          <p className="mt-1 text-xs text-foreground/55">
            Paste a Google Maps “Embed a map” HTTPS URL. Leave empty to hide the map.
          </p>
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-brand-navy">Social links</span>
            <button
              type="button"
              onClick={addSocial}
              className="text-xs font-semibold text-brand-gold underline"
            >
              Add row
            </button>
          </div>
          <ul className="mt-2 space-y-2">
            {social.map((s, i) => (
              <li
                key={i}
                className="flex flex-wrap items-end gap-2 rounded-lg border border-brand-border bg-brand-muted/30 p-3"
              >
                <div className="min-w-[140px] flex-1">
                  <label className="text-[10px] font-semibold uppercase text-foreground/55">
                    Label
                  </label>
                  <input
                    value={s.label}
                    onChange={(e) => updateSocial(i, { label: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-brand-border bg-white px-2 py-1.5 text-xs"
                  />
                </div>
                <div className="min-w-[100px]">
                  <label className="text-[10px] font-semibold uppercase text-foreground/55">
                    Abbrev
                  </label>
                  <input
                    value={s.abbr}
                    onChange={(e) => updateSocial(i, { abbr: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-brand-border bg-white px-2 py-1.5 text-xs"
                  />
                </div>
                <div className="min-w-[200px] flex-[2]">
                  <label className="text-[10px] font-semibold uppercase text-foreground/55">
                    URL (https)
                  </label>
                  <input
                    value={s.href}
                    onChange={(e) => updateSocial(i, { href: e.target.value })}
                    className="mt-0.5 w-full rounded-lg border border-brand-border bg-white px-2 py-1.5 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocial(i)}
                  className="rounded border border-brand-border px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        {err ? <p className="text-sm font-medium text-red-700">{err}</p> : null}
        {msg ? <p className="text-sm font-medium text-emerald-800">{msg}</p> : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary px-5 py-2.5 text-sm font-semibold text-white "
          >
            {saving ? "Saving…" : "Save public contact"}
          </button>
          <button
            type="button"
            onClick={() => load()}
            className="rounded-xl border border-brand-border px-5 py-2.5 text-sm font-medium text-brand-navy hover:bg-brand-muted"
          >
            Reload
          </button>
        </div>
      </form>
    </section>
  );
}
