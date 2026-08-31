import { DEMO_PAGES } from '@ori6in/shared';
import { QuoteForm } from '../../../components/QuoteForm';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { getCmsPage, listPrograms, resolveCmsCopy } from '../../../services/public-content';

const PRICING_FALLBACK = DEMO_PAGES.find((p) => p.slug === 'pricing')!;

export const metadata = pageMeta({
  title: 'Get a quote',
  description:
    'Request a personalised ORI6IN Education quote for admissions, test prep, visas, and end-to-end study abroad.',
  path: '/pricing',
});

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<{ program?: string }>;
}) {
  const [page, programs, params] = await Promise.all([
    getCmsPage('pricing'),
    listPrograms(),
    searchParams ?? Promise.resolve({} as { program?: string }),
  ]);
  const { title, body } = resolveCmsCopy(page, PRICING_FALLBACK, 160);
  const selected =
    programs.find((p) => p.slug === params.program)?.title ??
    programs.find((p) => p.slug === params.program)?.slug ??
    '';

  return (
    <>
      <PageBanner
        image={BANNERS.pricing}
        kicker="Quotes"
        title={title === 'Pricing' ? 'Get a quote' : title}
        lead="Tell us your goals — counsellors reply with a package fit for your profile."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <div className="prose mb-6">{body}</div>
        <QuoteForm
          programs={programs.map((p) => ({ slug: p.slug, title: p.title }))}
          defaultProgram={selected}
        />
      </main>
    </>
  );
}
