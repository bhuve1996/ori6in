'use client';

import { useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { Avatar } from '../../../../components/Avatar';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';
import {
  APPLICATION_STATUS_LABELS,
  applicationStatusLabel,
  formatTimelineEvent,
  mentorCompletionLabel,
  parentDecisionLabel,
  type TimelineEvent,
} from '../../../../lib/internship-status';

const STATUSES = [
  'applied',
  'under_review',
  'interview',
  'offered',
  'rejected',
  'withdrawn',
] as const;

type Applicant = {
  id: string;
  roleTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantId: string;
  status: string;
  notes: string | null;
  parentDecision?: string;
  mentorCompletionDecision?: string;
  timeline?: TimelineEvent[];
};

export default function CompanyApplicantsPage() {
  const { data, loading, error, reload } = useApiResource<{ items: Applicant[] }>(
    '/company/applicants',
    { errorMessage: 'Failed to load applicants' },
  );
  const items = data?.items ?? [];
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<string>('all');

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    setMessage(null);
    const note = notesById[id]?.trim();
    const { ok } = await apiFetch(`/company/applicants/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note: note || undefined }),
    });
    setBusyId(null);
    if (!ok) {
      setMessage('Could not update status');
      return;
    }
    setMessage(`Updated to ${applicationStatusLabel(status)}`);
    setNotesById((prev) => ({ ...prev, [id]: '' }));
    reload();
  }

  const visible =
    filter === 'all' ? items : items.filter((a) => a.status === filter);

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Applicants',
        lead: 'Move candidates through your internship pipeline with clear status and feedback notes.',
      }}
      back={{ href: '/company', label: 'Company' }}
      loading={loading}
      error={error}
    >
      {message ? <p className="notice">{message}</p> : null}

      {items.length > 0 ? (
        <label className="meta" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
          Filter
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All ({items.length})</option>
            {STATUSES.map((s) => {
              const count = items.filter((a) => a.status === s).length;
              return (
                <option key={s} value={s}>
                  {APPLICATION_STATUS_LABELS[s]} ({count})
                </option>
              );
            })}
          </select>
        </label>
      ) : null}

      {visible.length === 0 ? (
        <p className="notice">
          {items.length === 0
            ? 'No applications yet. When students apply, they show up here.'
            : 'No applicants in this status.'}
        </p>
      ) : (
        <div className="card-list">
          {visible.map((a) => (
            <article key={a.id} className="person-row" style={{ padding: '1rem 0' }}>
              <Avatar name={a.applicantName} seed={a.applicantId} kind="student" size="lg" />
              <div style={{ flex: 1 }}>
                <h2 style={{ marginTop: 0 }}>{a.applicantName}</h2>
                <p className="meta">
                  {a.applicantEmail} · {a.roleTitle} · {applicationStatusLabel(a.status)}
                </p>
                {a.notes ? <p>{a.notes}</p> : null}
                {a.parentDecision ? (
                  <p className="meta">Parent: {parentDecisionLabel(a.parentDecision)}</p>
                ) : null}
                {a.mentorCompletionDecision && a.mentorCompletionDecision !== 'pending' ? (
                  <p className="meta">
                    Mentor: {mentorCompletionLabel(a.mentorCompletionDecision)}
                  </p>
                ) : null}
                <label
                  className="meta"
                  style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}
                >
                  Pipeline status
                  <select
                    value={a.status}
                    disabled={busyId === a.id}
                    onChange={(e) => void setStatus(a.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {APPLICATION_STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="meta" style={{ display: 'block', marginTop: '0.5rem' }}>
                  Note for student (optional)
                  <input
                    value={notesById[a.id] ?? ''}
                    onChange={(e) =>
                      setNotesById((prev) => ({ ...prev, [a.id]: e.target.value }))
                    }
                    placeholder="Sent with the next status change"
                    style={{ display: 'block', width: '100%', maxWidth: '28rem', marginTop: '0.25rem' }}
                  />
                </label>
                {a.timeline?.length ? (
                  <details style={{ marginTop: '0.5rem' }}>
                    <summary className="meta">Timeline</summary>
                    <ul className="plain-list">
                      {[...a.timeline]
                        .slice()
                        .reverse()
                        .slice(0, 5)
                        .map((ev, idx) => (
                          <li key={`${a.id}-${idx}`}>{formatTimelineEvent(ev)}</li>
                        ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
