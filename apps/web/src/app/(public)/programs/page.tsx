import { Button } from '@ori6in/ui';
import { ProgramCard } from '../../../components/cards';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { listPrograms } from '../../../services/public-content';

export const metadata = pageMeta({
  title: 'Programs',
  description:
    'Browse ORI6IN programs — mentored tracks with weekly projects, reviews, and internship-ready portfolios.',
  path: '/programs',
});

export default async function ProgramsPage() {
  const programs = await listPrograms();

  return (
    <>
      <PageBanner
        image={BANNERS.programs}
        kicker="Learn"
        title="Programs"
        lead="Pick a track, ship weekly work, and get mentor reviews along the way."
      />
      <main id="main-content" className="page page-after-banner page-wide" tabIndex={-1}>
        {programs.length === 0 ? (
          <p className="meta">No published programs yet.</p>
        ) : (
          <ul className="mkt-program-grid">
            {programs.map((p, i) => (
              <li key={p.id}>
                <ProgramCard program={p} index={i} />
              </li>
            ))}
          </ul>
        )}
        <div className="cta-row">
          <Button href="/how-it-works" variant="secondary">
            How it works
          </Button>
          <Button href="/register" variant="accent">
            Get started
          </Button>
        </div>
      </main>
    </>
  );
}
