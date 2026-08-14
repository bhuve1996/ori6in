'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageBanner } from '../../../../../components/PageBanner';
import { BANNERS } from '../../../../../lib/media';

type VerifyResult = {
  valid: boolean;
  code: string;
  recipientName: string;
  programTitle: string;
  title: string;
  issuedAt: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3001/api';

export default function CertificateVerifyPage() {
  const params = useParams<{ code: string }>();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_BASE}/certificates/verify/${encodeURIComponent(params.code)}`,
        );
        if (!res.ok) {
          if (!cancelled) setError('Certificate not found');
          return;
        }
        const data = (await res.json()) as VerifyResult;
        if (!cancelled) setResult(data);
      } catch {
        if (!cancelled) setError('Could not verify certificate');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.code]);

  return (
    <>
      <PageBanner
        image={BANNERS.about}
        title="Verify certificate"
        lead="Confirm an ORI6IN program-completion certificate by code."
      />
      <main id="main-content" className="page page-after-banner">
        {loading ? <p className="meta">Checking…</p> : null}
        {error ? <p className="text-error">{error}</p> : null}
        {result ? (
          <article className="certificate-sheet">
            <p className="certificate-sheet__kicker">Verified</p>
            <h1 className="certificate-sheet__title">{result.title}</h1>
            <p className="certificate-sheet__body">
              <strong>{result.recipientName}</strong> completed{' '}
              <strong>{result.programTitle}</strong>.
            </p>
            <p className="meta">
              Code {result.code} · Issued {new Date(result.issuedAt).toLocaleDateString()}
            </p>
          </article>
        ) : null}
      </main>
    </>
  );
}
