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
  openRoles: number;
  applicants: number;
  interviews: number;
  recentListings: Array<{ id: string; title: string; location: string; published: boolean }>;
};

export default function CompanyHubPage() {
  const user = usePortalUser();
  const { data: dash, loading, error } = useApiResource<Dashboard>('/company/dashboard', {
    errorMessage: 'Failed to load company dashboard',
  });

  return (
    <PortalShell
      banner={{
        image: BANNERS.internships,
        title: 'Company Portal',
        lead: 'Post roles, review applicants, and schedule interviews.',
      }}
      loading={loading || !dash}
      error={error}
    >
      {dash ? (
        <>
          <PersonHeader name={user.fullName} seed={user.id} kind="person">
            <p className="page-lead" style={{ margin: 0 }}>
              Signed in as {user.fullName} ({user.email})
            </p>
          </PersonHeader>

          <StatGrid
            items={[
              { value: dash.openRoles, label: 'Open roles' },
              { value: dash.applicants, label: 'Applicants' },
              { value: dash.interviews, label: 'Interviews' },
            ]}
          />

          {dash.recentListings.length > 0 && (
            <section className="section-block">
              <h2>Your roles</h2>
              <ul className="plain-list">
                {dash.recentListings.map((l) => (
                  <li key={l.id}>
                    <strong>{l.title}</strong> · {l.location}
                    {l.published ? ' · live' : ' · draft'}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <PortalNavGrid
            links={[
              { href: '/company/internships', label: 'Manage roles' },
              { href: '/company/applicants', label: 'Applicants' },
              { href: '/company/interviews', label: 'Interviews' },
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
