'use client';

import { useState } from 'react';
import { AdminShell, AdminStatusPill } from '../../../../components/admin/AdminShell';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';

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
        (result.failures?.length ? ` First error: ${result.failures[0]}` : ''),
    );
    reload();
  }

  return (
    <AdminShell
      layout="full"
      title="Coming soon waitlist"
      lead={
        data
          ? `${data.total} signup${data.total === 1 ? '' : 's'} · ${pending} waiting for launch email.`
          : 'Notify signups from the soft-launch page.'
      }
      loading={loading}
      error={error}
      message={notice ?? undefined}
      stats={[
        { value: data?.total ?? 0, label: 'Total' },
        { value: pending, label: 'Pending email' },
        {
          value: (data?.total ?? 0) - pending,
          label: 'Announced',
        },
      ]}
      actions={
        <button
          type="button"
          className="btn btn-accent"
          disabled={busy || pending === 0}
          onClick={() => void announce()}
        >
          {busy ? 'Sending…' : `Email “we're live” (${pending})`}
        </button>
      }
    >
      {items.length === 0 ? (
        <p className="admin-empty">No waitlist signups yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Signed up</th>
                <th>Launch email</th>
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
                    {row.announcedAt ? (
                      <AdminStatusPill tone="ok">
                        Sent {new Date(row.announcedAt).toLocaleDateString()}
                      </AdminStatusPill>
                    ) : (
                      <AdminStatusPill tone="warn">Pending</AdminStatusPill>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
