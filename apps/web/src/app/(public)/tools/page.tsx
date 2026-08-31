import { Button } from '@ori6in/ui';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Free tools',
  description:
    'ORI6IN free study-abroad tools — University Finder, Course Finder, Scholarships, Cost Calculator, Eligibility, and Country Compare.',
  path: '/tools',
});

const TOOLS = [
  {
    href: '/tools/university-finder',
    title: 'University Finder',
    lead: 'Match universities to your profile, budget, and country.',
  },
  {
    href: '/tools/course-finder',
    title: 'Course / Career Finder',
    lead: 'Explore pathways when you are unsure what to study.',
  },
  {
    href: '/tools/scholarship-finder',
    title: 'Scholarship Finder',
    lead: 'Scan merit, university, and government funding leads.',
  },
  {
    href: '/tools/cost-calculator',
    title: 'Cost Calculator',
    lead: 'Estimate tuition + living costs by destination.',
  },
  {
    href: '/tools/eligibility',
    title: 'Eligibility Checker',
    lead: 'Quick readiness check before you shortlist.',
  },
  {
    href: '/tools/compare',
    title: 'Country Comparison',
    lead: 'Compare USA vs UK vs Canada vs Australia and more.',
  },
] as const;

export default function ToolsHubPage() {
  return (
    <>
      <PageBanner
        image={BANNERS.programs}
        kicker="Free tools"
        title="Plan before you apply"
        lead="Illustrative tools to explore destinations — then request a counsellor quote."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <ul className="tools-hub-grid">
          {TOOLS.map((t) => (
            <li key={t.href}>
              <a className="tools-hub-card" href={t.href}>
                <h2>{t.title}</h2>
                <p>{t.lead}</p>
                <span className="tile-cta">Open tool</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="cta-row" style={{ marginTop: '2rem' }}>
          <Button href="/hub" variant="secondary">
            Student Hub
          </Button>
          <Button href="/pricing" variant="accent">
            Get a quote
          </Button>
        </div>
      </main>
    </>
  );
}
