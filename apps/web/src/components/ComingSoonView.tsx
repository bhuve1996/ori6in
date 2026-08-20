'use client';

import { FormEvent, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { SITE_NAME, SITE_TAGLINE } from '../lib/site';
import { ComingSoonToggle } from './ComingSoonToggle';

/**
 * Soft-launch page intentionally does not load logo / owl assets.
 * Veiled CSS shapes only — nothing to unblur or download in DevTools.
 */
export function ComingSoonView() {
  const reduceMotion = useReducedMotion();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
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
    } catch {
      setStatus('error');
      setMessage('Network error. Try again in a moment.');
    }
  }

  return (
    <main id="main-content" className="coming-soon">
      <div className="coming-soon__glow" aria-hidden />
      <div className="coming-soon__grain" aria-hidden />

      <ComingSoonToggle />

      <div className="coming-soon__stage">
        <motion.div
          className="coming-soon__brand"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="coming-soon__mark" aria-label={SITE_NAME}>
            <span className="coming-soon__mark-veil" aria-hidden />
          </div>
          <p className="coming-soon__tagline type-kicker">{SITE_TAGLINE}</p>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={status === 'loading' || status === 'done'}
            />
          </label>
          <label className="coming-soon__field">
            <span className="sr-only">Email</span>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading' || status === 'done'}
            />
          </label>
          <button
            className="btn btn-accent"
            type="submit"
            disabled={status === 'loading' || status === 'done'}
          >
            {status === 'loading' ? 'Saving…' : status === 'done' ? 'Registered' : 'Notify me'}
          </button>
          {message ? (
            <p
              className={status === 'error' ? 'coming-soon__msg is-error' : 'coming-soon__msg'}
              role="status"
            >
              {message}
            </p>
          ) : null}
        </motion.form>
      </div>

      <motion.div
        className="coming-soon__mascot"
        aria-hidden
        initial={reduceMotion ? false : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="coming-soon__mascot-veil" />
      </motion.div>
    </main>
  );
}
