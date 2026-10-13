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
      <div className="auth-card">
        {done ? (
          <div className="auth-alert" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }}>
            <span className="auth-alert-icon">✓</span>
            <span>Password updated successfully. Redirecting to sign in…</span>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="reset-token" className="auth-label">
                Reset Token
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon" aria-hidden="true">🔑</span>
                <input
                  id="reset-token"
                  className="auth-input"
                  placeholder="Paste reset token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reset-new-password" className="auth-label">
                New Password
              </label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon" aria-hidden="true">🔒</span>
                <input
                  id="reset-new-password"
                  className="auth-input"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="auth-alert is-error" role="alert">
                <span className="auth-alert-icon">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <button className="auth-submit-btn" type="submit">
              Update Password
            </button>
          </form>
        )}

        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            <a href="/login" className="auth-card__footer-link">
              Back to sign in
            </a>
          </p>
        </div>
      </div>
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
