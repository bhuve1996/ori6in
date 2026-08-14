import { notFound } from 'next/navigation';
import { publicFetch } from '../../../../lib/api';
import { Avatar } from '../../../../components/Avatar';
import { PageBanner } from '../../../../components/PageBanner';
import { BANNERS } from '../../../../lib/media';

type MentorDetail = {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  skills: string[];
  location?: string;
  assignedStudents: number;
};

export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mentor = await publicFetch<MentorDetail>(`/mentors/${id}`);
  if (!mentor) notFound();

  return (
    <>
      <PageBanner
        image={BANNERS.mentors}
        kicker="Mentor"
        title={mentor.fullName}
        lead={mentor.title}
      />
      <main id="main-content" className="page page-after-banner">
        <a className="back-link" href="/mentors">
          ← Mentors
        </a>
        <div className="mkt-detail-hero">
          <Avatar name={mentor.fullName} seed={mentor.fullName} kind="mentor" size="lg" />
          <div>
            {mentor.location ? (
              <p className="meta" style={{ margin: '0 0 0.35rem' }}>
                {mentor.location}
              </p>
            ) : null}
            <p className="meta" style={{ margin: '0 0 0.35rem' }}>
              Skills: {mentor.skills.join(', ') || '—'}
            </p>
            <p className="meta" style={{ margin: 0 }}>
              Active mentees: {mentor.assignedStudents}
            </p>
          </div>
        </div>
        <div className="prose">{mentor.bio}</div>
        <div className="cta-row">
          <a className="btn accent" href="/programs">
            Explore programs
          </a>
        </div>
      </main>
    </>
  );
}
