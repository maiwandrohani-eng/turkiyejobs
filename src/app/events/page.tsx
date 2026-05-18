import { PageShell } from "@/components/PageShell";
import { EventsContent } from "@/components/EventsContent";
import { loadCommunityEvents } from "@/lib/community-events";
import { getPrisma } from "@/lib/prisma";

export const metadata = {
  title: "Events & key dates",
  description:
    "Workshops, webinars, and milestone dates for Türkiye's development and social impact community.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const prisma = getPrisma();
  const events = prisma ? await loadCommunityEvents(prisma) : [];

  return (
    <div className="min-h-[60vh] bg-background">
      <PageShell className="max-w-3xl">
        <EventsContent events={events} />
      </PageShell>
    </div>
  );
}
