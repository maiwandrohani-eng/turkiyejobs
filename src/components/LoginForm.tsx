"use client";

import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { isDemoAuthEnabled } from "@/lib/demo-auth";
import type { SessionUser, UserRole } from "@/lib/types";

function inferRole(email: string): UserRole {
  const e = email.toLowerCase();
  if (e.includes("admin")) return "admin";
  if (e.includes("org") || e.includes("ngo")) return "organization";
  return "individual";
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetOk = searchParams.get("reset") === "1";
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
      setError("Please enter a valid email address.");
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
      setError("Please enter your password.");
      return;
    }

    if (previewAuth) {
      exitPreviewSession();
    }

    setBusy(true);
    const rawCallback = searchParams.get("callbackUrl") ?? "/dashboard/user";
    const callbackUrl =
      rawCallback.startsWith("/") && !rawCallback.startsWith("//")
        ? rawCallback
        : "/dashboard/user";

    const res = await signIn("credentials", {
      email: email.trim(),
      password,
      redirect: false,
    });

    if (!res || res.error || res.ok === false) {
      setBusy(false);
      setError(
        res?.error === "CredentialsSignin"
          ? "Invalid email or password."
          : (res?.error as string) || "Sign-in failed. Please try again.",
      );
      return;
    }

    const session = await getSession();

    if (!session?.user) {
      setBusy(false);
      setError(
        "Sign-in succeeded but the session was not ready. Try again, or disable strict tracking protection for this site.",
      );
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

    /* Full navigation so the session cookie is visible to middleware (client router alone can loop back to /login). */
    window.location.assign(destination);
  };

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8"
    >
      {resetOk && (!previewAuth || signInMode === "database") ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          Your password was updated. Sign in with your new password.
        </p>
      ) : null}
      {previewAuth ? (
        <div className="rounded-xl border border-brand-border bg-brand-muted/50 p-3 text-sm text-foreground/80">
          <p className="font-semibold text-brand-navy">How do you want to sign in?</p>
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
                <span className="font-medium text-brand-navy">Preview (no password)</span>
                <span className="mt-0.5 block text-xs text-foreground/65">
                  Local demo only — email containing <strong>admin</strong>, <strong>org</strong>, or
                  anything else for an applicant. Does not load your real employer profile from the
                  database.
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
                <span className="font-medium text-brand-navy">Database account (Neon)</span>
                <span className="mt-0.5 block text-xs text-foreground/65">
                  Use the email and password you registered with. Required to edit your applicant
                  profile in the database, change your password, or update your organization’s public
                  directory page.
                </span>
              </span>
            </label>
          </div>
        </div>
      ) : (
        <p className="text-sm text-foreground/70">
          Sign in with the email and password you used at registration.
        </p>
      )}
      <label className="mt-6 block text-xs font-semibold text-brand-navy">
        Email
      </label>
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
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40"
            autoComplete="current-password"
            placeholder={previewAuth ? "Your TürkiyeJobs.org password" : ""}
          />
        </>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm font-medium text-red-700">{error}</p>
      ) : null}
      {signInMode === "database" || !previewAuth ? (
        <p className="mt-2 text-right text-sm">
          <Link
            href="/forgot-password"
            className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
          >
            Forgot password?
          </Link>
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full btn-primary py-3 text-sm font-semibold text-white "
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <p className="mt-4 text-center text-sm text-foreground/70">
        No account?{" "}
        <Link
          href="/register"
          className="font-semibold text-brand-gold underline decoration-brand-gold/50 underline-offset-2"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
