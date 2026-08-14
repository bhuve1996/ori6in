import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicFetch, type Program } from '../../../../lib/api';
import { PageBanner } from '../../../../components/PageBanner';
import { formatPrice } from '../../../../lib/format';
import { programImage } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';
import { SITE_NAME } from '../../../../lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = await publicFetch<Program>(`/programs/${slug}`);
  if (!program) return { title: 'Program' };
  return pageMeta({
    title: program.title,
    description: program.summary || `${program.title} on ${SITE_NAME}`,
    path: `/programs/${program.slug}`,
  });
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await publicFetch<Program>(`/programs/${slug}`);
  if (!program) notFound();

  return (
    <>
      <PageBanner
        image={programImage(program.slug)}
        kicker="Program"
        title={program.title}
        lead={program.summary}
      />
      <main id="main-content" className="page page-after-banner" tabIndex={-1}>
        <a className="back-link" href="/programs">
          ← Programs
        </a>
        <div className="mkt-flow-mini" aria-label="What you get">
          <span className="mkt-flow-mini__node">Enroll</span>
          <span className="mkt-flow-mini__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="mkt-flow-mini__node">Mentor reviews</span>
          <span className="mkt-flow-mini__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="mkt-flow-mini__node">Apply</span>
        </div>
        <p className="price-tag">{formatPrice(program.priceCents, program.currency)}</p>
        <div className="prose">{program.description}</div>
        <div className="cta-row">
          <a className="btn accent" href={`/checkout?programId=${program.id}`}>
            Buy now
          </a>
          <a className="btn secondary" href="/register">
            Create account
          </a>
        </div>
      </main>
    </>
  );
}
