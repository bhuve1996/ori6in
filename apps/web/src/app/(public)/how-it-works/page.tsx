import { Button } from '@ori6in/ui';
import { MediaStepCard } from '../../../components/cards';
import { PageBanner } from '../../../components/PageBanner';
import { FlowConnector } from '../../../components/FlowConnector';
import { BANNERS, HOME } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'How it works',
  description: 'Student → mentor → internship: how ORI6IN takes you from learning to opportunity.',
  path: '/how-it-works',
});

const STEPS = [
  {
    role: 'Student',
    title: 'Enroll & ship',
    caption: 'Join a track, complete lessons, and build weekly project milestones.',
    image: HOME.pathPrograms,
  },
  {
    role: 'Mentor',
    title: 'Get reviews',
    caption: 'Mentors leave notes and grades so you know what to improve next.',
    image: HOME.pathMentors,
  },
  {
    role: 'Internship',
    title: 'Apply to roles',
    caption: 'Use your portfolio to apply to internships and track status after you sign in.',
    image: HOME.pathInternships,
  },
] as const;

export default function HowItWorksPage() {
  return (
    <>
      <PageBanner
        image={BANNERS.howItWorks}
        kicker="How it works"
        title="Student → mentor → role"
        lead="One path from learning to opportunity — in three chapters."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <div className="mkt-flow-mini" aria-label="ORI6IN flow">
          <span className="mkt-flow-mini__node">Student</span>
          <FlowConnector />
          <span className="mkt-flow-mini__node">Mentor</span>
          <FlowConnector />
          <span className="mkt-flow-mini__node">Internship</span>
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
            Meet mentors
          </Button>
        </div>
      </main>
    </>
  );
}
