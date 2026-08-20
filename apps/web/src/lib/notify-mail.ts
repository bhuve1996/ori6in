import nodemailer from 'nodemailer';
import { absoluteUrl, getSiteUrl, SITE_NAME, SITE_TAGLINE } from './site';

export const COMING_SOON_NOTIFY_TO =
  process.env.COMING_SOON_NOTIFY_TO?.trim() || 'enquiry@ori6ineducation.com';

export type ComingSoonSignup = {
  email: string;
  name?: string;
  at: string;
};

function publicAsset(path: string) {
  // Prefer public site URL so images load in inbox clients (not localhost).
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    (getSiteUrl().includes('localhost') ? 'https://www.ori6ineducation.com' : getSiteUrl());
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function mailBody(signup: ComingSoonSignup) {
  const name = signup.name?.trim() || 'Someone';
  const who = signup.name ? `${signup.name} <${signup.email}>` : signup.email;
  const when = formatWhen(signup.at);
  const logoUrl = publicAsset('/brand/logo-dark.png');
  const bannerUrl = publicAsset('/banners/about.jpg');
  const siteUrl = absoluteUrl('/').includes('localhost')
    ? 'https://www.ori6ineducation.com'
    : absoluteUrl('/');

  const subject = `${SITE_NAME} coming soon — ${signup.email}`;

  const text = [
    `New ${SITE_NAME} coming-soon signup`,
    '',
    `Name: ${signup.name || '(not provided)'}`,
    `Email: ${signup.email}`,
    `Time: ${when}`,
    '',
    `Reply to ${who} when ${SITE_NAME} opens.`,
    siteUrl,
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
            <td style="padding:8px 28px 8px;">
              <p style="margin:0;color:#fffcf7;font-size:22px;font-weight:700;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.02em;">
                New notify signup
              </p>
              <p style="margin:8px 0 0;color:#d4c4a8;font-size:14px;line-height:1.5;font-family:Arial,Helvetica,sans-serif;">
                Someone registered on the coming soon page to hear when ${escapeHtml(SITE_NAME)} opens.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#16120e;border:1px solid #3d3220;border-radius:12px;">
                <tr>
                  <td style="padding:18px 20px;font-family:Arial,Helvetica,sans-serif;">
                    <p style="margin:0 0 12px;color:#9a7b3c;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">Details</p>
                    <p style="margin:0 0 10px;color:#f7f3ec;font-size:15px;line-height:1.45;">
                      <span style="color:#9a8f80;">Name</span><br/>
                      <strong>${escapeHtml(name)}</strong>
                    </p>
                    <p style="margin:0 0 10px;color:#f7f3ec;font-size:15px;line-height:1.45;">
                      <span style="color:#9a8f80;">Email</span><br/>
                      <a href="mailto:${escapeHtml(signup.email)}" style="color:#d4b87a;text-decoration:none;"><strong>${escapeHtml(signup.email)}</strong></a>
                    </p>
                    <p style="margin:0;color:#f7f3ec;font-size:15px;line-height:1.45;">
                      <span style="color:#9a8f80;">Signed up</span><br/>
                      <strong>${escapeHtml(when)}</strong>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 28px 28px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
              <a href="mailto:${escapeHtml(signup.email)}?subject=${encodeURIComponent(`${SITE_NAME} is opening soon`)}"
                 style="display:inline-block;background:#c2a772;color:#0c0c0c;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:8px;">
                Reply to ${escapeHtml(name)}
              </a>
              <p style="margin:16px 0 0;color:#6e655a;font-size:12px;line-height:1.45;">
                Reply-To is already set to this visitor.<br/>
                <a href="${escapeHtml(siteUrl)}" style="color:#c2a772;text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;color:#8b6240;font-size:11px;font-family:Arial,Helvetica,sans-serif;">
          ${escapeHtml(SITE_NAME)} · Coming soon notify
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function sendViaResend(signup: ComingSoonSignup) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from =
    process.env.NOTIFY_FROM_EMAIL?.trim() || 'ORI6IN <onboarding@resend.dev>';
  const { subject, text, html } = mailBody(signup);

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [COMING_SOON_NOTIFY_TO],
      reply_to: signup.email,
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend failed (${res.status}): ${detail.slice(0, 200)}`);
  }
  return true;
}

async function sendViaSmtp(signup: ComingSoonSignup) {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) return false;

  const port = Number(process.env.SMTP_PORT || 587);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const from =
    process.env.NOTIFY_FROM_EMAIL?.trim() ||
    `ORI6IN <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const { subject, text, html } = mailBody(signup);
  await transporter.sendMail({
    from,
    to: COMING_SOON_NOTIFY_TO,
    replyTo: signup.email,
    subject,
    text,
    html,
  });
  return true;
}

/** Sends signup details to COMING_SOON_NOTIFY_TO. */
export async function sendComingSoonNotify(signup: ComingSoonSignup) {
  if (await sendViaResend(signup)) return { provider: 'resend' as const };
  if (await sendViaSmtp(signup)) return { provider: 'smtp' as const };

  throw new Error(
    'Email is not configured. Set RESEND_API_KEY or SMTP_HOST/SMTP_USER/SMTP_PASS.',
  );
}

export function isNotifyMailConfigured() {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() ||
      (process.env.SMTP_HOST?.trim() &&
        process.env.SMTP_USER?.trim() &&
        process.env.SMTP_PASS?.trim()),
  );
}
