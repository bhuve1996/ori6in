'use client';

import { useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type LinkItem = {
  id: string;
  status: string;
  parentName: string;
  parentEmail: string;
};

export default function StudentParentLinksPage() {
  const { data, loading, error, reload } = useApiResource<{ items: LinkItem[] }>(
    '/student/parent-links',
    { errorMessage: 'Failed to load parent links' },
  );
  const items = data?.items ?? [];
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function respond(id: string, accept: boolean) {
    setBusy(id);
    setNotice(null);
    const { ok } = await apiFetch(`/student/parent-links/${id}/${accept ? 'accept' : 'decline'}`, {
      method: 'POST',
    });
    setBusy(null);
    if (!ok) {
      setNotice('Could not update link');
      return;
    }
    setNotice(accept ? 'Parent linked' : 'Request declined');
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Parent links',
        lead: 'Accept or decline requests from parents who want to follow your progress.',
      }}
      back={{ href: '/student', label: 'Student' }}
      loading={loading}
      error={error}
    >
      {notice ? <p className="notice">{notice}</p> : null}
      {items.length === 0 ? (
        <p className="meta">No parent link requests.</p>
      ) : (
        <ul className="card-list">
          {items.map((item) => (
            <li key={item.id}>
              <article>
                <h2>{item.parentName}</h2>
                <p className="meta">
                  {item.parentEmail} · {item.status}
                </p>
                {item.status === 'pending' ? (
                  <div className="cta-row">
                    <button
                      type="button"
                      className="btn btn-accent"
                      disabled={busy === item.id}
                      onClick={() => void respond(item.id, true)}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={busy === item.id}
                      onClick={() => void respond(item.id, false)}
                    >
                      Decline
                    </button>
                  </div>
                ) : (
                  <p className="text-success">{item.status}</p>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
