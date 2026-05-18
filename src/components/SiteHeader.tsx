"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/context/LanguageContext";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";

const NAV_KEYS = [
  { href: "/opportunities", key: "navOpportunities" },
  { href: "/organizations", key: "navOrganizations" },
  { href: "/resources", key: "navResources" },
  { href: "/how-it-works", key: "navHowItWorks" },
  { href: "/about", key: "navAbout" },
  { href: "/contact", key: "navContact" },
] as const;

function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLanguage();
  return (
    <div
      className={`flex rounded-lg border border-brand-border bg-white p-0.5 text-xs font-semibold ${className ?? ""}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-md px-2.5 py-1.5 transition ${
          locale === "en"
            ? "bg-brand-red text-white"
            : "text-brand-teal/70 hover:bg-brand-gold-muted"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLocale("tr")}
        className={`rounded-md px-2.5 py-1.5 transition ${
          locale === "tr"
            ? "bg-brand-red text-white"
            : "text-brand-teal/70 hover:bg-brand-gold-muted"
        }`}
      >
        TR
      </button>
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, hydrated } = useTurkiyeJobs();
  const { t } = useLanguage();

  const dashboardHref =
    session?.role === "organization"
      ? "/dashboard/organization"
      : session?.role === "admin"
        ? "/dashboard/admin"
        : session?.role === "individual"
          ? "/dashboard/user"
          : "/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-brand-red/20 bg-white/95 shadow-[0_1px_0_0_rgba(19,78,94,0.08)] backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3.5 md:py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <LogoMark />
          <span className="sr-only">TürkiyeJobs.org home</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_KEYS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand-teal/90 transition-colors hover:bg-brand-gold-muted hover:text-brand-teal"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageToggle />
          {hydrated && session ? (
            <Link
              href={dashboardHref}
              className="btn-outline px-3 py-2 text-sm shadow-sm"
            >
              {t("navDashboard")}
            </Link>
          ) : null}
          {hydrated && !session ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-brand-teal/80 hover:bg-brand-gold-muted hover:text-brand-teal"
              >
                {t("navLogin")}
              </Link>
              <Link
                href="/register"
                className="btn-primary px-4 py-2 text-sm"
              >
                {t("navRegister")}
              </Link>
            </>
          ) : null}
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg border border-brand-border p-2 text-brand-navy md:hidden"
          aria-expanded={open}
          aria-label={open ? t("navCloseMenu") : t("navOpenMenu")}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "border-t border-brand-border bg-white md:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
          <div className="px-3 py-2">
            <LanguageToggle className="w-fit" />
          </div>
          {NAV_KEYS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-brand-navy hover:bg-brand-gold-muted"
            >
              {t(item.key)}
            </Link>
          ))}
          {hydrated && session ? (
            <Link
              href={dashboardHref}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-brand-gold hover:bg-brand-gold-muted"
            >
              {t("navDashboard")}
            </Link>
          ) : null}
          {hydrated && !session ? (
            <div className="mt-2 flex flex-col gap-2 border-t border-brand-border pt-3">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-brand-border py-2.5 text-center text-sm font-medium text-brand-navy"
              >
                {t("navLogin")}
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="btn-primary py-2.5 text-center text-sm font-semibold text-white"
              >
                {t("navRegister")}
              </Link>
            </div>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
