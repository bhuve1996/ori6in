'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminShell, AdminStatusPill } from '../../../../components/admin/AdminShell';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';
import type { Program } from '../../../../lib/api';
import { formatPrice } from '../../../../lib/format';

type PubFilter = 'all' | 'published' | 'draft';

function AdminCatalogPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [pubFilter, setPubFilter] = useState<PubFilter>('all');
  const [busyId, setBusyId] = useState<string | null>(null);

  async function load() {
    const { ok, status, data } = await apiFetch<Program[]>('/admin/catalog/programs');
    if (status === 401 || status === 403) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!ok) {
      setError('Failed to load catalog');
      setLoading(false);
      return;
    }
    setPrograms(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void load();
  }, [router]);

  useEffect(() => {
    const created = searchParams.get('created');
    if (created) setMessage(`Created ${created}`);
  }, [searchParams]);

  const publishedCount = programs.filter((p) => p.published).length;
  const draftCount = programs.length - publishedCount;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      if (pubFilter === 'published' && !p.published) return false;
      if (pubFilter === 'draft' && p.published) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q)
      );
    });
  }, [programs, query, pubFilter]);

  async function togglePublish(program: Program) {
    setError('');
    setBusyId(program.id);
    const { ok } = await apiFetch(`/admin/catalog/programs/${program.id}`, {
      method: 'PUT',
      body: JSON.stringify({ published: !program.published }),
    });
    setBusyId(null);
    if (!ok) {
      setError('Update failed');
      return;
    }
    await load();
  }

  return (
    <AdminShell
      layout="full"
      title="Catalog"
      lead="Education packages and programs — publish for the public catalogue. Prices are internal (checkout); the public site uses Get a quote."
      loading={loading}
      error={error}
      message={message}
      stats={[
        { value: programs.length, label: 'Total' },
        { value: publishedCount, label: 'Published' },
        { value: draftCount, label: 'Drafts' },
      ]}
      actions={
        <a className="btn btn-accent" href="/admin/catalog/new">
          Create program
        </a>
      }
    >
      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2>Programs</h2>
          <p className="admin-panel__meta">
            {filtered.length} shown
            {filtered.length !== programs.length ? ` of ${programs.length}` : ''}
          </p>
        </div>

        <div className="admin-filters">
          <input
            type="search"
            placeholder="Search title, slug, summary…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search programs"
          />
          <div className="admin-filter-chips" role="group" aria-label="Publish filter">
            {(
              [
                ['all', 'All'],
                ['published', 'Published'],
                ['draft', 'Draft'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className="admin-chip"
                aria-pressed={pubFilter === id}
                onClick={() => setPubFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="admin-empty">No programs match these filters.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Program</th>
                  <th>Slug</th>
                  <th>Internal price</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <p className="admin-table__title">{p.title}</p>
                      <p className="admin-table__sub">{p.summary}</p>
                    </td>
                    <td>
                      <span className="admin-table__slug">{p.slug}</span>
                    </td>
                    <td>
                      <span>{formatPrice(p.priceCents, p.currency)}</span>
                      <p className="admin-table__sub">Checkout only</p>
                    </td>
                    <td>
                      <AdminStatusPill tone={p.published ? 'ok' : 'warn'}>
                        {p.published ? 'Published' : 'Draft'}
                      </AdminStatusPill>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={busyId === p.id}
                          onClick={() => void togglePublish(p)}
                        >
                          {p.published ? 'Unpublish' : 'Publish'}
                        </button>
                        <a className="btn btn-secondary" href={`/programs/${p.slug}`}>
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="admin-form__hint" style={{ marginTop: '0.85rem' }}>
          Public site shows Get a quote — not these list prices.
        </p>
      </section>
    </AdminShell>
  );
}

export default function AdminCatalogPage() {
  return (
    <Suspense fallback={<p className="meta">Loading…</p>}>
      <AdminCatalogPageInner />
    </Suspense>
  );
}
