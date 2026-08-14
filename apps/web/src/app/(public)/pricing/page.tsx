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
  const apiBody = page?.body ?? '';
  const body =
    apiBody.length > 120 && !/Phase 1/i.test(apiBody) ? apiBody : PRICING_FALLBACK.body;

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
          {body}
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
                    <p className="tile-sub">{p.summary}</p>
                    <div className="mkt-program-card__foot">
                      <span className="price-tag">{formatPrice(p.priceCents, p.currency)}</span>
                      <span className="tile-cta">View program</span>
                    </div>
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
