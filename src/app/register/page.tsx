import { RegisterForm } from "@/components/RegisterForm";
import { PageIntro, PageShell } from "@/components/PageShell";

export default function RegisterPage() {
  return (
    <div className="min-h-[60vh] surface-hero">
      <PageShell className="max-w-lg">
        <PageIntro
          eyebrow="Join TürkiyeJobs.org"
          title="Create your account"
          description="Choose whether you are applying for opportunities or posting them on behalf of an organization. Administrator accounts are issued separately by the platform team."
        />
        <RegisterForm />
      </PageShell>
    </div>
  );
}
