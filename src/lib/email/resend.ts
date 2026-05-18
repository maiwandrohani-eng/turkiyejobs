/**
 * Central Resend client — server-only. Never throws for transport failures.
 */

export const DEFAULT_EMAIL_FROM = "TürkiyeJobs <noreply@turkiyejobs.org>";

const FOOTER_TEXT =
  "TürkiyeJobs.org — Türkiye's Development & Social Impact Jobs Platform";

export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendEmailResult =
  | { ok: true; id?: string }
  | { ok: false; error: string; status?: number };

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing; skipped:", input.subject);
    return { ok: false, error: "RESEND_API_KEY missing" };
  }

  const from = process.env.EMAIL_FROM?.trim() || DEFAULT_EMAIL_FROM;
  const toList = Array.isArray(input.to) ? input.to : [input.to];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: toList,
        subject: input.subject,
        html: input.html,
        text: input.text,
        ...(input.replyTo ? { reply_to: [input.replyTo] } : {}),
      }),
    });

    const raw = await res.text();
    if (!res.ok) {
      console.error(
        "[email] Resend error",
        res.status,
        input.subject,
        raw.slice(0, 800),
      );
      return { ok: false, error: `Resend HTTP ${res.status}`, status: res.status };
    }

    try {
      const parsed = JSON.parse(raw) as { id?: string };
      return { ok: true, id: parsed.id };
    } catch {
      return { ok: true };
    }
  } catch (e) {
    console.error("[email] Resend fetch failed:", input.subject, e);
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

export function emailFooterText(): string {
  return FOOTER_TEXT;
}
