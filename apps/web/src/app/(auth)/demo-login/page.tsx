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
      <p className="page-lead">
        Credentials live in <code>docs/demo-logins.md</code>. Disable with{' '}
        <code>ENABLE_DEMO_LOGINS=false</code>.
      </p>
      <p className="notice">
        Shared password:{' '}
        <Tooltip label="Copied from docs/demo-logins.md">
          <code>DemoPass123!</code>
        </Tooltip>
      </p>
      {error && <p className="text-error">{error}</p>}
      <div className="stack">
        {DEMO_ACCOUNTS.map((account) => (
          <Tooltip
            key={account.email}
            label={`Opens the ${demoRoleLabel(account.role)} portal`}
            side="bottom"
          >
            <button
              className="btn"
              type="button"
              disabled={busy === account.email}
              onClick={() => void loginAs(account.email, account.password, account.role)}
              style={{ width: '100%' }}
            >
              {busy === account.email
                ? 'Signing in…'
                : `${demoRoleLabel(account.role)} — ${account.email}`}
            </button>
          </Tooltip>
        ))}
      </div>
      <p className="meta">
        <a href="/login">Normal login</a>
      </p>
    </AuthFrame>
  );
}
