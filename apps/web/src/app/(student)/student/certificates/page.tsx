'use client';

import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Cert = {
  id: string;
  code: string;
  title: string;
  programTitle: string;
  issuedAt: string;
};

export default function StudentCertificatesPage() {
  const { data, loading, error } = useApiResource<{ items: Cert[] }>(
    '/student/certificates',
    { errorMessage: 'Failed to load certificates' },
  );
  const items = data?.items ?? [];

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Certificates',
        lead: 'Completion certificates earned when you finish all lessons in a program.',
      }}
      back={{ href: '/student', label: 'Student' }}
      loading={loading}
      error={error}
    >
      {items.length === 0 ? (
        <p className="notice">
          No certificates yet. Complete every lesson in an enrolled program to earn one.
        </p>
      ) : (
        <ul className="card-list">
          {items.map((c) => (
            <li key={c.id}>
              <article>
                <h2>{c.programTitle}</h2>
                <p className="meta">
                  {c.code} · issued {new Date(c.issuedAt).toLocaleDateString()}
                </p>
                <a className="btn accent" href={`/student/certificates/${c.id}`}>
                  View certificate
                </a>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
