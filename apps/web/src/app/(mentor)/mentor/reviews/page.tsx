'use client';

import { FormEvent, useEffect, useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Template = { key: string; label: string };
type Review = {
  id: string;
  title: string;
  grade: string;
  feedback: string;
  studentName: string;
  status: string;
  templateKey: string | null;
};
type Student = { studentId: string; fullName: string };

export default function MentorReviewsPage() {
  const { data, loading, error, reload } = useApiResource<{
    items: Review[];
    templates: Template[];
  }>('/mentor/reviews', { errorMessage: 'Failed to load reviews' });
  const { data: studentsData } = useApiResource<Student[]>('/mentor/students', { silent: true });
  const students = Array.isArray(studentsData) ? studentsData : [];
  const reviews = data?.items ?? [];
  const templates = data?.templates ?? [];

  const [form, setForm] = useState({
    studentId: '',
    title: '',
    grade: 'Good',
    feedback: '',
    status: 'published' as 'draft' | 'published',
    templateKey: '',
  });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!form.studentId && students[0]) {
      setForm((f) => ({ ...f, studentId: students[0].studentId }));
    }
  }, [students, form.studentId]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    const { ok } = await apiFetch('/mentor/reviews', {
      method: 'POST',
      body: JSON.stringify({
        studentId: form.studentId,
        title: form.title,
        grade: form.grade,
        feedback: form.feedback,
        status: form.status,
        templateKey: form.templateKey || undefined,
      }),
    });
    setBusy(false);
    if (!ok) {
      setNotice('Could not save review');
      return;
    }
    setNotice(form.status === 'draft' ? 'Draft saved' : 'Review published');
    setForm((f) => ({ ...f, title: '', feedback: '' }));
    reload();
  }

  async function publish(id: string) {
    setBusy(true);
    const { ok } = await apiFetch(`/mentor/reviews/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'published' }),
    });
    setBusy(false);
    if (!ok) {
      setNotice('Publish failed');
      return;
    }
    setNotice('Review published');
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.mentorPortal,
        title: 'Reviews',
        lead: 'Use templates, save drafts, and publish feedback for assigned students.',
      }}
      back={{ href: '/mentor', label: 'Mentor' }}
      loading={loading}
      error={error}
    >
      {notice ? <p className="notice">{notice}</p> : null}

      <section className="section-block">
        <h2>Write a review</h2>
        <form className="stack-form" onSubmit={submit}>
          <label>
            Student
            <select
              value={form.studentId}
              onChange={(e) => setForm({ ...form, studentId: e.target.value })}
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
            Template
            <select
              value={form.templateKey}
              onChange={(e) => {
                const key = e.target.value;
                const label = templates.find((t) => t.key === key)?.label;
                setForm({
                  ...form,
                  templateKey: key,
                  title: label && !form.title ? label : form.title,
                });
              }}
            >
              <option value="">Custom</option>
              {templates.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <label>
            Grade
            <input
              value={form.grade}
              onChange={(e) => setForm({ ...form, grade: e.target.value })}
              required
            />
          </label>
          <label>
            Feedback
            <textarea
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              required
              rows={4}
            />
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as 'draft' | 'published' })
              }
            >
              <option value="published">Publish now</option>
              <option value="draft">Save as draft</option>
            </select>
          </label>
          <button className="btn accent" type="submit" disabled={busy || !form.studentId}>
            {busy ? 'Saving…' : 'Save review'}
          </button>
        </form>
      </section>

      <section className="section-block">
        <h2>Past reviews</h2>
        {reviews.length === 0 ? (
          <p className="meta">No reviews yet.</p>
        ) : (
          <ul className="card-list">
            {reviews.map((r) => (
              <li key={r.id}>
                <article>
                  <h3 style={{ marginTop: 0 }}>
                    {r.title}{' '}
                    <span className="meta">
                      · {r.status}
                      {r.templateKey ? ` · ${r.templateKey}` : ''}
                    </span>
                  </h3>
                  <p className="meta">
                    {r.studentName} · {r.grade}
                  </p>
                  <p>{r.feedback}</p>
                  {r.status === 'draft' ? (
                    <button
                      type="button"
                      className="btn accent"
                      disabled={busy}
                      onClick={() => void publish(r.id)}
                    >
                      Publish
                    </button>
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
