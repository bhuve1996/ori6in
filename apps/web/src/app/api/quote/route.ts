import { NextResponse } from 'next/server';
import { parseEmail } from '@ori6in/shared';
import { isNotifyMailConfigured, sendQuoteRequest } from '../../../lib/notify-mail';

type Body = {
  name?: string;
  email?: string;
  phone?: string;
  program?: string;
  message?: string;
};

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 80) : '';
  if (name.length < 2) {
    return NextResponse.json({ message: 'Please enter your name.' }, { status: 400 });
  }

  const parsed = parseEmail(body.email);
  if (!parsed.ok) {
    return NextResponse.json({ message: parsed.message }, { status: 400 });
  }

  const phone =
    typeof body.phone === 'string' ? body.phone.trim().replace(/\s+/g, ' ').slice(0, 30) : '';
  const program =
    typeof body.program === 'string' ? body.program.trim().slice(0, 120) : '';
  const message =
    typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : '';

  if (!isNotifyMailConfigured()) {
    console.warn('[quote] mail not configured; accepting quote without send', {
      email: parsed.email,
      program,
    });
    return NextResponse.json({ ok: true, queued: true });
  }

  try {
    const result = await sendQuoteRequest({
      name,
      email: parsed.email,
      phone: phone || undefined,
      program: program || undefined,
      message: message || undefined,
      at: new Date().toISOString(),
    });
    console.info('[quote] sent', { email: parsed.email, provider: result.provider });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[quote] send failed', err);
    return NextResponse.json(
      { message: 'Could not send your request. Please email enquiry@ori6ineducation.com.' },
      { status: 502 },
    );
  }
}
