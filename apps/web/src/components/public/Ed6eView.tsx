'use client';

import { ED6E_EXPANSION, ED6E_PILLARS, ED6E_STAGES, ED6E_PARENT_REVIEWS } from '@ori6in/shared';
import { BANNERS, ed6eStageImage } from '../../lib/media';
import { LeadButton } from '../leads/LeadButton';
import { ParentReviewsSection } from './ParentReviewsSection';
import { PublicHero } from './PublicHero';

const MONTHLY = [
  'Profile audit',
  'Personalised roadmap',
  'Project & portfolio mentoring',
  'Exposure guidance',
  'Skill & communication support',
  'Application readiness',
  'Monthly progress letter to parents',
  'Weekly counsellor cadence',
] as const;

const PILLAR_COPY: Record<(typeof ED6E_PILLARS)[number], string> = {
  Excellence: 'Academic depth and mastery evidence.',
  Direction: 'Clarity of aim — the why, not just the what.',
  Growth: 'Skills and habits compounding term over term.',
  Exposure: 'Competitions, programmes, people beyond school.',
};

export function Ed6eView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="ED6E by ORI6IN · Class 8–12"
        title="Start where you are. Rise to who you’re meant to become."
        lead={`ED6E builds what a student can do beyond the marksheet, one stage per class, measured on four pillars: ${ED6E_EXPANSION.replace('ED6E = ', '')}.`}
        image={BANNERS.student}
      />

      <section className="pub-section">
        <h2>Join at your current class</h2>
        <div className="pub-cards pub-cards--3">
          {ED6E_STAGES.map((stage) => (
            <article key={stage.catalogueId}>
              <div className="pub-card-media-wrapper">
                <img
                  className="pub-card-media"
                  src={ed6eStageImage(stage.catalogueId)}
                  alt={`${stage.entry} — ${stage.stage}`}
                  loading="lazy"
                />
                <span className="pub-card-badge">{stage.years}</span>
              </div>
              <h3>
                Entry {stage.entry} — {stage.stage}
              </h3>
              <p>{stage.focus}</p>
              <LeadButton kind="quote" programmeId={stage.catalogueId}>
                Get a quote
              </LeadButton>
            </article>
          ))}
        </div>
      </section>

      <section className="pub-section">
        <h2>What happens monthly</h2>
        <ul className="pub-list">
          {MONTHLY.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="pub-section">
        <h2>The four pillars</h2>
        <div className="pub-cards pub-cards--3">
          {ED6E_PILLARS.map((pillar) => (
            <article key={pillar}>
              <h3>{pillar}</h3>
              <p>{PILLAR_COPY[pillar]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pub-section">
        <h2>For parents</h2>
        <div className="pub-cards pub-cards--3">
          <article>
            <h3>Monthly progress letter</h3>
            <p>What happened, what’s next, and where the child stands on each pillar.</p>
          </article>
          <article>
            <h3>Consent built in</h3>
            <p>Under-18 students are enrolled and consented through a parent. Parents are part of the cadence from day one.</p>
          </article>
        </div>
      </section>

      <ParentReviewsSection
        kicker="Parent Experiences"
        title="What parents say about ED6E"
        lead="Hear from parents whose children started profile-building from Class 8 through Class 12."
        reviews={ED6E_PARENT_REVIEWS}
        programmeTag="ED6E · Class 8–12"
      />

      <section className="pub-note pub-section">
        <h2>After Class 12, the journey continues</h2>
        <p>
          Students headed for a master’s abroad move to BRI6GE during their UG years, then to 6LOBAL for the
          applications. Same counsellor, same record, no re-telling the story.
        </p>
        <div className="pub-actions">
          <a className="btn btn-secondary" href="/bri6ge">
            BRI6GE
          </a>
          <a className="btn btn-secondary" href="/study-abroad">
            6LOBAL
          </a>
        </div>
      </section>

      <section className="navy-cta">
        <h2>Profile Discovery Session — for student and parent.</h2>
        <p>Complimentary first session; an honest read of the profile.</p>
        <div className="pub-actions">
          <LeadButton kind="discovery">Book the discovery session</LeadButton>
          <LeadButton kind="brochure" interest="ED6E (Class 8–12)" className="btn btn-secondary">
            Download the brochure
          </LeadButton>
          <LeadButton kind="quote" programmeId="ed6e-class-8" className="btn btn-secondary">
            Get a quote
          </LeadButton>
        </div>
      </section>
    </main>
  );
}
