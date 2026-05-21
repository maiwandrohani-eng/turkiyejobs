import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { authOptions } from "@/lib/auth-options";
import { getPrisma } from "@/lib/prisma";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const bodySchema = z.object({
  organizationId: z.string().min(1),
  message: z.string().max(1200).optional().default(""),
});

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`org-claim:${ip}`, 20);
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests", retryAfter: rl.retryAfter },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ ok: false, error: "Please sign in to claim a profile." }, { status: 401 });
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

  const { organizationId, message } = parsed.data;

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { id: true, name: true, isActive: true, claimed: true },
  });

  if (!org || !org.isActive) {
    return NextResponse.json({ ok: false, error: "Organization profile is not available." }, { status: 404 });
  }

  if (org.claimed) {
    return NextResponse.json({ ok: false, error: "This profile has already been claimed." }, { status: 409 });
  }

  const existingPending = await prisma.organizationClaimRequest.findFirst({
    where: {
      organizationId,
      requesterUserId: session.user.id,
      status: "PENDING",
    },
    select: { id: true },
  });

  if (existingPending) {
    return NextResponse.json({
      ok: true,
      message: "Your claim request is already pending review.",
    });
  }

  await prisma.organizationClaimRequest.create({
    data: {
      organizationId,
      requesterUserId: session.user.id,
      requesterEmail: session.user.email,
      requesterName: session.user.name ?? null,
      message: message.trim() || null,
      status: "PENDING",
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Claim request submitted. An administrator will review it shortly.",
  });
}
