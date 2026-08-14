import { publicFetch } from '../../../lib/api';
import { Avatar } from '../../../components/Avatar';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Mentors',
  description: 'Meet ORI6IN mentors who review your work and keep you shipping toward internships.',
  path: '/mentors',
});

type MentorCard = {
  id: string;
  fullName: string;
  title: string;
  bio: string;
  skills: string[];
  location?: string;
  assignedStudents: number;
};

export default async function MentorsPage() {
  const mentors = (await publicFetch<MentorCard[]>('/mentors')) ?? [];

  return (
    <>
      <PageBanner
        image={BANNERS.mentors}
        kicker="People"
        title="Mentors"
        lead="Real mentors review your work and keep you shipping."
      />
      <main id="main-content" className="page page-after-banner page--wide">
        {mentors.length === 0 ? (
          <p className="meta">No mentors listed yet.</p>
        ) : (
          <ul className="mkt-mentor-grid">
            {mentors.map((m) => (
              <li key={m.id}>
                <a className="mkt-mentor-card" href={`/mentors/${m.id}`}>
                  <Avatar name={m.fullName} seed={m.fullName} kind="mentor" size="lg" />
                  <h2>{m.fullName}</h2>
                  <p className="mkt-mentor-card__role">{m.title}</p>
                  {m.location ? <p className="mkt-mentor-card__loc">{m.location}</p> : null}
                  {m.skills.length > 0 ? (
                    <ul className="mkt-mentor-card__skills">
                      {m.skills.slice(0, 3).map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  ) : null}
                  {m.bio ? <p className="mkt-mentor-card__bio">{m.bio}</p> : null}
                  <span className="tile-cta mkt-mentor-card__cta">View profile</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
