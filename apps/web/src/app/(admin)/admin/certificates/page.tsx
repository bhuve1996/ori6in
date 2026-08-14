'use client';

import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Cert = {
  id: string;
  code: string;
  title: string;
  recipientName: string;
  recipientEmail: string;
  programTitle: string;
  issuedAt: string;
};

export default function AdminCertificatesPage() {
  const { data, loading, error } = useApiResource<{ items: Cert[] }>(
    '/admin/certificates',
    { errorMessage: 'Failed to load certificates' },
  );
  const items = data?.items ?? [];

  return (
    <PortalShell
      banner={{
        image: BANNERS.admin,
        title: 'Certificates',
        lead: 'Issued program-completion certificates across the platform.',
      }}
      back={{ href: '/admin', label: 'Admin' }}
      loading={loading}
      error={error}
    >
      {items.length === 0 ? (
        <p className="meta">No certificates issued yet.</p>
      ) : (
        <ul className="card-list">
          {items.map((c) => (
            <li key={c.id}>
              <article>
                <h2>{c.programTitle}</h2>
                <p className="meta">
                  {c.recipientName} · {c.recipientEmail} · {c.code}
                </p>
                <p className="meta">
                  Issued {new Date(c.issuedAt).toLocaleDateString()}
                </p>
                <a href={`/certificates/verify/${c.code}`}>Public verify link</a>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
