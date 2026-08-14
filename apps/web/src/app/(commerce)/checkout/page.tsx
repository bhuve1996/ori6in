'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, getToken } from '../../../lib/auth';
import { useToast } from '../../../components/Toast';
import { Tooltip } from '../../../components/Tooltip';
import { useAsyncAction } from '../../../hooks/useAsyncAction';
import { formatPrice } from '../../../lib/format';
import { catalogItemToProgram, listCatalog } from '../../../services/catalog';
import type { Program } from '../../../lib/api';

function CheckoutInner() {
  const router = useRouter();
  const toast = useToast();
  const params = useSearchParams();
  const programId = params.get('programId') ?? '';
  const [program, setProgram] = useState<Program | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [status, setStatus] = useState('');
  const { busy, error, setError, run } = useAsyncAction();

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=/checkout?programId=${programId}`);
      return;
    }
    if (!programId) return;
    void (async () => {
      const catalog = await listCatalog();
      const item = catalog.find((c) => c.programId === programId);
      if (!item) {
        setError('Program not available for purchase');
        return;
      }
      setProgram(catalogItemToProgram(item));
    })();
  }, [programId, router, setError]);

  const purchase = useCallback(() => {
    if (!program) return;
    void run(async () => {
      setStatus('Creating order…');

      const checkout = await apiFetch<{
        order?: { id: string; amountCents: number; currency: string };
        message?: unknown;
      }>('/checkout', {
        method: 'POST',
        body: JSON.stringify({
          programId: program.id,
          ...(couponCode.trim() ? { couponCode: couponCode.trim() } : {}),
        }),
      });

      if (!checkout.ok || !checkout.data.order) {
        const msg =
          typeof checkout.data.message === 'string'
            ? checkout.data.message
            : JSON.stringify(checkout.data.message ?? checkout.data);
        toast.error('Checkout failed');
        throw new Error(msg);
      }

      setStatus('Creating payment…');
      const pay = await apiFetch<{
        payment?: { id: string };
        message?: unknown;
      }>('/payments/create', {
        method: 'POST',
        body: JSON.stringify({ orderId: checkout.data.order.id }),
      });

      if (!pay.ok || !pay.data.payment) {
        toast.error('Payment create failed');
        throw new Error('Payment create failed');
      }

      setStatus('Completing sandbox payment…');
      const done = await apiFetch<{ order?: { id: string } }>('/payments/mock-complete', {
        method: 'POST',
        body: JSON.stringify({ paymentId: pay.data.payment.id }),
      });

      if (!done.ok || !done.data.order) {
        toast.error('Payment completion failed');
        throw new Error('Payment completion failed');
      }

      toast.success('Purchase complete');
      setStatus('Purchase complete');
      router.push(`/student/orders?highlight=${done.data.order.id}`);
    });
  }, [couponCode, program, router, run, toast]);

  if (!programId) {
    return (
      <main id="main-content" className="page">
        <h1>Checkout</h1>
        <p className="page-lead">
          Missing program. Browse <a href="/programs">programs</a>.
        </p>
      </main>
    );
  }

  return (
    <main className="page">
      <a className="back-link" href="/programs">
        ← Programs
      </a>
      <h1>Checkout</h1>
      <p className="page-lead">Direct purchase for ORI6IN programs (sandbox checkout in demo).</p>
      {error && <p className="text-error">{error}</p>}
      {status && <p className="meta">{status}</p>}
      {!program ? (
        <p className="meta">Loading program…</p>
      ) : (
        <div className="form-grid">
          <h2 style={{ marginTop: 0 }}>{program.title}</h2>
          <p className="page-lead">{program.summary}</p>
          <p className="price-tag">{formatPrice(program.priceCents, program.currency)}</p>
          <Tooltip label="Demo coupon: ORI6IN10 for 10% off">
            <input
              placeholder="Coupon (try ORI6IN10)"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              style={{ width: '100%' }}
            />
          </Tooltip>
          <button
            className="btn btn-accent"
            type="button"
            disabled={busy}
            onClick={purchase}
          >
            {busy ? 'Processing…' : 'Pay (sandbox)'}
          </button>
          <p className="meta">
            Uses mock payment completion until Razorpay/Stripe keys are wired.
          </p>
        </div>
      )}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="page">Loading checkout…</main>}>
      <CheckoutInner />
    </Suspense>
  );
}
