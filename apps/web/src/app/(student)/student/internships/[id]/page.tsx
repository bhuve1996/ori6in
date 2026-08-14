'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../../lib/auth';
import { useToast } from '../../../../../components/Toast';

type Internship = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
};

export default function InternshipDetailPage() {
  const router = useRouter();
  const toast = useToast();
  const params = useParams<{ id: string }>();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=/student/internships/${params.id}`);
      return;
    }
    void (async () => {
      const detail = await apiFetch<Internship | { message?: string }>(
        `/internships/${params.id}`,
      );
      if (detail.status === 401) {
        clearSession();
        router.replace(`/login?next=/student/internships/${params.id}`);
        return;
      }
      if (!detail.ok) {
        setError(
          typeof (detail.data as { message?: string }).message === 'string'
            ? (detail.data as { message: string }).message
            : 'Internship not found',
        );
        return;
      }
      setInternship(detail.data as Internship);

      const apps = await apiFetch<Array<{ internshipId: string }>>(
        '/internships/applications/mine',
      );
      if (apps.ok && Array.isArray(apps.data)) {
        setApplied(apps.data.some((a) => a.internshipId === params.id));
      }
    })();
  }, [params.id, router]);

  async function apply() {
    if (!internship) return;
    setBusy(true);
    setError('');
    const { ok, data } = await apiFetch<{ message?: string }>(
      `/internships/${internship.id}/apply`,
      {
        method: 'POST',
        body: JSON.stringify({ notes: notes.trim() || undefined }),
      },
    );
    setBusy(false);
    if (!ok) {
      const msg = typeof data.message === 'string' ? data.message : 'Apply failed';
      setError(msg);
      toast.error(msg);
      return;
    }
    setApplied(true);
    toast.success('Application submitted');
  }

  if (error && !internship) {
    return (
      <main id="main-content" className="page">
        <a className="back-link" href="/student/internships">
          ← Internships
        </a>
        <p className="text-error">{error}</p>
      </main>
    );
  }

  if (!internship) {
    return (
      <main className="page">
        <p className="meta">Loading…</p>
      </main>
    );
  }

  return (
    <main className="page">
      <a className="back-link" href="/student/internships">
        ← Internships
      </a>
      <h1>{internship.title}</h1>
      <p className="meta">
        {internship.company} · {internship.location}
      </p>
      <div className="prose">{internship.description}</div>
      {error && <p className="text-error">{error}</p>}
      {applied ? (
        <p className="notice">✓ You have already applied.</p>
      ) : (
        <div className="form-grid wide">
          <textarea
            placeholder="Optional notes for your application"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
          <button
            className="btn accent"
            type="button"
            disabled={busy}
            onClick={() => void apply()}
          >
            {busy ? 'Submitting…' : 'Apply'}
          </button>
        </div>
      )}
    </main>
  );
}
