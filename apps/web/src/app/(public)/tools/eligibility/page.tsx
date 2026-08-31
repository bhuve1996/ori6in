import { PageBanner } from '../../../../components/PageBanner';
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
    <>
      <PageBanner
        image={BANNERS.howItWorks}
        kicker="Tools"
        title="Eligibility Checker"
        lead="A basic readiness check — academics, English, and experience signals."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <p className="tools-back">
          <a href="/tools">← All tools</a>
        </p>
        <EligibilityTool />
      </main>
    </>
  );
}
