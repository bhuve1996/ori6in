import { BANNERS, HOME } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { PublicHero } from '../../../components/public/PublicHero';

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
    image: BANNERS.programs,
  },
  {
    href: '/tools/course-finder',
    title: 'Course / Career Finder',
    lead: 'Explore pathways when you are unsure what to study.',
    image: BANNERS.about,
  },
  {
    href: '/tools/scholarship-finder',
    title: 'Scholarship Finder',
    lead: 'Scan merit, university, and government funding leads.',
    image: BANNERS.pricing,
  },
  {
    href: '/tools/cost-calculator',
    title: 'Cost Calculator',
    lead: 'Estimate tuition + living costs by destination.',
    image: HOME.outcomesReady,
  },
  {
    href: '/eligibility',
    title: 'Eligibility Checker',
    lead: 'Quick readiness check before you shortlist.',
    image: BANNERS.howItWorks,
  },
  {
    href: '/tools/compare',
    title: 'Country Comparison',
    lead: 'Compare USA vs UK vs Canada vs Australia and more.',
    image: HOME.pathPrograms,
  },
] as const;

export default function ToolsHubPage() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Free tools"
        title="Plan before you apply"
        lead="Illustrative tools to explore destinations — then request a counsellor quote. Fees are never listed on the public site."
        image={BANNERS.programs}
      />
      <section className="pub-section">
        <div className="pub-cards pub-cards--3">
          {TOOLS.map((t) => (
            <article key={t.href}>
              <img className="pub-card-media" src={t.image} alt="" />
              <h3>{t.title}</h3>
              <p>{t.lead}</p>
              <a href={t.href}>Open tool</a>
            </article>
          ))}
        </div>
        <div className="pub-actions" style={{ marginTop: '1.5rem' }}>
          <a className="btn btn-secondary" href="/eligibility">
            Full eligibility quiz
          </a>
          <a className="btn btn-accent" href="/contact">
            Get a quote
          </a>
        </div>
      </section>
    </main>
  );
}
