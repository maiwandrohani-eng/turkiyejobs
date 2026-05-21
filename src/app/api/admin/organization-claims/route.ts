import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: true, items: [] });
  }

  const items = await prisma.organizationClaimRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      organizationId: true,
      requesterUserId: true,
      requesterEmail: true,
      requesterName: true,
      message: true,
      createdAt: true,
      organization: { select: { name: true, slug: true, claimed: true, verificationStatus: true } },
    },
  });

  return NextResponse.json({ ok: true, items });
}
