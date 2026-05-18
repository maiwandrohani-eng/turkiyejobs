import { emailFooterText } from "./resend";
import { escapeHtml, wrapEmailHtml } from "./layout";

function siteOrigin(): string {
  const raw =
    process.env.NEXTAUTH_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (!raw) return "https://turkiyejobs.org";
  try {
    return new URL(raw).origin;
  } catch {
    return "https://turkiyejobs.org";
  }
}

function cta(href: string, label: string): string {
  const safe = escapeHtml(href);
  const lb = escapeHtml(label);
  return `<p style="margin:24px 0 0 0;">
  <a href="${safe}" style="display:inline-block;padding:12px 22px;background:#b51e36;color:#ffffff;text-decoration:none;font-weight:700;border-radius:10px;font-size:14px;">${lb}</a>
</p>`;
}

/** Combined welcome + “email on file” after registration */
export function buildRegistrationEmail(displayName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const name = escapeHtml(displayName.trim() || "there");
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:22px;color:#134e5e;">Welcome to TürkiyeJobs</h1>
    <p style="margin:0;">Hi ${name},</p>
    <p style="margin:16px 0 0 0;">Your account is ready. You can sign in anytime to browse opportunities, save roles, and apply when listings use TürkiyeJobs internal applications.</p>
    <h2 style="margin:28px 0 8px 0;font-size:16px;color:#134e5e;">Email on your account</h2>
    <p style="margin:0;">We use this address as your login and for important account messages. If you did not create this account, please contact support.</p>
    ${cta(`${origin}/login`, "Sign in to TürkiyeJobs")}
  `;
  const text = `Welcome to TürkiyeJobs\n\nHi ${displayName.trim() || "there"},\n\nYour account is ready. Sign in: ${origin}/login\n\n${emailFooterText()}`;
  return {
    subject: "Welcome to TürkiyeJobs.org",
    html: wrapEmailHtml(inner, "Your TürkiyeJobs account is ready."),
    text,
  };
}

export function buildAccountVerificationEmail(displayName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const name = escapeHtml(displayName.trim() || "there");
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Confirm your email</h1>
    <p style="margin:0;">Hi ${name},</p>
    <p style="margin:16px 0 0 0;">This message confirms that this email address is active on TürkiyeJobs.org. No further action is required.</p>
    ${cta(`${origin}/dashboard/user`, "Go to your dashboard")}
  `;
  const text = `Confirm your email — TürkiyeJobs\n\nHi ${displayName.trim() || "there"},\n\nThis confirms this email is active on TürkiyeJobs.org.\n\n${origin}/dashboard/user\n\n${emailFooterText()}`;
  return {
    subject: "Your TürkiyeJobs.org email is confirmed",
    html: wrapEmailHtml(inner, "This email is linked to your TürkiyeJobs account."),
    text,
  };
}

