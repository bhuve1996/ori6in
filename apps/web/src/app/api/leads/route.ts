import { NextResponse } from 'next/server';
import {
  CATALOGUE,
  COMPANY,
  INTEREST_OPTIONS,
  LEAD_SOURCES,
  parseEmail,
  type LeadKind,
} from '@ori6in/shared';
import { isNotifyMailConfigured, sendQuoteRequest } from '../../../lib/notify-mail';

const KINDS: LeadKind[] = ['discovery', 'brochure', 'quote', 'contact', 'eligibility'];
const INTEREST = new Set<string>(INTEREST_OPTIONS);
const PROGRAMMES = new Set(CATALOGUE.map((item) => item.label));

type Body = {
  kind?: string;
  name?: string;
  email?: string;
  phone?: string;
  interest?: string;
  programme?: string;
  qualification?: string;
  notes?: string;
  message?: string;
  consent?: boolean;
  eligibility?: Record<string, string>;
};

function asKind(raw: unknown): LeadKind | null {
  return typeof raw === 'string' && KINDS.includes(raw as LeadKind) ? (raw as LeadKind) : null;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const kind = asKind(body.kind);
  if (!kind) {
    return NextResponse.json({ message: 'Unknown form type.' }, { status: 400 });
  }

  if (body.consent !== true) {
    return NextResponse.json({ message: 'Please accept the data-consent line.' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
  if (name.length < 2) {
    return NextResponse.json({ message: 'Please enter your name.' }, { status: 400 });
  }

  const phone =
    typeof body.phone === 'string' ? body.phone.trim().replace(/\s+/g, ' ').slice(0, 30) : '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10) {
    return NextResponse.json({ message: 'Please enter a phone / WhatsApp number.' }, { status: 400 });
  }

  const emailRaw = typeof body.email === 'string' ? body.email.trim() : '';
  let email = '';
  if (emailRaw || kind === 'eligibility') {
    const parsed = parseEmail(emailRaw);
    if (!parsed.ok) {
      return NextResponse.json({ message: parsed.message }, { status: 400 });
    }
    email = parsed.email;
  }

  const interest = typeof body.interest === 'string' ? body.interest.trim() : '';
  if (interest && !INTEREST.has(interest)) {
    return NextResponse.json({ message: 'Choose a listed interest.' }, { status: 400 });
  }

  const programme = typeof body.programme === 'string' ? body.programme.trim() : '';
  if (programme && !PROGRAMMES.has(programme)) {
    return NextResponse.json({ message: 'Choose a listed programme.' }, { status: 400 });
  }

  const qualification =
    typeof body.qualification === 'string' ? body.qualification.trim().slice(0, 120) : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 1000) : '';
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';

  const eligibility =
    body.eligibility && typeof body.eligibility === 'object'
      ? Object.entries(body.eligibility)
          .map(([k, v]) => `${k}: ${String(v)}`)
          .join('; ')
      : '';

  const extra = [notes, eligibility].filter(Boolean).join('\n');

  if (!isNotifyMailConfigured()) {
    console.warn('[leads] mail not configured; accepting without send', {
      kind,
      email: email || undefined,
      programme,
    });
    return NextResponse.json({ ok: true, queued: true });
  }

  try {
    const result = await sendQuoteRequest({
      name,
      email,
      phone,
      program: programme || undefined,
      interest: interest || undefined,
      qualification: qualification || undefined,
      message: message || undefined,
      extra: extra || undefined,
      kind,
      source: LEAD_SOURCES[kind],
      at: new Date().toISOString(),
    });
    console.info('[leads] sent', { kind, email: email || undefined, provider: result.provider });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[leads] send failed', err);
    return NextResponse.json(
      { message: `Could not send your request. Please email ${COMPANY.email}.` },
      { status: 502 },
    );
  }
}
