'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell, AdminStatusPill } from '../../../../components/admin/AdminShell';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';
import type { BlogPost, CmsPage } from '../../../../lib/api';

export default function AdminCmsPage() {
  const router = useRouter();
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageForm, setPageForm] = useState({
    slug: 'about',
    title: '',
    body: '',
    published: true,
  });
  const [blogForm, setBlogForm] = useState({
    slug: '',
    title: '',
    excerpt: '',
    body: '',
    published: true,
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const pagesRes = await apiFetch<CmsPage[]>('/admin/cms/pages');
    const blogRes = await apiFetch<BlogPost[]>('/admin/cms/blog');
    if (pagesRes.status === 401 || pagesRes.status === 403) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!pagesRes.ok || !blogRes.ok) {
      setError('Failed to load CMS');
      setLoading(false);
      return;
    }
    setPages(Array.isArray(pagesRes.data) ? pagesRes.data : []);
    setPosts(Array.isArray(blogRes.data) ? blogRes.data : []);
    setLoading(false);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void load();
  }, [router]);

  async function savePage(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    const { ok, data } = await apiFetch<CmsPage | { message?: unknown }>('/admin/cms/pages', {
      method: 'POST',
      body: JSON.stringify(pageForm),
    });
    if (!ok) {
      setError(JSON.stringify((data as { message?: unknown }).message ?? data));
      return;
    }
    setMessage(`Saved page ${(data as CmsPage).slug}`);
    await load();
  }

  async function saveBlog(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    const { ok, data } = await apiFetch<BlogPost | { message?: unknown }>('/admin/cms/blog', {
      method: 'POST',
      body: JSON.stringify(blogForm),
    });
    if (!ok) {
      setError(JSON.stringify((data as { message?: unknown }).message ?? data));
      return;
    }
    setMessage(`Saved post ${(data as BlogPost).slug}`);
    setBlogForm({ slug: '', title: '', excerpt: '', body: '', published: true });
    await load();
  }

  return (
    <AdminShell
      layout="full"
      title="CMS"
      lead="Edit public pages (About, Get a quote) and blog posts."
      loading={loading}
      error={error}
      message={message}
      stats={[
        { value: pages.length, label: 'Pages' },
        { value: posts.length, label: 'Blog posts' },
        {
          value: pages.filter((p) => p.published).length + posts.filter((p) => p.published).length,
          label: 'Published',
        },
      ]}
    >
      <div className="admin-split">
        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2>Pages</h2>
            <p className="admin-panel__meta">{pages.length} total</p>
          </div>
          <div className="admin-table-wrap" style={{ marginBottom: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Slug</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <span className="admin-table__slug">{p.slug}</span>
                    </td>
                    <td>
                      <p className="admin-table__title">{p.title}</p>
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
                          onClick={() =>
                            setPageForm({
                              slug: p.slug,
                              title: p.title,
                              body: p.body,
                              published: p.published,
                            })
                          }
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <form onSubmit={savePage} className="admin-form">
            <label>
              Slug
              <input
                value={pageForm.slug}
                onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
                required
              />
            </label>
            <label>
              Title
              <input
                value={pageForm.title}
                onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
                required
              />
            </label>
            <label>
              Body
              <textarea
                value={pageForm.body}
                onChange={(e) => setPageForm({ ...pageForm, body: e.target.value })}
                required
                rows={8}
              />
            </label>
            <label className="admin-form__check">
              <input
                type="checkbox"
                checked={pageForm.published}
                onChange={(e) => setPageForm({ ...pageForm, published: e.target.checked })}
              />
              Published
            </label>
            <button className="btn btn-accent" type="submit">
              Save page
            </button>
          </form>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2>Blog posts</h2>
            <p className="admin-panel__meta">{posts.length} total</p>
          </div>
          <div className="admin-table-wrap" style={{ marginBottom: '1rem' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 ? (
                  <tr>
                    <td colSpan={3}>
                      <p className="admin-empty">No posts yet.</p>
                    </td>
                  </tr>
                ) : (
                  posts.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <p className="admin-table__title">{p.title}</p>
                        <p className="admin-table__sub">
                          <span className="admin-table__slug">{p.slug}</span>
                          {p.excerpt ? ` · ${p.excerpt}` : ''}
                        </p>
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
                            onClick={() =>
                              setBlogForm({
                                slug: p.slug,
                                title: p.title,
                                excerpt: p.excerpt,
                                body: p.body,
                                published: p.published,
                              })
                            }
                          >
                            Edit
                          </button>
                          <a className="btn btn-secondary" href={`/blog/${p.slug}`}>
                            View
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <form onSubmit={saveBlog} className="admin-form">
            <label>
              Slug
              <input
                value={blogForm.slug}
                onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
                required
              />
            </label>
            <label>
              Title
              <input
                value={blogForm.title}
                onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                required
              />
            </label>
            <label>
              Excerpt
              <input
                value={blogForm.excerpt}
                onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                required
              />
            </label>
            <label>
              Body
              <textarea
                value={blogForm.body}
                onChange={(e) => setBlogForm({ ...blogForm, body: e.target.value })}
                required
                rows={8}
              />
            </label>
            <label className="admin-form__check">
              <input
                type="checkbox"
                checked={blogForm.published}
                onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
              />
              Published
            </label>
            <button className="btn btn-accent" type="submit">
              Save post
            </button>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
