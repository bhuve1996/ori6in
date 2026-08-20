import nodemailer from 'nodemailer';

export const COMING_SOON_NOTIFY_TO =
  process.env.COMING_SOON_NOTIFY_TO?.trim() || 'rishi@ori6ineducation.com';

export type ComingSoonSignup = {
  email: string;
  name?: string;
  at: string;
};

function mailBody(signup: ComingSoonSignup) {
  const who = signup.name ? `${signup.name} <${signup.email}>` : signup.email;
  return {
    subject: `ORI6IN coming soon — ${signup.email}`,
    text: [
      'New coming-soon notify signup',
      '',
      `Name: ${signup.name || '(not provided)'}`,
      `Email: ${signup.email}`,
      `Time: ${signup.at}`,
      '',
      'Reply to this person to confirm when ORI6IN opens.',
    ].join('\n'),
    html: `
      <p><strong>New coming-soon notify signup</strong></p>
      <p>Name: ${escapeHtml(signup.name || '(not provided)')}<br/>
      Email: <a href="mailto:${escapeHtml(signup.email)}">${escapeHtml(signup.email)}</a><br/>
      Time: ${escapeHtml(signup.at)}</p>
      <p>Reply to <strong>${escapeHtml(who)}</strong> when ORI6IN opens.</p>
    `,
  };
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

/** Sends signup details to COMING_SOON_NOTIFY_TO (default rishi@…). */
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
