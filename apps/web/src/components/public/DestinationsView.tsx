'use client';

import { STUDY_DESTINATIONS } from '@ori6in/shared';
import { BANNERS, universityCampusImage } from '../../lib/media';
import { PublicHero } from './PublicHero';

export function DestinationsView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Destinations"
        title="Eight countries, current rules."
        lead="Figures come from the VAAK Country Rules Registry — the knowledge base counsellors work from."
        image={BANNERS.howItWorks}
      />

      <section className="pub-section">
        <div className="pub-cards pub-cards--3">
          {STUDY_DESTINATIONS.map((d) => (
            <article key={d.id}>
              <img className="pub-card-media" src={universityCampusImage(d.id, d.id)} alt="" />
              <h3>{d.name}</h3>
              <p>{d.work}</p>
              <p>Tests: {d.tests}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="navy-cta">
        <h2>Not sure which country fits?</h2>
        <a className="btn btn-accent" href="/eligibility">
          Run the 6-question check
        </a>
      </section>
    </main>
  );
}
