import { OpportunitiesPageClient } from "@/components/OpportunitiesPageClient";

type OpportunitiesPageProps = {
  searchParams: Promise<{
    orgId?: string;
    org?: string;
    category?: string;
  }>;
};

function decodeQueryParam(value: string | undefined): string {
  if (!value?.trim()) return "";
  try {
    return decodeURIComponent(value.trim());
  } catch {
    return value.trim();
  }
}

export default async function OpportunitiesPage({
  searchParams,
}: OpportunitiesPageProps) {
  const sp = await searchParams;

  return (
    <OpportunitiesPageClient
      orgIdFilter={decodeQueryParam(sp.orgId)}
      orgFilter={decodeQueryParam(sp.org)}
      categoryFilter={sp.category ?? null}
    />
  );
}
