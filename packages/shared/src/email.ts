/** Practical email checks for signup / notify forms (not full RFC 5322). */

const LOCAL_RE = /^[a-z0-9](?:[a-z0-9._+-]*[a-z0-9])?$/i;
const DOMAIN_LABEL_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
const TLD_RE = /^[a-z]{2,24}$/i;

/** Domains that are not usable inboxes for waitlist signup. */
const BLOCKED_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'localhost',
  'invalid',
  'local',
  'domain.com',
]);

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function isValidEmail(raw: string): boolean {
  return parseEmail(raw).ok;
}

export type EmailParseResult =
  | { ok: true; email: string }
  | { ok: false; message: string };

/**
 * Normalize + validate an email for waitlist / auth-style forms.
 * Returns a clear user-facing message when invalid.
 */
export function parseEmail(raw: unknown): EmailParseResult {
  if (typeof raw !== 'string') {
    return { ok: false, message: 'Enter a valid email address' };
  }

  const email = normalizeEmail(raw);
  if (!email) {
    return { ok: false, message: 'Enter your email address' };
  }

  if (email.length > 254) {
    return { ok: false, message: 'Email address is too long' };
  }

  // Any whitespace (including in the middle) is invalid.
  if (/\s/.test(raw) || /\s/.test(email)) {
    return { ok: false, message: 'Email cannot contain spaces' };
  }

  // Reject symbols that show up in typos / junk input ($, <, >, etc.).
  if (/[^a-z0-9.@_+-]/i.test(email)) {
    return {
      ok: false,
      message: 'Email can only use letters, numbers, and . _ + -',
    };
  }

  if (email.includes('..') || email.includes('@@')) {
    return { ok: false, message: 'Enter a valid email address' };
  }

  if (!email.includes('@') || email.split('@').length !== 2) {
    return { ok: false, message: 'Email must look like you@gmail.com' };
  }

  const [local, domain] = email.split('@');
  if (!local || !domain) {
    return { ok: false, message: 'Enter a valid email address' };
  }

  if (local.length < 2) {
    return { ok: false, message: 'Enter a complete email address' };
  }

  if (local.length > 64) {
    return { ok: false, message: 'Email address is too long' };
  }

  if (!LOCAL_RE.test(local)) {
    return { ok: false, message: 'Enter a valid email address' };
  }

  const labels = domain.split('.');
  if (labels.length < 2) {
    return {
      ok: false,
      message: 'Email domain looks incomplete (check .com / .in etc.)',
    };
  }

  for (const label of labels) {
    if (!label || !DOMAIN_LABEL_RE.test(label)) {
      return { ok: false, message: 'Enter a valid email address' };
    }
  }

  const tld = labels[labels.length - 1] ?? '';
  if (!TLD_RE.test(tld)) {
    return {
      ok: false,
      message: 'Email domain looks incomplete (check .com / .in etc.)',
    };
  }

  // Reject junk like a@g.com — name + domain labels (before TLD) need real length.
  const nameLabels = labels.slice(0, -1);
  if (nameLabels.some((label) => label.length < 2)) {
    return { ok: false, message: 'Enter a complete email address' };
  }

  if (BLOCKED_DOMAINS.has(domain) || BLOCKED_DOMAINS.has(labels.slice(-2).join('.'))) {
    return { ok: false, message: 'Use your real email address' };
  }

  // Common typo domains
  const typoHints: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gamil.com': 'gmail.com',
    'gnail.com': 'gmail.com',
    'gmail.co': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotnail.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'outllok.com': 'outlook.com',
    'yaho.com': 'yahoo.com',
    'yahooo.com': 'yahoo.com',
  };
  if (typoHints[domain]) {
    return {
      ok: false,
      message: `Did you mean ${local}@${typoHints[domain]}?`,
    };
  }

  return { ok: true, email };
}
