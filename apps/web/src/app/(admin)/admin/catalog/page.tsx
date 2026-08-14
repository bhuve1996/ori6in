'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';
import type { Program } from '../../../../lib/api';

const emptyForm = {
  title: '',
  slug: '',
  summary: '',
  description: '',
  priceCents: 99900,
  currency: 'INR',
  published: true,
};

export default function AdminCatalogPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    const { ok, status, data } = await apiFetch<Program[]>('/admin/catalog/programs');
    if (status === 401 || status === 403) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!ok) {
      setError('Failed to load catalog');
      return;
    }
    setPrograms(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void load();
  }, [router]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    const { ok, data } = await apiFetch<Program | { message?: unknown }>('/admin/catalog/programs', {
      method: 'POST',
      body: JSON.stringify(form),
    });
    if (!ok) {
      setError(JSON.stringify((data as { message?: unknown }).message ?? data));
      return;
    }
    setMessage(`Created ${(data as Program).title}`);
    setForm(emptyForm);
    await load();
  }

  async function togglePublish(program: Program) {
    setError('');
    const { ok } = await apiFetch(`/admin/catalog/programs/${program.id}`, {
      method: 'PUT',
      body: JSON.stringify({ published: !program.published }),
    });
    if (!ok) {
      setError('Update failed');
      return;
    }
    await load();
  }

  return (
    <main id="main-content" className="page">
      <a className="back-link" href="/admin">
        ← Admin
      </a>
      <h1>Catalog</h1>
      <p className="page-lead">ORI6IN own programs (including drafts) for catalog management.</p>
      {error && <p className="text-error">{error}</p>}
      {message && <p className="text-success">{message}</p>}

      <section className="section-block">
        <h2>Programs</h2>
        <ul className="plain-list">
          {programs.map((p) => (
            <li key={p.id}>
              <strong>{p.title}</strong> ({p.slug}) — {(p.priceCents / 100).toFixed(0)}{' '}
              {p.currency} — {p.published ? 'published' : 'draft'}{' '}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => void togglePublish(p)}
              >
                {p.published ? 'Unpublish' : 'Publish'}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-block">
        <h2>Create program</h2>
        <form onSubmit={onCreate} className="form-grid form-grid-wide">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <input
            placeholder="slug-kebab-case"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
          />
          <input
            placeholder="Summary"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
          />
          <input
            type="number"
            placeholder="Price (cents)"
            value={form.priceCents}
            onChange={(e) => setForm({ ...form, priceCents: Number(e.target.value) })}
            required
          />
          <label>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => setForm({ ...form, published: e.target.checked })}
            />{' '}
            Published
          </label>
          <button className="btn btn-accent" type="submit">
            Create
          </button>
        </form>
      </section>
    </main>
  );
}
