'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';

type Turn = { role: string; content: string };

export default function StudentAiPage() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/student/ai');
    }
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || busy) return;
    setBusy(true);
    setError('');
    const userTurn = { role: 'user', content: message.trim() };
    setTurns((t) => [...t, userTurn]);
    setMessage('');
    const { ok, status, data } = await apiFetch<{
      reply?: string;
      message?: string;
    }>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message: userTurn.content }),
    });
    setBusy(false);
    if (status === 401) {
      clearSession();
      router.replace('/login?next=/student/ai');
      return;
    }
    if (!ok || !data.reply) {
      setError(typeof data.message === 'string' ? data.message : 'Chat failed');
      return;
    }
    setTurns((t) => [...t, { role: 'assistant', content: data.reply as string }]);
  }

  return (
    <main id="main-content" className="page">
      <a className="back-link" href="/student">
        ← Student
      </a>
      <h1>AI Chat</h1>
      <p className="page-lead">
        Basic guidance chat for Month 1. Advanced memory and RAG arrive later.
      </p>
      {error && <p className="text-error">{error}</p>}
      <div className="card-list" style={{ marginBottom: '1.25rem' }}>
        {turns.length === 0 && (
          <p className="meta">Ask about programs, mentors, or how to get started.</p>
        )}
        {turns.map((t, i) => (
          <article key={`${t.role}-${i}`}>
            <p className="meta">{t.role === 'user' ? 'You' : 'ORI6IN AI'}</p>
            <p>{t.content}</p>
          </article>
        ))}
      </div>
      <form onSubmit={(e) => void onSubmit(e)} className="form-grid form-grid-wide">
        <textarea
          rows={3}
          placeholder="Type a message…"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button className="btn btn-accent" type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Send'}
        </button>
      </form>
    </main>
  );
}
