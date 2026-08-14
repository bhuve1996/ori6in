'use client';

import { useApiResource } from '../../../hooks/useApiResource';
import { usePortalUser } from '../../../hooks/PortalAuth';
import { PersonHeader } from '../../../components/portal/PersonHeader';
import { PortalNavGrid } from '../../../components/portal/PortalNavGrid';
import { PortalShell } from '../../../components/portal/PortalShell';
import { SignOutButton } from '../../../components/portal/SignOutButton';
import { StatGrid } from '../../../components/portal/StatGrid';
import { BANNERS } from '../../../lib/media';

type Dashboard = {
  child: { id: string; fullName: string; email: string };
  program: { id: string; title: string; slug: string } | null;
  progress: { percent: number; completedLessons: number; totalLessons: number };
  paidOrders: number;
  activeApplications: number;
  alerts: Array<{ id: string; title: string; body: string }>;
};

export default function ParentHubPage() {
  const user = usePortalUser();
  const { data: dash, loading, error } = useApiResource<Dashboard>('/parent/dashboard', {
    errorMessage: 'Failed to load parent dashboard',
  });

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Parent Portal',
        lead: "Follow your child's learning, payments, and internship applications.",
      }}
      loading={loading || !dash}
      error={error}
    >
      {dash ? (
        <>
          <PersonHeader name={user.fullName} seed={user.id} kind="person">
            <p className="page-lead" style={{ margin: 0 }}>
              Signed in as {user.fullName}
            </p>
            <p className="meta" style={{ margin: '0.25rem 0 0' }}>
              Linked student: {dash.child.fullName} · {dash.child.email}
            </p>
          </PersonHeader>

          <StatGrid
            items={[
              { value: `${dash.progress.percent}%`, label: 'Course progress' },
              { value: dash.paidOrders, label: 'Paid enrollments' },
              { value: dash.activeApplications, label: 'Applications' },
            ]}
          />

          {dash.program ? (
            <p className="notice">
              Active program: <strong>{dash.program.title}</strong> —{' '}
              {dash.progress.completedLessons}/{dash.progress.totalLessons} lessons done.
            </p>
          ) : (
            <p className="notice">No active enrollment yet. Browse programs to get started.</p>
          )}

          {dash.alerts.length > 0 && (
            <section className="section-block">
              <h2>Recent alerts</h2>
              <ul className="plain-list">
                {dash.alerts.map((a) => (
                  <li key={a.id}>
                    <strong>{a.title}</strong>
                    <br />
                    {a.body}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <PortalNavGrid
            links={[
              { href: '/parent/progress', label: 'Learning progress' },
              { href: '/parent/payments', label: 'Payments' },
              { href: '/parent/messaging', label: 'Messages' },
              { href: '/parent/approvals', label: 'Approvals' },
              { href: '/programs', label: 'Browse programs' },
            ]}
          />

          <div className="cta-row">
            <SignOutButton />
          </div>
        </>
      ) : null}
    </PortalShell>
  );
}
