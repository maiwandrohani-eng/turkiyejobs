import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  claimId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
});

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`admin-org-claim-moderate:${ip}`, 40);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ ok: false, error: "Database not configured." }, { status: 503 });
  }

  const claim = await prisma.organizationClaimRequest.findUnique({
    where: { id: parsed.data.claimId },
    select: {
      id: true,
      status: true,
      organizationId: true,
      organization: { select: { verificationStatus: true } },
    },
  });

  if (!claim || claim.status !== "PENDING") {
    return NextResponse.json({ ok: false, error: "Claim request not found or already processed." }, { status: 404 });
  }

  if (parsed.data.action === "reject") {
    await prisma.organizationClaimRequest.update({
      where: { id: claim.id },
      data: { status: "REJECTED" },
    });
    return NextResponse.json({ ok: true });
  }

  await prisma.$transaction(async (tx) => {
    await tx.organizationClaimRequest.update({
      where: { id: claim.id },
      data: { status: "APPROVED" },
    });

    await tx.organization.update({
      where: { id: claim.organizationId },
      data: {
        claimed: true,
        verificationStatus:
          claim.organization.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING",
      },
    });

    await tx.organizationClaimRequest.updateMany({
      where: {
        organizationId: claim.organizationId,
        status: "PENDING",
        NOT: { id: claim.id },
      },
      data: { status: "REJECTED" },
    });
  });

  return NextResponse.json({ ok: true });
}
