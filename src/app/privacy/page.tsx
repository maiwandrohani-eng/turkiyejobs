import { PageIntro, PageShell } from "@/components/PageShell";

export default function PrivacyPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow="Legal"
          title="Privacy Policy"
          description="How TürkiyeJobs.org handles personal data. Replace with jurisdiction-specific legal review before launch."
        />
        <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">1. Data we collect</h2>
            <p className="mt-3">
              We collect account details (name, email, organization), application
              materials you upload, usage analytics, and communications you send through
              contact forms.
            </p>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">2. How we use data</h2>
            <p className="mt-3">
              Data powers authentication, opportunity matching, employer workflows,
              customer support, fraud prevention, and product improvements. Marketing
              communications are optional and can be unsubscribed at any time.
            </p>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">3. Sharing</h2>
            <p className="mt-3">
              Employers receive application materials you submit to their listings.
              We may share data with subprocessors (hosting, email) under strict agreements.
              We do not sell personal data.
            </p>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">4. Retention & security</h2>
            <p className="mt-3">
              We retain information as long as your account is active or as needed for
              legal obligations. Technical and organizational measures protect data in
              transit and at rest.
            </p>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">5. Your rights</h2>
            <p className="mt-3">
              Depending on your location, you may request access, correction, export, or
              deletion of personal data. Contact privacy@turkiyejobs.org for requests.
            </p>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
