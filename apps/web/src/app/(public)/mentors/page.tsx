import { MentorCard } from '../../../components/cards';
import { PublicHero } from '../../../components/public/PublicHero';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { listMentors, resolveDemoMentor } from '../../../services/public-content';

export const metadata = pageMeta({
  title: 'Counsellors',
  description:
    'Meet ORI6IN counsellors who guide shortlists, applications, test prep, scholarships, and visas.',
  path: '/mentors',
});

export default async function MentorsPage() {
  const mentors = await listMentors();

  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="People"
        title="Counsellors"
        lead="Real counsellors guide your study-abroad plan — shortlists, essays, and visas."
        image={BANNERS.mentors}
      />
      <section className="pub-section">
        {mentors.length === 0 ? (
          <p className="meta">No published counsellors yet.</p>
        ) : (
          <ul className="mkt-mentor-grid">
            {mentors.map((m, i) => (
              <li key={m.id}>
                <MentorCard mentor={resolveDemoMentor(m)} index={i} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
