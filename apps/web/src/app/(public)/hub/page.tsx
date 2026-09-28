import { HUB_CHANNELS, HUB_EVENTS } from '@ori6in/shared';
import { PublicHero } from '../../../components/public/PublicHero';
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
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Community"
        title="ORI6IN Student Hub"
        lead="Country communities, webinars, scholarship alerts, test-prep resources, and pre-departure sessions."
        image={BANNERS.mentors}
      />
      <section className="pub-section">
        <h2>Communities</h2>
        <p className="type-lead">
          Join after you create an account — counsellors and peers share updates by destination.
        </p>
        <div className="pub-cards pub-cards--3">
          {HUB_CHANNELS.map((c) => (
            <article key={c.id}>
              <h3>{c.title}</h3>
              <p>{c.blurb}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="pub-section">
        <h2>Upcoming sessions</h2>
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
      <section className="pub-section">
        <h2>Resources</h2>
        <ul className="hub-links">
          <li>
            <a href="/tools">Free planning tools</a>
          </li>
          <li>
            <a href="/programmes">Programmes</a>
          </li>
          <li>
            <a href="/blog">Guides & updates</a>
          </li>
          <li>
            <a href="/study-abroad">6LOBAL counselling</a>
          </li>
        </ul>
        <div className="pub-actions" style={{ marginTop: '1.5rem' }}>
          <a className="btn btn-accent" href="/register">
            Create account
          </a>
          <a className="btn btn-secondary" href="/contact">
            Get a quote
          </a>
        </div>
      </section>
    </main>
  );
}
