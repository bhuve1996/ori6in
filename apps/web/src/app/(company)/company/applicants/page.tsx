'use client';

import { useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { Avatar } from '../../../../components/Avatar';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

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
};

export default function CompanyApplicantsPage() {
  const { data, loading, error, reload } = useApiResource<{ items: Applicant[] }>(
    '/company/applicants',
    { errorMessage: 'Failed to load applicants' },
  );
  const items = data?.items ?? [];
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function setStatus(id: string, status: string) {
    setBusyId(id);
    setMessage(null);
    const { ok } = await apiFetch(`/company/applicants/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (!ok) {
      setMessage('Could not update status');
      return;
    }
    setMessage(`Updated to ${status}`);
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Applicants',
        lead: 'Move candidates through your internship pipeline.',
      }}
      back={{ href: '/company', label: 'Company' }}
      loading={loading}
      error={error}
    >
      {message ? <p className="notice">{message}</p> : null}
      {items.length === 0 ? (
        <p className="notice">No applications yet. When students apply, they show up here.</p>
      ) : (
        <div className="card-list">
          {items.map((a) => (
            <article key={a.id} className="person-row" style={{ padding: '1rem 0' }}>
              <Avatar name={a.applicantName} seed={a.applicantId} kind="student" size="lg" />
              <div style={{ flex: 1 }}>
                <h2 style={{ marginTop: 0 }}>{a.applicantName}</h2>
                <p className="meta">
                  {a.applicantEmail} · {a.roleTitle}
                </p>
                {a.notes ? <p>{a.notes}</p> : null}
                <label className="meta" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                  Pipeline status
                  <select
                    value={a.status}
                    disabled={busyId === a.id}
                    onChange={(e) => void setStatus(a.id, e.target.value)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
