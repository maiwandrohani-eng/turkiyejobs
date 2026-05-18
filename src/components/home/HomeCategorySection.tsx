"use client";

import Link from "next/link";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const CATEGORY_TABS = [
  { labelKey: "Jobs", category: "Jobs" },
  { labelKey: "Consultancies", category: "Consultancies" },
  { labelKey: "Trainings", category: "Trainings" },
  { labelKey: "Volunteering", category: "Volunteer Roles" },
  { labelKey: "Tenders", category: "Tenders" },
  { labelKey: "Grants", category: "Grants" },
] as const;

const EARLY_LAUNCH_THRESHOLD = 10;

type Props = {
  publishedOpportunityCount: number;
};

export function HomeCategorySection({ publishedOpportunityCount }: Props) {
  const showTabs = publishedOpportunityCount >= EARLY_LAUNCH_THRESHOLD;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-10">
      {showTabs ? <CategoryTabs /> : <EarlyAccessCapture />}
    </div>
  );
}

function CategoryTabs() {
  return (
    <ul className="flex flex-wrap gap-2 text-xs font-medium text-brand-navy/80">
      {CATEGORY_TABS.map(({ labelKey, category }) => (
        <li key={category}>
          <Link
            href={`/opportunities?category=${encodeURIComponent(category)}`}
            className="inline-block rounded-full border border-brand-border bg-white px-3 py-1.5 shadow-sm transition hover:border-brand-navy/25 hover:bg-brand-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/40"
          >
            {labelKey}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function EarlyAccessCapture() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setStatus("error");
      setMessage(t("earlyEmailRequired"));
      return;
    }
    setStatus("loading");
    void fetch("/api/early-access", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed }),
    })
      .then(async (res) => {
        const data = (await res.json()) as {
          ok?: boolean;
          alreadyRegistered?: boolean;
          error?: unknown;
        };
        if (!res.ok) {
          setStatus("error");
          setMessage(
            typeof data.error === "string" ? data.error : t("earlyError"),
          );
          return;
        }
        setStatus("success");
        setMessage(data.alreadyRegistered ? t("earlyAlreadyOnList") : t("earlyThankYou"));
        setEmail("");
      })
      .catch(() => {
        setStatus("error");
        setMessage(t("earlyNetworkError"));
      });
  };

  return (
    <div>
      <p className="text-sm font-medium text-brand-navy">{t("earlyLaunchText")}</p>
      <form
        onSubmit={onSubmit}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start"
      >
        <div className="min-w-0 flex-1">
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={t("resourcesNewsletterPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "loading") setMessage(null);
            }}
            disabled={status === "loading"}
            className="w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:opacity-60"
          />
          {message ? (
            <p
              className={`mt-2 text-sm ${
                status === "error" ? "text-red-700" : "text-emerald-800"
              }`}
            >
              {message}
            </p>
          ) : null}
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="shrink-0 btn-primary px-6 py-2.5 text-sm font-semibold text-white "
        >
          {status === "loading" ? t("earlySaving") : t("newsletterButton")}
        </button>
      </form>
    </div>
  );
}
