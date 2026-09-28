import { PublicToolFrame } from '../../../../components/public/PublicToolFrame';
import { EligibilityTool } from '../../../../components/tools/EligibilityTool';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';

export const metadata = pageMeta({
  title: 'Eligibility Checker',
  description: 'Check basic study-abroad admission readiness by destination and profile.',
  path: '/tools/eligibility',
});

export default function EligibilityPage() {
  return (
    <PublicToolFrame
      title="Eligibility Checker"
      lead="A basic readiness check — academics, English, and experience signals."
      image={BANNERS.howItWorks}
    >
      <EligibilityTool />
    </PublicToolFrame>
  );
}
