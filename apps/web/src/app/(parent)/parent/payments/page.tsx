'use client';

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
    createdAt: string;
  }>;
};

export default function ParentPaymentsPage() {
  const { data, loading, error } = useApiResource<PaymentsPayload>('/parent/payments', {
    errorMessage: 'Failed to load payments',
  });

  return (
    <PortalShell
      banner={{
        image: BANNERS.pricing,
        title: 'Payments',
        lead: 'Enrollments and charges linked to your student.',
      }}
      back={{ href: '/parent', label: 'Parent' }}
      loading={loading}
      error={error}
    >
      {!data || data.orders.length === 0 ? (
        <p className="notice">
          No payments yet{data ? ` for ${data.student.fullName}` : ''}.
        </p>
      ) : (
        <ul className="card-list">
          {data.orders.map((o) => (
            <li key={o.id}>
              <article>
                <h2>{o.programTitle}</h2>
                <p className="price-tag">{formatPrice(o.amountCents, o.currency)}</p>
                <p className="meta">
                  {o.status} · {new Date(o.createdAt).toLocaleDateString()}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
