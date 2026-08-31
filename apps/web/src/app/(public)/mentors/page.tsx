import { MentorCard } from '../../../components/cards';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { listMentors } from '../../../services/public-content';

export const metadata = pageMeta({
  title: 'Counsellors',
  description:
    'Meet ORI6IN counsellors who guide shortlists, applications, test prep, scholarships, and visas.',
  path: '/mentors',
});

export default async function MentorsPage() {
  const mentors = await listMentors();

  return (
    <>
      <PageBanner
        image={BANNERS.mentors}
        kicker="People"
        title="Counsellors"
        lead="Real counsellors guide your study-abroad plan — shortlists, essays, and visas."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        {mentors.length === 0 ? (
          <p className="meta">No published counsellors yet.</p>
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
