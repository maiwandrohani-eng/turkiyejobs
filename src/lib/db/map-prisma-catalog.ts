import type {
  Compensation,
  Opportunity,
  OpportunityApplicationMethod,
  OpportunityCategory,
  OpportunityVisibility,
  Organization,
  WorkArrangement,
} from "@/lib/types";
import type {
  Category,
  FeaturedOpportunity,
  Opportunity as PrismaOpportunity,
  Organization as PrismaOrganization,
  OpportunityStatus,
  OpportunityApplyMode,
  WorkArrangement as PrismaWorkArrangement,
  CompensationType,
} from "@/generated/prisma/client";

const CATEGORIES: readonly OpportunityCategory[] = [
  "Jobs",
  "Consultancies",
  "Trainings",
  "Volunteer Roles",
  "Tenders",
  "Grants",
] as const;

export function parseCategoryName(name: string | null | undefined): OpportunityCategory {
  const n = name ?? "Jobs";
  if (n === "NGO Jobs") return "Jobs";
  return (CATEGORIES.includes(n as OpportunityCategory)
    ? n
    : "Jobs") as OpportunityCategory;
}

const WORK: Record<PrismaWorkArrangement, WorkArrangement> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ONSITE: "On-site",
};

const COMP: Record<CompensationType, Compensation> = {
  PAID: "Paid",
  UNPAID: "Unpaid",
};

function statusToVisibility(s: OpportunityStatus): OpportunityVisibility {
  switch (s) {
    case "PENDING_APPROVAL":
      return "pending_approval";
    case "PUBLISHED":
      return "published";
    case "REJECTED":
      return "rejected";
    case "CLOSED":
      return "closed";
    default:
      return "pending_approval";
  }
}

function applyModeToUi(m: OpportunityApplyMode): OpportunityApplicationMethod {
  switch (m) {
    case "INTERNAL":
      return "internal";
    case "APPLY_BY_EMAIL":
      return "email";
    case "EXTERNAL_LINK":
      return "external";
    default:
      return "internal";
  }
}

export type OpportunityRow = PrismaOpportunity & {
  organization: PrismaOrganization;
  category: Pick<Category, "nameEn"> | null;
  featured: FeaturedOpportunity | null;
};

export function mapOrganizationRecord(org: PrismaOrganization): Organization {
  const verificationStatus = (
    org.verificationStatus === "VERIFIED" ||
    org.verificationStatus === "PENDING" ||
    org.verificationStatus === "REJECTED" ||
    org.verificationStatus === "CURATED_PUBLIC_PROFILE" ||
    org.verificationStatus === "UNCLAIMED_PROFILE"
      ? org.verificationStatus
      : "PENDING"
  ) as Organization["verificationStatus"];

  return {
    id: org.id,
    name: org.name,
    slug: org.slug,
    description: org.description ?? "",
    location: org.location ?? "",
    website: org.website ?? undefined,
    verificationStatus,
    claimed: "claimed" in org ? (org.claimed as boolean | null | undefined) ?? null : null,
    verified: org.verificationStatus === "VERIFIED",
    featured: org.featuredBadge,
  };
}

export function mapOpportunityRecord(row: OpportunityRow): Opportunity {
  const deadline =
    row.deadline != null
      ? row.deadline.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);
  const desc = row.description ?? "";
  const short =
    desc.length > 320 ? `${desc.slice(0, 317).trimEnd()}…` : desc;

  return {
    id: row.id,
    slug: row.slug ?? undefined,
    title: row.title,
    organizationId: row.organizationId,
    organizationName: row.organization?.name?.trim() || "Organization",
    category: parseCategoryName(row.category?.nameEn),
    location: row.location ?? "",
    deadline,
    type: row.type,
    workArrangement: WORK[row.workArrangement] ?? "On-site",
    compensation: COMP[row.compensation] ?? "Paid",
    shortDescription: short,
    description: desc,
    requirements: row.requirements ?? "",
    howToApply: row.howToApply ?? "",
    externalApplyUrl: row.externalApplyUrl ?? undefined,
    applicationEmail: row.applicationEmail ?? undefined,
    externalApplicationUrl: row.externalApplicationUrl ?? undefined,
    applicationMethod: applyModeToUi(row.applyMode),
    featured: row.featured != null,
    visibility: statusToVisibility(row.status),
  };
}
