'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch } from '../../../lib/auth';
import { AuthFrame } from '../../../components/public/AuthFrame';
import { useToast } from '../../../components/Toast';

function ResetPasswordForm() {
  const router = useRouter();
  const toast = useToast();
  const params = useSearchParams();
  const [token, setToken] = useState(params.get('token') ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { ok, data } = await apiFetch<{ message?: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
    if (!ok) {
      const msg = typeof data.message === 'string' ? data.message : 'Reset failed';
      setError(msg);
      toast.error(msg);
      return;
    }
    setDone(true);
    toast.success('Password updated');
    setTimeout(() => router.push('/login'), 1200);
  }

  return (
    <AuthFrame title="Reset password" lead="Choose a new password, then sign in.">
      {done ? (
        <p className="text-success">Password updated. Redirecting to sign in…</p>
      ) : (
        <form onSubmit={onSubmit} className="form-grid">
          <input
            placeholder="Reset token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New password (min 8)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {error && <p className="text-error">{error}</p>}
          <button className="btn btn-accent" type="submit">
            Update password
          </button>
        </form>
      )}
    </AuthFrame>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="pub">Loading…</main>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
