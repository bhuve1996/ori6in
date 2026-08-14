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

  async function acknowledge(id: string) {
    setBusy(id);
    const { ok } = await apiFetch(`/parent/approvals/${id}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
    setBusy(null);
    if (!ok) {
      toast.error('Could not acknowledge');
      return;
    }
    toast.success('Marked as reviewed');
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.internships,
        title: 'Approvals',
        lead: 'Review internship applications and enrollment notices for your student.',
      }}
      back={{ href: '/parent', label: 'Parent' }}
      loading={loading}
      error={error}
    >
      {data ? (
        <ul className="card-list">
          {data.items.map((item) => (
            <li key={item.id}>
              <article>
                <h2>{item.title}</h2>
                <p className="meta">
                  {item.company} · {item.type} · {item.status}
                </p>
                {item.needsParentAck ? (
                  <button
                    className="btn accent"
                    type="button"
                    disabled={busy === item.id}
                    onClick={() => void acknowledge(item.id)}
                  >
                    {busy === item.id ? 'Saving…' : 'Mark reviewed'}
                  </button>
                ) : (
                  <p className="text-success">Reviewed</p>
                )}
              </article>
            </li>
          ))}
        </ul>
      ) : null}
    </PortalShell>
  );
}
