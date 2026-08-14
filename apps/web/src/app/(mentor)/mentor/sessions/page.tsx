'use client';

import { FormEvent, useMemo, useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Student = { studentId: string; fullName: string };
type Session = {
  id: string;
  studentId: string;
  studentName: string;
  topic: string;
  startsAt: string;
  endsAt: string;
  status: string;
  meetingUrl: string | null;
};

function toLocalInputValue(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function MentorSessionsPage() {
  const { data: studentsData } = useApiResource<Student[]>('/mentor/students', {
    silent: true,
  });
  const students = Array.isArray(studentsData) ? studentsData : [];
  const { data, loading, error, reload } = useApiResource<{ items: Session[] }>(
    '/mentor/sessions',
    { errorMessage: 'Failed to load sessions' },
  );
  const items = data?.items ?? [];

  const defaultStart = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    d.setMinutes(0, 0, 0);
    return toLocalInputValue(d);
  }, []);

  const [studentId, setStudentId] = useState('');
  const [topic, setTopic] = useState('Weekly mentoring');
  const [startsAt, setStartsAt] = useState(defaultStart);
  const [meetingUrl, setMeetingUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function book(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    const start = new Date(startsAt);
    const { ok } = await apiFetch('/mentor/sessions', {
      method: 'POST',
      body: JSON.stringify({
        studentId: studentId || students[0]?.studentId,
        topic,
        startsAt: start.toISOString(),
        endsAt: new Date(start.getTime() + 45 * 60 * 1000).toISOString(),
        meetingUrl: meetingUrl.trim() || undefined,
      }),
    });
    setBusy(false);
    if (!ok) {
      setNotice('Could not book session');
      return;
    }
    setNotice('Session booked');
    setMeetingUrl('');
    reload();
  }

  async function setStatus(id: string, status: 'completed' | 'cancelled') {
    setBusy(true);
    const { ok } = await apiFetch(`/mentor/sessions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setBusy(false);
    if (!ok) {
      setNotice('Update failed');
      return;
    }
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.mentorPortal,
        title: 'Sessions',
        lead: 'Book and manage mentoring sessions with your assigned students.',
      }}
      back={{ href: '/mentor', label: 'Mentor' }}
      loading={loading}
      error={error}
    >
      {notice ? <p className="notice">{notice}</p> : null}

      <section className="section-block">
        <h2>Book a session</h2>
        <form className="stack-form" onSubmit={book}>
          <label>
            Student
            <select
              value={studentId || students[0]?.studentId || ''}
              onChange={(e) => setStudentId(e.target.value)}
              required
            >
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </label>
          <label>
            Topic
            <input value={topic} onChange={(e) => setTopic(e.target.value)} required minLength={3} />
          </label>
          <label>
            Starts
            <input
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
            />
          </label>
          <label>
            Meeting link (optional)
            <input
              type="url"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://meet.example/…"
            />
          </label>
          <button className="btn btn-accent" type="submit" disabled={busy || students.length === 0}>
            {busy ? 'Saving…' : 'Book session'}
          </button>
        </form>
      </section>

      <section className="section-block">
        <h2>Upcoming & recent</h2>
        {items.length === 0 ? (
          <p className="meta">No sessions yet.</p>
        ) : (
          <ul className="card-list">
            {items.map((s) => (
              <li key={s.id}>
                <article>
                  <h3 style={{ marginTop: 0 }}>{s.topic}</h3>
                  <p className="meta">
                    {s.studentName} · {s.status} ·{' '}
                    {new Date(s.startsAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                  {s.meetingUrl ? (
                    <p>
                      <a href={s.meetingUrl} target="_blank" rel="noreferrer">
                        Join meeting
                      </a>
                    </p>
                  ) : null}
                  {s.status === 'scheduled' ? (
                    <div className="cta-row">
                      <button
                        type="button"
                        className="btn btn-accent"
                        disabled={busy}
                        onClick={() => void setStatus(s.id, 'completed')}
                      >
                        Mark completed
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={busy}
                        onClick={() => void setStatus(s.id, 'cancelled')}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PortalShell>
  );
}
