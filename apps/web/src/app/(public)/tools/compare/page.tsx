import { PageBanner } from '../../../../components/PageBanner';
import { CountryCompareTool } from '../../../../components/tools/CountryCompareTool';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';

export const metadata = pageMeta({
  title: 'Country Comparison',
  description: 'Compare USA, UK, Canada, Australia, Germany, and more for study abroad.',
  path: '/tools/compare',
});

export default function CountryComparePage() {
  return (
    <>
      <PageBanner
        image={BANNERS.about}
        kicker="Tools"
        title="Country Comparison"
        lead="Tuition, living costs, work rights, post-study options, and tests — side by side."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <p className="tools-back">
          <a href="/tools">← All tools</a>
        </p>
        <CountryCompareTool />
      </main>
    </>
  );
}
