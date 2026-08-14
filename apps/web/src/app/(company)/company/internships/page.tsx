'use client';

import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type Listing = {
  id: string;
  slug: string;
  title: string;
  company: string;
  location: string;
  description: string;
  published: boolean;
};

export default function CompanyInternshipsPage() {
  const { data, loading, error } = useApiResource<{ items: Listing[] }>(
    '/company/internships',
    { errorMessage: 'Failed to load roles' },
  );
  const items = data?.items ?? [];

  return (
    <PortalShell
      banner={{
        image: BANNERS.internships,
        title: 'Internship roles',
        lead: 'Open roles students can discover and apply to.',
      }}
      back={{ href: '/company', label: 'Company' }}
      loading={loading}
      error={error}
    >
      {items.length === 0 ? (
        <p className="meta">No published roles yet.</p>
      ) : (
        <ul className="card-list">
          {items.map((item) => (
            <li key={item.id}>
              <article>
                <h2>{item.title}</h2>
                <p className="meta">
                  {item.company} · {item.location} · {item.published ? 'Published' : 'Draft'}
                </p>
                <p>{item.description}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
      <p className="notice">
        Role create/edit UI arrives next — demo listings are seeded for walkthroughs.
      </p>
    </PortalShell>
  );
}
