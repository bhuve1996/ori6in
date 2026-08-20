import { NextResponse } from 'next/server';
import {
  isNotifyMailConfigured,
  sendComingSoonNotify,
} from '../../../lib/notify-mail';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: string;
  name?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ message: 'Enter a valid email' }, { status: 400 });
  }

  if (!isNotifyMailConfigured()) {
    console.error('[notify] mail not configured');
    return NextResponse.json(
      { message: 'Notify signup is temporarily unavailable. Try again later.' },
      { status: 503 },
    );
  }

  const signup = {
    email,
    name: name || undefined,
    at: new Date().toISOString(),
  };

  try {
    const result = await sendComingSoonNotify(signup);
    console.info('[notify] sent', { email: signup.email, provider: result.provider });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[notify] send failed', err);
    return NextResponse.json(
      { message: 'Could not send your signup. Please try again.' },
      { status: 502 },
    );
  }
}
