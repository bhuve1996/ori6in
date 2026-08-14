import { MentorCard } from '../../../components/cards';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { listMentors } from '../../../services/public-content';

export const metadata = pageMeta({
  title: 'Mentors',
  description: 'Meet ORI6IN mentors who review your work and keep you shipping toward internships.',
  path: '/mentors',
});

export default async function MentorsPage() {
  const mentors = await listMentors();

  return (
    <>
      <PageBanner
        image={BANNERS.mentors}
        kicker="People"
        title="Mentors"
        lead="Real mentors review your work and keep you shipping."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        {mentors.length === 0 ? (
          <p className="meta">No published mentors yet.</p>
        ) : (
          <ul className="mkt-mentor-grid">
            {mentors.map((m, i) => (
              <li key={m.id}>
                <MentorCard mentor={m} index={i} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
