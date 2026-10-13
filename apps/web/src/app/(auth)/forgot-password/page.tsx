'use client';

import { useState } from 'react';
import { apiFetch } from '../../../lib/auth';
import { AuthFrame } from '../../../components/public/AuthFrame';
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
    <AuthFrame
      title="Forgot password"
      lead="We’ll send a reset link if the account exists."
    >
      <div className="auth-card">
        <form onSubmit={onSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="forgot-email" className="auth-label">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">✉</span>
              <input
                id="forgot-email"
                className="auth-input"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

          {message && (
            <div className="auth-alert" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }} role="status">
              <span className="auth-alert-icon">✓</span>
              <span>{message}</span>
            </div>
          )}

          {devToken && (
            <div className="auth-alert" style={{ background: '#fdf8ea', border: '1px solid var(--gold-descriptor)', color: 'var(--navy)' }}>
              <span>
                Dev reset link:{' '}
                <a href={`/reset-password?token=${devToken}`} style={{ color: 'var(--gold-brand)', fontWeight: 600 }}>Reset password</a>
              </span>
            </div>
          )}

          <button className="auth-submit-btn" type="submit">
            Send Reset Link
          </button>
        </form>

        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            Remembered your password?{' '}
            <a href="/login" className="auth-card__footer-link">
              Back to sign in
            </a>
          </p>
        </div>
      </div>
    </AuthFrame>
  );
}
