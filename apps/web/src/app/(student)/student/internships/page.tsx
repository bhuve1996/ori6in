'use client';

import { useApiResource } from '../../../../hooks/useApiResource';
import { PortalShell } from '../../../../components/portal/PortalShell';
import { BANNERS } from '../../../../lib/media';
import {
  applicationStatusLabel,
  formatTimelineEvent,
  mentorCompletionLabel,
  parentDecisionLabel,
  type TimelineEvent,
} from '../../../../lib/internship-status';

type Internship = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
};

type Application = {
  id: string;
  internshipId: string;
  status: string;
  parentDecision: string;
  parentNote: string | null;
  mentorCompletionDecision: string;
  mentorCompletionNote: string | null;
  timeline: TimelineEvent[];
  internship: { id: string; title: string; company: string; location?: string } | null;
};

export default function StudentInternshipsPage() {
  const {
    data: internships,
    loading: listLoading,
    error: listError,
  } = useApiResource<Internship[]>('/internships', {
    errorMessage: 'Failed to load internships',
  });
  const {
    data: applications,
    loading: appsLoading,
    error: appsError,
  } = useApiResource<Application[]>('/internships/applications/mine', {
    errorMessage: 'Failed to load applications',
  });

  const roles = Array.isArray(internships) ? internships : [];
  const apps = Array.isArray(applications) ? applications : [];
  const appliedIds = new Set(apps.map((a) => a.internshipId));

  return (
    <PortalShell
      banner={{
        image: BANNERS.internships,
        title: 'Internships',
        lead: 'Browse open roles and track company, parent, and mentor decisions on your applications.',
      }}
      back={{ href: '/student', label: 'Student' }}
      loading={listLoading || appsLoading}
      error={listError || appsError}
    >
      {apps.length > 0 ? (
        <section className="section-block">
          <h2>My applications</h2>
          <ul className="card-list">
            {apps.map((a) => (
              <li key={a.id}>
                <article>
                  <h3 style={{ marginTop: 0 }}>
                    <a href={`/student/internships/${a.internshipId}`}>
                      {a.internship?.title ?? 'Role'}
                    </a>
                  </h3>
                  <p className="meta">
                    {a.internship?.company ?? ''}
                    {a.internship?.location ? ` · ${a.internship.location}` : ''}
                  </p>
                  <p>
                    <strong>Company:</strong> {applicationStatusLabel(a.status)}
                  </p>
                  <p className="meta">
                    <strong>Parent:</strong> {parentDecisionLabel(a.parentDecision)}
                    {a.parentNote ? ` — ${a.parentNote}` : ''}
                  </p>
                  {a.status === 'offered' || a.mentorCompletionDecision !== 'pending' ? (
                    <p className="meta">
                      <strong>Mentor:</strong>{' '}
                      {mentorCompletionLabel(a.mentorCompletionDecision)}
                      {a.mentorCompletionNote ? ` — ${a.mentorCompletionNote}` : ''}
                    </p>
                  ) : null}
                  {a.timeline?.length ? (
                    <details>
                      <summary className="meta">Status timeline</summary>
                      <ul className="plain-list">
                        {[...a.timeline]
                          .slice()
                          .reverse()
                          .map((ev, idx) => (
                            <li key={`${a.id}-${idx}`}>{formatTimelineEvent(ev)}</li>
                          ))}
                      </ul>
                    </details>
                  ) : null}
                </article>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <p className="notice">No applications yet — open a role below to apply.</p>
      )}

      <section className="section-block">
        <h2>Open roles</h2>
        {roles.length === 0 ? (
          <p className="meta">No internships published yet.</p>
        ) : (
          <div className="card-list">
            {roles.map((i) => (
              <article key={i.id}>
                <h3>
                  <a href={`/student/internships/${i.id}`}>{i.title}</a>
                </h3>
                <p className="meta">
                  {i.company} · {i.location}
                </p>
                <p className="page-lead">{i.description}</p>
                <p>
                  {appliedIds.has(i.id) ? (
                    <span className="text-success">
                      ✓ {applicationStatusLabel(
                        apps.find((a) => a.internshipId === i.id)?.status ?? 'applied',
                      )}
                    </span>
                  ) : (
                    <a className="btn btn-accent" href={`/student/internships/${i.id}`}>
                      View & apply
                    </a>
                  )}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </PortalShell>
  );
}
