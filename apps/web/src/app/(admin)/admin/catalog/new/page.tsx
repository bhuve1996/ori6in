'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell } from '../../../../../components/admin/AdminShell';
import { apiFetch, clearSession, getToken } from '../../../../../lib/auth';
import type { Program } from '../../../../../lib/api';
import { formatPrice } from '../../../../../lib/format';

const emptyForm = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  priceCents: 99900,
  currency: 'INR',
  published: true,
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminCatalogNewPage() {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!getToken()) router.replace('/login');
  }, [router]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    const payload = {
      ...form,
      slug: form.slug.trim() || slugify(form.title),
    };
    const { ok, status, data } = await apiFetch<Program | { message?: unknown }>(
      '/admin/catalog/programs',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );
    setSaving(false);
    if (status === 401 || status === 403) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!ok) {
      setError(JSON.stringify((data as { message?: unknown }).message ?? data));
      return;
    }
    const created = data as Program;
    router.push(`/admin/catalog?created=${encodeURIComponent(created.title)}`);
  }

  return (
    <AdminShell
      title="Create program"
      lead="Add a package to the catalogue. Public pages still use Get a quote — this price is for internal checkout only."
      error={error}
    >
      <p>
        <a className="back-link" href="/admin/catalog">
          ← Catalog
        </a>
      </p>
      <section className="admin-panel admin-form-page">
        <form onSubmit={onCreate} className="admin-form">
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  title,
                  slug: prev.slug === slugify(prev.title) || !prev.slug ? slugify(title) : prev.slug,
                }));
              }}
              required
            />
          </label>
          <label>
            Slug
            <input
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="auto-from-title"
              required
            />
          </label>
          <label>
            Summary
            <input
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
              rows={8}
            />
          </label>
          <label>
            Price (cents, INR)
            <input
              type="number"
              value={form.priceCents}
              onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })}
              required
              min={0}
            />
            <span className="admin-form__hint">
              Preview: {formatPrice(form.priceCents || 0, form.currency)}
            </span>
          </label>
          <label className="admin-form__check">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />
            Publish immediately
          </label>
          <button className="btn btn-accent" type="submit" disabled={saving}>
            {saving ? 'Creating…' : 'Create program'}
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
