import { publicFetch, type Program } from '../../../lib/api';
import { PageBanner } from '../../../components/PageBanner';
import { formatPrice } from '../../../lib/format';
import { BANNERS, programImage } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Programs',
  description:
    'Browse ORI6IN programs — mentored tracks with weekly projects, reviews, and internship-ready portfolios.',
  path: '/programs',
});

export default async function ProgramsPage() {
  const programs = (await publicFetch<Program[]>('/programs')) ?? [];

  return (
    <>
      <PageBanner
        image={BANNERS.programs}
        kicker="Learn"
        title="Programs"
        lead="Pick a track, ship weekly work, and get mentor reviews along the way."
      />
      <main id="main-content" className="page page-after-banner page--wide" tabIndex={-1}>
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
                    <p>{p.summary}</p>
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
