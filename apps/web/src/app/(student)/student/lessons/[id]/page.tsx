'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../../lib/auth';
import { useToast } from '../../../../../components/Toast';
import { Tooltip } from '../../../../../components/Tooltip';

type LessonDetail = {
  id: string;
  courseId: string;
  title: string;
  content: string;
  completed: boolean;
};

export default function StudentLessonPage() {
  const router = useRouter();
  const toast = useToast();
  const params = useParams<{ id: string }>();
  const [lesson, setLesson] = useState<LessonDetail | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const { ok, status, data } = await apiFetch<LessonDetail | { message?: string }>(
      `/student/lessons/${params.id}`,
    );
    if (status === 401) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!ok) {
      setError(
        typeof (data as { message?: string }).message === 'string'
          ? (data as { message: string }).message
          : 'Failed to load lesson',
      );
      return;
    }
    setLesson(data as LessonDetail);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void load();
  }, [params.id, router]);

  async function markComplete() {
    if (!lesson) return;
    setBusy(true);
    setError('');
    const { ok, data } = await apiFetch<{ message?: string }>(
      `/student/lessons/${lesson.id}/complete`,
      { method: 'POST' },
    );
    setBusy(false);
    if (!ok) {
      const msg =
        typeof data.message === 'string' ? data.message : 'Could not mark complete';
      setError(msg);
      toast.error(msg);
      return;
    }
    toast.success('Lesson marked complete');
    await load();
  }

  if (error && !lesson) {
    return (
      <main id="main-content" className="page">
        <p className="text-error">{error}</p>
      </main>
    );
  }

  if (!lesson) {
    return (
      <main className="page">
        <p className="meta">Loading…</p>
      </main>
    );
  }

  return (
    <main className="page">
      <a className="back-link" href={`/student/courses/${lesson.courseId}`}>
        ← Course
      </a>
      <h1>{lesson.title}</h1>
      {lesson.completed && <p className="text-success">✓ Completed</p>}
      {error && <p className="text-error">{error}</p>}
      <div className="prose">{lesson.content}</div>
      {!lesson.completed && (
        <div className="cta-row">
          <Tooltip label="Saves progress on this lesson">
            <button
              className="btn btn-accent"
              type="button"
              disabled={busy}
              onClick={() => void markComplete()}
            >
              {busy ? 'Saving…' : 'Mark complete'}
            </button>
          </Tooltip>
        </div>
      )}
    </main>
  );
}
