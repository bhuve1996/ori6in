import { HUB_CHANNELS, HUB_EVENTS } from '@ori6in/shared';
import { Button } from '@ori6in/ui';
import { PageBanner } from '../../../components/PageBanner';
import { BANNERS } from '../../../lib/media';
import { pageMeta } from '../../../lib/seo';

export const metadata = pageMeta({
  title: 'Student Hub',
  description:
    'ORI6IN Student Hub — country communities, webinars, scholarship alerts, test-prep resources, and pre-departure sessions.',
  path: '/hub',
});

export default function StudentHubPage() {
  return (
    <>
      <PageBanner
        image={BANNERS.mentors}
        kicker="Community"
        title="ORI6IN Student Hub"
        lead="Country communities, webinars, scholarship alerts, test-prep resources, and pre-departure sessions."
      />
      <main id="main-content" className="page page-after-banner page-wide">
        <section className="hub-section">
          <h2 className="hub-section__title">Communities</h2>
          <p className="hub-section__lead">
            Join after you create an account — counsellors and peers share updates by destination.
          </p>
          <ul className="hub-grid">
            {HUB_CHANNELS.map((c) => (
              <li key={c.id}>
                <article className="hub-card">
                  <h3>{c.title}</h3>
                  <p>{c.blurb}</p>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <section className="hub-section">
          <h2 className="hub-section__title">Upcoming sessions</h2>
          <ul className="hub-events">
            {HUB_EVENTS.map((e) => (
              <li key={e.title}>
                <span className="hub-events__tag">{e.tag}</span>
                <strong>{e.title}</strong>
                <span className="meta">{e.when}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="hub-section">
          <h2 className="hub-section__title">Resources</h2>
          <ul className="hub-links">
            <li>
              <a href="/tools">Free planning tools</a>
            </li>
            <li>
              <a href="/programs">Programs & packages</a>
            </li>
            <li>
              <a href="/blog">Guides & updates</a>
            </li>
            <li>
              <a href="/programs/ori6in-fly">ORI6IN Fly pre-departure</a>
            </li>
          </ul>
        </section>

        <div className="cta-row">
          <Button href="/register" variant="accent">
            Create account
          </Button>
          <Button href="/pricing" variant="secondary">
            Get a quote
          </Button>
        </div>
      </main>
    </>
  );
}
