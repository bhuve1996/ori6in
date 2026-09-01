'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminShell, AdminStatusPill } from '../../../../components/admin/AdminShell';
import { Avatar } from '../../../../components/Avatar';
import { useToast } from '../../../../components/Toast';
import { Tooltip } from '../../../../components/Tooltip';
import { apiFetch, clearSession, getToken, setSession } from '../../../../lib/auth';

type UserRow = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  emailVerified: boolean;
};

type Program = { id: string; title: string };

const ROLE_FILTERS = [
  { id: '', label: 'All' },
  { id: 'student', label: 'Student' },
  { id: 'mentor', label: 'Counsellor' },
  { id: 'parent', label: 'Parent' },
  { id: 'company', label: 'Company' },
  { id: 'admin', label: 'Admin' },
] as const;

function roleLabel(role: string) {
  if (role === 'mentor') return 'counsellor';
  return role;
}

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
  const [loading, setLoading] = useState(true);

  async function loadUsers(nextRole = role) {
    const qs = nextRole ? `?role=${encodeURIComponent(nextRole)}` : '';
    const { ok, status, data } = await apiFetch<{ items: UserRow[] }>(`/admin/users${qs}`);
    if (status === 401 || status === 403) {
      clearSession();
      router.replace('/login');
      return;
    }
    if (!ok) {
      setError('Failed to load users');
      setLoading(false);
      return;
    }
    setUsers(Array.isArray(data.items) ? data.items : []);
    setLoading(false);
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
    const { ok, data } = await apiFetch<UserRow | { message?: unknown }>('/admin/users/company', {
      method: 'POST',
      body: JSON.stringify(company),
    });
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
    const { ok, data } = await apiFetch<{ message?: unknown }>('/admin/users/assign-mentor', {
      method: 'POST',
      body: JSON.stringify(assign),
    });
    if (!ok) {
      setError(JSON.stringify((data as { message?: unknown }).message ?? data));
      toast.error('Could not assign counsellor');
      return;
    }
    setMessage('Counsellor assigned.');
    toast.success('Counsellor assigned');
  }

  async function impersonate(userId: string) {
    setError('');
    const { ok, data } = await apiFetch<{
      token?: string;
      user?: { role: string };
      message?: string;
    }>(`/admin/impersonate/${userId}`, { method: 'POST' });
    if (!ok || !data.token || !data.user) {
      const msg = typeof data.message === 'string' ? data.message : 'Impersonation failed';
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
    <AdminShell
      layout="full"
      title="Users"
      lead="Filter accounts, create companies, assign counsellors, and impersonate for support."
      loading={loading}
      error={error}
      message={message}
      stats={[
        { value: users.length, label: role ? `${roleLabel(role)}s` : 'Listed' },
        { value: mentors.length, label: 'Counsellors' },
        { value: students.length, label: 'Students' },
      ]}
    >
      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2>Accounts</h2>
          <p className="admin-panel__meta">{users.length} shown</p>
        </div>
        <div className="admin-filters">
          <div className="admin-filter-chips" role="group" aria-label="Role filter">
            {ROLE_FILTERS.map((f) => (
              <button
                key={f.id || 'all'}
                type="button"
                className="admin-chip"
                aria-pressed={role === f.id}
                onClick={() => {
                  setRole(f.id);
                  setLoading(true);
                  void loadUsers(f.id);
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {users.length === 0 ? (
          <p className="admin-empty">No users for this filter.</p>
        ) : (
          <ul className="admin-card-list">
            {users.map((u) => (
              <li key={u.id}>
                <article className="admin-person">
                  <Avatar
                    name={u.fullName}
                    seed={u.id}
                    kind={u.role === 'mentor' ? 'mentor' : 'student'}
                  />
                  <div>
                    <h3>{u.fullName}</h3>
                    <p className="meta">
                      {u.email} · {roleLabel(u.role)}
                    </p>
                    <AdminStatusPill tone={u.emailVerified ? 'ok' : 'neutral'}>
                      {u.emailVerified ? 'Verified' : 'Unverified'}
                    </AdminStatusPill>
                  </div>
                  {u.role !== 'admin' && u.role !== 'super_admin' ? (
                    <div className="admin-table__actions">
                      <Tooltip label="Open their portal with a temporary session">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => void impersonate(u.id)}
                        >
                          Impersonate
                        </button>
                      </Tooltip>
                    </div>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="admin-split">
        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2>Create company account</h2>
          </div>
          <form onSubmit={createCompany} className="admin-form">
            <label>
              Company / contact name
              <input
                value={company.fullName}
                onChange={(e) => setCompany({ ...company, fullName: e.target.value })}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                value={company.email}
                onChange={(e) => setCompany({ ...company, email: e.target.value })}
                required
              />
            </label>
            <label>
              Temp password
              <input
                type="password"
                value={company.password}
                onChange={(e) => setCompany({ ...company, password: e.target.value })}
                minLength={8}
                required
              />
              <span className="admin-form__hint">Minimum 8 characters</span>
            </label>
            <button className="btn btn-accent" type="submit">
              Create company
            </button>
          </form>
        </section>

        <section className="admin-panel">
          <div className="admin-panel__head">
            <h2>Assign counsellor</h2>
          </div>
          <form onSubmit={assignMentor} className="admin-form">
            <label>
              Counsellor
              <select
                value={assign.mentorId}
                onChange={(e) => setAssign({ ...assign, mentorId: e.target.value })}
                required
              >
                <option value="">Select…</option>
                {mentors.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Student
              <select
                value={assign.studentId}
                onChange={(e) => setAssign({ ...assign, studentId: e.target.value })}
                required
              >
                <option value="">Select…</option>
                {students.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.fullName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Program
              <select
                value={assign.programId}
                onChange={(e) => setAssign({ ...assign, programId: e.target.value })}
                required
              >
                <option value="">Select…</option>
                {programs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
            <button className="btn btn-accent" type="submit">
              Assign
            </button>
          </form>
        </section>
      </div>
    </AdminShell>
  );
}
