"use client";

import { useState } from "react";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";

type ImportSummary = {
  rowsRead: number;
  created: number;
  updated: number;
  skipped: number;
};

export function AdminOrganizationImportPanel({ disabled }: { disabled: boolean }) {
  const { refreshPublicCatalog } = useTurkiyeJobs();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<ImportSummary | null>(null);

  const btn =
    "inline-flex min-h-[2.5rem] items-center justify-center rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 disabled:opacity-50";

  if (disabled) return null;

  const submit = async () => {
    if (!file) {
      setError("Select an Excel file first.");
      return;
    }

    setBusy(true);
    setError(null);
    setSummary(null);

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/organizations/import", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const body = (await res.json()) as {
        ok?: boolean;
        error?: string;
        summary?: ImportSummary;
      };

      if (!res.ok || !body.ok || !body.summary) {
        setError(body.error ?? "Import failed.");
        return;
      }

      setSummary(body.summary);
      refreshPublicCatalog();
    } catch {
      setError("Network error while uploading import file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
      <h2 className="text-base font-bold text-brand-navy">Import organizations from Excel</h2>
      <p className="mt-2 text-sm text-foreground/70">
        Imports rows into the Organization table only, applies duplicate checks, and updates missing
        fields without downgrading verified employers.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full rounded-lg border border-brand-border bg-white px-3 py-2 text-sm"
        />
        <button type="button" className={btn} onClick={() => void submit()} disabled={busy || !file}>
          {busy ? "Importing..." : "Run import"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

      {summary ? (
        <div className="mt-4 rounded-lg border border-brand-border bg-brand-muted/40 p-3 text-sm text-brand-navy">
          <p>Rows read: {summary.rowsRead}</p>
          <p>Created: {summary.created}</p>
          <p>Updated (missing fields only): {summary.updated}</p>
          <p>Skipped (no changes): {summary.skipped}</p>
        </div>
      ) : null}
    </section>
  );
}
