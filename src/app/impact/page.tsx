import { PageShell } from "@/components/PageShell";
import { ImpactContent } from "@/components/ImpactContent";

export const metadata = {
  title: "Transparency & impact",
  description:
    "Principles behind listings quality, fairness, and how TürkiyeJobs.org serves Türkiye's social impact ecosystem.",
};

export default function ImpactPage() {
  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <ImpactContent />
      </PageShell>
    </div>
  );
}
