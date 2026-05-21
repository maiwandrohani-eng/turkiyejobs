"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";

type Props = {
  organizationId: string;
  returnPath: string;
};

export function ClaimProfileButton({ organizationId, returnPath }: Props) {
  const { status } = useSession();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (status !== "authenticated") {
    return (
      <Link
        href={`/login?next=${encodeURIComponent(returnPath)}`}
        className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
      >
        Sign in to claim this profile
      </Link>
    );
  }

  const submit = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/organizations/claim", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });
      const body = (await res.json()) as { ok?: boolean; message?: string; error?: string };
      if (!res.ok || !body.ok) {
        setError(body.error ?? "Could not submit claim request.");
        return;
      }
      setMessage(body.message ?? "Claim request submitted.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => void submit()}
        disabled={busy}
        className="inline-flex min-h-[2.75rem] items-center justify-center rounded-lg border border-brand-border px-4 py-2 text-sm font-semibold text-brand-navy hover:bg-brand-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50 disabled:opacity-50"
      >
        {busy ? "Submitting claim..." : "Claim this profile"}
      </button>
      {message ? <p className="text-xs text-emerald-800">{message}</p> : null}
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
