import nodemailer from 'nodemailer';
import { absoluteUrl, getSiteUrl, SITE_NAME, SITE_PHONE, SITE_TAGLINE } from './site';
import {
  isZohoMailApiConfigured,
  isZohoMailConfigured,
  isZohoSmtpConfigured,
  sendViaZohoMailApi,
} from './zoho-mail';

export const COMING_SOON_NOTIFY_TO =
  process.env.COMING_SOON_NOTIFY_TO?.trim() || 'enquiry@ori6ineducation.com';

export type ComingSoonSignup = {
  email: string;
  name?: string;
  at: string;
};

function publicAsset(path: string) {
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

function fromAddress() {
  return (
    process.env.NOTIFY_FROM_EMAIL?.trim() ||
    `ORI6IN <${process.env.SMTP_USER?.trim() || 'enquiry@ori6ineducation.com'}>`
  );
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
<body style="margin:0;padding:0;background:#f4efe4;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe4;padding:24px 12px;">
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
              <p style="margin:12px 0 0;color:#d3a150;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;font-family:Arial,Helvetica,sans-serif;">
                ${escapeHtml(SITE_TAGLINE)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 8px;">
              <p style="margin:0;color:#fbf7ef;font-size:22px;font-weight:700;font-family:Arial,Helvetica,sans-serif;letter-spacing:-0.02em;">
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
                    <p style="margin:0 0 12px;color:#c9a361;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">Details</p>
                    <p style="margin:0 0 10px;color:#fcfaf5;font-size:15px;line-height:1.45;">
                      <span style="color:#9a8f80;">Name</span><br/>
                      <strong>${escapeHtml(name)}</strong>
                    </p>
                    <p style="margin:0 0 10px;color:#fcfaf5;font-size:15px;line-height:1.45;">
                      <span style="color:#9a8f80;">Email</span><br/>
                      <a href="mailto:${escapeHtml(signup.email)}" style="color:#c9a361;text-decoration:none;"><strong>${escapeHtml(signup.email)}</strong></a>
                    </p>
                    <p style="margin:0;color:#fcfaf5;font-size:15px;line-height:1.45;">
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
                 style="display:inline-block;background:#d3a150;color:#0c0c0c;text-decoration:none;font-weight:700;font-size:14px;padding:12px 22px;border-radius:8px;">
                Reply to ${escapeHtml(name)}
              </a>
              <p style="margin:16px 0 0;color:#6e655a;font-size:12px;line-height:1.45;">
                Reply-To is already set to this visitor.<br/>
                <a href="${escapeHtml(siteUrl)}" style="color:#d3a150;text-decoration:none;">${escapeHtml(siteUrl.replace(/^https?:\/\//, ''))}</a>
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

async function sendViaZohoSmtp(signup: ComingSoonSignup) {
  if (!isZohoSmtpConfigured()) return false;

  const host = process.env.SMTP_HOST!.trim();
  const user = process.env.SMTP_USER!.trim();
  const pass = process.env.SMTP_PASS!.trim();
  const { subject, text, html } = mailBody(signup);

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
        to: COMING_SOON_NOTIFY_TO,
        replyTo: signup.email,
        subject,
        text,
        html,
      });
      return true;
    } catch (err) {
      lastError = err;
      console.warn(
        `[notify] Zoho SMTP failed ${target.host}:${target.port}`,
        err instanceof Error ? err.message : err,
      );
    }
  }

  // On Railway Hobby SMTP is blocked — fall through to Zoho Mail API if configured.
  if (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_ENVIRONMENT_NAME) {
    return false;
  }
  throw lastError instanceof Error
    ? lastError
    : new Error('Zoho SMTP send failed');
}

/** Sends signup details to COMING_SOON_NOTIFY_TO via Zoho only. */
export async function sendComingSoonNotify(signup: ComingSoonSignup) {
  const { subject, text, html } = mailBody(signup);
  const errors: string[] = [];

  // Prefer Zoho Mail HTTPS API (Railway Hobby blocks SMTP).
  if (isZohoMailApiConfigured()) {
    try {
      await sendViaZohoMailApi({
        to: COMING_SOON_NOTIFY_TO,
        fromEmail: fromAddress(),
        subject,
        text,
        html,
        replyTo: signup.email,
      });
      return { provider: 'zoho-api' as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
      console.warn('[notify] Zoho Mail API failed', msg);
    }
  }

  try {
    if (await sendViaZohoSmtp(signup)) {
      return { provider: 'zoho-smtp' as const };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
  }

  throw new Error(
    errors[0] ||
      'Zoho mail is not ready for this host. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, and ZOHO_ACCOUNT_ID (Mail API — required on Railway Hobby), or use Zoho SMTP locally / on Railway Pro.',
  );
}

export function isNotifyMailConfigured() {
  return isZohoMailConfigured();
}

export type QuoteRequest = {
  name: string;
  email: string;
  phone?: string;
  program?: string;
  message?: string;
  at: string;
  kind?: string;
  source?: string;
  interest?: string;
  qualification?: string;
  extra?: string;
};

function quoteMailBody(quote: QuoteRequest) {
  const when = formatWhen(quote.at);
  const logoUrl = publicAsset('/brand/logo-dark.png');
  const siteUrl = absoluteUrl('/').includes('localhost')
    ? 'https://www.ori6ineducation.com'
    : absoluteUrl('/');
  const kindLabel = quote.kind || 'quote';
  const subject = `${SITE_NAME} ${kindLabel} — ${quote.name}`;

  const text = [
    `New ${SITE_NAME} lead (${kindLabel})`,
    '',
    `Source: ${quote.source || '(not specified)'}`,
    `Name: ${quote.name}`,
    `Email: ${quote.email || '(not provided)'}`,
    `Phone: ${quote.phone || '(not provided)'}`,
    `Interest: ${quote.interest || '(not specified)'}`,
    `Programme: ${quote.program || '(not specified)'}`,
    `Class / qualification: ${quote.qualification || '(not specified)'}`,
    `Message: ${quote.message || '(none)'}`,
    `Notes: ${quote.extra || '(none)'}`,
    `Time: ${when}`,
    '',
    `Call from ${SITE_PHONE} within one working day.`,
    siteUrl,
  ].join('\n');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f4efe4;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe4;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#0c0c0c;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px;text-align:center;">
          <img src="${escapeHtml(logoUrl)}" width="180" alt="${escapeHtml(SITE_NAME)}" style="display:inline-block;width:180px;height:auto;" />
          <p style="margin:12px 0 0;color:#d3a150;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;">${escapeHtml(SITE_TAGLINE)}</p>
        </td></tr>
        <tr><td style="padding:0 28px 8px;">
          <p style="margin:0;color:#fbf7ef;font-size:22px;font-weight:700;">New ${escapeHtml(kindLabel)}</p>
          <p style="margin:8px 0 0;color:#d4c4a8;font-size:14px;line-height:1.5;">A visitor submitted a website lead. Call from ${escapeHtml(SITE_PHONE)} within one working day.</p>
        </td></tr>
        <tr><td style="padding:16px 28px 28px;">
          <table role="presentation" width="100%" style="background:#1a1510;border-radius:12px;color:#fcfaf5;font-size:14px;">
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2a241c;"><strong>Source</strong><br/>${escapeHtml(quote.source || '—')}</td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2a241c;"><strong>Name</strong><br/>${escapeHtml(quote.name)}</td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2a241c;"><strong>Email</strong><br/>${escapeHtml(quote.email || '—')}</td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2a241c;"><strong>Phone</strong><br/>${escapeHtml(quote.phone || '—')}</td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2a241c;"><strong>Interest</strong><br/>${escapeHtml(quote.interest || '—')}</td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2a241c;"><strong>Programme</strong><br/>${escapeHtml(quote.program || '—')}</td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2a241c;"><strong>Class / qualification</strong><br/>${escapeHtml(quote.qualification || '—')}</td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2a241c;"><strong>Message</strong><br/>${escapeHtml(quote.message || '—')}</td></tr>
            <tr><td style="padding:14px 16px;"><strong>Notes</strong><br/>${escapeHtml(quote.extra || '—')}</td></tr>
          </table>
          <p style="margin:16px 0 0;color:#8b6240;font-size:11px;">${escapeHtml(SITE_NAME)} · ${escapeHtml(kindLabel)} · ${escapeHtml(when)}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();

  return { subject, text, html };
}

/** Sends a quote enquiry to COMING_SOON_NOTIFY_TO via Zoho. */
export async function sendQuoteRequest(quote: QuoteRequest) {
  const { subject, text, html } = quoteMailBody(quote);
  const errors: string[] = [];

  if (isZohoMailApiConfigured()) {
    try {
      await sendViaZohoMailApi({
        to: COMING_SOON_NOTIFY_TO,
        fromEmail: fromAddress(),
        subject,
        text,
        html,
        replyTo: quote.email || undefined,
      });
      return { provider: 'zoho-api' as const };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
      console.warn('[quote] Zoho Mail API failed', msg);
    }
  }

  if (isZohoSmtpConfigured()) {
    try {
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
            to: COMING_SOON_NOTIFY_TO,
            replyTo: quote.email || undefined,
            subject,
            text,
            html,
          });
          return { provider: 'zoho-smtp' as const };
        } catch (err) {
          lastError = err;
        }
      }
      if (lastError) throw lastError;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(msg);
      console.warn('[quote] Zoho SMTP failed', msg);
    }
  }

  throw new Error(errors[0] || 'Mail is not configured for quote requests.');
}
