import { DEMO_PAGES } from '@ori6in/shared';
import { publicFetch, type CmsPage } from '../../../lib/api';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS, HOME } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

const ABOUT_FALLBACK = DEMO_PAGES.find((p) => p.slug === 'about')!;

export const metadata = pageMeta({
  title: 'About',
  description:
    'ORI6IN brings programs, mentorship, and internships together so students can learn and launch with clarity.',
  path: '/about',
});

export default async function AboutPage() {
  const page = await publicFetch<CmsPage>('/cms/pages/about');

  return (
    <>
      <PageBanner
        image={BANNERS.about}
        kicker="About"
        title={page?.title ?? ABOUT_FALLBACK.title}
        lead="Programs, mentorship, and internships — in one place."
      />
      <main id="main-content" className="page page-after-banner page--wide">
        <div className="mkt-about">
          <div className="mkt-about__media">
            <img
              src={HOME.pathMentors}
              alt="Mentor guiding a student through project work"
              loading="lazy"
            />
          </div>
          <div className="mkt-about__copy">
            <div className="prose">{page?.body ?? ABOUT_FALLBACK.body}</div>
            <div className="mkt-flow-mini" aria-label="How ORI6IN works">
              <span className="mkt-flow-mini__node">Student</span>
              <span className="mkt-flow-mini__dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="mkt-flow-mini__node">Mentor</span>
              <span className="mkt-flow-mini__dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="mkt-flow-mini__node">Internship</span>
            </div>
            <div className="cta-row">
              <a className="btn accent" href="/programs">
                Explore programs
              </a>
              <a className="btn secondary" href="/register">
                Get started
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
