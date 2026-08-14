'use client';

import { useApiResource } from '../../../hooks/useApiResource';
import { usePortalUser } from '../../../hooks/PortalAuth';
import { Avatar } from '../../../components/Avatar';
import { PersonHeader } from '../../../components/portal/PersonHeader';
import { PortalNavGrid } from '../../../components/portal/PortalNavGrid';
import { PortalShell } from '../../../components/portal/PortalShell';
import { SignOutButton } from '../../../components/portal/SignOutButton';
import { StatGrid } from '../../../components/portal/StatGrid';
import { BANNERS } from '../../../lib/media';

type Dashboard = {
  assignedStudents: number;
  pendingApprovals: number;
  students: Array<{
    studentId: string;
    fullName: string;
    programTitle: string;
    progress: { percent: number };
  }>;
  upcomingMeetings: Array<{
    id: string;
    topic: string;
    startsAt: string;
    status: string;
  }>;
  recentReviews: Array<{ title: string; grade: string; status?: string }>;
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
        lead: 'Sessions, reviews, and internship completion sign-off for your students.',
      }}
      loading={loading}
      error={error}
    >
      <PersonHeader name={user.fullName} seed={user.id} kind="mentor">
        <p className="page-lead" style={{ margin: 0 }}>
          Signed in as {user.fullName} · {dash?.assignedStudents ?? 0} assigned students
        </p>
      </PersonHeader>

      {dash ? (
        <StatGrid
          items={[
            { value: dash.assignedStudents, label: 'Students' },
            { value: dash.upcomingMeetings.length, label: 'Upcoming sessions' },
            { value: dash.pendingApprovals, label: 'Completion approvals' },
            { value: dash.recentReviews.length, label: 'Recent reviews' },
          ]}
        />
      ) : null}

      <PortalNavGrid
        links={[
          { href: '/mentor/students', label: 'Students' },
          { href: '/mentor/sessions', label: 'Sessions' },
          { href: '/mentor/reviews', label: 'Reviews' },
          { href: '/mentor/approvals', label: 'Approvals' },
        ]}
      />

      {dash && dash.upcomingMeetings.length > 0 ? (
        <section className="section-block">
          <h2>Upcoming sessions</h2>
          <ul className="plain-list">
            {dash.upcomingMeetings.map((m) => (
              <li key={m.id}>
                <strong>{m.topic}</strong> ·{' '}
                {new Date(m.startsAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

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
