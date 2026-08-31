'use client';

import { AdminShell, ADMIN_NAV } from '../../../components/admin/AdminShell';
import { SignOutButton } from '../../../components/portal/SignOutButton';
import { useApiResource } from '../../../hooks/useApiResource';
import { usePortalUser } from '../../../hooks/PortalAuth';
import { formatPrice } from '../../../lib/format';

type Dashboard = {
  statistics: {
    users: number;
    students: number;
    mentors: number;
    companies: number;
    programs: number;
    publishedPrograms: number;
    paidOrders: number;
    cmsPages: number;
    blogPosts: number;
    internships: number;
    pendingInternshipApprovals?: number;
  };
  revenue: { amountCents: number; currency: string };
  recentPaidOrders: Array<{
    id: string;
    programTitle: string;
    amountCents: number;
    currency: string;
  }>;
};

export default function AdminPortalPage() {
  const user = usePortalUser();
  const { data: dash, loading, error } = useApiResource<Dashboard>('/admin/dashboard', {
    errorMessage: 'Failed to load dashboard',
  });
  const s = dash?.statistics;
  const pending = s?.pendingInternshipApprovals ?? 0;

  return (
    <AdminShell
      title="Admin hub"
      lead={`Signed in as ${user.fullName} (${user.role}). Catalog, CMS, users, and platform overview.`}
      loading={loading}
      error={error}
      stats={
        s && dash
          ? [
              { value: s.users, label: 'Users' },
              { value: s.students, label: 'Students' },
              { value: s.mentors, label: 'Counsellors' },
              { value: s.publishedPrograms, label: 'Published programs' },
              { value: s.paidOrders, label: 'Paid orders' },
              {
                value: formatPrice(dash.revenue.amountCents, dash.revenue.currency),
                label: 'Revenue',
              },
            ]
          : undefined
      }
      actions={<SignOutButton />}
    >
      {s ? (
        <>
          <section className="admin-panel">
            <div className="admin-panel__head">
              <h2>Platform snapshot</h2>
            </div>
            <div className="admin-stats" style={{ marginBottom: '1rem' }}>
              <div className="admin-stat">
                <strong>{s.cmsPages}</strong>
                <span>CMS pages</span>
              </div>
              <div className="admin-stat">
                <strong>{s.blogPosts}</strong>
                <span>Blog posts</span>
              </div>
              <div className="admin-stat">
                <strong>{s.internships}</strong>
                <span>Live roles</span>
              </div>
              <div className="admin-stat">
                <strong>{s.companies}</strong>
                <span>Companies</span>
              </div>
              <div className="admin-stat">
                <strong>{s.programs}</strong>
                <span>All programs</span>
              </div>
              <div className="admin-stat">
                <strong>{pending}</strong>
                <span>Pending approvals</span>
              </div>
            </div>
            {pending > 0 ? (
              <p className="admin-alert admin-alert--warn" style={{ marginBottom: 0 }}>
                <a href="/admin/approvals">
                  Review {pending} company posting{pending === 1 ? '' : 's'}
                </a>
              </p>
            ) : (
              <p className="admin-panel__meta">No company postings waiting for approval.</p>
            )}
          </section>

          {dash && dash.recentPaidOrders.length > 0 ? (
            <section className="admin-panel">
              <div className="admin-panel__head">
                <h2>Recent paid orders</h2>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Program</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.recentPaidOrders.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <p className="admin-table__title">{o.programTitle}</p>
                        </td>
                        <td>{formatPrice(o.amountCents, o.currency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </>
      ) : null}

      <section className="admin-panel">
        <div className="admin-panel__head">
          <h2>Jump to</h2>
        </div>
        <div className="portal-grid">
          {ADMIN_NAV.filter((l) => l.href !== '/admin').map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
