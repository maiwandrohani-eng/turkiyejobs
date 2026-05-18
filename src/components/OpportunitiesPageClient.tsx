"use client";

import { OpportunitiesExplorer } from "@/components/OpportunitiesExplorer";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { useLanguage } from "@/context/LanguageContext";

type OpportunitiesPageClientProps = {
  orgIdFilter?: string;
  orgFilter?: string;
  categoryFilter?: string | null;
};

export function OpportunitiesPageClient({
  orgIdFilter = "",
  orgFilter = "",
  categoryFilter = null,
}: OpportunitiesPageClientProps) {
  const { t } = useLanguage();
  const { opportunities } = useTurkiyeJobs();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow={t("opportunitiesEyebrow")}
          title={t("opportunitiesTitle")}
          description={t("opportunitiesDescription")}
        />
        <OpportunitiesExplorer
          opportunities={opportunities}
          initialOrganizationId={orgIdFilter}
          initialOrganization={orgIdFilter ? "" : orgFilter}
          initialCategory={categoryFilter}
        />
      </PageShell>
    </div>
  );
}
