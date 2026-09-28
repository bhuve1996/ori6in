import { PublicToolFrame } from '../../../../components/public/PublicToolFrame';
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
    <PublicToolFrame
      title="Country Comparison"
      lead="Tuition, living costs, work rights, post-study options, and tests — side by side."
      image={BANNERS.about}
    >
      <CountryCompareTool />
    </PublicToolFrame>
  );
}
