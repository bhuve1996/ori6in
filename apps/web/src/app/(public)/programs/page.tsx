import { Button } from '@ori6in/ui';
import { ProgramsCatalog } from '../../../components/ProgramsCatalog';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { listPrograms } from '../../../services/public-content';

export const metadata = pageMeta({
  title: 'Programs',
  description:
    'ORI6IN Education catalogue — 360°, packages, test prep, country admissions, combos, and premium services.',
  path: '/programs',
});

export default async function ProgramsPage() {
  const programs = await listPrograms();

  return (
    <>
      <PageBanner
        image={BANNERS.programs}
        kicker="Study abroad"
        title="Programs"
        lead="Packages, test prep, country admissions, and combos — request a quote for pricing."
      />
      <main id="main-content" className="page page-after-banner page-wide" tabIndex={-1}>
        {programs.length === 0 ? (
          <p className="meta">No published programs yet.</p>
        ) : (
          <ProgramsCatalog programs={programs} />
        )}
        <div className="cta-row">
          <Button href="/tools" variant="secondary">
            Free tools
          </Button>
          <Button href="/pricing" variant="accent">
            Get a quote
          </Button>
        </div>
      </main>
    </>
  );
}
