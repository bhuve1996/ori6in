'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch, clearSession, getToken, setSession } from '../../../../lib/auth';
import { Avatar } from '../../../../components/Avatar';
import { PageBanner } from '../../../../components/PageBanner';
import { useToast } from '../../../../components/Toast';
import { Tooltip } from '../../../../components/Tooltip';
import { BANNERS } from '../../../../lib/media';

type UserRow = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  emailVerified: boolean;
};

type Program = { id: string; title: string };

export default function AdminUsersPage() {
  const router = useRouter();
  const toast = useToast();
  const [role, setRole] = useState('');
  const [users, setUsers] = useState<UserRow[]>([]);
  const [mentors, setMentors] = useState<UserRow[]>([]);
  const [students, setStudents] = useState<UserRow[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [company, setCompany] = useState({
    email: '',
    fullName: '',
    password: '',
  });
  const [assign, setAssign] = useState({
    mentorId: '',
    studentId: '',
    programId: '',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadUsers(nextRole = role) {
    const qs = nextRole ? `?role=${encodeURIComponent(nextRole)}` : '';
    const { ok, status, data } = await apiFetch<{ items: UserRow[] }>(
      `/admin/users${qs}`,
    );
    if (status === 401 || status === 403) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!ok) {
      setError('Failed to load users');
      return;
    }
    setUsers(Array.isArray(data.items) ? data.items : []);
  }

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    void loadUsers();
    void (async () => {
      const [m, s, p] = await Promise.all([
        apiFetch<{ items: UserRow[] }>('/admin/users?role=mentor'),
        apiFetch<{ items: UserRow[] }>('/admin/users?role=student'),
        apiFetch<Program[]>('/admin/catalog/programs'),
      ]);
      if (m.ok) setMentors(m.data.items ?? []);
      if (s.ok) setStudents(s.data.items ?? []);
      if (p.ok && Array.isArray(p.data)) setPrograms(p.data);
    })();
  }, [router]);

  async function createCompany(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    const { ok, data } = await apiFetch<UserRow | { message?: unknown }>(
      '/admin/users/company',
      { method: 'POST', body: JSON.stringify(company) },
    );
    if (!ok) {
      setError(JSON.stringify((data as { message?: unknown }).message ?? data));
      toast.error('Could not create company');
      return;
    }
    setMessage(`Company created: ${(data as UserRow).email}`);
    toast.success('Company account created');
    setCompany({ email: '', fullName: '', password: '' });
    await loadUsers();
  }

  async function assignMentor(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    const { ok, data } = await apiFetch<{ message?: unknown }>(
      '/admin/users/assign-mentor',
      { method: 'POST', body: JSON.stringify(assign) },
    );
    if (!ok) {
      setError(JSON.stringify((data as { message?: unknown }).message ?? data));
      toast.error('Could not assign mentor');
      return;
    }
    setMessage('Mentor assigned.');
    toast.success('Mentor assigned');
  }

  async function impersonate(userId: string) {
    setError('');
    const { ok, data } = await apiFetch<{
      token?: string;
      user?: { role: string };
      message?: string;
    }>(`/admin/impersonate/${userId}`, { method: 'POST' });
    if (!ok || !data.token || !data.user) {
      const msg =
        typeof data.message === 'string' ? data.message : 'Impersonation failed';
      setError(msg);
      toast.error(msg);
      return;
    }
    setSession(data.token, data.user.role);
    toast.info(`Now viewing as ${data.user.role}`);
    if (data.user.role === 'mentor') router.push('/mentor');
    else if (data.user.role === 'student') router.push('/student');
    else if (data.user.role === 'company') router.push('/company');
    else router.push('/');
  }

  return (
    <>
      <PageBanner
        image={BANNERS.admin}
        title="Users"
        lead="Filter accounts, create companies, assign mentors, and impersonate for support."
      />
      <main id="main-content" className="page page-after-banner">
      <a className="back-link" href="/admin">
        ← Admin
      </a>
      {error && <p className="text-error">{error}</p>}
      {message && <p className="text-success">{message}</p>}

      <p className="meta">
        Filter:{' '}
        <select
          value={role}
          onChange={(e) => {
            const next = e.target.value;
            setRole(next);
            void loadUsers(next);
          }}
        >
          <option value="">All</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="parent">Parent</option>
          <option value="company">Company</option>
          <option value="admin">Admin</option>
        </select>
      </p>

      <div className="card-list">
        {users.map((u) => (
          <article key={u.id} className="person-row">
            <Avatar
              name={u.fullName}
              seed={u.id}
              kind={u.role === 'mentor' ? 'mentor' : 'student'}
            />
            <div>
              <h3>{u.fullName}</h3>
              <p className="meta">
                {u.email} · {u.role}
                {u.emailVerified ? ' · verified' : ''}
              </p>
              {u.role !== 'admin' && u.role !== 'super_admin' && (
                <p>
                  <Tooltip label="Open their portal with a temporary session">
                    <button
                      type="button"
                      className="btn secondary"
                      onClick={() => void impersonate(u.id)}
                    >
                      Impersonate
                    </button>
                  </Tooltip>
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="section-block">
        <h2>Create company account</h2>
        <form onSubmit={createCompany} className="form-grid">
          <input
            placeholder="Company / contact name"
            value={company.fullName}
            onChange={(e) => setCompany({ ...company, fullName: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Temp password (min 8)"
            value={company.password}
            onChange={(e) => setCompany({ ...company, password: e.target.value })}
            minLength={8}
            required
          />
          <button className="btn accent" type="submit">
            Create company
          </button>
        </form>
      </section>

      <section className="section-block">
        <h2>Assign mentor</h2>
        <form onSubmit={assignMentor} className="form-grid">
          <select
            value={assign.mentorId}
            onChange={(e) => setAssign({ ...assign, mentorId: e.target.value })}
            required
          >
            <option value="">Mentor</option>
            {mentors.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>
          <select
            value={assign.studentId}
            onChange={(e) => setAssign({ ...assign, studentId: e.target.value })}
            required
          >
            <option value="">Student</option>
            {students.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName}
              </option>
            ))}
          </select>
          <select
            value={assign.programId}
            onChange={(e) => setAssign({ ...assign, programId: e.target.value })}
            required
          >
            <option value="">Program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <button className="btn accent" type="submit">
            Assign
          </button>
        </form>
      </section>
    </main>
    </>
  );
}
