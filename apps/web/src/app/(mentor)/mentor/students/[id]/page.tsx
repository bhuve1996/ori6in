'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../../lib/auth';
import { Avatar } from '../../../../../components/Avatar';
import { PageBanner } from '../../../../../components/PageBanner';
import { useToast } from '../../../../../components/Toast';
import { BANNERS } from '../../../../../lib/media';

type StudentDetail = {
  student: { id: string; fullName: string; email: string };
  program: { id: string; title: string } | null;
  progress: { percent: number; completedLessons: number; totalLessons: number };
  notes: Array<{ id: string; note: string; createdAt: string }>;
  reviews: Array<{ id: string; title: string; grade: string; feedback: string }>;
};

export default function MentorStudentDetailPage() {
  const router = useRouter();
  const toast = useToast();
  const params = useParams<{ id: string }>();
  const [detail, setDetail] = useState<StudentDetail | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const { ok, status, data } = await apiFetch<StudentDetail | { message?: string }>(
      `/mentor/students/${params.id}`,
    );
    if (status === 401 || status === 403) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!ok) {
      setError(
        typeof (data as { message?: string }).message === 'string'
          ? (data as { message: string }).message
          : 'Failed to load student',
      );
      return;
    }
    setDetail(data as StudentDetail);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void load();
  }, [params.id, router]);

  async function saveNote() {
    setError('');
    const { ok, data } = await apiFetch<{ message?: string }>('/mentor/reviews/session-notes', {
      method: 'POST',
      body: JSON.stringify({ studentId: params.id, note }),
    });
    if (!ok) {
      const msg = typeof data.message === 'string' ? data.message : 'Could not save note';
      setError(msg);
      toast.error(msg);
      return;
    }
    setNote('');
    toast.success('Session note saved');
    await load();
  }

  if (error && !detail) {
    return (
      <main id="main-content" className="page">
        <a className="back-link" href="/mentor/students">
          ← Students
        </a>
        <p className="text-error">{error}</p>
      </main>
    );
  }

  if (!detail) {
    return (
      <main className="page">
        <p className="meta">Loading…</p>
      </main>
    );
  }

  return (
    <>
      <PageBanner
        image={BANNERS.student}
        title={detail.student.fullName}
        lead={
          detail.program
            ? `${detail.student.email} · ${detail.program.title}`
            : detail.student.email
        }
      />
      <main className="page page-after-banner">
      <a className="back-link" href="/mentor/students">
        ← Students
      </a>
      <div className="person-row" style={{ marginBottom: '1rem' }}>
        <Avatar
          name={detail.student.fullName}
          seed={detail.student.id}
          kind="student"
          size="lg"
        />
        <p className="meta">
          Progress: {detail.progress.completedLessons}/{detail.progress.totalLessons} (
          {detail.progress.percent}%)
        </p>
      </div>

      <section className="section-block">
        <h2>Session notes</h2>
        <ul className="plain-list">
          {detail.notes.map((n) => (
            <li key={n.id}>{n.note}</li>
          ))}
        </ul>
        <div className="form-grid wide">
          <textarea
            placeholder="Add a session note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
          <div className="cta-row">
            <button className="btn accent" type="button" onClick={() => void saveNote()}>
              Save note
            </button>
          </div>
        </div>
        {error && <p className="text-error">{error}</p>}
      </section>

      <section className="section-block">
        <h2>Reviews</h2>
        <ul className="plain-list">
          {detail.reviews.map((r) => (
            <li key={r.id}>
              <strong>{r.title}</strong> — {r.grade}
              <br />
              {r.feedback}
            </li>
          ))}
        </ul>
        <p>
          <a href="/mentor/reviews">Write a review →</a>
        </p>
      </section>
    </main>
    </>
  );
}
