import nodemailer from 'nodemailer';
import {
  isZohoMailApiConfigured,
  isZohoMailConfigured,
  isZohoSmtpConfigured,
  sendViaZohoMailApi,
} from './zoho-mail';

const SITE_NAME = 'ORI6IN';
const SITE_TAGLINE = 'Everything starts here.';

export function isOutboundMailConfigured() {
  return isZohoMailConfigured();
}

function siteBase() {
  const raw =
    process.env.WEB_URL?.trim() ||
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    'https://www.ori6ineducation.com';
  const withProtocol = raw.startsWith('http') ? raw : `https://${raw}`;
  const base = withProtocol.replace(/\/$/, '');
  return base.includes('localhost') ? 'https://www.ori6ineducation.com' : base;
}

function publicAsset(path: string) {
  const base = siteBase();
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function fromAddress() {
  return (
    process.env.NOTIFY_FROM_EMAIL?.trim() ||
    `ORI6IN <${process.env.SMTP_USER?.trim() || 'enquiry@ori6ineducation.com'}>`
  );
}

type LiveMail = {
  email: string;
  name?: string | null;
};

function liveMailBody(recipient: LiveMail) {
  const first = recipient.name?.trim().split(/\s+/)[0] || 'there';
  const logoUrl = publicAsset('/brand/logo-dark.png');
  const bannerUrl = publicAsset('/banners/about.jpg');
  const siteUrl = siteBase();
  const subject = `${SITE_NAME} is live — welcome in`;

  const text = [
    `Hi ${first},`,
    '',
    `${SITE_NAME} is open.`,
    SITE_TAGLINE,
    '',
    `Visit us: ${siteUrl}`,
    '',
    `Thanks for waiting with us.`,
    `— ${SITE_NAME}`,
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f3ebe0;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3ebe0;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0c0c0c;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="padding:0;line-height:0;">
              <img src="${escapeHtml(bannerUrl)}" width="560" alt="" style="display:block;width:100%;max-height:160px;object-fit:cover;" />
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px 28px;text-align:center;">
              <img src="${escapeHtml(logoUrl)}" width="200" alt="${escapeHtml(SITE_NAME)}" style="display:inline-block;width:200px;height:auto;max-width:70%;" />
              <p style="margin:12px 0 0;color:#c2a772;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
                ${escapeHtml(SITE_TAGLINE)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 8px;font-family:Arial,Helvetica,sans-serif;">
              <p style="margin:0;color:#fffcf7;font-size:22px;font-weight:700;letter-spacing:-0.02em;">
                We're live, ${escapeHtml(first)}
              </p>
              <p style="margin:12px 0 0;color:#d4c4a8;font-size:15px;line-height:1.55;">
                Thanks for signing up on our coming soon page. ${escapeHtml(SITE_NAME)} is open — explore programs, mentorship, and internships.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
              <a href="${escapeHtml(siteUrl)}"
                 style="display:inline-block;background:#c2a772;color:#0c0c0c;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:8px;">
                Visit ${escapeHtml(SITE_NAME)}
              </a>
              <p style="margin:16px 0 0;color:#6e655a;font-size:12px;line-height:1.45;">
                <a href="${escapeHtml(siteUrl)}" style="color:#c2a772;text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;color:#8b6240;font-size:11px;font-family:Arial,Helvetica,sans-serif;">
          ${escapeHtml(SITE_NAME)} · You asked to be notified when we opened.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  return { subject, text, html };
}

function smtpTargets(host: string) {
  const preferredPort = Number(process.env.SMTP_PORT || 465);
  const preferredSecure =
    process.env.SMTP_SECURE === 'true' ||
    process.env.SMTP_SECURE === '1' ||
    preferredPort === 465;
  const primary = { host, port: preferredPort, secure: preferredSecure };
  const fallback =
    preferredPort === 465
      ? { host, port: 587, secure: false }
      : { host, port: 465, secure: true };
  return [primary, fallback];
}

async function sendViaZohoSmtp(to: string, subject: string, text: string, html: string) {
  if (!isZohoSmtpConfigured()) return false;

  const host = process.env.SMTP_HOST!.trim();
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();

  let lastError: unknown;
  for (const target of smtpTargets(host)) {
    try {
      const transporter = nodemailer.createTransport({
        host: target.host,
        port: target.port,
        secure: target.secure,
        auth: { user, pass },
        connectionTimeout: 12_000,
        greetingTimeout: 12_000,
        socketTimeout: 20_000,
        requireTLS: !target.secure,
        tls: { minVersion: 'TLSv1.2' },
      });
      await transporter.sendMail({
        from: fromAddress(),
        to,
        subject,
        text,
        html,
      });
      return true;
    } catch (err) {
      lastError = err;
      console.warn(
        `[mailer] Zoho SMTP failed ${target.host}:${target.port}`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_ENVIRONMENT_NAME) {
    return false;
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('Zoho SMTP send failed');
}

/** Sends branded “we're live” email to one waitlist signup via Zoho only. */
export async function sendComingSoonLiveEmail(recipient: LiveMail) {
  const { subject, text, html } = liveMailBody(recipient);
  const errors: string[] = [];

  if (isZohoMailApiConfigured()) {
    try {
      await sendViaZohoMailApi({
        to: recipient.email,
        fromEmail: fromAddress(),
        subject,
        text,
        html,
      });
      return { provider: 'zoho-api' as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
      console.warn('[mailer] Zoho Mail API failed', msg);
    }
  }

  try {
    if (await sendViaZohoSmtp(recipient.email, subject, text, html)) {
      return { provider: 'zoho-smtp' as const };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
  }

  throw new Error(
    errors[0] ||
      'Zoho mail is not ready. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, and ZOHO_ACCOUNT_ID (Mail API — required on Railway Hobby), or Zoho SMTP locally / on Railway Pro.',
  );
}
