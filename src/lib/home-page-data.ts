import { getPrisma } from "@/lib/prisma";

export type VerifiedOrgStripItem = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
};

function hasUsableLogo(logoUrl: string | null): boolean {
  if (!logoUrl) return false;
  const trimmed = logoUrl.trim();
  if (!trimmed) return false;
  // Data-URI placeholders are not treated as "working logos" for prioritization.
  if (trimmed.startsWith("data:image/svg+xml")) return false;
  return true;
}

export async function getPublishedOpportunityCount(): Promise<number> {
  const prisma = getPrisma();
  if (!prisma) return 0;
  try {
    return await prisma.opportunity.count({
      where: {
        status: "PUBLISHED",
        organization: { verificationStatus: { not: "REJECTED" } },
      },
    });
  } catch {
    return 0;
  }
}

export async function getVerifiedOrganizationsForStrip(): Promise<VerifiedOrgStripItem[]> {
  const prisma = getPrisma();
  if (!prisma) return [];
  try {
    const rows = await prisma.organization.findMany({
      where: {
        verificationStatus: { not: "REJECTED" },
        isActive: true,
      },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, logoUrl: true },
    });

    return [...rows].sort((a, b) => {
      const aHasLogo = hasUsableLogo(a.logoUrl);
      const bHasLogo = hasUsableLogo(b.logoUrl);
      if (aHasLogo !== bHasLogo) return aHasLogo ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  } catch {
    return [];
  }
}
