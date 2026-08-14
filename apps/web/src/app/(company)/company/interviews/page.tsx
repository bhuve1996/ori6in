'use client';

import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Interview = {
  id: string;
  applicantName: string;
  roleTitle: string;
  scheduledAt: string;
  mode: string;
  status: string;
};

export default function CompanyInterviewsPage() {
  const { data, loading, error } = useApiResource<{ items: Interview[] }>(
    '/company/interviews',
    { errorMessage: 'Failed to load interviews' },
  );
  const items = data?.items ?? [];

  return (
    <PortalShell
      banner={{
        image: BANNERS.mentorPortal,
        title: 'Interviews',
        lead: 'Upcoming and to-schedule conversations with applicants.',
      }}
      back={{ href: '/company', label: 'Company' }}
      loading={loading}
      error={error}
    >
      {items.length === 0 ? (
        <p className="meta">No interviews scheduled.</p>
      ) : (
        <ul className="card-list">
          {items.map((item) => (
            <li key={item.id}>
              <article>
                <h2>{item.applicantName}</h2>
                <p className="meta">
                  {item.roleTitle} · {item.mode} · {item.status}
                </p>
                <p>
                  {new Date(item.scheduledAt).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
