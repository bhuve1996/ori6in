'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';
import { PageBanner } from '../../../../components/PageBanner';
import { BANNERS } from '../../../../lib/media';

type CourseRow = {
  id: string;
  title: string;
  summary: string;
  programTitle: string;
  programSlug?: string;
  lessonCount: number;
  completedLessons: number;
  percent: number;
};

export default function StudentCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void (async () => {
      const { ok, status, data } = await apiFetch<CourseRow[]>('/student/courses');
      if (status === 401 || status === 403) {
        clearSession();
        router.replace('/login');
        return;
      }
      if (!ok) {
        setError('Failed to load courses');
        return;
      }
      setCourses(Array.isArray(data) ? data : []);
    })();
  }, [router]);

  return (
    <>
      <PageBanner
        image={BANNERS.student}
        title="My courses"
        lead="Courses unlock after you purchase (or via demo enrollment)."
      />
      <main id="main-content" className="page page-after-banner">
        <a className="back-link" href="/student">
          ← Student
        </a>
        {error && <p className="text-error">{error}</p>}
        {courses.length === 0 && (
          <p className="notice">
            No enrolled courses yet. <a href="/programs">Browse programs</a> or check{' '}
            <a href="/student/orders">orders</a>.
          </p>
        )}
        <div className="media-card-list">
          {courses.map((c) => (
            <article key={c.id} className="media-card">
              <a className="media-card__image" href={`/student/courses/${c.id}`}>
                <img
                  src={
                    c.programTitle.toLowerCase().includes('ai')
                      ? '/programs/ai-foundations.jpg'
                      : '/programs/career-launchpad.jpg'
                  }
                  alt=""
                />
              </a>
              <div className="media-card__body">
                <h2>
                  <a href={`/student/courses/${c.id}`}>{c.title}</a>
                </h2>
                <p className="meta">{c.programTitle}</p>
                <p>{c.summary}</p>
                <p className="meta">
                  Progress: {c.completedLessons}/{c.lessonCount} lessons ({c.percent}%)
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
