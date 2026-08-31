'use client';

import { FormEvent, useMemo, useState } from 'react';
import { parseEmail } from '@ori6in/shared';

type ProgramOption = { slug: string; title: string };

type Props = {
  programs?: ProgramOption[];
  defaultProgram?: string;
};

export function QuoteForm({ programs = [], defaultProgram = '' }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [program, setProgram] = useState(defaultProgram);
  const [message, setMessage] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  const emailCheck = useMemo(() => parseEmail(email), [email]);
  const emailHint =
    emailTouched && email.trim() && !emailCheck.ok ? emailCheck.message : null;
  const canSubmit =
    name.trim().length >= 2 && emailCheck.ok && status !== 'loading';

  function touchField() {
    if (status === 'done' || status === 'error') {
      setStatus('idle');
      setFeedback('');
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailTouched(true);
    setFeedback('');

    if (!canSubmit) {
      setStatus('error');
      setFeedback(
        name.trim().length < 2
          ? 'Please enter your name.'
          : emailCheck.ok
            ? 'Check the form and try again.'
            : emailCheck.message,
      );
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: emailCheck.ok ? emailCheck.email : email,
          phone: phone.trim(),
          program: program.trim(),
          message: message.trim(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setStatus('error');
        setFeedback(data.message || 'Something went wrong. Try again.');
        return;
      }
      setStatus('done');
      setFeedback('Thanks — our counsellors will reply with a personalised quote shortly.');
      setName('');
      setEmail('');
      setPhone('');
      setProgram(defaultProgram);
      setMessage('');
      setEmailTouched(false);
    } catch {
      setStatus('error');
      setFeedback('Network error. Try again in a moment.');
    }
  }

  return (
    <form className="quote-form" onSubmit={onSubmit} noValidate>
      <div className="quote-form__grid">
        <label className="quote-form__field">
          <span>Full name</span>
          <input
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => {
              touchField();
              setName(e.target.value);
            }}
            placeholder="Your name"
            required
          />
        </label>
        <label className="quote-form__field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              touchField();
              setEmail(e.target.value);
            }}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@example.com"
            required
            aria-invalid={emailHint ? true : undefined}
          />
          {emailHint ? <em className="quote-form__hint">{emailHint}</em> : null}
        </label>
        <label className="quote-form__field">
          <span>Phone (optional)</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              touchField();
              setPhone(e.target.value);
            }}
            placeholder="+91 …"
          />
        </label>
        <label className="quote-form__field">
          <span>Program interest</span>
          <select
            name="program"
            value={program}
            onChange={(e) => {
              touchField();
              setProgram(e.target.value);
            }}
          >
            <option value="">Not sure yet — advise me</option>
            {programs.map((p) => (
              <option key={p.slug} value={p.title}>
                {p.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="quote-form__field quote-form__field--full">
        <span>Tell us about your goals (optional)</span>
        <textarea
          name="message"
          rows={4}
          value={message}
          onChange={(e) => {
            touchField();
            setMessage(e.target.value);
          }}
          placeholder="Destination, degree level, intake, or any questions…"
        />
      </label>

      <div className="quote-form__actions">
        <button className="btn btn-accent" type="submit" disabled={!canSubmit || status === 'done'}>
          {status === 'loading' ? 'Sending…' : status === 'done' ? 'Request sent' : 'Get a quote'}
        </button>
        {feedback ? (
          <p className={`quote-form__status${status === 'error' ? ' is-error' : ''}`} role="status">
            {feedback}
          </p>
        ) : (
          <p className="quote-form__note">No public price list — we quote based on your profile.</p>
        )}
      </div>
    </form>
  );
}
