'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { apiFetch, getStoredRole, getToken } from '../lib/auth';
import { BRAND } from '../lib/media';

type Turn = { role: 'user' | 'assistant'; content: string };

const QUICK = [
  { label: 'Programs', prompt: 'What programs do you offer?' },
  { label: 'How it works', prompt: 'How does ORI6IN work?' },
  { label: 'Pricing', prompt: 'How does pricing work?' },
  { label: 'Get started', prompt: 'How do I get started?' },
] as const;

function localReply(message: string): string {
  const q = message.toLowerCase();
  if (q.includes('program') || q.includes('course') || q.includes('track')) {
    return 'We offer mentored programs like Career Launchpad and AI Foundations. Browse /programs to compare tracks, then enroll when ready.';
  }
  if (q.includes('price') || q.includes('cost') || q.includes('pay') || q.includes('fee')) {
    return 'Pricing is listed on each program and on /pricing. You can check out after creating a student account.';
  }
  if (q.includes('mentor')) {
    return 'Mentors review your weekly work and leave notes. Meet them on /mentors — after you enroll, they guide your path.';
  }
  if (q.includes('intern')) {
    return 'Internships open after you sign in as a student. Build your portfolio in a program, then apply from your portal.';
  }
  if (q.includes('how') || q.includes('work') || q.includes('path')) {
    return 'Student → Mentor → Internship. Enroll, ship weekly work, get mentor reviews, then apply to roles. See /how-it-works and /roles for what each person can do.';
  }
  if (q.includes('start') || q.includes('register') || q.includes('sign')) {
    return 'Create an account at /register, pick a program, and you are in. Demo logins are also on /demo-login if you want a walkthrough.';
  }
  if (q.includes('parent') || q.includes('company')) {
    return 'Parents and companies have their own portals after login. Parents follow progress; companies post roles and review applicants.';
  }
  return 'I am Ori, your ORI6IN guide. Ask about programs, mentors, pricing, or how to get started — or open /programs to explore.';
}

export function OwlAssistant() {
  const pathname = usePathname();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([
    {
      role: 'assistant',
      content: `Hi — I am Ori. ${BRAND.tagline} Ask me anything about programs, mentors, or getting started.`,
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hidden = pathname === '/student/ai';

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
    inputRef.current?.focus();
  }, [open, turns, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setBusy(true);
    setTurns((t) => [...t, { role: 'user', content: trimmed }]);
    setMessage('');

    const token = getToken();
    const role = getStoredRole();
    if (token && role === 'student') {
      const { ok, data } = await apiFetch<{ reply?: string; message?: string }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: trimmed }),
      });
      const reply =
        ok && data.reply
          ? data.reply
          : localReply(trimmed);
      setTurns((t) => [...t, { role: 'assistant', content: reply }]);
    } else {
      await new Promise((r) => window.setTimeout(r, 280));
      setTurns((t) => [...t, { role: 'assistant', content: localReply(trimmed) }]);
    }
    setBusy(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(message);
  }

  if (hidden) return null;

  return (
    <div className="owl-assist" data-open={open ? 'true' : 'false'}>
      {open ? (
        <section
          id={panelId}
          className="owl-assist__panel"
          role="dialog"
          aria-label="Ori, ORI6IN assistant"
          aria-modal="false"
        >
          <header className="owl-assist__head">
            <img src={BRAND.owl} alt="" width={44} height={44} className="owl-assist__avatar" />
            <div>
              <strong>Ori</strong>
              <p>Your ORI6IN guide</p>
            </div>
            <button
              type="button"
              className="owl-assist__close"
              aria-label="Close assistant"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div className="owl-assist__chips" aria-label="Quick questions">
            {QUICK.map((q) => (
              <button
                key={q.label}
                type="button"
                className="owl-assist__chip"
                disabled={busy}
                onClick={() => void send(q.prompt)}
              >
                {q.label}
              </button>
            ))}
          </div>

          <div className="owl-assist__log" ref={listRef}>
            {turns.map((t, i) => (
              <div
                key={`${t.role}-${i}`}
                className={`owl-assist__bubble owl-assist__bubble--${t.role}`}
              >
                {t.content}
              </div>
            ))}
            {busy ? <p className="owl-assist__typing">Ori is thinking…</p> : null}
          </div>

          <form className="owl-assist__form" onSubmit={onSubmit}>
            <textarea
              ref={inputRef}
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask Ori…"
              aria-label="Message Ori"
              disabled={busy}
            />
            <button className="btn accent" type="submit" disabled={busy || !message.trim()}>
              Send
            </button>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        className="owl-assist__fab"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? 'Close Ori assistant' : 'Open Ori assistant'}
        onClick={() => setOpen((v) => !v)}
      >
        <img src={BRAND.owl} alt="" width={56} height={56} />
        <span className="owl-assist__fab-label">Ask Ori</span>
      </button>
    </div>
  );
}
