'use client';

import { useState } from 'react';
import { apiFetch } from '../../../lib/auth';
import { useToast } from '../../../components/Toast';

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devToken, setDevToken] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setDevToken('');
    const { ok, data } = await apiFetch<{
      message?: string;
      devResetToken?: string;
    }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    if (!ok) {
      setError('Request failed');
      toast.error('Could not send reset link');
      return;
    }
    const msg = data.message ?? 'If the email exists, a reset link will be sent';
    setMessage(msg);
    toast.success('Check your email for a reset link');
    if (data.devResetToken) setDevToken(data.devResetToken);
  }

  return (
    <main id="main-content" className="page page-auth">
      <h1>Forgot password</h1>
      <p className="page-lead">We’ll send a reset link if the account exists.</p>
      <form onSubmit={onSubmit} className="form-grid">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-error">{error}</p>}
        {message && <p className="text-success">{message}</p>}
        {devToken && (
          <p className="notice">
            Dev reset link:{' '}
            <a href={`/reset-password?token=${devToken}`}>Reset password</a>
          </p>
        )}
        <button className="btn accent" type="submit">
          Send reset link
        </button>
      </form>
      <p className="meta">
        <a href="/login">Back to login</a>
      </p>
    </main>
  );
}
