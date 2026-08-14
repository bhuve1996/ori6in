'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';

type Order = {
  id: string;
  programId: string;
  programTitle: string;
  amountCents: number;
  currency: string;
  couponCode: string | null;
  status: string;
  createdAt: string;
};

function OrdersInner() {
  const router = useRouter();
  const params = useSearchParams();
  const highlight = params.get('highlight');
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void (async () => {
      const { ok, status, data } = await apiFetch<Order[]>('/orders');
      if (status === 401) {
        clearSession();
        router.replace('/login');
        return;
      }
      if (!ok) {
        setError('Failed to load orders');
        return;
      }
      setOrders(Array.isArray(data) ? data : []);
    })();
  }, [router]);

  return (
    <main id="main-content" className="page">
      <a className="back-link" href="/student">
        ← Student
      </a>
      <h1>My orders</h1>
      {error && <p className="text-error">{error}</p>}
      {orders.length === 0 && (
        <p className="notice">
          No purchases yet. Browse <a href="/programs">programs</a>.
        </p>
      )}
      <ul className="plain-list">
        {orders.map((o) => (
          <li key={o.id} style={highlight === o.id ? { fontWeight: 700 } : undefined}>
            {o.programTitle} — {(o.amountCents / 100).toFixed(0)} {o.currency} — {o.status}
            {o.couponCode ? ` (coupon ${o.couponCode})` : ''}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default function StudentOrdersPage() {
  return (
    <Suspense
      fallback={
        <main className="page">
          <p className="meta">Loading…</p>
        </main>
      }
    >
      <OrdersInner />
    </Suspense>
  );
}
