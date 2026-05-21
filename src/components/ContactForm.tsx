"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export function ContactForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [successDetail, setSuccessDetail] = useState<string | null>(null);
  const defaultSubject = searchParams.get("subject") ?? "";
  const defaultMessage = searchParams.get("message") ?? "";

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErr(null);
    setSuccessDetail(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const subject = String(fd.get("subject") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string | Record<string, string[]>;
        message?: string;
      };

      if (!res.ok || !data.ok) {
        const flat = data.error;
        if (typeof flat === "object" && flat !== null && !Array.isArray(flat)) {
          const first = Object.values(flat).flat()[0];
          setErr(typeof first === "string" ? first : t("contactFormCheckError"));
        } else if (typeof flat === "string") {
          setErr(flat);
        } else {
          setErr(t("contactFormError"));
        }
        return;
      }

      form.reset();
      setSent(true);
      if (typeof data.message === "string") setSuccessDetail(data.message);
    } catch {
      setErr(t("contactFormNetworkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm md:p-8"
    >
      {err ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900" role="alert">
          {err}
        </p>
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-brand-navy">{t("contactFormName")}</label>
          <input
            required
            name="name"
            disabled={loading}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:opacity-60"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="text-xs font-semibold text-brand-navy">{t("contactFormEmail")}</label>
          <input
            required
            type="email"
            name="email"
            disabled={loading}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-brand-navy">{t("contactFormSubject")}</label>
          <input
            required
            name="subject"
            defaultValue={defaultSubject}
            disabled={loading}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:opacity-60"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-brand-navy">{t("contactFormMessage")}</label>
          <textarea
            required
            name="message"
            rows={5}
            defaultValue={defaultMessage}
            disabled={loading}
            className="mt-1 w-full rounded-xl border border-brand-border bg-brand-muted/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-gold/40 disabled:opacity-60"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full btn-primary py-3 text-sm font-semibold text-white  sm:w-auto sm:px-10"
      >
        {loading ? t("contactFormSending") : t("contactFormSend")}
      </button>
      {sent ? (
        <p className="mt-4 text-sm font-medium text-brand-navy">
          {successDetail ?? t("contactFormSuccess")}
        </p>
      ) : null}
    </form>
  );
}
