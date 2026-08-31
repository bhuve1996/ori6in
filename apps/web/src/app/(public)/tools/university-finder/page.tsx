import { PageBanner } from '../../../../components/PageBanner';
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
    <>
      <PageBanner
        image={BANNERS.programs}
        kicker="Tools"
        title="University Finder"
        lead="Academic profile + course + budget + country → sample shortlist with Safe / Target / Ambitious tiers."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <p className="tools-back">
          <a href="/tools">← All tools</a>
        </p>
        <UniversityFinderTool />
      </main>
    </>
  );
}
