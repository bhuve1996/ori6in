'use client';

import { useApiResource } from '../../../hooks/useApiResource';
import { usePortalUser } from '../../../hooks/PortalAuth';
import { Avatar } from '../../../components/Avatar';
import { PersonHeader } from '../../../components/portal/PersonHeader';
import { PortalNavGrid } from '../../../components/portal/PortalNavGrid';
import { PortalShell } from '../../../components/portal/PortalShell';
import { SignOutButton } from '../../../components/portal/SignOutButton';
import { BANNERS } from '../../../lib/media';

type Dashboard = {
  assignedStudents: number;
  students: Array<{
    studentId: string;
    fullName: string;
    programTitle: string;
    progress: { percent: number };
  }>;
  recentReviews: Array<{ title: string; grade: string }>;
};

export default function MentorPortalPage() {
  const user = usePortalUser();
  const { data: dash, loading, error } = useApiResource<Dashboard>('/mentor/dashboard', {
    errorMessage: 'Failed to load mentor dashboard',
  });

  return (
    <PortalShell
      banner={{
        image: BANNERS.mentorPortal,
        title: 'Mentor Portal',
        lead: 'Guide assigned students with reviews, notes, and progress checks.',
      }}
      loading={loading}
      error={error}
    >
      <PersonHeader name={user.fullName} seed={user.id} kind="mentor">
        <p className="page-lead" style={{ margin: 0 }}>
          Signed in as {user.fullName} · {dash?.assignedStudents ?? 0} assigned students
        </p>
      </PersonHeader>

      <PortalNavGrid
        links={[
          { href: '/mentor/students', label: 'Students' },
          { href: '/mentor/reviews', label: 'Reviews & notes' },
        ]}
      />

      {dash && dash.students.length > 0 && (
        <section className="section-block">
          <h2>Quick view</h2>
          <div className="card-list">
            {dash.students.map((s) => (
              <article key={s.studentId} className="person-row">
                <Avatar name={s.fullName} seed={s.studentId} kind="student" />
                <div>
                  <h3>
                    <a href={`/mentor/students/${s.studentId}`}>{s.fullName}</a>
                  </h3>
                  <p className="meta">
                    {s.programTitle} · {s.progress.percent}%
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="cta-row">
        <SignOutButton />
      </div>
    </PortalShell>
  );
}
