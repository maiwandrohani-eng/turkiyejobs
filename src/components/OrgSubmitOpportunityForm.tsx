"use client";

import { useMemo, useState } from "react";
import type {
  OpportunityCategory,
  OrgOpportunitySubmissionInput,
  WorkArrangement,
  Compensation,
} from "@/lib/types";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import {
  getOrgSubmitFormProfile,
  listingTypesForCategory,
} from "@/lib/org-submit-form-profile";

const CATEGORIES: OpportunityCategory[] = [
  "Jobs",
  "Consultancies",
  "Trainings",
  "Volunteer Roles",
  "Tenders",
  "Grants",
];

const inputClass =
  "mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40";
const selectClass =
  "mt-1 w-full rounded-xl border border-brand-border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40";
const labelClass = "mt-4 block text-xs font-semibold text-brand-navy";

function isValidApplicationEmail(s: string) {
  const t = s.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
}

function emptyForm(): OrgOpportunitySubmissionInput {
  return {
    title: "",
    category: "Jobs",
    type: "",
    location: "",
    deadline: "",
    workArrangement: "On-site",
    compensation: "Paid",
    shortDescription: "",
    description: "",
    requirements: "",
    howToApply: "",
    applicationMethod: "internal",
    applicationEmail: "",
    externalApplicationUrl: "",
    contractType: "",
    startDate: "",
    duration: "",
    salaryOrCompensationDetail: "",
    budgetOrContractValue: "",
    experienceLevel: "",
    educationRequirements: "",
    languagesRequired: "",
    positionsAvailable: "",
    sectorThematicArea: "",
    tenderOrGrantReference: "",
    eligibilitySummary: "",
    contactPersonName: "",
    contactEmail: "",
    contactPhone: "",
    attachmentsUrl: "",
    additionalInformation: "",
  };
}

