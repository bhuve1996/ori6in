'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, portalPathForRole, setSession } from '../../../lib/auth';
import { AuthFrame } from '../../../components/public/AuthFrame';
import { BRAND } from '../../../lib/media';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [waitlistState, setWaitlistState] = useState<{
    inWaitlist: boolean;
    alreadyExisted: boolean;
    registeredUser?: { fullName: string; email: string; role: string; token: string };
  } | null>(null);

  // Toggle for testing / walkthroughs
  const [waitlistMode, setWaitlistMode] = useState(true);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { ok, data } = await apiFetch<{
      token?: string;
      user?: { role: string; email?: string; fullName?: string };
      message?: unknown;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!ok || !data.token || !data.user) {
      const msg = typeof data.message === 'string' ? data.message : JSON.stringify(data.message ?? data);
      
      // If user already registered, show waitlist status for students
      if (form.role === 'student' && (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists'))) {
        setWaitlistState({
          inWaitlist: true,
          alreadyExisted: true,
          registeredUser: {
            fullName: form.fullName,
            email: form.email,
            role: form.role,
            token: '',
          },
        });
        return;
      }

      setError(msg);
      return;
    }

    // If waitlist mode is ON and registering as student:
    if (waitlistMode && data.user.role === 'student') {
      setWaitlistState({
        inWaitlist: true,
        alreadyExisted: false,
        registeredUser: {
          fullName: form.fullName,
          email: form.email,
          role: data.user.role,
          token: data.token,
        },
      });
      return;
    }

    // Direct access if waitlistMode is toggled OFF or non-student role
    setSession(data.token, data.user.role);
    router.push(portalPathForRole(data.user.role));
  }

  function proceedToPortal() {
    if (!waitlistState?.registeredUser?.token) {
      router.push('/login');
      return;
    }
    setSession(waitlistState.registeredUser.token, waitlistState.registeredUser.role);
    router.push(portalPathForRole(waitlistState.registeredUser.role));
  }

  if (waitlistState) {
    return (
      <AuthFrame
        title="Student Early Access Waitlist"
        lead="Our student workspace is rolling out in cohorts."
      >
        <div className="waitlist-card">
          <div className="waitlist-card__badge">
            <img
              src={BRAND.owl}
              alt="ORI6IN Owl"
              width={64}
              height={64}
              className="waitlist-card__owl"
            />
          </div>

          <div className="waitlist-card__content">
            <span className="type-kicker" style={{ color: 'var(--gold-descriptor)' }}>
              {waitlistState.alreadyExisted ? 'Account Verified' : 'You’re on the list!'}
            </span>
            <h2 className="waitlist-card__title">
              {waitlistState.alreadyExisted
                ? 'You are already on the student waitlist'
                : 'You have been added to the waitlist'}
            </h2>
            <p className="waitlist-card__msg">
              Welcome, <strong>{waitlistState.registeredUser?.fullName || 'Student'}</strong>! We are onboarding students in curated batches to maintain 1:1 counsellor quality across <strong>ED6E</strong> and <strong>BRI6GE</strong>.
            </p>
            <div className="waitlist-card__meta-pill">
              <span>Registered Email:</span>
              <strong>{waitlistState.registeredUser?.email}</strong>
            </div>
            <p className="waitlist-card__submsg">
              We will send your invite link as soon as your batch opens. In the meantime, you can book a free Profile Discovery Session or explore demo accounts.
            </p>
          </div>

          <div className="waitlist-card__actions">
            <a href="/?lead=discovery" className="btn btn-accent">
              ✦ Book Discovery Session
            </a>
            {waitlistState.registeredUser?.token ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={proceedToPortal}
              >
                Preview Student Portal Anyway →
              </button>
            ) : (
              <a href="/login" className="btn btn-secondary">
                Sign in to another account
              </a>
            )}
          </div>

          <div className="waitlist-card__footer">
            <button
              type="button"
              className="waitlist-toggle-link"
              onClick={() => setWaitlistState(null)}
            >
              ← Back to registration form
            </button>
          </div>
        </div>
      </AuthFrame>
    );
  }

  return (
    <AuthFrame
      title="Create an account"
      lead="One person, one role. Company accounts are created by admins."
    >
      <div className="auth-mode-toggle">
        <label className="auth-mode-toggle__label">
          <input
            type="checkbox"
            checked={waitlistMode}
            onChange={(e) => setWaitlistMode(e.target.checked)}
            className="auth-mode-toggle__input"
          />
          <span className="auth-mode-toggle__text">
            Waitlist gate enabled for students ({waitlistMode ? 'Active' : 'Bypassed'})
          </span>
        </label>
      </div>

      <div className="auth-card">
        <form onSubmit={onSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="reg-name" className="auth-label">
              Full Name
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">👤</span>
              <input
                id="reg-name"
                className="auth-input"
                placeholder="Student or Guardian Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-email" className="auth-label">
              Email Address
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">✉</span>
              <input
                id="reg-email"
                className="auth-input"
                placeholder="name@example.com"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-password" className="auth-label">
              Password
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">🔒</span>
              <input
                id="reg-password"
                className="auth-input"
                type="password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                minLength={8}
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="reg-role" className="auth-label">
              I am joining as
            </label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon" aria-hidden="true">🎓</span>
              <select
                id="reg-role"
                className="auth-input auth-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="student">Student (Class 8–12 / UG)</option>
                <option value="mentor">Counsellor / Mentor</option>
                <option value="parent">Parent / Guardian</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="auth-alert is-error" role="alert">
              <span className="auth-alert-icon">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <button className="auth-submit-btn" type="submit" disabled={loading}>
            {loading ? 'Processing…' : form.role === 'student' ? 'Join Student Waitlist' : 'Create Account'}
          </button>
        </form>

        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            Already have an account?{' '}
            <a href="/login" className="auth-card__footer-link">
              Sign in
            </a>
          </p>
          <div className="auth-card__divider">
            <span>or</span>
          </div>
          <a href="/demo-login" className="auth-demo-pill">
            <span>✦</span> Demo Walkthrough Logins
          </a>
        </div>
      </div>
    </AuthFrame>
  );
}
