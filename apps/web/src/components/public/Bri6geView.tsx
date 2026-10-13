'use client';

import { BRI6GE_PARENT_REVIEWS, BRI6GE_STAGES, ED6E_EXPANSION } from '@ori6in/shared';
import { BANNERS, HOME } from '../../lib/media';
import { LeadButton } from '../leads/LeadButton';
import { GrantStrip } from './GrantStrip';
import { ParentReviewsSection } from './ParentReviewsSection';
import { PublicHero } from './PublicHero';

const INCLUDED = [
  'Profile audit',
  'Semester-by-semester roadmap',
  'Internship & research mentoring',
  'Project & portfolio guidance',
  'Test calendar run with 6RIP courses',
  'Scholarship scouting',
  'German public-university route planning',
  'Final-year handover to 6LOBAL',
] as const;

export function Bri6geView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="BRI6GE by ORI6IN · UG Year 1–3"
        title="In college in India. Headed abroad for your master’s."
        lead={`A profile-building runway during the UG years — internships, research, projects and a test calendar — so the final-year application lands with three years of evidence, not three months of panic. Same four measured pillars as ED6E: ${ED6E_EXPANSION.replace('ED6E = ', '')}.`}
        image={BANNERS.internships}
      />

      <section className="pub-section">
        <h2>Join in your current UG year</h2>
        <div className="pub-cards pub-cards--3">
          {BRI6GE_STAGES.map((stage) => (
            <article key={stage.catalogueId}>
              <img className="pub-card-media" src={HOME.internships} alt="" />
              <h3>
                Entry {stage.entry} — {stage.stage} ({stage.years})
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
        <h2>What’s included</h2>
        <ul className="pub-list">
          {INCLUDED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="pub-note pub-section">
        <h2>Three years of evidence beats three months of panic.</h2>
        <p>Universities read trajectories, not just final-year documents — BRI6GE builds the trajectory.</p>
      </section>

      <section className="pub-section">
        <p>
          BRI6GE students move into 6LOBAL admission counselling in the final year — same counsellor wherever possible.
          Bundle pricing available.
        </p>
        <div className="pub-actions">
          <a className="btn btn-secondary" href="/study-abroad">
            6LOBAL
          </a>
          <a className="btn btn-secondary" href="/test-prep">
            6RIP bundles
          </a>
        </div>
      </section>

      <ParentReviewsSection
        kicker="College Parents"
        title="What parents say about BRI6GE"
        lead="How the UG runway prepared their college students for elite master’s and scholarships."
        reviews={BRI6GE_PARENT_REVIEWS}
        programmeTag="BRI6GE · UG Year 1–3"
      />

      <GrantStrip intro="Milestone rewards if you continue into 6LOBAL." />

      <section className="navy-cta">
        <h2>In college? The clock is already running.</h2>
        <p>Start with a complimentary Discovery Session — student and parents together.</p>
        <div className="pub-actions">
          <LeadButton kind="discovery">Book the discovery session</LeadButton>
          <LeadButton kind="brochure" interest="BRI6GE (UG Year 1–3)" className="btn btn-secondary">
            Download the brochure
          </LeadButton>
          <LeadButton kind="quote" programmeId="bri6ge-y1" className="btn btn-secondary">
            Get a quote
          </LeadButton>
        </div>
      </section>
    </main>
  );
}
