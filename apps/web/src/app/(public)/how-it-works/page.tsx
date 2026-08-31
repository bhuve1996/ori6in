import { Button } from '@ori6in/ui';
import { MediaStepCard } from '../../../components/cards';
import { PageBanner } from '../../../components/PageBanner';
import { FlowConnector } from '../../../components/FlowConnector';
import { BANNERS, HOME } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'How it works',
  description:
    'Dream → Apply → Fly: how ORI6IN takes you from profile clarity to university admit, visa, and departure.',
  path: '/how-it-works',
});

const STEPS = [
  {
    role: 'Discover',
    title: 'Profile & path',
    caption: 'Career counselling, course fit, and country selection with a counsellor.',
    image: HOME.pathPrograms,
  },
  {
    role: 'Apply',
    title: 'Shortlist & submit',
    caption: 'Universities, test prep, SOP/LOR, scholarships, and tracked applications.',
    image: HOME.pathMentors,
  },
  {
    role: 'Fly',
    title: 'Visa & depart',
    caption: 'Visa documentation, mocks, and ORI6IN Fly pre-departure support.',
    image: HOME.pathInternships,
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <PageBanner
        image={BANNERS.howItWorks}
        kicker="How it works"
        title="Dream → Apply → Fly"
        lead="One study-abroad journey — from first counselling call to boarding."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <div className="mkt-flow-mini" aria-label="ORI6IN flow">
          <span className="mkt-flow-mini__node">Discover</span>
          <FlowConnector />
          <span className="mkt-flow-mini__node">Apply</span>
          <FlowConnector />
          <span className="mkt-flow-mini__node">Fly</span>
        </div>

        <ol className="mkt-program-grid" style={{ listStyle: 'none', padding: 0 }}>
          {STEPS.map((step, i) => (
            <li key={step.role}>
              <MediaStepCard
                image={step.image}
                meta={`0${i + 1} · ${step.role}`}
                title={step.title}
                caption={step.caption}
                eager={i === 0}
                index={i}
              />
            </li>
          ))}
        </ol>

        <div className="cta-row" style={{ marginTop: '2rem' }}>
          <Button href="/programs" variant="accent">
            Explore programs
          </Button>
          <Button href="/register" variant="secondary">
            Get started
          </Button>
          <Button href="/mentors" variant="secondary">
            Meet counsellors
          </Button>
        </div>
      </main>
    </>
  );
}
