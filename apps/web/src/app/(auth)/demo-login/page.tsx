'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_ACCOUNTS } from '@ori6in/shared';
import { apiFetch, portalPathForRole, setSession } from '../../../lib/auth';
import { AuthFrame } from '../../../components/public/AuthFrame';
import { useToast } from '../../../components/Toast';
import { Tooltip } from '../../../components/Tooltip';

function demoRoleLabel(role: string) {
  if (role === 'mentor') return 'Counsellor';
  if (role === 'super_admin') return 'Super admin';
  return role.replaceAll('_', ' ');
}

export default function DemoLoginPage() {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loginAs(email: string, password: string, role: string) {
    setBusy(email);
    setError('');
    const { ok, data } = await apiFetch<{
      token?: string;
      user?: { role: string };
      message?: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setBusy(null);
    if (!ok || !data.token || !data.user) {
      const msg =
        typeof data.message === 'string'
          ? data.message
          : 'Demo login failed. Is ENABLE_DEMO_LOGINS=true and API running?';
      setError(msg);
      toast.error(msg);
      return;
    }
    setSession(data.token, data.user.role);
    toast.success(`Signed in as ${demoRoleLabel(data.user.role)}`);
    router.push(portalPathForRole(data.user.role || role));
  }

  return (
    <AuthFrame
      title="Demo logins"
      lead="Temporary walkthrough accounts for exploring ORI6IN portals."
    >
      <div className="auth-card">
        <p className="page-lead" style={{ margin: '0 0 0.85rem' }}>
          One-click walkthrough accounts for exploring ORI6IN portals.
        </p>

        {error && (
          <div className="auth-alert is-error" style={{ marginBottom: '1rem' }} role="alert">
            <span className="auth-alert-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <div className="stack" style={{ gap: '0.65rem', maxWidth: 'none' }}>
          {DEMO_ACCOUNTS.map((account) => (
            <Tooltip
              key={account.email}
              label={`Opens the ${demoRoleLabel(account.role)} portal`}
              side="bottom"
            >
              <button
                className="auth-submit-btn"
                type="button"
                disabled={busy === account.email}
                onClick={() => void loginAs(account.email, account.password, account.role)}
                style={{
                  background: 'color-mix(in srgb, var(--cream) 60%, #fff)',
                  color: 'var(--navy)',
                  border: '1.5px solid var(--hairline)',
                  boxShadow: 'none',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  fontSize: '0.9rem',
                }}
              >
                <span>
                  <strong style={{ color: 'var(--gold-brand)' }}>✦ {demoRoleLabel(account.role)}</strong>
                  <span style={{ color: 'var(--warm-grey)', marginLeft: '0.5rem', fontWeight: 500, fontSize: '0.82rem' }}>
                    ({account.email})
                  </span>
                </span>
                <span>{busy === account.email ? '…' : '→'}</span>
              </button>
            </Tooltip>
          ))}
        </div>

        <div className="auth-card__footer">
          <p className="auth-card__footer-text">
            Ready to log in normally?{' '}
            <a href="/login" className="auth-card__footer-link">
              Standard sign in
            </a>
          </p>
        </div>
      </div>
    </AuthFrame>
  );
}
