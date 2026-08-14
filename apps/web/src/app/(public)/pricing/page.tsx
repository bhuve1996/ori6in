import { DEMO_PAGES } from '@ori6in/shared';
import { publicFetch, type CmsPage, type Program } from '../../../lib/api';
import { PageBanner } from '../../../components/PageBanner';
import { formatPrice } from '../../../lib/format';
import { BANNERS, programImage } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

const PRICING_FALLBACK = DEMO_PAGES.find((p) => p.slug === 'pricing')!;

export const metadata = pageMeta({
  title: 'Pricing',
  description: 'Transparent pricing for ORI6IN programs — mentorship and career-ready projects included.',
  path: '/pricing',
});

export default async function PricingPage() {
  const page = await publicFetch<CmsPage>('/cms/pages/pricing');
  const programs = (await publicFetch<Program[]>('/programs')) ?? [];

  return (
    <>
      <PageBanner
        image={BANNERS.pricing}
        kicker="Pricing"
        title={page?.title ?? PRICING_FALLBACK.title}
        lead="What you see is what you pay — for ORI6IN programs."
      />
      <main id="main-content" className="page page-after-banner page--wide">
        <div className="prose" style={{ marginBottom: '1.5rem' }}>
          {page?.body ?? PRICING_FALLBACK.body}
        </div>
        {programs.length === 0 ? (
          <p className="meta">No published programs yet.</p>
        ) : (
          <ul className="mkt-program-grid">
            {programs.map((p) => (
              <li key={p.id}>
                <a className="mkt-program-card" href={`/programs/${p.slug}`}>
                  <div className="mkt-program-card__media">
                    <img src={programImage(p.slug)} alt="" loading="lazy" />
                  </div>
                  <div className="mkt-program-card__body">
                    <h2>{p.title}</h2>
                    <p className="price-tag">{formatPrice(p.priceCents, p.currency)}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
