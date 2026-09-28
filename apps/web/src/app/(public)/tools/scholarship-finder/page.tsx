import { PublicToolFrame } from '../../../../components/public/PublicToolFrame';
import { ScholarshipFinderTool } from '../../../../components/tools/ScholarshipFinderTool';
import { BANNERS } from '../../../../lib/media';
import { pageMeta } from '../../../../lib/seo';

export const metadata = pageMeta({
  title: 'Scholarship Finder',
  description: 'Find scholarship and funding leads by country and degree level.',
  path: '/tools/scholarship-finder',
});

export default function ScholarshipFinderPage() {
  return (
    <PublicToolFrame
      title="Scholarship Finder"
      lead="Scan university, merit, and government funding leads — then refine with a counsellor."
      image={BANNERS.pricing}
    >
      <ScholarshipFinderTool />
    </PublicToolFrame>
  );
}
