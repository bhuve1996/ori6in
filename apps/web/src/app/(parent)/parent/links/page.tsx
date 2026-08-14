'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type LinkRow = {
  id: string;
  status: string;
  inviteEmail: string;
  studentName: string | null;
  studentEmail: string;
};

export default function ParentLinksPage() {
  const { data, loading, error, reload } = useApiResource<{ items: LinkRow[] }>(
    '/parent/links',
    { errorMessage: 'Failed to load links' },
  );
  const items = data?.items ?? [];
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  async function onInvite(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    setNotice(null);
    const { ok, data: res } = await apiFetch<LinkRow>('/parent/links', {
      method: 'POST',
      body: JSON.stringify({ studentEmail: email }),
    });
    setBusy(false);
    if (!ok) {
      setFormError('Could not invite — check the student email exists.');
      return;
    }
    setEmail('');
    setNotice(
      (res as LinkRow).status === 'pending'
        ? 'Invite sent — waiting for the student to accept.'
        : 'Student already linked.',
    );
    reload();
  }

  async function revoke(id: string) {
    setBusy(true);
    setNotice(null);
    const { ok } = await apiFetch(`/parent/links/${id}/revoke`, { method: 'POST' });
    setBusy(false);
    if (!ok) {
      setFormError('Could not revoke link');
      return;
    }
    setNotice('Link revoked');
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Student links',
        lead: 'Invite your student by email. They must accept before you can follow their activity.',
      }}
      back={{ href: '/parent', label: 'Parent' }}
      loading={loading}
      error={error}
    >
      <section className="section-block">
        <h2>Invite student</h2>
        <form className="stack-form" onSubmit={onInvite}>
          <label>
            Student email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="student@demo.ori6in.test"
            />
          </label>
          <button className="btn btn-accent" type="submit" disabled={busy}>
            {busy ? 'Sending…' : 'Send invite'}
          </button>
        </form>
        {formError ? <p className="text-error">{formError}</p> : null}
        {notice ? <p className="notice">{notice}</p> : null}
      </section>

      <section className="section-block">
        <h2>Your links</h2>
        {items.length === 0 ? (
          <p className="meta">No links yet.</p>
        ) : (
          <ul className="card-list">
            {items.map((item) => (
              <li key={item.id}>
                <article>
                  <h3 style={{ marginTop: 0 }}>
                    {item.studentName ?? item.studentEmail}
                  </h3>
                  <p className="meta">
                    {item.studentEmail} · {item.status}
                  </p>
                  {item.status !== 'revoked' ? (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={busy}
                      onClick={() => void revoke(item.id)}
                    >
                      Revoke
                    </button>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PortalShell>
  );
}
