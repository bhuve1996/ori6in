'use client';

import { useApiResource } from '../../../hooks/useApiResource';
import { usePortalUser } from '../../../hooks/PortalAuth';
import { PortalNavGrid } from '../../../components/portal/PortalNavGrid';
import { PortalShell } from '../../../components/portal/PortalShell';
import { SignOutButton } from '../../../components/portal/SignOutButton';
import { StatGrid } from '../../../components/portal/StatGrid';
import { formatPrice } from '../../../lib/format';
import { BANNERS } from '../../../lib/media';

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

  return (
    <PortalShell
      banner={{
        image: BANNERS.admin,
        title: 'Admin Portal',
        lead: 'Catalog, CMS, users, and platform overview.',
      }}
      loading={loading}
      error={error}
    >
      <p className="page-lead">
        Signed in as {user.fullName} ({user.role})
      </p>

      {s && dash ? (
        <section className="section-block">
          <h2>Overview</h2>
          <StatGrid
            items={[
              { value: s.users, label: 'Users' },
              { value: s.students, label: 'Students' },
              { value: s.mentors, label: 'Mentors' },
              { value: s.publishedPrograms, label: 'Published programs' },
              { value: s.paidOrders, label: 'Paid orders' },
              {
                value: formatPrice(dash.revenue.amountCents, dash.revenue.currency),
                label: `Revenue (${dash.revenue.currency})`,
              },
            ]}
          />
          <p className="meta">
            CMS: {s.cmsPages} pages, {s.blogPosts} posts · Internships live: {s.internships} ·
            Pending role approvals: {s.pendingInternshipApprovals ?? 0} · Companies: {s.companies}
          </p>
          {(s.pendingInternshipApprovals ?? 0) > 0 ? (
            <p className="notice">
              <a href="/admin/approvals">
                Review {s.pendingInternshipApprovals} company posting
                {s.pendingInternshipApprovals === 1 ? '' : 's'}
              </a>
            </p>
          ) : null}
          {dash.recentPaidOrders.length > 0 && (
            <>
              <h3>Recent paid orders</h3>
              <ul className="plain-list">
                {dash.recentPaidOrders.map((o) => (
                  <li key={o.id}>
                    {o.programTitle} — {formatPrice(o.amountCents, o.currency)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      ) : null}

      <PortalNavGrid
        links={[
          { href: '/admin/users', label: 'Users' },
          { href: '/admin/catalog', label: 'Catalog' },
          { href: '/admin/cms', label: 'CMS' },
          { href: '/admin/approvals', label: 'Internship approvals' },
          { href: '/admin/certificates', label: 'Certificates' },
          { href: '/admin/coming-soon', label: 'Coming soon waitlist' },
        ]}
      />

      <div className="cta-row">
        <SignOutButton />
      </div>
    </PortalShell>
  );
}
