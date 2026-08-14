'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiFetch, fetchMe, getToken } from '../../../lib/auth';

function VerifyEmailInner() {
  const params = useSearchParams();
  const [status, setStatus] = useState('Verifying…');
  const [ok, setOk] = useState(false);
  const [profile, setProfile] = useState<{ email: string; emailVerified: boolean } | null>(
    null,
  );

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setStatus('Missing verification token.');
      return;
    }
    void (async () => {
      const { ok: success, data } = await apiFetch<{
        message?: string;
        emailVerified?: boolean;
      }>('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      });
      if (!success) {
        setStatus(typeof data.message === 'string' ? data.message : 'Verification failed');
        return;
      }
      setOk(true);
      setStatus('Email verified.');
      if (getToken()) {
        const me = await fetchMe();
        if (me) setProfile({ email: me.email, emailVerified: me.emailVerified });
      }
    })();
  }, [params]);

  return (
    <main id="main-content" className="page page-auth">
      <h1>Verify email</h1>
      <p className={ok ? 'text-success' : 'page-lead'}>{status}</p>
      {profile && (
        <p className="meta">
          {profile.email} — verified: {String(profile.emailVerified)}
        </p>
      )}
      <div className="cta-row">
        <a className="btn accent" href="/login">
          Go to login
        </a>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<main className="page page-auth">Loading…</main>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
