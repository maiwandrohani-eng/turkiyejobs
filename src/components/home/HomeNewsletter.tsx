"use client";

import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useLanguage } from "@/context/LanguageContext";

export function HomeNewsletter() {
  const { t } = useLanguage();

  return (
    <section className="surface-red border-t border-brand-red/10 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-xl font-bold text-brand-teal">{t("newsletterHeading")}</h2>
        <p className="mt-2 text-sm text-brand-teal/70">{t("newsletterSubtext")}</p>
        <NewsletterSignup
          source="homepage"
          placeholder="Your email address"
          buttonLabel={t("newsletterButton")}
        />
      </div>
    </section>
  );
}
