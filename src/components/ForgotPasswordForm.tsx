"use client";

import Link from "next/link";
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

export function ForgotPasswordForm() {
  const t = useAuthT();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email.includes("@")) {
      setError(t("errForgotEmail"));
      return;
    }
    setBusy(true);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: unknown;
      message?: string;
      emailConfigured?: boolean;
    };
    setBusy(false);
    if (!res.ok) {
      const fe = fieldErrorsMessage(data.error);
      setError(
        typeof data.error === "string"
          ? data.error
          : fe ?? t("errForgotGeneric"),
      );
      return;
    }
    setInfo(
      data.emailConfigured === false
        ? `${data.message ?? t("forgotSuccess")}`
        : (data.message ?? t("forgotSuccess")),
    );
  };

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8"
    >
      <label className="block text-xs font-semibold text-brand-navy">{t("workEmail")}</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="email"
      />
      {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
      {info ? <p className="mt-3 text-sm font-medium text-brand-navy">{info}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full btn-primary py-3 text-sm font-semibold text-white "
      >
        {busy ? t("sending") : t("sendResetLink")}
      </button>
      <p className="mt-4 text-center text-sm text-foreground/70">
        <Link
          href="/login"
          className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
        >
          {t("backToSignIn")}
        </Link>
      </p>
    </form>
  );
}
