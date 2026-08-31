import { PageBanner } from '../../../../components/PageBanner';
import { CostCalculatorTool } from '../../../../components/tools/CostCalculatorTool';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';

export const metadata = pageMeta({
  title: 'Cost Calculator',
  description: 'Estimate tuition and living costs for study-abroad destinations.',
  path: '/tools/cost-calculator',
});

export default function CostCalculatorPage() {
  return (
    <>
      <PageBanner
        image={BANNERS.pricing}
        kicker="Tools"
        title="Cost Calculator"
        lead="Estimate tuition + living expenses by country, length, and lifestyle."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <p className="tools-back">
          <a href="/tools">← All tools</a>
        </p>
        <CostCalculatorTool />
      </main>
    </>
  );
}
