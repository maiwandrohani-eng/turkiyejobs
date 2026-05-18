"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Mail, ExternalLink } from "lucide-react";
import type { Opportunity } from "@/lib/types";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { cn } from "@/lib/cn";
import { isApplicationOpenForOpportunity, suppressedCatalogIdsForBrowse } from "@/lib/opportunity-visibility";
import {
  applicationMethodLabel,
  getExternalApplicationHref,
  getOpportunityApplicationMethod,
} from "@/lib/opportunity-apply";

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function mailtoApplyHref(opportunity: Opportunity, applicationEmail: string) {
  const subject = encodeURIComponent(`Application: ${opportunity.title}`);
  const body = encodeURIComponent(
    `Dear ${opportunity.organizationName},\n\nI am writing to apply for: ${opportunity.title}\n\n`,
  );
  return `mailto:${applicationEmail.trim()}?subject=${subject}&body=${body}`;
}

export function OpportunityDetailActions({ opportunity }: { opportunity: Opportunity }) {
  const {
    toggleSave,
    isSaved,
    hydrated,
    applyToOpportunity,
    recordExternalApplyIntent,
    session,
    suppressedCatalogIds,
    applicantProfile,
  } = useTurkiyeJobs();
  const [cover, setCover] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState(
    applicantProfile?.portfolioUrl ?? "",
  );
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );
  const saved = hydrated && isSaved(opportunity.id);
  const listingsOpen =
    isApplicationOpenForOpportunity(opportunity) &&
    !suppressedCatalogIdsForBrowse(suppressedCatalogIds).includes(opportunity.id);

  const method = getOpportunityApplicationMethod(opportunity);
  const extHref = getExternalApplicationHref(opportunity);
  const appEmail = opportunity.applicationEmail?.trim();

  const onInternalApply = async () => {
    setMsg(null);
    const fullName =
      applicantProfile?.fullName?.trim() ||
      session?.displayName?.trim() ||
      "";
    if (!fullName) {
      setMsg({
        type: "err",
        text: "Please add your full name in your applicant profile before applying.",
      });
      return;
    }
    if (!applicantProfile?.phone?.trim()) {
      setMsg({
        type: "err",
        text: "Please add your phone number in your applicant profile before applying.",
      });
      return;
    }
    const cv = applicantProfile.cvUrl?.trim() ?? "";
    if (!cv.startsWith("http")) {
      setMsg({
        type: "err",
        text: "Please add a valid CV or resume URL (https) in your applicant profile before applying.",
      });
      return;
    }
    const res = await applyToOpportunity(opportunity.id, {
      fullName,
      phone: applicantProfile?.phone,
      portfolioUrl: portfolioUrl.trim() || undefined,
      coverLetter: cover.trim() || undefined,
    });
    setMsg({ type: res.ok ? "ok" : "err", text: res.message });
    if (res.ok) setCover("");
  };

  const onRecordExternal = async (channel: "email" | "external_link") => {
    setMsg(null);
    const res = await recordExternalApplyIntent(opportunity.id, channel);
    setMsg({ type: res.ok ? "ok" : "err", text: res.message });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => toggleSave(opportunity.id)}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
            saved
              ? "border-brand-gold bg-brand-gold/15 text-brand-navy"
              : "border-brand-border bg-white text-brand-navy hover:bg-brand-muted",
          )}
        >
          <Bookmark className={cn("h-4 w-4", saved && "fill-brand-gold")} />
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-brand-navy">Apply</h2>
        <p className="mt-1 text-xs text-foreground/60">
          Method: <strong>{applicationMethodLabel(method)}</strong>
        </p>

        {!listingsOpen ? (
          <p className="mt-2 text-sm text-foreground/75">
            Applications open once this listing is published by TürkiyeJobs.org
            administrators.
          </p>
        ) : !session || session.role !== "individual" ? (
          <p className="mt-2 text-sm text-foreground/75">
            Sign in as an{" "}
            <Link
              href="/register"
              className="font-semibold text-brand-gold underline decoration-brand-gold/60 underline-offset-2"
            >
              individual applicant
            </Link>{" "}
            to apply or to track an external application.
          </p>
        ) : method === "internal" ? (
          <>
            <p className="mt-2 text-sm text-foreground/75">
              Submit your application on TürkiyeJobs.org. Your profile (CV, LinkedIn, etc.)
              is attached automatically when saved.
            </p>
            <label className="mt-4 block text-xs font-semibold text-brand-navy">
              Portfolio URL (optional, overrides profile for this application)
            </label>
            <input
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/50 p-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/45"
              placeholder="https://…"
            />
            <label className="mt-4 block text-xs font-semibold text-brand-navy">
              Cover letter (optional)
            </label>
            <textarea
              value={cover}
              onChange={(e) => setCover(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/50 p-3 text-sm outline-none focus:ring-2 focus:ring-brand-gold/45"
              placeholder="Briefly explain your fit and availability…"
            />
            <button
              type="button"
              onClick={() => void onInternalApply()}
              className="mt-4 w-full rounded-xl bg-brand-gold py-3 text-sm font-semibold text-brand-navy shadow-sm hover:bg-brand-gold-soft sm:w-auto sm:px-8"
            >
              Submit application on TürkiyeJobs.org
            </button>
          </>
        ) : method === "email" && appEmail ? (
          <>
            <p className="mt-2 text-sm text-foreground/75">
              This employer accepts applications by email. Use your email client, then
              optionally record that you applied externally so it appears in your dashboard.
            </p>
            <a
              href={mailtoApplyHref(opportunity, appEmail)}
              className="mt-4 inline-flex items-center justify-center gap-2 btn-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-hover"
            >
              <Mail className="h-4 w-4" />
              Apply via email
            </a>
            <button
              type="button"
              onClick={() => void onRecordExternal("email")}
              className="mt-3 block w-full rounded-xl border border-brand-border py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted sm:w-auto sm:px-6"
            >
              I applied externally — track in my dashboard
            </button>
          </>
        ) : method === "external" && extHref ? (
          <>
            <p className="mt-2 text-sm text-foreground/75">
              This employer uses an external site or form. Follow the link to apply, then
              optionally record that you applied externally so it appears in your dashboard.
            </p>
            <a
              href={extHref}
              className="mt-4 inline-flex items-center justify-center gap-2 btn-primary px-6 py-3 text-sm font-semibold text-white hover:bg-brand-red-hover"
            >
              <ExternalLink className="h-4 w-4" />
              Open external application
            </a>
            <button
              type="button"
              onClick={() => void onRecordExternal("external_link")}
              className="mt-3 block w-full rounded-xl border border-brand-border py-2.5 text-sm font-semibold text-brand-navy hover:bg-brand-muted sm:w-auto sm:px-6"
            >
              I applied externally — track in my dashboard
            </button>
          </>
        ) : (
          <p className="mt-2 text-sm text-red-800">
            This listing’s apply-by-email or external link is not configured correctly.
            Please contact the organization.
          </p>
        )}
        {msg ? (
          <p
            className={cn(
              "mt-3 text-sm font-medium",
              msg.type === "ok" ? "text-brand-navy" : "text-red-700",
            )}
          >
            {msg.text}
          </p>
        ) : null}
      </div>

      <dl className="grid gap-3 rounded-2xl border border-brand-border bg-brand-muted/40 p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-brand-navy">Organization</dt>
          <dd className="text-foreground/80">{opportunity.organizationName}</dd>
        </div>
        <div>
          <dt className="font-semibold text-brand-navy">Deadline</dt>
          <dd className="text-foreground/80">{formatDate(opportunity.deadline)}</dd>
        </div>
        <div>
          <dt className="font-semibold text-brand-navy">Location</dt>
          <dd className="text-foreground/80">{opportunity.location}</dd>
        </div>
        <div>
          <dt className="font-semibold text-brand-navy">Type</dt>
          <dd className="text-foreground/80">{opportunity.type}</dd>
        </div>
        <div>
          <dt className="font-semibold text-brand-navy">Arrangement</dt>
          <dd className="text-foreground/80">
            {opportunity.workArrangement} · {opportunity.compensation}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-brand-navy">Apply method</dt>
          <dd className="text-foreground/80">{applicationMethodLabel(method)}</dd>
        </div>
      </dl>
    </div>
  );
}
