import { siteConfig } from '@/config/site';

export type ContactEmailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  receivedAt?: Date;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatWhen(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Amman',
  }).format(date);
}

/**
 * Table-based HTML email — dark portfolio look (ink + blue accent).
 * Inline styles only for client compatibility.
 */
export function buildContactEmailHtml(payload: ContactEmailPayload): string {
  const { name, email, subject, message } = payload;
  const when = formatWhen(payload.receivedAt ?? new Date());
  const siteUrl = siteConfig.url;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeSubject = escapeHtml(subject);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br />');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark light" />
  <title>New portfolio enquiry</title>
</head>
<body style="margin:0;padding:0;background-color:#0B0D10;color:#F4F6F8;font-family:IBM Plex Sans,Segoe UI,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0B0D10;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background-color:#14181E;border:1px solid rgba(255,255,255,0.10);border-radius:14px;overflow:hidden;">
          <tr>
            <td style="padding:28px 28px 20px;border-bottom:1px solid rgba(255,255,255,0.08);background:linear-gradient(165deg,#1A1F27 0%,#14181E 55%,#0F1217 100%);">
              <p style="margin:0 0 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#3D82E6;">
                System.contact
              </p>
              <h1 style="margin:0;font-family:Syne,Arial Black,Arial,sans-serif;font-size:26px;line-height:1.2;letter-spacing:-0.02em;color:#FAFAFA;font-weight:700;">
                New portfolio enquiry
              </h1>
              <p style="margin:10px 0 0;font-size:14px;line-height:1.5;color:#9AA3AF;">
                Someone reached out via ${escapeHtml(siteConfig.name)}’s contact form.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid rgba(255,255,255,0.08);border-radius:12px;background-color:#1A1F27;">
                <tr>
                  <td style="padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0 0 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#7B8494;">From</p>
                    <p style="margin:0;font-size:16px;line-height:1.4;color:#F4F6F8;font-weight:600;">${safeName}</p>
                    <p style="margin:6px 0 0;">
                      <a href="mailto:${safeEmail}" style="color:#3D82E6;text-decoration:none;font-size:14px;">${safeEmail}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;border-bottom:1px solid rgba(255,255,255,0.08);">
                    <p style="margin:0 0 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#7B8494;">Subject</p>
                    <p style="margin:0;font-size:15px;line-height:1.45;color:#F4F6F8;">${safeSubject}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 18px;">
                    <p style="margin:0 0 4px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#7B8494;">Received</p>
                    <p style="margin:0;font-size:14px;line-height:1.45;color:#9AA3AF;">${escapeHtml(when)} (Asia/Amman)</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 8px;">
              <p style="margin:0 0 10px;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#3D82E6;">
                Message
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-left:3px solid #3D82E6;background-color:#0F1217;border-radius:0 12px 12px 0;">
                <tr>
                  <td style="padding:18px 20px;font-size:15px;line-height:1.65;color:#F4F6F8;">
                    ${safeMessage}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 28px 28px;" align="left">
              <a href="mailto:${safeEmail}?subject=${encodeURIComponent(`Re: ${subject}`)}"
                 style="display:inline-block;background-color:#FAFAFA;color:#0A0A0A;text-decoration:none;font-size:14px;font-weight:600;padding:12px 20px;border-radius:10px;">
                Reply to ${safeName}
              </a>
              <p style="margin:16px 0 0;font-size:12px;line-height:1.5;color:#7B8494;">
                Tip: use Reply in your client — Reply-To is already set to the sender.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 28px 24px;border-top:1px solid rgba(255,255,255,0.08);background-color:#0F1217;">
              <p style="margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#7B8494;">
                ${escapeHtml(siteConfig.name)} · Software Engineer
              </p>
              <p style="margin:8px 0 0;font-size:12px;line-height:1.5;color:#7B8494;">
                <a href="${escapeHtml(siteUrl)}" style="color:#3D82E6;text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>
                &nbsp;·&nbsp; Amman, Jordan
              </p>
            </td>
          </tr>
        </table>

        <p style="margin:20px 0 0;max-width:560px;font-size:11px;line-height:1.5;color:#5A6470;text-align:center;">
          Automated notification from your portfolio contact form. Do not share this inbox publicly.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildContactEmailText(payload: ContactEmailPayload): string {
  const when = formatWhen(payload.receivedAt ?? new Date());
  return [
    'New portfolio enquiry',
    '=====================',
    '',
    `From: ${payload.name} <${payload.email}>`,
    `Subject: ${payload.subject}`,
    `Received: ${when} (Asia/Amman)`,
    '',
    'Message',
    '-------',
    payload.message,
    '',
    `Site: ${siteConfig.url}`,
  ].join('\n');
}
