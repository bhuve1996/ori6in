'use client';

import { useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { useToast } from '../../../../components/Toast';
import { BANNERS } from '../../../../lib/media';

type ApprovalsPayload = {
  student: { fullName: string };
  items: Array<{
    id: string;
    type: string;
    title: string;
    company: string;
    status: string;
    parentDecision: string;
    needsParentAck: boolean;
  }>;
};

export default function ParentApprovalsPage() {
  const toast = useToast();
  const { data, loading, error, reload } = useApiResource<ApprovalsPayload>(
    '/parent/approvals',
    { errorMessage: 'Failed to load approvals' },
  );
  const [busy, setBusy] = useState<string | null>(null);

  async function decide(id: string, decision: 'approved' | 'rejected') {
    setBusy(id);
    const { ok } = await apiFetch(`/parent/approvals/${id}/decide`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    });
    setBusy(null);
    if (!ok) {
      toast.error('Could not save decision');
      return;
    }
    toast.success(decision === 'approved' ? 'Approved' : 'Rejected');
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.internships,
        title: 'Approvals',
        lead: data
          ? `Review internship applications for ${data.student.fullName}.`
          : 'Approve or reject internship applications for your linked student.',
      }}
      back={{ href: '/parent', label: 'Parent' }}
      loading={loading}
      error={error}
    >
      {data ? (
        data.items.length === 0 ? (
          <p className="meta">No applications yet.</p>
        ) : (
          <ul className="card-list">
            {data.items.map((item) => (
              <li key={item.id}>
                <article>
                  <h2>{item.title}</h2>
                  <p className="meta">
                    {item.company} · app: {item.status} · parent: {item.parentDecision}
                  </p>
                  {item.needsParentAck ? (
                    <div className="cta-row">
                      <button
                        className="btn btn-accent"
                        type="button"
                        disabled={busy === item.id}
                        onClick={() => void decide(item.id, 'approved')}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-secondary"
                        type="button"
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
        )
      ) : null}
    </PortalShell>
  );
}
