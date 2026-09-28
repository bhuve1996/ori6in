import { notFound } from 'next/navigation';
import { Avatar } from '../../../../components/Avatar';
import { PublicHero } from '../../../../components/public/PublicHero';
import { BANNERS, HOME } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';
import { getMentorById, resolveDemoMentor } from '../../../../services/public-content';

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
  const raw = await getMentorById<MentorDetail>(id);
  if (!raw) return { title: 'Mentor' };
  const mentor = resolveDemoMentor(raw);
  return pageMeta({
    title: mentor.fullName,
    description: mentor.title || `${mentor.fullName} — counsellor on ORI6IN`,
    path: `/mentors/${mentor.id}`,
  });
}

export default async function MentorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const raw = await getMentorById<MentorDetail>(id);
  if (!raw) notFound();
  const mentor = resolveDemoMentor(raw);
  const bio = mentor.bio ?? '';
  const skills = mentor.skills?.length ? mentor.skills : [];
  const location = mentor.location;
  const bioBlocks = bio.split(/\n\n+/).filter(Boolean);

  const focus = [
    {
      title: 'Guidance',
      caption: 'Clear next steps on shortlists, essays, and documents.',
      image: HOME.outcomesFeedback,
    },
    {
      title: 'Sessions',
      caption: 'Book time for profile reviews, applications, and visa prep.',
      image: HOME.pathMentors,
    },
    {
      title: 'Outcomes',
      caption: 'Leave with a stronger admit plan and travel-ready checklist.',
      image: HOME.outcomesReady,
    },
  ] as const;

  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Counsellor"
        title={mentor.fullName}
        lead={mentor.title}
        image={BANNERS.mentors}
      />
      <section className="pub-section">
        <a className="back-link" href="/mentors">
          ← Counsellors
        </a>

        <div className="mentor-detail">
          <section className="mentor-detail__hero">
            <Avatar name={mentor.fullName} seed={mentor.fullName} kind="mentor" size="lg" />
            <div className="mentor-detail__hero-copy">
              <p className="mentor-detail__kicker">{mentor.title}</p>
              <ul className="mentor-detail__meta">
                {location ? <li>{location}</li> : null}
                <li>
                  {mentor.assignedStudents} active student
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
            <p className="mentor-detail__kicker">How counselling works</p>
            <h2>Guidance, sessions, outcomes</h2>
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
            <a className="btn btn-accent" href="/programmes">
              Explore programmes
            </a>
            <a className="btn btn-secondary" href="/register">
              Get started
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
