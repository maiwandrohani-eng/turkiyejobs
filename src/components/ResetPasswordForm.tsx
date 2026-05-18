"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

function fieldErrorsMessage(error: unknown): string | null {
  if (!error || typeof error !== "object") return null;
  const lines: string[] = [];
  for (const value of Object.values(error as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && item.trim()) lines.push(item);
      }
    }
  }
  return lines.length ? lines.join(" ") : null;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Missing reset token. Open the link from your email again.");
      return;
    }
    if (password.length < 10) {
      setError("Password must be at least 10 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: unknown };
    setBusy(false);
    if (!res.ok) {
      const fe = fieldErrorsMessage(data.error);
      setError(
        typeof data.error === "string"
          ? data.error
          : fe ?? "Reset failed. Request a new link from the forgot-password page.",
      );
      return;
    }
    router.push("/login?reset=1");
    router.refresh();
  };

  if (!token) {
    return (
      <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm text-red-700">
          This page needs a valid reset link. Check your email or{" "}
          <Link href="/forgot-password" className="font-semibold text-brand-gold underline">
            request a new reset
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8"
    >
      <label className="block text-xs font-semibold text-brand-navy">
        New password (min 10 characters)
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="new-password"
      />
      <label className="mt-4 block text-xs font-semibold text-brand-navy">Confirm password</label>
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="new-password"
      />
      {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full btn-primary py-3 text-sm font-semibold text-white "
      >
        {busy ? "Saving…" : "Save new password"}
      </button>
      <p className="mt-4 text-center text-sm text-foreground/70">
        <Link href="/login" className="font-semibold text-brand-gold underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
