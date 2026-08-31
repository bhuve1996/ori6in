'use client';

import { useState } from 'react';
import { AdminShell, AdminStatusPill } from '../../../../components/admin/AdminShell';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';

type Listing = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  paymentStatus: string;
  approvalStatus: string;
};

export default function AdminApprovalsPage() {
  const { data, loading, error, reload } = useApiResource<{ items: Listing[] }>(
    '/admin/approvals/internships',
    { errorMessage: 'Failed to load approvals' },
  );
  const items = data?.items ?? [];
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});

  async function review(id: string, decision: 'approved' | 'rejected') {
    setBusy(id);
    setNotice(null);
    const note = decision === 'rejected' ? rejectNotes[id]?.trim() || undefined : undefined;
    const { ok } = await apiFetch(`/admin/approvals/internships/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ decision, note }),
    });
    setBusy(null);
    if (!ok) {
      setNotice('Review failed');
      return;
    }
    setNotice(
      decision === 'approved'
        ? 'Role approved and published'
        : 'Role rejected' + (note ? ` — ${note}` : ''),
    );
    reload();
  }

  return (
    <AdminShell
      title="Internship approvals"
      lead={
        items.length > 0
          ? `${items.length} company posting${items.length === 1 ? '' : 's'} waiting for review.`
          : 'Review company postings before they go live for students.'
      }
      loading={loading}
      error={error}
      message={notice ?? undefined}
      stats={[
        { value: items.length, label: 'Pending' },
      ]}
    >
      {items.length === 0 ? (
        <p className="admin-empty">No roles waiting for approval.</p>
      ) : (
        <ul className="admin-card-list">
          {items.map((item) => (
            <li key={item.id}>
              <article className="admin-panel" style={{ marginBottom: 0 }}>
                <div className="admin-panel__head">
                  <h2>{item.title}</h2>
                  <AdminStatusPill tone="warn">{item.approvalStatus || 'Pending'}</AdminStatusPill>
                </div>
                <p className="admin-table__sub">
                  {item.company} · {item.location} · payment: {item.paymentStatus}
                </p>
                <p style={{ margin: '0.75rem 0' }}>{item.description}</p>
                <div className="admin-form" style={{ marginBottom: '0.85rem' }}>
                  <label>
                    Rejection note (optional)
                    <input
                      value={rejectNotes[item.id] ?? ''}
                      onChange={(e) =>
                        setRejectNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      placeholder="Shown to the company when rejecting"
                    />
                  </label>
                </div>
                <div className="cta-row">
                  <button
                    type="button"
                    className="btn btn-accent"
                    disabled={busy === item.id}
                    onClick={() => void review(item.id, 'approved')}
                  >
                    Approve & publish
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    disabled={busy === item.id}
                    onClick={() => void review(item.id, 'rejected')}
                  >
                    Reject
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
