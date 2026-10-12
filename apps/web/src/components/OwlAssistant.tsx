'use client';

import { COMPANY } from '@ori6in/shared';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { usePathname } from 'next/navigation';
import { apiFetch, getStoredRole, getToken } from '../lib/auth';
import { BRAND } from '../lib/media';
import { easeOut, softSpring } from '../lib/motion';

type Turn = { role: 'user' | 'assistant'; content: string };

const QUICK = [
  { label: 'ED6E', prompt: 'What is ED6E?' },
  { label: 'BRI6GE', prompt: 'What is BRI6GE?' },
  { label: '6LOBAL', prompt: 'How does study-abroad counselling work?' },
  { label: 'Discovery', prompt: 'How do I book a Discovery Session?' },
] as const;

function localReply(message: string): string {
  const q = message.toLowerCase();
  const phone = COMPANY.phoneDisplay;

  if (
    q.includes('ed6e') ||
    q.includes('class 8') ||
    q.includes('class 9') ||
    q.includes('class 10') ||
    q.includes('class 11') ||
    q.includes('class 12') ||
    q.includes('school')
  ) {
    return 'ED6E is the Class 8–12 profile-building programme: Excellence · Direction · Growth · Exposure. One counsellor, a monthly parent letter, and a compounding profile. Read /ed6e or book a free Discovery Session.';
  }
  if (q.includes('bri6ge') || q.includes('ug year') || q.includes('college year')) {
    return 'BRI6GE is the UG Year 1–3 runway from an Indian undergraduate degree to a global master’s — Foundation, Momentum, or Launch. Same counsellor as ED6E. See /bri6ge.';
  }
  if (
    q.includes('6lobal') ||
    q.includes('study abroad') ||
    q.includes('study-abroad') ||
    q.includes('mba') ||
    q.includes('phd')
  ) {
    return '6LOBAL by Edumillenia is admission counselling for UG, master’s, MBA, and PhD — one counsellor from first call to departure. Destinations and tracks: /study-abroad. Every quote is personal to the student.';
  }
  if (
    q.includes('6rip') ||
    q.includes('ielts') ||
    q.includes('toefl') ||
    q.includes('gre') ||
    q.includes('gmat') ||
    q.includes('sat') ||
    q.includes('dmat') ||
    q.includes('german')
  ) {
    return '6RIP is test preparation: IELTS, TOEFL, GRE, GMAT Focus, SAT, German A1–B2, and dMAT for summer 2027. Variants and bundles are on /test-prep. Ask for a quote — fees are not listed publicly.';
  }
  if (q.includes('6rant') || q.includes('grant')) {
    return '6RANT is a ₹25,000 forex credit across counselling, IELTS, offer letter, visa, and campus arrival. It is not on 6RAND. Details live on /terms.';
  }
  if (
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('pay') ||
    q.includes('fee') ||
    q.includes('quote')
  ) {
    return `We do not publish fees. Request a personalised quote from /contact or the gold buttons on the site. A counsellor will call from ${phone} within one working day.`;
  }
  if (
    q.includes('discover') ||
    q.includes('book a session') ||
    q.includes('book the session') ||
    q.includes('complimentary')
  ) {
    return `The first Discovery Session is complimentary — student and parents together. Use Book a free Discovery Session in the header, or call ${phone}.`;
  }
  if (q.includes('eligib')) {
    return 'The six-question eligibility quiz is at /eligibility. You can send the full read to a counsellor from there.';
  }
  if (q.includes('destination') || q.includes('country') || q.includes('germany') || q.includes('usa') || q.includes('canada')) {
    return 'We counsel for USA, UK, Canada, Germany, Ireland, Netherlands, Singapore, and Australia. Country notes: /destinations. Compare in /tools/compare if you want a planning sketch.';
  }
  if (q.includes('how') || q.includes('work') || q.includes('step') || q.includes('path')) {
    return 'Six steps, one counsellor: Discovery Session, personalised roadmap, build, progress in writing, position, admission. After Class 12, ED6E continues into BRI6GE or 6LOBAL. See /how-it-works.';
  }
  if (q.includes('mentor') || q.includes('counsellor') || q.includes('counselor')) {
    return 'You work with one counsellor, not a rotating desk. Meet published counsellors on /mentors. Book Discovery to be assigned.';
  }
  if (q.includes('start') || q.includes('register') || q.includes('sign')) {
    return `Book a Discovery Session, write via /contact, or create an account at /register. Call ${phone} or WhatsApp from the footer.`;
  }
  if (q.includes('parent')) {
    return 'Parents sit in the Discovery Session. ED6E includes a monthly parent letter. After you create accounts, the parent portal follows progress — start at /login.';
  }
  if (q.includes('tool') || q.includes('finder') || q.includes('calculator')) {
    return 'Planning tools are at /tools — University Finder, Course Finder, Scholarships, Cost Calculator, and Country Compare. The full eligibility quiz is /eligibility. They are sketches; a counsellor quote comes next.';
  }
  if (q.includes('hub') || q.includes('community')) {
    return 'Student Hub is at /hub — country communities, webinars, and pre-departure notes. Create an account to go deeper.';
  }
  if (q.includes('program') || q.includes('course') || q.includes('offer') || q.includes('package')) {
    return 'Four product lines: ED6E (Class 8–12), BRI6GE (UG Year 1–3), 6LOBAL study-abroad counselling, and 6RIP tests. Overview: /programmes. Quoted for each family, with no one-size price list.';
  }
  return `I am Ori. ${BRAND.tagline} Ask about ED6E, BRI6GE, 6LOBAL, 6RIP, or a free Discovery Session — or open /how-it-works.`;
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
      content: `Hi — I am Ori. ${BRAND.tagline} Ask about ED6E, BRI6GE, 6LOBAL, 6RIP, or a free Discovery Session.`,
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
