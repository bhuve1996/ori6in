'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, setSession } from '../../../lib/auth';
import { resolvePostLoginPath } from '../../../lib/routes';
import { AuthFrame } from '../../../components/public/AuthFrame';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { ok, data } = await apiFetch<{
      token?: string;
      user?: { role: string };
      message?: string | string[];
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setSubmitting(false);
    if (!ok || !data.token || !data.user) {
      setError(
        typeof data.message === 'string'
          ? data.message
          : Array.isArray(data.message)
            ? data.message.join(', ')
            : 'Invalid credentials. Please verify your email and password.',
      );
      return;
    }
    setSession(data.token, data.user.role);
    router.push(resolvePostLoginPath(data.user.role, next));
  }

  return (
    <AuthFrame
      title="Sign in"
      lead="Student, parent, and counsellor portals — one sign-in."
    >
      <div className="auth-card">
        <form onSubmit={onSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">✉</span>
              <input
                id="login-email"
                className="auth-input"
                placeholder="name@example.com"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="login-password" className="auth-label">
                Password
              </label>
              <a href="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </a>
            </div>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">🔒</span>
              <input
                id="login-password"
                className="auth-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="auth-toggle-pwd"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-alert is-error" role="alert">
              <span className="auth-alert-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button className="auth-submit-btn" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in to ORI6IN'}
          </button>
        </form>

        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            Don’t have an account?{' '}
            <a href="/register" className="auth-card__footer-link">
              Create an account
            </a>
          </p>
          <div className="auth-card__divider">
            <span>or</span>
          </div>
          <a href="/demo-login" className="auth-demo-pill">
            <span>✦</span> Explore with Demo Logins
          </a>
        </div>
      </div>
    </AuthFrame>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="pub">Loading…</main>}>
      <LoginForm />
    </Suspense>
  );
}
