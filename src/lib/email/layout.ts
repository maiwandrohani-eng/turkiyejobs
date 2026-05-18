import { emailFooterText } from "./resend";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Wrap inner HTML in a simple responsive, table-based layout for major clients.
 */
export function wrapEmailHtml(inner: string, preheader?: string): string {
  const pre = preheader ? escapeHtml(preheader) : "";
  const footer = escapeHtml(emailFooterText());
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>TürkiyeJobs</title>
<style>
  @media only screen and (max-width: 620px) {
    .mj-column { width: 100% !important; }
    .pad { padding-left: 16px !important; padding-right: 16px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Segoe UI,system-ui,-apple-system,sans-serif;color:#134e5e;">
  ${pre ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${pre}</div>` : ""}
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f5;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
          <tr>
            <td class="pad" style="padding:28px 28px 8px 28px;background:#134e5e;color:#f8fafc;border-bottom:3px solid #b51e36;">
              <p style="margin:0;font-size:20px;font-weight:700;letter-spacing:0.02em;"><span style="color:#f0c4cb;">Türkiye</span><span style="color:#ffffff;">Jobs</span><span style="color:#d1d5db;font-weight:500;">.org</span></p>
              <p style="margin:8px 0 0 0;font-size:13px;opacity:0.9;">NGO &amp; development sector careers in Türkiye</p>
            </td>
          </tr>
          <tr>
            <td class="pad mj-column" style="padding:24px 28px 32px 28px;font-size:15px;line-height:1.55;color:#1e293b;">
              ${inner}
            </td>
          </tr>
          <tr>
            <td class="pad" style="padding:16px 28px 24px 28px;background:#fafaf9;border-top:1px solid #e7e5e4;font-size:12px;line-height:1.5;color:#64748b;">
              ${footer}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export { escapeHtml };
