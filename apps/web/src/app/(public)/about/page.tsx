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
    'ORI6IN Education helps students Dream. Apply. Fly. — counselling, test prep, admits, scholarships, visas, and pre-departure.',
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
        lead="Study abroad counselling — from first shortlist to departure."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <div className="mkt-about">
          <div className="mkt-about__media">
            <img
              src={HOME.pathMentors}
              alt="Counsellor guiding a student through study-abroad planning"
              loading="lazy"
            />
          </div>
          <div className="mkt-about__copy">
            <div className="prose">{body}</div>
            <div className="mkt-flow-mini" aria-label="How ORI6IN works">
              <span className="mkt-flow-mini__node">Discover</span>
              <FlowConnector />
              <span className="mkt-flow-mini__node">Apply</span>
              <FlowConnector />
              <span className="mkt-flow-mini__node">Fly</span>
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
