import { DEMO_PAGES } from '@ori6in/shared';
import { ProgramCard } from '../../../components/cards';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { getCmsPage, listPrograms, resolveCmsCopy } from '../../../services/public-content';

const PRICING_FALLBACK = DEMO_PAGES.find((p) => p.slug === 'pricing')!;

export const metadata = pageMeta({
  title: 'Pricing',
  description: 'Transparent pricing for ORI6IN programs — mentorship and career-ready projects included.',
  path: '/pricing',
});

export default async function PricingPage() {
  const [page, programs] = await Promise.all([getCmsPage('pricing'), listPrograms()]);
  const { title, body } = resolveCmsCopy(page, PRICING_FALLBACK, 120);

  return (
    <>
      <PageBanner
        image={BANNERS.pricing}
        kicker="Pricing"
        title={title}
        lead="What you see is what you pay — for ORI6IN programs."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <div className="prose mb-6">{body}</div>
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
      </main>
    </>
  );
}
