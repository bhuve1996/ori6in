'use client';

import { useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { formatPrice } from '../../../../lib/format';
import { BANNERS } from '../../../../lib/media';

type PaymentsPayload = {
  student: { fullName: string };
  orders: Array<{
    id: string;
    programTitle: string;
    amountCents: number;
    currency: string;
    status: string;
    paidByUserId: string | null;
    createdAt: string;
  }>;
  availablePrograms: Array<{
    programId: string;
    title: string;
    priceCents: number;
    currency: string;
  }>;
};

export default function ParentPaymentsPage() {
  const { data, loading, error, reload } = useApiResource<PaymentsPayload>(
    '/parent/payments',
    { errorMessage: 'Failed to load payments' },
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function payForProgram(programId: string) {
    setBusy(programId);
    setNotice(null);
    const { ok, data: res } = await apiFetch<{ note?: string }>('/parent/payments/checkout', {
      method: 'POST',
      body: JSON.stringify({ programId, couponCode: 'ORI6IN10' }),
    });
    setBusy(null);
    if (!ok) {
      setNotice('Checkout failed');
      return;
    }
    setNotice((res as { note?: string }).note ?? 'Paid (sandbox)');
    reload();
  }

  async function payOrder(orderId: string) {
    setBusy(orderId);
    setNotice(null);
    const { ok } = await apiFetch(`/parent/payments/${orderId}/pay`, { method: 'POST' });
    setBusy(null);
    if (!ok) {
      setNotice('Payment failed');
      return;
    }
    setNotice('Sandbox payment completed');
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.pricing,
        title: 'Payments',
        lead: data
          ? `Enrollments and sandbox payments for ${data.student.fullName}.`
          : 'Pay for programs on behalf of your linked student.',
      }}
      back={{ href: '/parent', label: 'Parent' }}
      loading={loading}
      error={error}
    >
      {notice ? <p className="notice">{notice}</p> : null}

      {data?.availablePrograms && data.availablePrograms.length > 0 ? (
        <section className="section-block">
          <h2>Enroll & pay (sandbox)</h2>
          <ul className="card-list">
            {data.availablePrograms.map((p) => (
              <li key={p.programId}>
                <article>
                  <h3 style={{ marginTop: 0 }}>{p.title}</h3>
                  <p className="price-tag">{formatPrice(p.priceCents, p.currency)}</p>
                  <button
                    type="button"
                    className="btn accent"
                    disabled={busy === p.programId}
                    onClick={() => void payForProgram(p.programId)}
                  >
                    {busy === p.programId ? 'Paying…' : 'Pay with ORI6IN10'}
                  </button>
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="section-block">
        <h2>Order history</h2>
        {!data || data.orders.length === 0 ? (
          <p className="notice">No payments yet.</p>
        ) : (
          <ul className="card-list">
            {data.orders.map((o) => (
              <li key={o.id}>
                <article>
                  <h2>{o.programTitle}</h2>
                  <p className="price-tag">{formatPrice(o.amountCents, o.currency)}</p>
                  <p className="meta">
                    {o.status}
                    {o.paidByUserId ? ' · paid by parent' : ''} ·{' '}
                    {new Date(o.createdAt).toLocaleDateString()}
                  </p>
                  {o.status === 'pending_payment' ? (
                    <button
                      type="button"
                      className="btn accent"
                      disabled={busy === o.id}
                      onClick={() => void payOrder(o.id)}
                    >
                      Pay now (sandbox)
                    </button>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PortalShell>
  );
}
