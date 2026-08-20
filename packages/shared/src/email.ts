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

  const providerHint = suggestMajorProvider(domain);
  if (providerHint) {
    return {
      ok: false,
      message: `Did you mean ${local}@${providerHint}?`,
    };
  }

  return { ok: true, email };
}

/** Well-known inbox providers — incomplete / typo domains should not pass. */
const MAJOR_PROVIDERS: Array<{ domain: string; stems: string[] }> = [
  { domain: 'gmail.com', stems: ['gmail'] },
  { domain: 'googlemail.com', stems: ['googlemail'] },
  { domain: 'yahoo.com', stems: ['yahoo'] },
  { domain: 'outlook.com', stems: ['outlook'] },
  { domain: 'hotmail.com', stems: ['hotmail'] },
  { domain: 'live.com', stems: ['live'] },
  { domain: 'icloud.com', stems: ['icloud'] },
  { domain: 'me.com', stems: ['me'] },
  { domain: 'proton.me', stems: ['proton'] },
  { domain: 'protonmail.com', stems: ['protonmail'] },
  { domain: 'aol.com', stems: ['aol'] },
  { domain: 'zoho.com', stems: ['zoho'] },
  { domain: 'rediffmail.com', stems: ['rediffmail'] },
];

const PROVIDER_TYPOS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.con': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'googlemail.co': 'googlemail.com',
  'hotmal.com': 'hotmail.com',
  'hotnail.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outllok.com': 'outlook.com',
  'outlokk.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'icloud.co': 'icloud.com',
  'protonmail.co': 'protonmail.com',
};

function suggestMajorProvider(domain: string): string | null {
  if (PROVIDER_TYPOS[domain]) return PROVIDER_TYPOS[domain];

  // Exact known provider (and common Yahoo regional) is fine.
  if (
    MAJOR_PROVIDERS.some((p) => p.domain === domain) ||
    domain === 'yahoo.co.in' ||
    domain === 'yahoo.co.uk'
  ) {
    return null;
  }

  const labels = domain.split('.');
  const tld = labels[labels.length - 1] ?? '';
  const sld = labels.length >= 2 ? labels[labels.length - 2] : '';

  for (const provider of MAJOR_PROVIDERS) {
    const providerHost = provider.domain;
    const providerLabels = provider.domain.split('.');
    const providerSld = providerLabels[0] ?? '';
    const providerTld = providerLabels.slice(1).join('.');

    // Incomplete stem: gm / gma / gmai / yaho / outloo …
    for (const stem of provider.stems) {
      if (sld.length >= 2 && sld.length < stem.length && stem.startsWith(sld)) {
        return providerHost;
      }
    }

    // Full provider name with wrong TLD: gmail.co, outlook.org, …
    if (labels.length === 2 && sld === providerSld && tld !== providerTld) {
      return providerHost;
    }
  }

  return null;
}
