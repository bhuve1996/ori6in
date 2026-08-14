'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Thread = {
  id: string;
  withName: string;
  topic: string;
  preview: string;
  participantRole: string;
  updatedAt: string;
};

type ThreadDetail = {
  thread: { id: string; topic: string; withName: string };
  messages: Array<{
    id: string;
    body: string;
    senderName: string;
    mine: boolean;
    createdAt: string;
  }>;
};

export default function ParentMessagingPage() {
  const { data, loading, error, reload } = useApiResource<{
    student: { fullName: string };
    threads: Thread[];
  }>('/parent/messaging', { errorMessage: 'Failed to load messages' });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ThreadDetail | null>(null);
  const [body, setBody] = useState('');
  const [topic, setTopic] = useState('');
  const [role, setRole] = useState<'student' | 'mentor' | 'support'>('student');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function openThread(id: string) {
    setSelectedId(id);
    setNotice(null);
    const { ok, data: res } = await apiFetch<ThreadDetail>(`/parent/messaging/${id}`);
    if (ok) setDetail(res as ThreadDetail);
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!selectedId || !body.trim()) return;
    setBusy(true);
    const { ok } = await apiFetch(`/parent/messaging/${selectedId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
    setBusy(false);
    if (!ok) {
      setNotice('Could not send message');
      return;
    }
    setBody('');
    await openThread(selectedId);
    reload();
  }

  async function createThread(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    const { ok, data: res } = await apiFetch<{ id: string }>('/parent/messaging', {
      method: 'POST',
      body: JSON.stringify({ topic, participantRole: role }),
    });
    setBusy(false);
    if (!ok) {
      setNotice('Could not create thread — link a student first.');
      return;
    }
    setTopic('');
    reload();
    await openThread((res as { id: string }).id);
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.mentors,
        title: 'Messages',
        lead: data
          ? `Two-way threads about ${data.student.fullName}.`
          : 'Message your student, their mentor, or support.',
      }}
      back={{ href: '/parent', label: 'Parent' }}
      loading={loading}
      error={error}
    >
      {notice ? <p className="notice">{notice}</p> : null}

      <section className="section-block">
        <h2>New conversation</h2>
        <form className="stack-form" onSubmit={createThread}>
          <label>
            Topic
            <input value={topic} onChange={(e) => setTopic(e.target.value)} required minLength={3} />
          </label>
          <label>
            With
            <select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
              <option value="student">Student</option>
              <option value="mentor">Assigned mentor</option>
              <option value="support">ORI6IN support</option>
            </select>
          </label>
          <button className="btn accent" type="submit" disabled={busy}>
            Start thread
          </button>
        </form>
      </section>

      <section className="section-block">
        <h2>Inbox</h2>
        {!data || data.threads.length === 0 ? (
          <p className="meta">No threads yet.</p>
        ) : (
          <ul className="card-list">
            {data.threads.map((t) => (
              <li key={t.id}>
                <article>
                  <h3 style={{ marginTop: 0 }}>{t.topic}</h3>
                  <p className="meta">
                    With {t.withName} · {t.participantRole}
                  </p>
                  <p>{t.preview}</p>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={() => void openThread(t.id)}
                  >
                    Open
                  </button>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      {detail ? (
        <section className="section-block">
          <h2>{detail.thread.topic}</h2>
          <p className="meta">With {detail.thread.withName}</p>
          <ul className="plain-list">
            {detail.messages.map((m) => (
              <li key={m.id}>
                <strong>{m.mine ? 'You' : m.senderName}</strong>
                <br />
                {m.body}
                <br />
                <span className="meta">{new Date(m.createdAt).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <form className="stack-form" onSubmit={send}>
            <label>
              Reply
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                rows={3}
              />
            </label>
            <button className="btn accent" type="submit" disabled={busy}>
              Send
            </button>
          </form>
        </section>
      ) : null}
    </PortalShell>
  );
}
