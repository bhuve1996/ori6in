import { DEMO_PAGES } from '@ori6in/shared';
import { Button } from '@ori6in/ui';
import { FlowConnector } from '../../../components/FlowConnector';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS, HOME } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';
import { getCmsPage, resolveCmsCopy } from '../../../services/public-content';

const ABOUT_FALLBACK = DEMO_PAGES.find((p) => p.slug === 'about')!;

export const metadata = pageMeta({
  title: 'About',
  description:
    'ORI6IN brings programs, mentorship, and internships together so students can learn and launch with clarity.',
  path: '/about',
});

export default async function AboutPage() {
  const page = await getCmsPage('about');
  const { title, body } = resolveCmsCopy(page, ABOUT_FALLBACK, 220);

  return (
    <>
      <PageBanner
        image={BANNERS.about}
        kicker="About"
        title={title}
        lead="Programs, mentorship, and internships — in one place."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <div className="mkt-about">
          <div className="mkt-about__media">
            <img
              src={HOME.pathMentors}
              alt="Mentor guiding a student through project work"
              loading="lazy"
            />
          </div>
          <div className="mkt-about__copy">
            <div className="prose">{body}</div>
            <div className="mkt-flow-mini" aria-label="How ORI6IN works">
              <span className="mkt-flow-mini__node">Student</span>
              <FlowConnector />
              <span className="mkt-flow-mini__node">Mentor</span>
              <FlowConnector />
              <span className="mkt-flow-mini__node">Internship</span>
            </div>
            <div className="cta-row">
              <Button href="/programs" variant="accent">
                Explore programs
              </Button>
              <Button href="/register" variant="secondary">
                Get started
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
