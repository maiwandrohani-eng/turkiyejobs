"use client";

import { useSearchParams } from "next/navigation";
import { OpportunitiesExplorer } from "@/components/OpportunitiesExplorer";
import { PageIntro, PageShell } from "@/components/PageShell";
import { useTurkiyeJobs } from "@/context/TurkiyeJobsProvider";
import { useLanguage } from "@/context/LanguageContext";

export function OpportunitiesPageClient() {
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const orgIdFilter = searchParams.get("orgId")
    ? decodeURIComponent(searchParams.get("orgId")!.trim())
    : "";
  const orgFilter = searchParams.get("org")
    ? decodeURIComponent(searchParams.get("org")!.trim())
    : "";
  const categoryFilter = searchParams.get("category");
  const { opportunities, hydrated } = useTurkiyeJobs();

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell>
        <PageIntro
          eyebrow={t("opportunitiesEyebrow")}
          title={t("opportunitiesTitle")}
          description={t("opportunitiesDescription")}
        />
        {!hydrated ? (
          <p className="text-sm text-foreground/60">{t("opportunitiesLoading")}</p>
        ) : (
          <OpportunitiesExplorer
            opportunities={opportunities}
            initialOrganizationId={orgIdFilter}
            initialOrganization={orgIdFilter ? "" : orgFilter}
            initialCategory={categoryFilter}
          />
        )}
      </PageShell>
    </div>
  );
}
