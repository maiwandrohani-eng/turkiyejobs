"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthT } from "@/lib/i18n/use-auth-translations";

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

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const t = useAuthT();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError(t("errResetMissingToken"));
      return;
    }
    if (password.length < 10) {
      setError(t("errPasswordMin"));
      return;
    }
    if (password !== confirm) {
      setError(t("errPasswordsMismatch"));
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
          : fe ?? t("errResetFailed"),
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
          {t("resetLinkInvalidBefore")}{" "}
          <Link href="/forgot-password" className="font-semibold text-brand-gold underline">
            {t("resetLinkInvalidLink")}
          </Link>
          {t("resetLinkInvalidAfter")}
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
        {t("newPasswordLabel")}
      </label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="new-password"
      />
      <label className="mt-4 block text-xs font-semibold text-brand-navy">
        {t("confirmPassword")}
      </label>
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
        {busy ? t("saving") : t("savePassword")}
      </button>
      <p className="mt-4 text-center text-sm text-foreground/70">
        <Link href="/login" className="font-semibold text-brand-gold underline">
          {t("signIn")}
        </Link>
      </p>
    </form>
  );
}
