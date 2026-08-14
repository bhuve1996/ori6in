'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../../lib/auth';

type CourseDetail = {
  id: string;
  title: string;
  summary: string;
  programTitle: string;
  lessons: Array<{
    id: string;
    title: string;
    slug: string;
    completed: boolean;
  }>;
};

export default function StudentCourseDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void (async () => {
      const { ok, status, data } = await apiFetch<CourseDetail | { message?: string }>(
        `/student/courses/${params.id}`,
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
            : 'Failed to load course',
        );
        return;
      }
      setCourse(data as CourseDetail);
    })();
  }, [params.id, router]);

  if (error) {
    return (
      <main id="main-content" className="page">
        <a className="back-link" href="/student/courses">
          ← Courses
        </a>
        <p className="text-error">{error}</p>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="page">
        <p className="meta">Loading…</p>
      </main>
    );
  }

  return (
    <main className="page">
      <a className="back-link" href="/student/courses">
        ← Courses
      </a>
      <h1>{course.title}</h1>
      <p className="meta">{course.programTitle}</p>
      <p className="page-lead">{course.summary}</p>
      <ol className="plain-list">
        {course.lessons.map((l) => (
          <li key={l.id}>
            <a href={`/student/lessons/${l.id}`}>{l.title}</a>
            {l.completed ? ' ✓' : ''}
          </li>
        ))}
      </ol>
    </main>
  );
}
