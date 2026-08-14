'use client';

import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';

type MessagingPayload = {
  student: { fullName: string };
  threads: Array<{
    id: string;
    withName: string;
    topic: string;
    preview: string;
    updatedAt: string;
  }>;
};

export default function ParentMessagingPage() {
  const { data, loading, error } = useApiResource<MessagingPayload>('/parent/messaging', {
    errorMessage: 'Failed to load messages',
  });

  return (
    <PortalShell
      banner={{
        image: BANNERS.mentors,
        title: 'Messages',
        lead: 'Updates from mentors and ORI6IN support about your linked student.',
      }}
      back={{ href: '/parent', label: 'Parent' }}
      loading={loading}
      error={error}
    >
      {data ? (
        <ul className="card-list">
          {data.threads.map((t) => (
            <li key={t.id}>
              <article>
                <h2>{t.topic}</h2>
                <p className="meta">With {t.withName}</p>
                <p>{t.preview}</p>
              </article>
            </li>
          ))}
        </ul>
      ) : null}
      <p className="notice">
        Full two-way messaging ships next — this inbox shows the threads you will manage.
      </p>
    </PortalShell>
  );
}
