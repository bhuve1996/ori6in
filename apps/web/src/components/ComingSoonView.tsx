'use client';

import { FormEvent, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { parseEmail } from '@ori6in/shared';
import { BRAND } from '../lib/media';
import { SITE_NAME } from '../lib/site';

export function ComingSoonView() {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const emailCheck = useMemo(() => parseEmail(email), [email]);
  const emailOk = emailCheck.ok;
  const emailHint =
    emailTouched && email.trim() && !emailOk
      ? emailCheck.message
      : null;
  const canSubmit =
    emailOk && status !== 'loading' && status !== 'done';

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setEmailTouched(true);
    setMessage('');

    if (!canSubmit) {
      const parsed = parseEmail(email);
      setStatus('error');
      setMessage(parsed.ok ? 'Enter a valid email address' : parsed.message);
      return;
    }

    const parsed = parseEmail(email);
    if (!parsed.ok) {
      setStatus('error');
      setMessage(parsed.message);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: parsed.email, name }),
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        setStatus('error');
        setMessage(data.message || 'Something went wrong. Try again.');
        return;
      }
      setStatus('done');
      setMessage("You're on the list. We'll email you when we open.");
      setEmail('');
      setName('');
      setEmailTouched(false);
    } catch {
      setStatus('error');
      setMessage('Network error. Try again in a moment.');
    }
  }

  return (
    <main id="main-content" className="coming-soon">
      <div className="coming-soon__glow" aria-hidden />
      <div className="coming-soon__grain" aria-hidden />

      <div className="coming-soon__stage">
        <motion.div
          className="coming-soon__brand"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            className="coming-soon__logo"
            src={BRAND.logoDark}
            alt={SITE_NAME}
            width={280}
            height={112}
          />
        </motion.div>

        <motion.div
          className="coming-soon__copy"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="coming-soon__title type-display">Coming soon</h1>
          <p className="coming-soon__lead type-lead">
            Mentorship, real programs, and internships — launching shortly. Register to get
            notified the moment we open.
          </p>
        </motion.div>

        <motion.form
          className="coming-soon__form"
          onSubmit={onSubmit}
          noValidate
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
        >
          <label className="coming-soon__field">
            <span className="sr-only">Name</span>
            <input
              name="name"
              placeholder="Your name"
              autoComplete="name"
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === 'loading' || status === 'done'}
            />
          </label>
          <label className="coming-soon__field">
            <span className="sr-only">Email</span>
            <input
              name="email"
              type="text"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="Email address"
              autoComplete="email"
              required
              maxLength={254}
              spellCheck={false}
              aria-invalid={emailTouched && !emailOk ? true : undefined}
              aria-describedby={
                emailHint || message ? 'coming-soon-msg' : undefined
              }
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailTouched(true);
                if (status === 'error') {
                  setStatus('idle');
                  setMessage('');
                }
              }}
              onBlur={() => setEmailTouched(true)}
              disabled={status === 'loading' || status === 'done'}
            />
          </label>
          <button
            className="btn btn-accent"
            type="submit"
            disabled={!canSubmit}
            aria-disabled={!canSubmit}
            title={
              !email.trim()
                ? 'Enter your email address'
                : !emailOk
                  ? emailCheck.message
                  : undefined
            }
          >
            {status === 'loading' ? 'Saving…' : status === 'done' ? 'Registered' : 'Notify me'}
          </button>
          {emailHint || message ? (
            <p
              id="coming-soon-msg"
              className={
                emailHint || status === 'error'
                  ? 'coming-soon__msg is-error'
                  : 'coming-soon__msg'
              }
              role="status"
            >
              {emailHint || message}
            </p>
          ) : null}
        </motion.form>
      </div>

      <motion.aside
        className="coming-soon__reveal"
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0, x: 28 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="coming-soon__reveal-curtain" />
        <p className="coming-soon__reveal-text">
          <span>Revealing</span>
          <span>soon</span>
        </p>
        <span className="coming-soon__reveal-shimmer" />
      </motion.aside>
    </main>
  );
}
