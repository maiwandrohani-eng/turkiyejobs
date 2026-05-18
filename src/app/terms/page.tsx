import { PageIntro, PageShell } from "@/components/PageShell";

export default function TermsPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <PageIntro
          eyebrow="Legal"
          title="Terms of Service"
          description="These terms govern your use of TürkiyeJobs.org. Replace with counsel-reviewed text before production launch."
        />
        <div className="space-y-6 text-sm leading-relaxed text-foreground/80">
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">1. Acceptance</h2>
            <p className="mt-3">
              By accessing TürkiyeJobs.org you agree to these terms and our Privacy Policy.
              If you disagree, please discontinue use of the platform.
            </p>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">2. Accounts</h2>
            <p className="mt-3">
              You are responsible for safeguarding your credentials. Employers must
              provide accurate organization information. We may suspend accounts that
              misrepresent affiliations or abuse the community.
            </p>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">3. Listings & applications</h2>
            <p className="mt-3">
              Opportunities are provided by third-party organizations. TürkiyeJobs.org does
              not guarantee hiring outcomes. Applications may be submitted through our
              tools or external employer systems as indicated in each listing.
            </p>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">4. Content moderation</h2>
            <p className="mt-3">
              We may review, edit, or remove content that violates law, these terms, or
              community guidelines, including fraudulent postings or discriminatory language.
            </p>
          </section>
          <section className="rounded-2xl border border-brand-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-brand-navy">5. Limitation of liability</h2>
            <p className="mt-3">
              To the fullest extent permitted by law, TürkiyeJobs.org and its operators are
              not liable for indirect or consequential damages arising from use of the site.
            </p>
          </section>
        </div>
      </PageShell>
    </div>
  );
}
