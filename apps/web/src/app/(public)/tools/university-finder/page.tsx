import { PublicToolFrame } from '../../../../components/public/PublicToolFrame';
import { UniversityFinderTool } from '../../../../components/tools/UniversityFinderTool';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';

export const metadata = pageMeta({
  title: 'University Finder',
  description: 'Find universities based on country, degree level, field, budget, and English scores.',
  path: '/tools/university-finder',
});

export default function UniversityFinderPage() {
  return (
    <PublicToolFrame
      title="University Finder"
      lead="Academic profile + course + budget + country → sample shortlist with Safe / Target / Ambitious tiers."
      image={BANNERS.programs}
    >
      <UniversityFinderTool />
    </PublicToolFrame>
  );
}
