'use client';

import { useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Signup = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  announcedAt: string | null;
};

type ListResponse = {
  total: number;
  pending: number;
  items: Signup[];
};

type AnnounceResponse = {
  sent: number;
  failed: number;
  skipped: number;
  failures: string[];
  message?: string;
};

export default function AdminComingSoonPage() {
  const { data, loading, error, reload } = useApiResource<ListResponse>(
    '/admin/coming-soon-signups',
    { errorMessage: 'Failed to load waitlist' },
  );
  const items = data?.items ?? [];
  const pending = data?.pending ?? 0;
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function announce() {
    if (pending === 0) return;
    const okConfirm = window.confirm(
      `Send “ORI6IN is live” to ${pending} waitlist signup${pending === 1 ? '' : 's'}?`,
    );
    if (!okConfirm) return;

    setBusy(true);
    setNotice(null);
    const { ok, data: result } = await apiFetch<AnnounceResponse>(
      '/admin/coming-soon-signups/announce',
      { method: 'POST' },
    );
    setBusy(false);

    if (!ok) {
      setNotice(result.message || 'Announce failed. Check API SMTP settings.');
      return;
    }

    setNotice(
      `Sent ${result.sent}. Failed ${result.failed}.` +
        (result.failures?.length
          ? ` First error: ${result.failures[0]}`
          : ''),
    );
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.admin,
        title: 'Coming soon waitlist',
        lead: data
          ? `${data.total} signup${data.total === 1 ? '' : 's'} · ${pending} waiting for launch email.`
          : 'Notify signups from the soft-launch page.',
      }}
      back={{ href: '/admin', label: 'Admin' }}
      loading={loading}
      error={error}
    >
      <div className="cta-row" style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          className="btn btn-accent"
          disabled={busy || pending === 0}
          onClick={() => void announce()}
        >
          {busy ? 'Sending…' : `Email “we're live” (${pending})`}
        </button>
      </div>

      {notice ? <p className="notice">{notice}</p> : null}

      {items.length === 0 ? (
        <p className="meta">No waitlist signups yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th align="left">Name</th>
                <th align="left">Email</th>
                <th align="left">Signed up</th>
                <th align="left">Launch email</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <td>{row.name || '—'}</td>
                  <td>
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </td>
                  <td>{new Date(row.createdAt).toLocaleString()}</td>
                  <td>
                    {row.announcedAt
                      ? `Sent ${new Date(row.announcedAt).toLocaleString()}`
                      : 'Pending'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PortalShell>
  );
}