export function OrgSubmitOpportunityForm() {
  const { submitOrgOpportunity, session, organizationCanPost } = useTurkiyeJobs();
  const [form, setForm] = useState<OrgOpportunitySubmissionInput>(emptyForm);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const profile = useMemo(
    () => getOrgSubmitFormProfile(form.category, form.type),
    [form.category, form.type],
  );

  const listingTypeOptions = useMemo(
    () => listingTypesForCategory(form.category),
    [form.category],
  );

  const set = <K extends keyof OrgOpportunitySubmissionInput>(
    key: K,
    value: OrgOpportunitySubmissionInput[K],
  ) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const onCategoryChange = (cat: OpportunityCategory) => {
    setForm((f) => {
      const opts = listingTypesForCategory(cat);
      const keepType = f.type && opts.includes(f.type) ? f.type : "";
      let compensation = f.compensation;
      if (cat === "Volunteer Roles") compensation = "Unpaid";
      else if (f.category === "Volunteer Roles" && compensation === "Unpaid")
        compensation = "Paid";
      return { ...f, category: cat, type: keepType, compensation };
    });
  };

  if (!session || session.role !== "organization") {
    return (
      <p className="text-sm text-foreground/70">
        Sign in as an organization to post jobs, consultancies, trainings,
        volunteering, tenders, or grants.
      </p>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    if (!organizationCanPost) {
      setErr(
        "Your organization account is not approved to post yet. Please wait for TürkiyeJobs.org administrators to approve your registration.",
      );
      return;
    }
    const required: { key: keyof OrgOpportunitySubmissionInput; label: string }[] =
      [
        { key: "title", label: "Title" },
        { key: "type", label: "Listing type" },
        { key: "location", label: "Location" },
        { key: "deadline", label: "Application deadline" },
        { key: "shortDescription", label: "Short summary" },
        { key: "description", label: "Full description" },
        { key: "requirements", label: "Requirements" },
        { key: "howToApply", label: "How to apply" },
        { key: "contactEmail", label: "Contact email" },
      ];
    for (const { key, label } of required) {
      if (!String(form[key]).trim()) {
        setErr(`Please complete: ${label}.`);
        return;
      }
    }
    if (profile.requireProcurementFields) {
      if (!form.tenderOrGrantReference.trim()) {
        setErr(`Please complete: ${profile.referenceLabel}.`);
        return;
      }
      if (!form.eligibilitySummary.trim()) {
        setErr(`Please complete: ${profile.eligibilityLabel}.`);
        return;
      }
    }
    if (form.applicationMethod === "email") {
      if (!isValidApplicationEmail(form.applicationEmail)) {
        setErr("Please enter a valid application email for “Apply by email”.");
        return;
      }
    }
    if (form.applicationMethod === "external") {
      const u = form.externalApplicationUrl.trim();
      if (!u.startsWith("http://") && !u.startsWith("https://")) {
        setErr("Please enter a valid https URL for the external application link.");
        return;
      }
    }
    submitOrgOpportunity(form);
    setForm(emptyForm());
    setMsg(
      "Listing submitted for admin approval. You can preview it from your dashboard using View listing; it will appear publicly after approval.",
    );
  };

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8 ${!organizationCanPost ? "opacity-60" : ""}`}
    >
      {!organizationCanPost ? (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <strong>Posting locked:</strong> New employer accounts require administrator
          approval before listings can be submitted. You can still explore the form;
          submit will stay disabled until your organization is approved.
        </div>
      ) : null}
      <h2 className="text-lg font-bold text-brand-navy">
        Post a new opportunity
      </h2>
      <p className="mt-1 text-sm text-foreground/70">
        Use this form for every service type TürkiyeJobs.org supports:{" "}
        <strong>
          jobs, consultancies, trainings, volunteer roles, tenders, and grants
        </strong>
        . All posts are reviewed by administrators before going live.
      </p>

      <fieldset className="mt-8 border-t border-brand-border pt-6">
        <legend className="text-sm font-bold text-brand-navy">
          1. Service category & listing type
        </legend>
        <label className={labelClass}>
          Category <span className="text-red-600">*</span>
        </label>
        <select
          value={form.category}
          onChange={(e) =>
            onCategoryChange(e.target.value as OpportunityCategory)
          }
          className={selectClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className={labelClass}>
          Listing type <span className="text-red-600">*</span>
        </label>
        <select
          value={form.type}
          onChange={(e) => set("type", e.target.value)}
          className={selectClass}
          required
        >
          <option value="">Select type…</option>
          {listingTypeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <p className="mt-3 rounded-lg bg-brand-muted/50 px-3 py-2 text-xs text-foreground/75">
          {profile.hint}
        </p>
        <label className={labelClass}>
          Title <span className="text-red-600">*</span>
        </label>
        <input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className={inputClass}
          placeholder="Clear, specific title (as it should appear publicly)"
        />
      </fieldset>

      <fieldset className="mt-8 border-t border-brand-border pt-6">
        <legend className="text-sm font-bold text-brand-navy">
          2. {profile.section2Title}
        </legend>
        <p className="mt-2 text-xs text-foreground/70">{profile.section2Intro}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Location <span className="text-red-600">*</span>
            </label>
            <input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className={inputClass}
              placeholder="Governorate, city, or “Remote (Türkiye-based)”"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Application deadline <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
              className={inputClass}
              required
            />
          </div>
          {profile.showWorkArrangement ? (
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Work arrangement
              </label>
              <select
                value={form.workArrangement}
                onChange={(e) =>
                  set("workArrangement", e.target.value as WorkArrangement)
                }
                className={selectClass}
              >
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          ) : null}
          {profile.showCompensationSelect ? (
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                Paid / unpaid
              </label>
              <select
                value={form.compensation}
                onChange={(e) =>
                  set("compensation", e.target.value as Compensation)
                }
                className={selectClass}
              >
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          ) : null}
        </div>
        <label className={labelClass}>{profile.salaryLabel}</label>
        <input
          value={form.salaryOrCompensationDetail}
          onChange={(e) => set("salaryOrCompensationDetail", e.target.value)}
          className={inputClass}
          placeholder={profile.salaryPlaceholder}
        />
        <label className={labelClass}>{profile.contractLabel}</label>
        <input
          value={form.contractType}
          onChange={(e) => set("contractType", e.target.value)}
          className={inputClass}
          placeholder={profile.contractPlaceholder}
        />
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              Expected start date (optional)
            </label>
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-navy">
              {profile.durationLabel}
            </label>
            <input
              value={form.duration}
              onChange={(e) => set("duration", e.target.value)}
              className={inputClass}
              placeholder={profile.durationPlaceholder}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="mt-8 border-t border-brand-border pt-6">
        <legend className="text-sm font-bold text-brand-navy">
          3. {profile.section3Title}
        </legend>
        <label className={labelClass}>
          Short public summary <span className="text-red-600">*</span>
        </label>
        <textarea
          value={form.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
          rows={3}
          className={inputClass}
          placeholder={profile.shortSummaryPlaceholder}
        />
        <label className={labelClass}>
          {profile.descriptionLabel} <span className="text-red-600">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={8}
          className={inputClass}
          placeholder={profile.descriptionPlaceholder}
        />
        <label className={labelClass}>
          {profile.requirementsLabel} <span className="text-red-600">*</span>
        </label>
        <textarea
          value={form.requirements}
          onChange={(e) => set("requirements", e.target.value)}
          rows={6}
          className={inputClass}
          placeholder={profile.requirementsPlaceholder}
        />
        {profile.showCandidateGrid ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                {profile.experienceLabel}
              </label>
              <input
                value={form.experienceLevel}
                onChange={(e) => set("experienceLevel", e.target.value)}
                className={inputClass}
                placeholder={profile.experiencePlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                {profile.educationLabel}
              </label>
              <input
                value={form.educationRequirements}
                onChange={(e) => set("educationRequirements", e.target.value)}
                className={inputClass}
                placeholder={profile.educationPlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                {profile.languagesLabel}
              </label>
              <input
                value={form.languagesRequired}
                onChange={(e) => set("languagesRequired", e.target.value)}
                className={inputClass}
                placeholder={profile.languagesPlaceholder}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                {profile.positionsLabel}
              </label>
              <input
                value={form.positionsAvailable}
                onChange={(e) => set("positionsAvailable", e.target.value)}
                className={inputClass}
                placeholder={profile.positionsPlaceholder}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-brand-navy">
                {profile.positionsLabel}
              </label>
              <input
                value={form.positionsAvailable}
                onChange={(e) => set("positionsAvailable", e.target.value)}
                className={inputClass}
                placeholder={profile.positionsPlaceholder}
              />
            </div>
          </div>
        )}
        <label className={labelClass}>{profile.sectorLabel}</label>
        <input
          value={form.sectorThematicArea}
          onChange={(e) => set("sectorThematicArea", e.target.value)}
          className={inputClass}
          placeholder={profile.sectorPlaceholder}
        />
      </fieldset>

      {profile.showProcurementSection ? (
        <fieldset className="mt-8 border-t border-brand-border pt-6">
          <legend className="text-sm font-bold text-brand-navy">
            4. {profile.procurementLegend}
          </legend>
          <p className="text-xs text-foreground/65">{profile.procurementIntro}</p>
          <label className={labelClass}>
            {profile.referenceLabel}{" "}
            {profile.requireProcurementFields ? (
              <span className="text-red-600">*</span>
            ) : null}
          </label>
          <input
            value={form.tenderOrGrantReference}
            onChange={(e) => set("tenderOrGrantReference", e.target.value)}
            className={inputClass}
            placeholder={profile.referencePlaceholder}
          />
          <label className={labelClass}>{profile.budgetLabel}</label>
          <input
            value={form.budgetOrContractValue}
            onChange={(e) => set("budgetOrContractValue", e.target.value)}
            className={inputClass}
            placeholder={profile.budgetPlaceholder}
          />
          <label className={labelClass}>
            {profile.eligibilityLabel}{" "}
            {profile.requireProcurementFields ? (
              <span className="text-red-600">*</span>
            ) : null}
          </label>
          <textarea
            value={form.eligibilitySummary}
            onChange={(e) => set("eligibilitySummary", e.target.value)}
            rows={4}
            className={inputClass}
            placeholder={profile.eligibilityPlaceholder}
          />
        </fieldset>
      ) : null}

      <fieldset className="mt-8 border-t border-brand-border pt-6">
        <legend className="text-sm font-bold text-brand-navy">
          {profile.showProcurementSection ? "5" : "4"}. {profile.section5Title}
        </legend>
        <label className={labelClass}>
          How to apply <span className="text-red-600">*</span>
        </label>
        <textarea
          value={form.howToApply}
          onChange={(e) => set("howToApply", e.target.value)}
          rows={5}
          className={inputClass}
          placeholder={profile.howToApplyPlaceholder}
        />

        <fieldset className="mt-6 rounded-xl border border-brand-border bg-brand-muted/25 p-4">
          <legend className="text-xs font-bold uppercase tracking-wide text-brand-navy">
            How candidates apply
          </legend>
          <p className="text-xs text-foreground/65">
            Internal keeps applicants on TürkiyeJobs.org (Neon database). Email and external
            options still allow users to save listings and log that they applied off-platform.
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {(
              [
                { value: "internal" as const, label: "Internal apply (TürkiyeJobs.org form)" },
                { value: "email" as const, label: "Apply by email (mailto for applicants)" },
                { value: "external" as const, label: "External apply link (employer’s site or portal)" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className="flex cursor-pointer items-start gap-3 rounded-lg border border-brand-border bg-white px-3 py-2.5 has-[:checked]:border-brand-gold has-[:checked]:bg-brand-gold-muted/50"
              >
                <input
                  type="radio"
                  name="applicationMethod"
                  checked={form.applicationMethod === opt.value}
                  onChange={() => set("applicationMethod", opt.value)}
                  className="mt-0.5 text-brand-gold accent-brand-gold"
                />
                <span className="text-sm font-medium text-brand-navy">{opt.label}</span>
              </label>
            ))}
          </div>
          {form.applicationMethod === "email" ? (
            <>
              <label className={labelClass}>
                Application email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={form.applicationEmail}
                onChange={(e) => set("applicationEmail", e.target.value)}
                className={inputClass}
                placeholder="e.g. careers@yourngo.org"
              />
            </>
          ) : null}
          {form.applicationMethod === "external" ? (
            <>
              <label className={labelClass}>
                External application URL <span className="text-red-600">*</span>
              </label>
              <input
                type="url"
                value={form.externalApplicationUrl}
                onChange={(e) => set("externalApplicationUrl", e.target.value)}
                className={inputClass}
                placeholder="https://your-ats-or-website/apply…"
              />
            </>
          ) : null}
        </fieldset>

        <label className={labelClass}>{profile.attachmentsLabel}</label>
        <input
          type="url"
          value={form.attachmentsUrl}
          onChange={(e) => set("attachmentsUrl", e.target.value)}
          className={inputClass}
          placeholder={profile.attachmentsPlaceholder}
        />
        <label className={labelClass}>Other notes for reviewers (optional)</label>
        <textarea
          value={form.additionalInformation}
          onChange={(e) => set("additionalInformation", e.target.value)}
          rows={3}
          className={inputClass}
          placeholder="Internal codes, co-funding, security context, preferred publication date…"
        />
      </fieldset>

      <fieldset className="mt-8 border-t border-brand-border pt-6">
        <legend className="text-sm font-bold text-brand-navy">
          {profile.showProcurementSection ? "6" : "5"}. Contact person (shown to
          applicants after approval)
        </legend>
        <label className={labelClass}>Contact name</label>
        <input
          value={form.contactPersonName}
          onChange={(e) => set("contactPersonName", e.target.value)}
          className={inputClass}
        />
        <label className={labelClass}>
          Contact email <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          value={form.contactEmail}
          onChange={(e) => set("contactEmail", e.target.value)}
          className={inputClass}
          required
        />
        <label className={labelClass}>Contact phone (optional)</label>
        <input
          value={form.contactPhone}
          onChange={(e) => set("contactPhone", e.target.value)}
          className={inputClass}
        />
      </fieldset>

      {err ? <p className="mt-4 text-sm font-medium text-red-700">{err}</p> : null}
      {msg ? (
        <p className="mt-4 text-sm font-medium text-brand-navy">{msg}</p>
      ) : null}

      <button
        type="submit"
        disabled={!organizationCanPost}
        className="mt-6 btn-primary px-8 py-3 text-sm font-semibold text-white hover:bg-brand-red-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        Submit for admin approval
      </button>
    </form>
  );
}
