/**
 * Zoho-only outbound mail: Mail REST API (HTTPS, works on Railway Hobby)
 * and SMTP (works locally / Railway Pro).
 */

export type ZohoSendInput = {
  to: string;
  fromEmail: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

type ZohoDc = 'in' | 'com' | 'eu' | 'com.au';

function zohoDc(): ZohoDc {
  const raw = (process.env.ZOHO_DC || 'in').trim().toLowerCase();
  if (raw === 'com' || raw === 'eu' || raw === 'com.au' || raw === 'in') return raw;
  const host = process.env.SMTP_HOST?.trim() || '';
  if (host.includes('.eu')) return 'eu';
  if (host.includes('.com.au')) return 'com.au';
  if (host.includes('.com') && !host.includes('.in')) return 'com';
  return 'in';
}

function accountsBase() {
  const dc = zohoDc();
  if (dc === 'eu') return 'https://accounts.zoho.eu';
  if (dc === 'com.au') return 'https://accounts.zoho.com.au';
  if (dc === 'com') return 'https://accounts.zoho.com';
  return 'https://accounts.zoho.in';
}

function mailApiBase() {
  const dc = zohoDc();
  if (dc === 'eu') return 'https://mail.zoho.eu';
  if (dc === 'com.au') return 'https://mail.zoho.com.au';
  if (dc === 'com') return 'https://mail.zoho.com';
  return 'https://mail.zoho.in';
}

function fromEmailOnly(from: string) {
  const m = from.match(/<([^>]+)>/);
  return (m?.[1] || from).trim();
}

let cachedAccess: { token: string; expiresAt: number } | null = null;

async function getZohoAccessToken(): Promise<string | null> {
  const clientId = process.env.ZOHO_CLIENT_ID?.trim();
  const clientSecret = process.env.ZOHO_CLIENT_SECRET?.trim();
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN?.trim();
  if (!clientId || !clientSecret || !refreshToken) return null;

  if (cachedAccess && Date.now() < cachedAccess.expiresAt - 60_000) {
    return cachedAccess.token;
  }

  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });

  const res = await fetch(`${accountsBase()}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };
  if (!res.ok || !json.access_token) {
    throw new Error(
      `Zoho token refresh failed: ${json.error || res.status} ${JSON.stringify(json).slice(0, 180)}`,
    );
  }

  cachedAccess = {
    token: json.access_token,
    expiresAt: Date.now() + (Number(json.expires_in) || 3600) * 1000,
  };
  return cachedAccess.token;
}

export async function sendViaZohoMailApi(input: ZohoSendInput): Promise<boolean> {
  const accountId = process.env.ZOHO_ACCOUNT_ID?.trim();
  const token = await getZohoAccessToken();
  if (!accountId || !token) return false;

  const fromAddress = fromEmailOnly(input.fromEmail);
  const content = input.replyTo
    ? `${input.html}<p style="color:#888;font-size:12px;font-family:Arial,sans-serif">Reply-To: ${input.replyTo}</p>`
    : input.html;

  const res = await fetch(`${mailApiBase()}/api/accounts/${accountId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      fromAddress,
      toAddress: input.to,
      subject: input.subject,
      content,
      mailFormat: 'html',
      encoding: 'UTF-8',
      askReceipt: 'no',
    }),
  });

  const detail = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(`Zoho Mail API failed (${res.status}): ${detail.slice(0, 240)}`);
  }
  return true;
}

export function isZohoMailApiConfigured() {
  return Boolean(
    process.env.ZOHO_CLIENT_ID?.trim() &&
      process.env.ZOHO_CLIENT_SECRET?.trim() &&
      process.env.ZOHO_REFRESH_TOKEN?.trim() &&
      process.env.ZOHO_ACCOUNT_ID?.trim(),
  );
}

export function isZohoSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim(),
  );
}

export function isZohoMailConfigured() {
  return isZohoMailApiConfigured() || isZohoSmtpConfigured();
}
