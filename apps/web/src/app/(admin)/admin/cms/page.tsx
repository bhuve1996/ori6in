'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
      return;
    }
    setPages(Array.isArray(pagesRes.data) ? pagesRes.data : []);
    setPosts(Array.isArray(blogRes.data) ? blogRes.data : []);
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
    <main id="main-content" className="page">
      <a className="back-link" href="/admin">
        ← Admin
      </a>
      <h1>CMS</h1>
      {error && <p className="text-error">{error}</p>}
      {message && <p className="text-success">{message}</p>}

      <section className="section-block">
        <h2>Pages</h2>
        <ul className="plain-list">
          {pages.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className="btn secondary"
                onClick={() =>
                  setPageForm({
                    slug: p.slug,
                    title: p.title,
                    body: p.body,
                    published: p.published,
                  })
                }
              >
                Edit {p.slug}
              </button>{' '}
              — {p.published ? 'published' : 'draft'}
            </li>
          ))}
        </ul>
        <form onSubmit={savePage} className="form-grid wide">
          <input
            placeholder="slug"
            value={pageForm.slug}
            onChange={(e) => setPageForm({ ...pageForm, slug: e.target.value })}
            required
          />
          <input
            placeholder="Title"
            value={pageForm.title}
            onChange={(e) => setPageForm({ ...pageForm, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Body"
            value={pageForm.body}
            onChange={(e) => setPageForm({ ...pageForm, body: e.target.value })}
            required
            rows={6}
          />
          <label>
            <input
              type="checkbox"
              checked={pageForm.published}
              onChange={(e) => setPageForm({ ...pageForm, published: e.target.checked })}
            />{' '}
            Published
          </label>
          <button className="btn accent" type="submit">
            Save page
          </button>
        </form>
      </section>

      <section className="section-block">
        <h2>Blog posts</h2>
        <ul className="plain-list">
          {posts.map((p) => (
            <li key={p.id}>
              {p.title} ({p.slug}) — {p.published ? 'published' : 'draft'}
            </li>
          ))}
        </ul>
        <form onSubmit={saveBlog} className="form-grid wide">
          <input
            placeholder="slug"
            value={blogForm.slug}
            onChange={(e) => setBlogForm({ ...blogForm, slug: e.target.value })}
            required
          />
          <input
            placeholder="Title"
            value={blogForm.title}
            onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
            required
          />
          <input
            placeholder="Excerpt"
            value={blogForm.excerpt}
            onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
            required
          />
          <textarea
            placeholder="Body"
            value={blogForm.body}
            onChange={(e) => setBlogForm({ ...blogForm, body: e.target.value })}
            required
            rows={6}
          />
          <label>
            <input
              type="checkbox"
              checked={blogForm.published}
              onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
            />{' '}
            Published
          </label>
          <button className="btn accent" type="submit">
            Save post
          </button>
        </form>
      </section>
    </main>
  );
}
