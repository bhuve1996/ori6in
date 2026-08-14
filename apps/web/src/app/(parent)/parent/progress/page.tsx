'use client';

import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { ProgressBar } from '../../../../components/portal/ProgressBar';
import { BANNERS } from '../../../../lib/media';

type ProgressPayload = {
  student: { id: string; fullName: string };
  programs: Array<{
    programId: string;
    title: string;
    slug: string;
    progress: { percent: number; completedLessons: number; totalLessons: number };
  }>;
};

export default function ParentProgressPage() {
  const { data, loading, error } = useApiResource<ProgressPayload>('/parent/progress', {
    errorMessage: 'Failed to load progress',
  });

  return (
    <PortalShell
      banner={{
        image: BANNERS.student,
        title: 'Learning progress',
        lead: 'See how your linked student is moving through enrolled programs.',
      }}
      back={{ href: '/parent', label: 'Parent' }}
      loading={loading}
      error={error}
    >
      {!data || data.programs.length === 0 ? (
        <p className="notice">No enrolled programs yet.</p>
      ) : (
        <ul className="card-list">
          {data.programs.map((p) => (
            <li key={p.programId}>
              <article>
                <h2>{p.title}</h2>
                <p>
                  {p.progress.completedLessons}/{p.progress.totalLessons} lessons ·{' '}
                  {p.progress.percent}% complete
                </p>
                <ProgressBar percent={p.progress.percent} />
                <p className="meta">
                  <a href={`/programs/${p.slug}`}>View program</a>
                </p>
              </article>
            </li>
          ))}
        </ul>
      )}
    </PortalShell>
  );
}
