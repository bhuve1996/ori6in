import { NextResponse } from 'next/server';
import { parseEmail } from '@ori6in/shared';
import {
  isNotifyMailConfigured,
  sendComingSoonNotify,
} from '../../../lib/notify-mail';

type Body = {
  email?: string;
  name?: string;
};

function apiBase() {
  const raw =
    process.env.API_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'http://localhost:3001';
  return raw.replace(/\/$/, '');
}

async function persistSignup(email: string, name?: string) {
  const res = await fetch(`${apiBase()}/api/coming-soon/signups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, name }),
  });
  const data = (await res.json().catch(() => ({}))) as {
    ok?: boolean;
    created?: boolean;
    message?: string;
  };
  if (!res.ok) {
    throw new Error(data.message || `Could not save signup (${res.status})`);
  }
  return data;
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = parseEmail(body.email);
  if (!parsed.ok) {
    return NextResponse.json({ message: parsed.message }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
  const email = parsed.email;

  let created = true;
  try {
    const saved = await persistSignup(email, name || undefined);
    created = saved.created !== false;
  } catch (err) {
    console.error('[notify] persist failed', err);
    return NextResponse.json(
      { message: 'Could not save your signup. Please try again.' },
      { status: 502 },
    );
  }

  if (!isNotifyMailConfigured()) {
    console.warn('[notify] mail not configured; signup saved without ops email');
    return NextResponse.json({ ok: true, created });
  }

  const signup = {
    email,
    name: name || undefined,
    at: new Date().toISOString(),
  };

  try {
    const result = await sendComingSoonNotify(signup);
    console.info('[notify] sent', {
      email: signup.email,
      provider: result.provider,
      created,
    });
    return NextResponse.json({ ok: true, created });
  } catch (err) {
    console.error('[notify] send failed (signup already saved)', err);
    return NextResponse.json(
      {
        message: 'Signup saved, but notify email failed. Please try again.',
        created,
        mailWarning: true,
      },
      { status: 502 },
    );
  }
}
