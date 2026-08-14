'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken } from '../../../../lib/auth';

type Notification = {
  id: string;
  channel: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export default function StudentNotificationsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Notification[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { ok, status, data } = await apiFetch<Notification[]>('/notifications');
    if (status === 401) {
      clearSession();
      router.replace('/login?next=/student/notifications');
      return;
    }
    if (!ok) {
      setError('Failed to load notifications');
      setLoading(false);
      return;
    }
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login?next=/student/notifications');
      return;
    }
    void load();
  }, [router]);

  async function markRead(id: string) {
    const { ok } = await apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
    if (ok) {
      setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    }
  }

  async function markAllRead() {
    const { ok } = await apiFetch('/notifications/read-all', { method: 'PATCH' });
    if (ok) {
      setItems((list) => list.map((n) => ({ ...n, read: true })));
    }
  }

  const unread = items.filter((n) => !n.read).length;

  if (loading) {
    return (
      <main id="main-content" className="page">
        <p className="meta">Loading…</p>
      </main>
    );
  }

  return (
    <main className="page">
      <a className="back-link" href="/student">
        ← Student
      </a>
      <h1>Notifications</h1>
      <p className="page-lead">
        {unread > 0 ? `${unread} unread` : 'All caught up'}
      </p>
      {unread > 0 && (
        <div className="cta-row">
          <button type="button" className="btn btn-secondary" onClick={() => void markAllRead()}>
            Mark all read
          </button>
        </div>
      )}
      {error && <p className="text-error">{error}</p>}

      {items.length === 0 && <p className="notice">No notifications yet.</p>}
      <div className="card-list">
        {items.map((n) => (
          <article key={n.id}>
            <strong>{n.title}</strong>
            <p>{n.body}</p>
            <p className="meta">
              {new Date(n.createdAt).toLocaleString()} · {n.channel}
              {!n.read && (
                <>
                  {' · '}
                  <button type="button" className="btn btn-secondary" onClick={() => void markRead(n.id)}>
                    Mark read
                  </button>
                </>
              )}
            </p>
          </article>
        ))}
      </div>
    </main>
  );
}
