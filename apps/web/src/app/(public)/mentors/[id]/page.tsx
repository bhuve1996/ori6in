import { notFound } from 'next/navigation';
import { DEMO_MENTORS } from '@ori6in/shared';
import { publicFetch } from '../../../../lib/api';
import { Avatar } from '../../../../components/Avatar';
import { PageBanner } from '../../../../components/PageBanner';
import { BANNERS, HOME } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';

type MentorDetail = {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  skills: string[];
  location?: string;
  assignedStudents: number;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mentor = await publicFetch<MentorDetail>(`/mentors/${id}`);
  if (!mentor) return { title: 'Mentor' };
  return pageMeta({
    title: mentor.fullName,
    description: mentor.title || `${mentor.fullName} — mentor on ORI6IN`,
    path: `/mentors/${mentor.id}`,
  });
}

export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mentor = await publicFetch<MentorDetail>(`/mentors/${id}`);
  if (!mentor) notFound();

  const demo = DEMO_MENTORS.find(
    (m) => m.fullName.toLowerCase() === mentor.fullName.toLowerCase(),
  );
  const bio =
    mentor.bio && mentor.bio.length > 120 ? mentor.bio : (demo?.bio ?? mentor.bio);
  const skills = mentor.skills?.length ? mentor.skills : (demo?.skills ?? []);
  const location = mentor.location || demo?.location;
  const bioBlocks = bio.split(/\n\n+/).filter(Boolean);

  const focus = [
    {
      title: 'Reviews',
      caption: 'Written notes on your milestones — what works, what to fix next.',
      image: HOME.outcomesFeedback,
    },
    {
      title: 'Sessions',
      caption: 'Book time for walkthroughs, critiques, and career questions.',
      image: HOME.pathMentors,
    },
    {
      title: 'Outcomes',
      caption: 'Leave with clearer portfolio work and a sharper story for roles.',
      image: HOME.outcomesReady,
    },
  ] as const;

  return (
    <>
      <PageBanner
        image={BANNERS.mentors}
        kicker="Mentor"
        title={mentor.fullName}
        lead={mentor.title}
      />
      <main id="main-content" className="page page-after-banner page--wide" tabIndex={-1}>
        <a className="back-link" href="/mentors">
          ← Mentors
        </a>

        <div className="mentor-detail">
          <section className="mentor-detail__hero">
            <Avatar name={mentor.fullName} seed={mentor.fullName} kind="mentor" size="lg" />
            <div className="mentor-detail__hero-copy">
              <p className="mentor-detail__kicker">{mentor.title}</p>
              <ul className="mentor-detail__meta">
                {location ? <li>{location}</li> : null}
                <li>
                  {mentor.assignedStudents} active mentee
                  {mentor.assignedStudents === 1 ? '' : 's'}
                </li>
              </ul>
              {skills.length > 0 ? (
                <ul className="mentor-detail__skills">
                  {skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>

          <section className="mentor-detail__bio">
            <p className="mentor-detail__kicker">About</p>
            <div className="prose">
              {bioBlocks.map((block) => (
                <p key={block.slice(0, 40)}>{block}</p>
              ))}
            </div>
          </section>

          <section className="mentor-detail__focus">
            <p className="mentor-detail__kicker">How mentoring works</p>
            <h2>Reviews, sessions, outcomes</h2>
            <ul className="mentor-detail__focus-grid">
              {focus.map((item) => (
                <li key={item.title}>
                  <figure>
                    <div className="mentor-detail__focus-media">
                      <img src={item.image} alt="" loading="lazy" />
                    </div>
                    <figcaption>
                      <h3>{item.title}</h3>
                      <p>{item.caption}</p>
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </section>

          <div className="cta-row">
            <a className="btn accent" href="/programs">
              Explore programs
            </a>
            <a className="btn secondary" href="/register">
              Get started
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
