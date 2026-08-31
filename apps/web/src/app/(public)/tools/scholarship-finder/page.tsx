import { PageBanner } from '../../../../components/PageBanner';
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
    <>
      <PageBanner
        image={BANNERS.pricing}
        kicker="Tools"
        title="Scholarship Finder"
        lead="Scan university, merit, and government funding leads — then refine with a counsellor."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <p className="tools-back">
          <a href="/tools">← All tools</a>
        </p>
        <ScholarshipFinderTool />
      </main>
    </>
  );
}
