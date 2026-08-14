'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, portalPathForRole, setSession } from '../../../lib/auth';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student',
  });
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { ok, data } = await apiFetch<{
      token?: string;
      user?: { role: string };
      message?: unknown;
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    if (!ok || !data.token || !data.user) {
      setError(typeof data.message === 'string' ? data.message : JSON.stringify(data.message ?? data));
      return;
    }
    setSession(data.token, data.user.role);
    router.push(portalPathForRole(data.user.role));
  }

  return (
    <>
      <PageBanner
        image={BANNERS.auth}
        title="Register"
        lead="One person, one role. Company accounts are created by admins."
      />
      <main id="main-content" className="page page-auth page-after-banner">
      <form onSubmit={onSubmit} className="form-grid">
        <input
          placeholder="Full name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password (min 8)"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          minLength={8}
          required
        />
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="parent">Parent</option>
        </select>
        {error && <p className="text-error">{error}</p>}
        <button className="btn btn-accent" type="submit">
          Create account
        </button>
      </form>
      <p className="meta">
        <a href="/login">Already have an account?</a>
      </p>
    </main>
    </>
  );
}
