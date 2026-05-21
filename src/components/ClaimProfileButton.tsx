"use client";

import { useState } from "react";

type Props = {
  organizationId: string;
  organizationName?: string;
  returnPath?: string;
  className?: string;
};

export function ClaimProfileButton({ organizationId, organizationName, className }: Props) {
  const [busy, setBusy] = useState(false);

  const onClaim = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch("/api/organizations/claim", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });

      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };

      if (res.status === 401) {
        alert("Please sign in first, then click Claim this profile again.");
        return;
      }

      if (!res.ok || !body.ok) {
        alert(body.error ?? "Could not submit claim request.");
        return;
      }

      alert(body.message ?? `Claim request submitted for ${organizationName ?? "this organization"}.`);
    } catch {
      alert("Network error while submitting claim request.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void onClaim()}
      disabled={busy}
      className={
        className ??
        "inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 disabled:opacity-60"
      }
    >
      {busy ? "Submitting..." : "Claim this profile"}
    </button>
  );
}
