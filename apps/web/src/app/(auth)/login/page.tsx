'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiFetch, setSession } from '../../../lib/auth';
import { resolvePostLoginPath } from '../../../lib/routes';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { ok, data } = await apiFetch<{
      token?: string;
      user?: { role: string };
      message?: string | string[];
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!ok || !data.token || !data.user) {
      setError(
        typeof data.message === 'string'
          ? data.message
          : Array.isArray(data.message)
            ? data.message.join(', ')
            : 'Login failed',
      );
      return;
    }
    setSession(data.token, data.user.role);
    router.push(resolvePostLoginPath(data.user.role, next));
  }

  return (
    <>
      <PageBanner
        image={BANNERS.auth}
        title="Login"
        lead="Sign in to your ORI6IN portal."
      />
      <main id="main-content" className="page page-auth page-after-banner">
      <form onSubmit={onSubmit} className="form-grid">
        <input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-error">{error}</p>}
        <button className="btn btn-accent" type="submit">
          Sign in
        </button>
      </form>
      <p className="meta">
        <a href="/register">Create an account</a>
        {' · '}
        <a href="/forgot-password">Forgot password</a>
        {' · '}
        <a href="/demo-login">Demo logins</a>
      </p>
    </main>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="page page-auth">Loading…</main>}>
      <LoginForm />
    </Suspense>
  );
}
