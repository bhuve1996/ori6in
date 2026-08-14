'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';
import { useToast } from '../../../../components/Toast';

type Review = {
  id: string;
  title: string;
  grade: string;
  feedback: string;
  studentName: string;
};

type StudentRow = {
  studentId: string;
  fullName: string;
};

export default function MentorReviewsPage() {
  const router = useRouter();
  const toast = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [form, setForm] = useState({
    studentId: '',
    title: '',
    grade: 'Good',
    feedback: '',
  });
  const [error, setError] = useState('');

  async function load() {
    const reviewsRes = await apiFetch<Review[]>('/mentor/reviews');
    const studentsRes = await apiFetch<StudentRow[]>('/mentor/students');
    if (reviewsRes.status === 401 || reviewsRes.status === 403) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!reviewsRes.ok) {
      setError('Failed to load reviews');
      return;
    }
    setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
    if (studentsRes.ok && Array.isArray(studentsRes.data)) {
      setStudents(studentsRes.data);
      if (!form.studentId && studentsRes.data[0]) {
        setForm((f) => ({ ...f, studentId: studentsRes.data[0].studentId }));
      }
    }
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void load();
  }, [router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { ok, data } = await apiFetch<{ message?: unknown }>('/mentor/reviews', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    if (!ok) {
      const msg = JSON.stringify((data as { message?: unknown }).message ?? data);
      setError(msg);
      toast.error('Could not save review');
      return;
    }
    toast.success('Review saved');
    setForm((f) => ({ ...f, title: '', feedback: '' }));
    await load();
  }

  return (
    <main id="main-content" className="page">
      <a className="back-link" href="/mentor">
        ← Mentor
      </a>
      <h1>Reviews & notes</h1>
      {error && <p className="text-error">{error}</p>}

      <section className="section-block">
        <h2>Write a review</h2>
        <form onSubmit={submit} className="form-grid wide">
          <select
            value={form.studentId}
            onChange={(e) => setForm({ ...form, studentId: e.target.value })}
            required
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.fullName}
              </option>
            ))}
          </select>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="Grade"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            required
          />
          <textarea
            placeholder="Feedback"
            value={form.feedback}
            onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            required
            rows={4}
          />
          <button className="btn accent" type="submit">
            Submit review
          </button>
        </form>
      </section>

      <section className="section-block">
        <h2>Past reviews</h2>
        <ul className="plain-list">
          {reviews.map((r) => (
            <li key={r.id}>
              <strong>{r.title}</strong> — {r.studentName} — {r.grade}
              <br />
              {r.feedback}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
