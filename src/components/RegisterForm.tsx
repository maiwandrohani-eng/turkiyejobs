"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import { SAMPLE_ORGANIZATIONS } from "@/lib/demo/catalog";
import { useAuthT } from "@/lib/i18n/use-auth-translations";
import type { PendingOrgRecord, SessionUser, UserRole } from "@/lib/types";

function today() {
  return new Date().toISOString().slice(0, 10);
}

/** API may return `error` as a string or Zod-style field maps (string[][]). */
function registerApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "string" && error.trim()) return error;
  if (!error || typeof error !== "object") {
    return fallback;
  }
  const lines: string[] = [];
  for (const value of Object.values(error as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string" && item.trim()) lines.push(item);
      }
    }
  }
  return lines.length > 0 ? lines.join(" ") : fallback;
}

export function RegisterForm() {
  const router = useRouter();
  const t = useAuthT();
  const { login, registerPendingOrganization, registerUserProfile } =
    useTurkiyeJobs();
  const demo = isDemoAuthEnabled();
  const [role, setRole] = useState<UserRole>("individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orgName, setOrgName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.includes("@")) {
      setError(
        role === "organization"
          ? t("errRegisterOrgContact")
          : t("errRegisterNameEmail"),
      );
      return;
    }
    if (role === "organization" && !orgName.trim()) {
      setError(t("errRegisterOrgName"));
      return;
    }

    if (demo) {
      const trimmedOrg = orgName.trim();
      const matched =
        role === "organization"
          ? SAMPLE_ORGANIZATIONS.find(
              (o) => o.name.toLowerCase() === trimmedOrg.toLowerCase(),
            )
          : undefined;
      const session: SessionUser = {
        role,
        email,
        displayName: name.trim(),
        organizationName:
          role === "organization" ? trimmedOrg : undefined,
        organizationId:
          matched?.id ?? (role === "organization" ? "org-demo" : undefined),
      };
      registerUserProfile({
        email,
        displayName: name.trim(),
        role,
        registeredAt: today(),
      });
      if (role === "organization") {
        const needsApproval = !matched?.verified;
        if (needsApproval) {
          const pending: PendingOrgRecord = {
            id: `porg-${Date.now()}`,
            name: trimmedOrg,
            email,
            submittedAt: today(),
          };
          registerPendingOrganization(pending);
        }
      }
      login(session);
      if (role === "organization") router.push("/dashboard/organization");
      else router.push("/dashboard/user");
      return;
    }

    if (password.length < 10) {
      setError(t("errPasswordMin"));
      return;
    }

    setBusy(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password,
        name: name.trim(),
        role: role === "organization" ? "organization" : "individual",
        organizationName:
          role === "organization" ? orgName.trim() : undefined,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      error?: unknown;
    };
    if (!res.ok) {
      setBusy(false);
      if (res.status === 409) {
        setError(t("errEmailTaken"));
      } else {
        setError(registerApiErrorMessage(data.error, t("errRegisterFailed")));
      }
      return;
    }

    const sign = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });
    setBusy(false);
    if (!sign || sign.error || sign.ok === false) {
      setError(t("errCreatedSignInFailed"));
      router.push("/login");
      return;
    }

    const sess = await getSession();
    if (!sess?.user) {
      setError(t("errCreatedPleaseLogin"));
      router.push("/login");
      return;
    }

    const dest =
      role === "organization" ? "/dashboard/organization" : "/dashboard/user";
    window.location.assign(dest);
  };

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8"
    >
      <fieldset>
        <legend className="text-xs font-semibold text-brand-navy">
          {t("registeringAs")}
        </legend>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-brand-muted/30 px-4 py-3 has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold-muted">
            <input
              type="radio"
              name="role"
              checked={role === "individual"}
              onChange={() => setRole("individual")}
              className="text-brand-gold accent-brand-gold"
            />
            <span className="text-sm font-medium text-brand-navy">
              {t("individualApplicant")}
            </span>
          </label>
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-brand-border bg-brand-muted/30 px-4 py-3 has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold-muted">
            <input
              type="radio"
              name="role"
              checked={role === "organization"}
              onChange={() => setRole("organization")}
              className="text-brand-gold accent-brand-gold"
            />
            <span className="text-sm font-medium text-brand-navy">
              {t("organizationEmployer")}
            </span>
          </label>
        </div>
      </fieldset>

      <label className="mt-6 block text-xs font-semibold text-brand-navy">
        {role === "organization" ? t("contactPersonName") : t("fullName")}
      </label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        placeholder={t("namePlaceholder")}
      />

      {role === "organization" ? (
        <>
          <label className="mt-4 block text-xs font-semibold text-brand-navy">
            {t("organizationName")}
          </label>
          <input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            placeholder={t("orgPlaceholder")}
          />
          <p className="mt-1.5 text-xs text-foreground/60">{t("orgNameHint")}</p>
        </>
      ) : null}

      <label className="mt-4 block text-xs font-semibold text-brand-navy">
        {t("workEmail")}
      </label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        placeholder={t("emailPlaceholder")}
      />

      {!demo ? (
        <>
          <label className="mt-4 block text-xs font-semibold text-brand-navy">
            {t("passwordMin")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            autoComplete="new-password"
          />
        </>
      ) : null}

      {error ? (
        <p className="mt-3 text-sm font-medium text-red-700">{error}</p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="btn-primary mt-6 w-full py-3 text-sm"
      >
        {busy ? t("creatingAccount") : t("createAccount")}
      </button>
      <p className="mt-4 text-center text-sm text-foreground/70">
        {t("alreadyRegistered")}{" "}
        <Link
          href="/login"
          className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
        >
          {t("logIn")}
        </Link>
      </p>
    </form>
  );
}
