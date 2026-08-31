'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { apiFetch, getStoredRole, getToken } from '../lib/auth';
import { BRAND } from '../lib/media';
import { easeOut, softSpring } from '../lib/motion';

type Turn = { role: 'user' | 'assistant'; content: string };

const QUICK = [
  { label: 'Programs', prompt: 'What programs do you offer?' },
  { label: 'Tools', prompt: 'What free tools do you have?' },
  { label: 'Get a quote', prompt: 'How does pricing work?' },
  { label: 'Get started', prompt: 'How do I get started?' },
] as const;

function localReply(message: string): string {
  const q = message.toLowerCase();
  if (q.includes('program') || q.includes('course') || q.includes('track') || q.includes('package')) {
    return 'We offer ORI6IN 360°, Essential / Advantage / Premier admissions packages, test prep (IELTS, GRE, GMAT, and more), plus Visa Assist and Fly. Browse /programs to compare.';
  }
  if (q.includes('price') || q.includes('cost') || q.includes('pay') || q.includes('fee') || q.includes('quote')) {
    return 'We do not publish fixed prices. Request a personalised quote at /pricing — a counsellor will reply based on your profile.';
  }
  if (q.includes('mentor') || q.includes('counsellor') || q.includes('counselor')) {
    return 'Counsellors guide shortlists, essays, and visas. Meet them on /mentors — after you enroll, they guide your path.';
  }
  if (q.includes('visa') || q.includes('fly') || q.includes('abroad') || q.includes('university')) {
    return 'ORI6IN covers study abroad end-to-end: universities, scholarships, visas, and pre-departure. Start with ORI6IN 360° or an admissions package on /programs.';
  }
  if (q.includes('ielts') || q.includes('gre') || q.includes('gmat') || q.includes('toefl') || q.includes('test')) {
    return 'Test prep includes IELTS, TOEFL, PTE, DET, GRE, GMAT, SAT, and German. See /programs, then request a quote at /pricing.';
  }
  if (q.includes('how') || q.includes('work') || q.includes('path')) {
    return 'Dream → Apply → Fly. Discover your path, shortlist and apply, then visa and depart. See /how-it-works.';
  }
  if (q.includes('start') || q.includes('register') || q.includes('sign')) {
    return 'Create an account at /register, or request a quote at /pricing. Demo logins are on /demo-login if you want a walkthrough.';
  }
  if (q.includes('parent') || q.includes('company')) {
    return 'Parents follow progress from their portal after login. Companies can still post internship roles. Students should start with /programs, /tools, or /pricing for a quote.';
  }
  if (q.includes('tool') || q.includes('finder') || q.includes('calculator')) {
    return 'Free tools live at /tools — University Finder, Course Finder, Scholarship Finder, Cost Calculator, Eligibility Checker, and Country Compare.';
  }
  if (q.includes('hub') || q.includes('community')) {
    return 'ORI6IN Student Hub is at /hub — country communities, webinars, and pre-departure resources. Create an account to go deeper.';
  }
  return 'I am Ori, your ORI6IN guide. Ask about programs, tools, quotes, or how to get started — or open /programs and /tools to explore.';
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
      const reply = ok && data.reply ? data.reply : localReply(trimmed);
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
      <AnimatePresence>
        {open ? (
          <motion.section
            key="owl-panel"
            id={panelId}
            className="owl-assist__panel"
            role="dialog"
            aria-label="Ori, ORI6IN assistant"
            aria-modal="false"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.32, ease: easeOut }}
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
              <AnimatePresence initial={false}>
                {turns.map((t, i) => (
                  <motion.div
                    key={`${t.role}-${i}`}
                    className={`owl-assist__bubble owl-assist__bubble--${t.role}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: easeOut }}
                  >
                    {t.content}
                  </motion.div>
                ))}
              </AnimatePresence>
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
              <button className="btn btn-accent" type="submit" disabled={busy || !message.trim()}>
                Send
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        className="owl-assist__fab"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? 'Close Ori assistant' : 'Open Ori assistant'}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ y: -2, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={softSpring}
      >
        <img src={BRAND.owl} alt="" width={56} height={56} />
        <span className="owl-assist__fab-label">Ask Ori</span>
      </motion.button>
    </div>
  );
}
