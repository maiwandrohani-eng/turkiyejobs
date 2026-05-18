import { NextResponse } from "next/server";
import { z } from "zod";
import { assertAppOrigin } from "@/lib/assert-app-origin";
import { sendContactFormEmails } from "@/lib/email/transactional";
import { clientIp, rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(254),
  subject: z.string().trim().min(1).max(200),
  message: z.string().trim().min(1).max(10000),
});

export async function POST(req: Request) {
  if (!assertAppOrigin(req)) {
    return NextResponse.json({ ok: false, error: "Invalid origin" }, { status: 403 });
  }

  const ip = clientIp(req);
  const rl = rateLimit(`contact:${ip}`, 10);
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
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY?.trim()) {
    console.warn("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "Email is not configured on this server." },
      { status: 503 },
    );
  }

  const inboxTo =
    process.env.CONTACT_INBOX_EMAIL?.trim() || "maiwandr@gmail.com";
  if (!inboxTo.includes("@")) {
    console.warn("[contact] CONTACT_INBOX_EMAIL is not set or invalid");
    return NextResponse.json(
      { ok: false, error: "Contact inbox is not configured on this server." },
      { status: 503 },
    );
  }

  const { name, email, subject, message } = parsed.data;
  const { staff, user } = await sendContactFormEmails({
    fromName: name,
    fromEmail: email,
    subject,
    message,
    inboxTo,
  });

  if (!staff.ok) {
    console.error("[contact] staff notify failed", staff.error);
    return NextResponse.json(
      { ok: false, error: "We could not deliver your message. Please try again or email hello@turkiyejobs.org." },
      { status: 502 },
    );
  }

  if (!user.ok) {
    console.error("[contact] confirmation to submitter failed", user.error);
    return NextResponse.json({
      ok: true,
      confirmationEmailSent: false,
      message:
        "Your message was received by our team, but we could not send a confirmation email. Please check spam or contact hello@turkiyejobs.org if you need a reply.",
    });
  }

  return NextResponse.json({
    ok: true,
    confirmationEmailSent: true,
    message: "We emailed you a confirmation and will reply soon.",
  });
}
