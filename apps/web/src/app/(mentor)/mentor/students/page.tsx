'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';
import { Avatar } from '../../../../components/Avatar';
import { PageBanner } from '../../../../components/PageBanner';
import { BANNERS } from '../../../../lib/media';

type StudentRow = {
  studentId: string;
  fullName: string;
  email: string;
  programTitle: string;
  progress: { percent: number; completedLessons: number; totalLessons: number };
};

export default function MentorStudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void (async () => {
      const { ok, status, data } = await apiFetch<StudentRow[]>('/mentor/students');
      if (status === 401 || status === 403) {
        clearSession();
        router.replace('/login');
        return;
      }
      if (!ok) {
        setError('Failed to load students');
        return;
      }
      setStudents(Array.isArray(data) ? data : []);
    })();
  }, [router]);

  return (
    <>
      <PageBanner
        image={BANNERS.mentorPortal}
        title="Assigned students"
        lead="Open a student to review progress and leave session notes."
      />
      <main id="main-content" className="page page-after-banner">
        <a className="back-link" href="/mentor">
          ← Mentor
        </a>
        {error && <p className="text-error">{error}</p>}
        {students.length === 0 && <p className="notice">No students assigned yet.</p>}
        <div className="card-list">
          {students.map((s) => (
            <article key={s.studentId} className="person-row">
              <Avatar name={s.fullName} seed={s.studentId} kind="student" size="lg" />
              <div>
                <h2>
                  <a href={`/mentor/students/${s.studentId}`}>{s.fullName}</a>
                </h2>
                <p className="meta">
                  {s.email} · {s.programTitle}
                </p>
                <p className="meta">
                  Progress: {s.progress.completedLessons}/{s.progress.totalLessons} (
                  {s.progress.percent}%)
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
