import type { PrismaClient } from "@/generated/prisma/client";

export type CommunityEventRow = {
  id: string;
  eventDate: string;
  title: string;
  detail: string;
  href: string | null;
  confirmed: boolean;
};

/** Seed data when the CommunityEvent table is empty (matches prior static page). */
export const FALLBACK_COMMUNITY_EVENTS: CommunityEventRow[] = [
  {
    id: "fallback-1",
    eventDate: "2026-05-28",
    title: "CV clinic — social impact roles (online)",
    detail: "Open session on structuring CVs for NGO and consultancy applications.",
    href: "/resources",
    confirmed: false,
  },
  {
    id: "fallback-2",
    eventDate: "2026-06-12",
    title: "Safeguarding refresher — hiring managers",
    detail: "Discussion on fair screening and referral pathways when shortlisting.",
    href: "/resources/safeguarding-basics-every-applicant-should-know",
    confirmed: false,
  },
  {
    id: "fallback-3",
    eventDate: "2026-06-30",
    title: "Q2 reporting window — many donor roles",
    detail:
      "Reminder: several MEAL and programme reporting roles track to quarter-end cycles.",
    href: "/opportunities",
    confirmed: false,
  },
  {
    id: "fallback-4",
    eventDate: "2026-09-15",
    title: "Regional skills week (hybrid, Ankara)",
    detail:
      "Community-led trainings on facilitation, MEAL basics, and remote collaboration.",
    href: "/opportunities?category=Trainings",
    confirmed: false,
  },
];

export async function loadCommunityEvents(
  prisma: PrismaClient,
): Promise<CommunityEventRow[]> {
  try {
    const rows = await prisma.communityEvent.findMany({
      orderBy: [{ sortOrder: "asc" }, { eventDate: "asc" }],
    });
    if (rows.length === 0) return FALLBACK_COMMUNITY_EVENTS;
    return rows.map((r) => ({
      id: r.id,
      eventDate: r.eventDate,
      title: r.title,
      detail: r.detail,
      href: r.href,
      confirmed: r.confirmed,
    }));
  } catch {
    return FALLBACK_COMMUNITY_EVENTS;
  }
}
