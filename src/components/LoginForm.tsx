"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import { useAuthT } from "@/lib/i18n/use-auth-translations";
import type { SessionUser, UserRole } from "@/lib/types";

function inferRole(email: string): UserRole {
  const e = email.toLowerCase();
  if (e.includes("admin")) return "admin";
  if (e.includes("org") || e.includes("ngo")) return "organization";
  return "individual";
}

type LoginFormProps = {
  resetOk?: boolean;
  callbackUrl?: string;
};

export function LoginForm({
  resetOk = false,
  callbackUrl: callbackUrlProp = "/dashboard/user",
}: LoginFormProps) {
  const router = useRouter();
  const t = useAuthT();
  const { login, exitPreviewSession } = useTurkiyeJobs();
  const previewAuth = isDemoAuthEnabled();
  const [signInMode, setSignInMode] = useState<"preview" | "database">(
    previewAuth ? "preview" : "database",
  );
  const [email, setEmail] = useState(previewAuth ? "preview.applicant@turkiyejobs.local" : "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) {
      setError(t("errInvalidEmail"));
      return;
    }

    if (previewAuth && signInMode === "preview") {
      const role = inferRole(email);
      const local = email.split("@")[0] ?? "User";
      const session: SessionUser = {
        role,
        email,
        displayName: local.replace(/[._-]/g, " "),
        organizationName:
          role === "organization" ? "Care Türkiye Foundation" : undefined,
        organizationId: role === "organization" ? "org-2" : undefined,
      };
      login(session);
      if (role === "admin") router.push("/dashboard/admin");
      else if (role === "organization") router.push("/dashboard/organization");
      else router.push("/dashboard/user");
      return;
    }

    if (!password) {
      setError(t("errEnterPassword"));
      return;
    }

    if (previewAuth) {
      exitPreviewSession();
    }

    setBusy(true);
    const callbackUrl = callbackUrlProp;

    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (!res || res.error || res.ok === false) {
      setBusy(false);
      setError(
        res?.error === "CredentialsSignin"
          ? t("errInvalidCredentials")
          : (res?.error as string) || t("errSignInFailed"),
      );
      return;
    }

    const session = await getSession();

    if (!session?.user) {
      setBusy(false);
      setError(t("errSessionNotReady"));
      return;
    }

    const role = session.user.role;
    let destination = callbackUrl;
    if (role === "ADMIN") {
      destination = "/dashboard/admin";
    } else if (role === "ORG_USER") {
      destination = "/dashboard/organization";
    } else if (role === "INDIVIDUAL") {
      if (!callbackUrl.startsWith("/dashboard/user")) {
        destination = "/dashboard/user";
      }
    }

    window.location.assign(destination);
  };

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8"
    >
      {resetOk && (!previewAuth || signInMode === "database") ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {t("resetPasswordUpdated")}
        </p>
      ) : null}
      {previewAuth ? (
        <div className="rounded-xl border border-brand-border bg-brand-muted/50 p-3 text-sm text-foreground/80">
          <p className="font-semibold text-brand-navy">{t("previewModeHeading")}</p>
          <div className="mt-3 flex flex-col gap-2">
            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 hover:bg-white/80 has-[:checked]:border-brand-gold/50 has-[:checked]:bg-white">
              <input
                type="radio"
                name="signInMode"
                className="mt-1"
                checked={signInMode === "preview"}
                onChange={() => setSignInMode("preview")}
              />
              <span>
                <span className="font-medium text-brand-navy">{t("previewOption")}</span>
                <span className="mt-0.5 block text-xs text-foreground/65">
                  {t("previewOptionDesc")}
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2 rounded-lg border border-transparent px-2 py-1.5 hover:bg-white/80 has-[:checked]:border-brand-gold/50 has-[:checked]:bg-white">
              <input
                type="radio"
                name="signInMode"
                className="mt-1"
                checked={signInMode === "database"}
                onChange={() => setSignInMode("database")}
              />
              <span>
                <span className="font-medium text-brand-navy">{t("databaseOption")}</span>
                <span className="mt-0.5 block text-xs text-foreground/65">
                  {t("databaseOptionDesc")}
                </span>
              </span>
            </label>
          </div>
        </div>
      ) : (
        <p className="text-sm text-foreground/70">{t("signInIntro")}</p>
      )}
      <label className="mt-6 block text-xs font-semibold text-brand-navy">{t("email")}</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
        autoComplete="email"
      />
      {signInMode === "database" || !previewAuth ? (
        <>
          <label className="mt-4 block text-xs font-semibold text-brand-navy">
            {t("password")}
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            autoComplete="current-password"
            placeholder={previewAuth ? t("passwordPlaceholder") : ""}
          />
        </>
      ) : null}
      {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
      {signInMode === "database" || !previewAuth ? (
        <p className="mt-2 text-right text-sm">
          <Link
            href="/forgot-password"
            className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
          >
            {t("forgotPassword")}
          </Link>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full btn-primary py-3 text-sm font-semibold text-white "
      >
        {busy ? t("signingIn") : t("signIn")}
      </button>
      <p className="mt-4 text-center text-sm text-foreground/70">
        {t("noAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
        >
          {t("register")}
        </Link>
      </p>
    </form>
  );
}
