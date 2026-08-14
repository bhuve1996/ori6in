'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../../../../lib/auth';
import { useApiResource } from '../../../../../hooks/useApiResource';
import { PortalShell } from '../../../../../components/portal/PortalShell';
import { useToast } from '../../../../../components/Toast';
import { BANNERS } from '../../../../../lib/media';
import {
  applicationStatusLabel,
  formatTimelineEvent,
  mentorCompletionLabel,
  parentDecisionLabel,
  type TimelineEvent,
} from '../../../../../lib/internship-status';

type Internship = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
};

type Application = {
  id: string;
  internshipId: string;
  status: string;
  notes: string | null;
  parentDecision: string;
  parentNote: string | null;
  mentorCompletionDecision: string;
  mentorCompletionNote: string | null;
  timeline: TimelineEvent[];
};

export default function InternshipDetailPage() {
  const toast = useToast();
  const params = useParams<{ id: string }>();
  const {
    data: internship,
    loading,
    error,
  } = useApiResource<Internship>(`/internships/${params.id}`, {
    errorMessage: 'Internship not found',
  });
  const {
    data: applications,
    reload: reloadApps,
  } = useApiResource<Application[]>('/internships/applications/mine', { silent: true });

  const myApp = useMemo(() => {
    if (!Array.isArray(applications)) return null;
    return applications.find((a) => a.internshipId === params.id) ?? null;
  }, [applications, params.id]);

  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function apply() {
    if (!internship) return;
    setBusy(true);
    setFormError(null);
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
      setFormError(msg);
      toast.error(msg);
      return;
    }
    toast.success('Application submitted');
    reloadApps();
  }

  async function withdraw() {
    if (!myApp) return;
    setBusy(true);
    setFormError(null);
    const { ok } = await apiFetch(`/internships/applications/${myApp.id}/withdraw`, {
      method: 'POST',
    });
    setBusy(false);
    if (!ok) {
      setFormError('Could not withdraw');
      toast.error('Could not withdraw');
      return;
    }
    toast.success('Application withdrawn');
    reloadApps();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.internships,
        title: internship?.title ?? 'Internship',
        lead: internship
          ? `${internship.company} · ${internship.location}`
          : 'Role details',
      }}
      back={{ href: '/student/internships', label: 'Internships' }}
      loading={loading}
      error={error}
    >
      {internship ? (
        <>
          <div className="prose">{internship.description}</div>
          {formError ? <p className="text-error">{formError}</p> : null}

          {myApp ? (
            <section className="section-block">
              <h2>Your application</h2>
              <p>
                <strong>Company status:</strong> {applicationStatusLabel(myApp.status)}
              </p>
              <p className="meta">
                <strong>Parent:</strong> {parentDecisionLabel(myApp.parentDecision)}
                {myApp.parentNote ? ` — ${myApp.parentNote}` : ''}
              </p>
              {myApp.status === 'offered' || myApp.mentorCompletionDecision !== 'pending' ? (
                <p className="meta">
                  <strong>Mentor:</strong>{' '}
                  {mentorCompletionLabel(myApp.mentorCompletionDecision)}
                  {myApp.mentorCompletionNote ? ` — ${myApp.mentorCompletionNote}` : ''}
                </p>
              ) : null}
              {myApp.notes ? <p>Your notes: {myApp.notes}</p> : null}
              {myApp.timeline?.length ? (
                <details open>
                  <summary>Status timeline</summary>
                  <ul className="plain-list">
                    {[...myApp.timeline]
                      .slice()
                      .reverse()
                      .map((ev, idx) => (
                        <li key={`${myApp.id}-${idx}`}>{formatTimelineEvent(ev)}</li>
                      ))}
                  </ul>
                </details>
              ) : null}
              {myApp.status !== 'withdrawn' &&
              myApp.status !== 'offered' &&
              myApp.status !== 'rejected' ? (
                <div className="cta-row" style={{ marginTop: '1rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={busy}
                    onClick={() => void withdraw()}
                  >
                    Withdraw application
                  </button>
                </div>
              ) : null}
            </section>
          ) : (
            <section className="section-block">
              <h2>Apply</h2>
              <div className="stack-form">
                <label>
                  Notes (optional)
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Why you’re a fit for this role"
                  />
                </label>
                <button
                  className="btn btn-accent"
                  type="button"
                  disabled={busy}
                  onClick={() => void apply()}
                >
                  {busy ? 'Submitting…' : 'Apply'}
                </button>
              </div>
            </section>
          )}
        </>
      ) : null}
    </PortalShell>
  );
}