export function buildPasswordResetEmail(resetUrl: string): {
  subject: string;
  html: string;
  text: string;
} {
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Reset your password</h1>
    <p style="margin:0;">We received a request to reset the password for your TürkiyeJobs.org account.</p>
    <p style="margin:16px 0 0 0;">This link expires in one hour.</p>
    ${cta(resetUrl, "Choose a new password")}
    <p style="margin:24px 0 0 0;font-size:14px;color:#64748b;">If you did not request a reset, you can ignore this email.</p>
  `;
  const text = `Reset your TürkiyeJobs password\n\nOpen: ${resetUrl}\n\nThis link expires in one hour.\n\n${emailFooterText()}`;
  return {
    subject: "Reset your TürkiyeJobs.org password",
    html: wrapEmailHtml(inner, "Reset your TürkiyeJobs password"),
    text,
  };
}

export function buildApplicationSubmittedEmail(params: {
  applicantName: string;
  opportunityTitle: string;
  organizationName: string;
}): { subject: string; html: string; text: string } {
  const an = escapeHtml(params.applicantName);
  const ot = escapeHtml(params.opportunityTitle);
  const on = escapeHtml(params.organizationName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Application received</h1>
    <p style="margin:0;">Hi ${an},</p>
    <p style="margin:16px 0 0 0;">Your application to <strong>${ot}</strong> at <strong>${on}</strong> has been submitted on TürkiyeJobs.org.</p>
    <p style="margin:16px 0 0 0;">You can track status from your applicant dashboard.</p>
    ${cta(`${origin}/dashboard/user`, "View your applications")}
  `;
  const text = `Application received — TürkiyeJobs\n\nHi ${params.applicantName},\n\nSubmitted: ${params.opportunityTitle} (${params.organizationName}).\n\n${origin}/dashboard/user\n\n${emailFooterText()}`;
  return {
    subject: `Application submitted: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "Your application was submitted."),
    text,
  };
}

export function buildApplicationSubmittedOrgEmail(params: {
  organizationName: string;
  opportunityTitle: string;
  applicantName: string;
  applicantEmail: string;
}): { subject: string; html: string; text: string } {
  const on = escapeHtml(params.organizationName);
  const ot = escapeHtml(params.opportunityTitle);
  const an = escapeHtml(params.applicantName);
  const ae = escapeHtml(params.applicantEmail);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">New internal application</h1>
    <p style="margin:0;">Hello ${on} team,</p>
    <p style="margin:16px 0 0 0;">Someone applied via TürkiyeJobs internal apply for <strong>${ot}</strong>.</p>
    <ul style="margin:16px 0 0 0;padding-left:20px;">
      <li><strong>Applicant:</strong> ${an}</li>
      <li><strong>Email:</strong> ${ae}</li>
    </ul>
    ${cta(`${origin}/dashboard/organization`, "Open employer workspace")}
  `;
  const text = `New application — ${params.opportunityTitle}\n\nApplicant: ${params.applicantName} <${params.applicantEmail}>\n\n${origin}/dashboard/organization\n\n${emailFooterText()}`;
  return {
    subject: `New applicant: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "New internal application on TürkiyeJobs."),
    text,
  };
}

export function buildOrganizationApprovedEmail(orgName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const o = escapeHtml(orgName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Approval confirmed</h1>
    <p style="margin:0;">This email confirms that <strong>${o}</strong> has been <strong>approved</strong> on TürkiyeJobs.org.</p>
    <p style="margin:16px 0 0 0;">Your team may now submit opportunities for administrator review before they go live on the public directory.</p>
    ${cta(`${origin}/dashboard/organization`, "Open employer workspace")}
  `;
  const text = `Confirmation: organization approved — TürkiyeJobs\n\n${orgName} is approved on TürkiyeJobs.org. You can post opportunities (each listing is still reviewed before publication).\n\n${origin}/dashboard/organization\n\n${emailFooterText()}`;
  return {
    subject: "Confirmation: your organization is approved on TürkiyeJobs.org",
    html: wrapEmailHtml(inner, "Your organization registration is approved."),
    text,
  };
}

export function buildOrganizationRejectedEmail(orgName: string): {
  subject: string;
  html: string;
  text: string;
} {
  const o = escapeHtml(orgName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Organization registration update</h1>
    <p style="margin:0;">Your registration for <strong>${o}</strong> was not approved for posting on TürkiyeJobs.org at this time.</p>
    <p style="margin:16px 0 0 0;">If you believe this is a mistake, reply to your TürkiyeJobs contact or reach out through the site contact form.</p>
    ${cta(`${origin}/contact`, "Contact TürkiyeJobs")}
  `;
  const text = `Organization registration — TürkiyeJobs\n\n${orgName} was not approved at this time.\n\n${origin}/contact\n\n${emailFooterText()}`;
  return {
    subject: "TürkiyeJobs.org — organization registration update",
    html: wrapEmailHtml(inner, "Update on your organization registration."),
    text,
  };
}

export function buildOpportunityApprovedEmail(params: {
  opportunityTitle: string;
  organizationName: string;
}): { subject: string; html: string; text: string } {
  const t = escapeHtml(params.opportunityTitle);
  const o = escapeHtml(params.organizationName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Listing approved</h1>
    <p style="margin:0;"><strong>${t}</strong> for <strong>${o}</strong> is approved and published (or moving live) on TürkiyeJobs.org.</p>
    ${cta(`${origin}/opportunities`, "View public opportunities")}
  `;
  const text = `Listing approved — TürkiyeJobs\n\n${params.opportunityTitle} (${params.organizationName})\n\n${origin}/opportunities\n\n${emailFooterText()}`;
  return {
    subject: `Published: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "Your listing was approved."),
    text,
  };
}

export function buildOpportunityRejectedEmail(params: {
  opportunityTitle: string;
  organizationName: string;
}): { subject: string; html: string; text: string } {
  const t = escapeHtml(params.opportunityTitle);
  const o = escapeHtml(params.organizationName);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Listing not approved</h1>
    <p style="margin:0;"><strong>${t}</strong> for <strong>${o}</strong> was not approved for public listing on TürkiyeJobs.org.</p>
    <p style="margin:16px 0 0 0;">You can revise and resubmit from your employer workspace when posting is available.</p>
    ${cta(`${origin}/dashboard/organization`, "Employer workspace")}
  `;
  const text = `Listing not approved — TürkiyeJobs\n\n${params.opportunityTitle}\n\n${origin}/dashboard/organization\n\n${emailFooterText()}`;
  return {
    subject: `Listing update: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "Your listing was not approved."),
    text,
  };
}

export function buildApplicationStatusUpdatedEmail(params: {
  opportunityTitle: string;
  organizationName: string;
  statusLabel: string;
}): { subject: string; html: string; text: string } {
  const t = escapeHtml(params.opportunityTitle);
  const o = escapeHtml(params.organizationName);
  const s = escapeHtml(params.statusLabel);
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Application status updated</h1>
    <p style="margin:0;">Your application to <strong>${t}</strong> at <strong>${o}</strong> is now: <strong>${s}</strong>.</p>
    ${cta(`${origin}/dashboard/user`, "View your dashboard")}
  `;
  const text = `Application status — TürkiyeJobs\n\n${params.opportunityTitle} (${params.organizationName})\nNew status: ${params.statusLabel}\n\n${origin}/dashboard/user\n\n${emailFooterText()}`;
  return {
    subject: `Application update: ${params.opportunityTitle}`,
    html: wrapEmailHtml(inner, "Your application status changed."),
    text,
  };
}

/** Auto-reply after someone uses the public contact form */
export function buildContactConfirmationEmail(params: {
  displayName: string;
  subject: string;
}): { subject: string; html: string; text: string } {
  const name = escapeHtml(params.displayName.trim() || "there");
  const subj = escapeHtml(params.subject.trim());
  const origin = siteOrigin();
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">We received your message</h1>
    <p style="margin:0;">Hi ${name},</p>
    <p style="margin:16px 0 0 0;">Thank you for contacting TürkiyeJobs.org. We have received your message regarding <strong>${subj}</strong> and will reply as soon as we can.</p>
    <p style="margin:16px 0 0 0;font-size:14px;color:#64748b;">If your question is urgent, you can also reach us at <a href="mailto:hello@turkiyejobs.org" style="color:#b51e36;font-weight:600;">hello@turkiyejobs.org</a>.</p>
    ${cta(`${origin}/`, "Visit TürkiyeJobs.org")}
  `;
  const text = `We received your message — TürkiyeJobs.org\n\nHi ${params.displayName.trim() || "there"},\n\nWe received your message about: ${params.subject.trim()}\n\nWe will reply as soon as we can.\n\n${origin}/\n\n${emailFooterText()}`;
  return {
    subject: "We received your message — TürkiyeJobs.org",
    html: wrapEmailHtml(inner, "TürkiyeJobs.org received your contact form message."),
    text,
  };
}

/** Internal copy of a contact form submission (HTML body uses escaped fields). */
export function buildContactStaffEmail(params: {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
}): { subject: string; html: string; text: string } {
  const n = escapeHtml(params.fromName.trim());
  const e = escapeHtml(params.fromEmail.trim());
  const s = escapeHtml(params.subject.trim());
  const msgEscaped = escapeHtml(params.message.trim())
    .replace(/\r\n/g, "\n")
    .replace(/\n/g, "<br/>");
  const inner = `
    <h1 style="margin:0 0 12px 0;font-size:20px;color:#134e5e;">Contact form</h1>
    <p style="margin:0;"><strong>Name:</strong> ${n}</p>
    <p style="margin:8px 0 0 0;"><strong>Email:</strong> ${e}</p>
    <p style="margin:8px 0 0 0;"><strong>Subject:</strong> ${s}</p>
    <h2 style="margin:24px 0 8px 0;font-size:15px;color:#134e5e;">Message</h2>
    <p style="margin:0;line-height:1.55;">${msgEscaped}</p>
  `;
  const text = `Contact form — TürkiyeJobs.org\n\nName: ${params.fromName.trim()}\nEmail: ${params.fromEmail.trim()}\nSubject: ${params.subject.trim()}\n\nMessage:\n${params.message.trim()}\n\n${emailFooterText()}`;
  return {
    subject: `[TürkiyeJobs contact] ${params.subject.trim().slice(0, 120)}`,
    html: wrapEmailHtml(inner, "New message from turkiyejobs.org contact form."),
    text,
  };
}
