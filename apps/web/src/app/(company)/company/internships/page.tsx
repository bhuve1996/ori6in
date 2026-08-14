'use client';

import { FormEvent, useState } from 'react';
import { apiFetch } from '../../../../lib/auth';
import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Listing = {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  description: string;
  approvalStatus: string;
  paymentStatus: string;
  published: boolean;
};

export default function CompanyInternshipsPage() {
  const { data, loading, error, reload } = useApiResource<{ items: Listing[] }>(
    '/company/internships',
    { errorMessage: 'Failed to load roles' },
  );
  const items = data?.items ?? [];
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('Remote');
  const [description, setDescription] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy('create');
    setFormError(null);
    setNotice(null);
    const { ok, data: created } = await apiFetch<Listing>('/company/internships', {
      method: 'POST',
      body: JSON.stringify({ title, location, description }),
    });
    setBusy(null);
    if (!ok) {
      setFormError('Could not create role — check fields and try again.');
      return;
    }
    setTitle('');
    setDescription('');
    setNotice(`Draft created: ${(created as Listing).title}`);
    reload();
  }

  async function pay(id: string) {
    setBusy(id);
    setNotice(null);
    const { ok, data: res } = await apiFetch<Listing & { note?: string }>(
      `/company/internships/${id}/pay`,
      { method: 'POST' },
    );
    setBusy(null);
    if (!ok) {
      setFormError('Payment failed');
      return;
    }
    setNotice((res as { note?: string }).note ?? 'Marked as paid');
    reload();
  }

  async function submit(id: string) {
    setBusy(id);
    setFormError(null);
    setNotice(null);
    const { ok } = await apiFetch(`/company/internships/${id}/submit`, { method: 'POST' });
    setBusy(null);
    if (!ok) {
      setFormError('Submit failed — pay first if unpaid.');
      return;
    }
    setNotice('Submitted for admin approval');
    reload();
  }

  return (
    <PortalShell
      banner={{
        image: BANNERS.internships,
        title: 'Internship roles',
        lead: 'Create roles, pay to post (sandbox), and submit for admin approval.',
      }}
      back={{ href: '/company', label: 'Company' }}
      loading={loading}
      error={error}
    >
      <section className="section-block">
        <h2>Post a new role</h2>
        <form className="stack-form" onSubmit={onCreate}>
          <label>
            Title
            <input value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />
          </label>
          <label>
            Location
            <input value={location} onChange={(e) => setLocation(e.target.value)} required />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              minLength={10}
              rows={4}
            />
          </label>
          <button className="btn accent" type="submit" disabled={busy === 'create'}>
            {busy === 'create' ? 'Saving…' : 'Save draft'}
          </button>
        </form>
        {formError ? <p className="text-error">{formError}</p> : null}
        {notice ? <p className="notice">{notice}</p> : null}
      </section>

      <section className="section-block">
        <h2>Your roles</h2>
        {items.length === 0 ? (
          <p className="meta">No roles yet — create a draft above.</p>
        ) : (
          <ul className="card-list">
            {items.map((item) => (
              <li key={item.id}>
                <article>
                  <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                  <p className="meta">
                    {item.company} · {item.location} · {item.approvalStatus} · pay:{' '}
                    {item.paymentStatus}
                    {item.published ? ' · live' : ''}
                  </p>
                  <p>{item.description}</p>
                  <div className="cta-row">
                    {item.paymentStatus === 'unpaid' ? (
                      <button
                        type="button"
                        className="btn secondary"
                        disabled={busy === item.id}
                        onClick={() => void pay(item.id)}
                      >
                        Pay to post (sandbox)
                      </button>
                    ) : null}
                    {item.approvalStatus === 'draft' || item.approvalStatus === 'rejected' ? (
                      <button
                        type="button"
                        className="btn accent"
                        disabled={busy === item.id || item.paymentStatus === 'unpaid'}
                        onClick={() => void submit(item.id)}
                      >
                        Submit for approval
                      </button>
                    ) : null}
                    {item.approvalStatus === 'pending_approval' ? (
                      <span className="meta">Waiting on admin approval</span>
                    ) : null}
                    {item.approvalStatus === 'approved' && item.published ? (
                      <span className="meta">Live for students</span>
                    ) : null}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PortalShell>
  );
}
