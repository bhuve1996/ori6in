'use client';

import { useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type ApprovalsPayload = {
  items: Array<{
    id: string;
    studentName: string;
    title: string;
    company: string;
    status: string;
    mentorCompletionDecision: string;
    needsMentorDecision: boolean;
  }>;
};

export default function MentorApprovalsPage() {
  const { data, loading, error, reload } = useApiResource<ApprovalsPayload>(
    '/mentor/approvals',
    { errorMessage: 'Failed to load approvals' },
  );
  const items = data?.items ?? [];
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function decide(id: string, decision: 'approved' | 'rejected') {
    setBusy(id);
    setNotice(null);
    const { ok } = await apiFetch(`/mentor/approvals/${id}/decide`, {
      method: 'POST',
      body: JSON.stringify({
        decision,
        note: decision === 'approved' ? 'Completion verified by mentor' : 'Needs more evidence',
        documentKeys: decision === 'approved' ? ['mentor-signoff'] : [],
      }),
    });
    setBusy(null);
    if (!ok) {
      setNotice('Could not save decision');
      return;
    }
    setNotice(decision === 'approved' ? 'Completion approved' : 'Completion rejected');
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.internships,
        title: 'Completion approvals',
        lead: 'Sign off on offered internships for your assigned students.',
      }}
      back={{ href: '/mentor', label: 'Mentor' }}
      loading={loading}
      error={error}
    >
      {notice ? <p className="notice">{notice}</p> : null}
      {items.length === 0 ? (
        <p className="meta">No offered internships awaiting completion sign-off.</p>
      ) : (
        <ul className="card-list">
          {items.map((item) => (
            <li key={item.id}>
              <article>
                <h2>{item.title}</h2>
                <p className="meta">
                  {item.studentName} · {item.company} · {item.mentorCompletionDecision}
                </p>
                {item.needsMentorDecision ? (
                  <div className="cta-row">
                    <button
                      type="button"
                      className="btn accent"
                      disabled={busy === item.id}
                      onClick={() => void decide(item.id, 'approved')}
                    >
                      Approve completion
                    </button>
                    <button
                      type="button"
                      className="btn secondary"
                      disabled={busy === item.id}
                      onClick={() => void decide(item.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                ) : (
                  <p className="text-success">Decision recorded</p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
