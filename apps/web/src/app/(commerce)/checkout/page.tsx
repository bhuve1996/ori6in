'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, getToken } from '../../../lib/auth';
import { publicFetch, type Program } from '../../../lib/api';
import { useToast } from '../../../components/Toast';
import { Tooltip } from '../../../components/Tooltip';
import { formatPrice } from '../../../lib/format';

function CheckoutInner() {
  const router = useRouter();
  const toast = useToast();
  const params = useSearchParams();
  const programId = params.get('programId') ?? '';
  const [program, setProgram] = useState<Program | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace(`/login?next=/checkout?programId=${programId}`);
      return;
    }
    if (!programId) return;
    void (async () => {
      const catalog =
        (await publicFetch<
          Array<{
            programId: string;
            slug: string;
            title: string;
            summary: string;
            priceCents: number;
            currency: string;
          }>
        >('/catalog')) ?? [];
      const item = catalog.find((c) => c.programId === programId);
      if (!item) {
        setError('Program not available for purchase');
        return;
      }
      setProgram({
        id: item.programId,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        description: '',
        priceCents: item.priceCents,
        currency: item.currency,
        published: true,
      });
    })();
  }, [programId, router]);

  async function purchase() {
    if (!program) return;
    setBusy(true);
    setError('');
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
      setBusy(false);
      const msg =
        typeof checkout.data.message === 'string'
          ? checkout.data.message
          : JSON.stringify(checkout.data.message ?? checkout.data);
      setError(msg);
      toast.error('Checkout failed');
      return;
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
      setBusy(false);
      setError('Payment create failed');
      toast.error('Payment create failed');
      return;
    }

    setStatus('Completing sandbox payment…');
    const done = await apiFetch<{ order?: { id: string } }>('/payments/mock-complete', {
      method: 'POST',
      body: JSON.stringify({ paymentId: pay.data.payment.id }),
    });

    setBusy(false);
    if (!done.ok || !done.data.order) {
      setError('Payment completion failed');
      toast.error('Payment completion failed');
      return;
    }

    toast.success('Purchase complete');
    setStatus('Purchase complete');
    router.push(`/student/orders?highlight=${done.data.order.id}`);
  }

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
      <p className="page-lead">Direct purchase — Phase 1 ORI6IN programs only.</p>
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
            className="btn accent"
            type="button"
            disabled={busy}
            onClick={() => void purchase()}
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
