'use client';

import { useApiResource } from '../../../../hooks/useApiResource';
import { Avatar } from '../../../../components/Avatar';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Applicant = {
  id: string;
  roleTitle: string;
  applicantName: string;
  applicantEmail: string;
  applicantId: string;
  status: string;
  notes: string | null;
};

export default function CompanyApplicantsPage() {
  const { data, loading, error } = useApiResource<{ items: Applicant[] }>(
    '/company/applicants',
    { errorMessage: 'Failed to load applicants' },
  );
  const items = data?.items ?? [];

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Applicants',
        lead: 'Students who applied to your open internship roles.',
      }}
      back={{ href: '/company', label: 'Company' }}
      loading={loading}
      error={error}
    >
      {items.length === 0 ? (
        <p className="notice">No applications yet. When students apply, they show up here.</p>
      ) : (
        <div className="card-list">
          {items.map((a) => (
            <article key={a.id} className="person-row" style={{ padding: '1rem 0' }}>
              <Avatar name={a.applicantName} seed={a.applicantId} kind="student" size="lg" />
              <div>
                <h2 style={{ marginTop: 0 }}>{a.applicantName}</h2>
                <p className="meta">
                  {a.applicantEmail} · {a.roleTitle} · {a.status}
                </p>
                {a.notes ? <p>{a.notes}</p> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </PortalShell>
  );
}
