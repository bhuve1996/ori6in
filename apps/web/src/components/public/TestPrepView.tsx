'use client';

import { BUNDLE_IDS, catalogueById, GRIP_FORMAT_LINE, GRIP_PARENT_REVIEWS, GRIP_TESTS } from '@ori6in/shared';
import { BANNERS } from '../../lib/media';
import { LeadButton } from '../leads/LeadButton';
import { goldSixNodes } from './GoldSix';
import { ParentReviewsSection } from './ParentReviewsSection';
import { PublicHero } from './PublicHero';

export function TestPrepView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="6RIP · Test preparation"
        title="Every test your journey needs, under one roof."
        lead="Planned around the student’s intake, not a generic calendar — pick a variant, we send the plan and the fee."
        image={BANNERS.blog}
      />

      {GRIP_TESTS.map((test) => (
        <section key={test.id} className="pub-section">
          <h2>{goldSixNodes(test.name)}</h2>
          <p className="type-meta">{GRIP_FORMAT_LINE}</p>
          <div className="pub-cards pub-cards--3">
            {test.variants.map((id) => {
              const item = catalogueById(id);
              if (!item) return null;
              return (
                <article key={id}>
                  <h3>{item.label}</h3>
                  <LeadButton kind="quote" programmeId={id}>
                    Get a quote
                  </LeadButton>
                </article>
              );
            })}
          </div>
        </section>
      ))}

      <section className="pub-section">
        <h2>dMAT</h2>
        <article className="pub-cards">
          <article>
            <h3>dMAT preparation</h3>
            <p>For German master’s applicants under the APS India process, from summer 2027.</p>
            <LeadButton kind="quote" programmeId="dmat">
              Get a quote
            </LeadButton>
          </article>
        </article>
      </section>

      <ParentReviewsSection
        kicker="Score & Prep Reviews"
        title="What parents say about 6RIP"
        lead="How small batches and diagnostic test preparation unlocked breakthrough scores."
        reviews={GRIP_PARENT_REVIEWS}
        programmeTag="6RIP · Test Prep"
      />

      <section className="navy-cta">
        <h2>Not sure which test? Ask before you book anything.</h2>
        <p>Destination and intake decide the test — a counsellor advises which test, which score, by when.</p>
        <LeadButton kind="discovery" interest="6RIP — Test Preparation">
          Enquire about test prep
        </LeadButton>
      </section>

      <section className="pub-section" id="bundles">
        <h2>Bundle and save.</h2>
        <div className="pub-cards pub-cards--3">
          {BUNDLE_IDS.map((id) => {
            const item = catalogueById(id);
            if (!item) return null;
            return (
              <article key={id}>
                <h3>{item.label}</h3>
                <LeadButton kind="quote" programmeId={id}>
                  Get a quote
                </LeadButton>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
