import { PublicToolFrame } from '../../../../components/public/PublicToolFrame';
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
    <PublicToolFrame
      title="Cost Calculator"
      lead="Estimate tuition + living expenses by country, length, and lifestyle."
      image={BANNERS.pricing}
    >
      <CostCalculatorTool />
    </PublicToolFrame>
  );
}
