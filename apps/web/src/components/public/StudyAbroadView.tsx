'use client';

import { BANNERS, HOME } from '../../lib/media';
import { LeadButton } from '../leads/LeadButton';
import { GrantStrip } from './GrantStrip';
import { PublicHero } from './PublicHero';

export function StudyAbroadView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="6LOBAL by Edumillenia · Overseas counselling"
        title="Four tracks. One counsellor. Zero guesswork."
        lead="One counsellor stays with you from the first call to departure. We assess your profile, build a Reach, Match and Safe shortlist, guide your SOP, LOR and CV, follow up on offers and scholarships, prepare your visa file and interview, and help with pre-departure and forex."
        image={BANNERS.programs}
      />

      <section className="pub-section">
        <div className="pub-cards pub-cards--3">
          <article>
            <img className="pub-card-media" src={HOME.pathPrograms} alt="" />
            <h3>Undergraduate</h3>
            <p>
              For Class 11–12 students heading abroad for a bachelor’s degree. SAT/ACT strategy · subject-fit mapping ·
              early-decision planning · parent-CC communication. Destinations: USA, UK, Canada, Ireland, Netherlands,
              Singapore, Australia.
            </p>
            <LeadButton kind="quote" programmeId="global-essential-ug-ms">
              Get a quote
            </LeadButton>
          </article>
          <article>
            <img className="pub-card-media" src={HOME.pathMentors} alt="" />
            <h3>Master’s</h3>
            <p>
              MS/MSc across Engineering, CS/Data, Management, Finance and Design. GRE/IELTS/TOEFL planning · German
              public-university route (uni-assist, APS, dMAT from 2027) · September/January intakes.
            </p>
            <p>In college now? Start earlier with BRI6GE.</p>
            <div className="pub-actions">
              <LeadButton kind="quote" programmeId="global-essential-ug-ms">
                Get a quote
              </LeadButton>
              <a className="btn btn-secondary" href="/bri6ge">
                BRI6GE
              </a>
            </div>
          </article>
          <article>
            <img className="pub-card-media" src={HOME.mentors} alt="" />
            <h3>MBA</h3>
            <p>
              GMAT Focus strategy · school research · essay architecture with multiple reviewed drafts · mock interviews
              · scholarship strategy · admit negotiation guidance. Intensive support via 6RAND.
            </p>
            <LeadButton kind="quote" programmeId="global-essential-mba">
              Get a quote
            </LeadButton>
          </article>
          <article>
            <img className="pub-card-media" src={HOME.outcomesReady} alt="" />
            <h3>PhD</h3>
            <p>
              Supervisor mapping · research-statement reviews · funding and assistantship guidance. Destinations: USA,
              UK, Germany, Australia.
            </p>
            <LeadButton kind="quote" programmeId="phd-guidance">
              Get a quote
            </LeadButton>
          </article>
        </div>
      </section>

      <section className="pub-section">
        <h2>Choose your level of support</h2>
        <div className="pub-cards pub-cards--3">
          <article>
            <h3>6LOBAL Essential (UG/MS)</h3>
            <p>Counsellor-led shortlist, application guidance, document review, visa file support.</p>
            <LeadButton kind="quote" programmeId="global-essential-ug-ms">
              Get a quote
            </LeadButton>
          </article>
          <article>
            <h3>6LOBAL Essential (MBA)</h3>
            <p>The same, plus GMAT-aligned school research and essay reviews.</p>
            <LeadButton kind="quote" programmeId="global-essential-mba">
              Get a quote
            </LeadButton>
          </article>
          <article>
            <h3>6RAND — concierge</h3>
            <p>
              Dedicated concierge counsellor, line-by-line essay/SOP architecture across drafts, mock interviews,
              scholarship strategy, admit negotiation. Three tiers — scope agreed in your quote.
            </p>
            <LeadButton kind="quote" programmeId="grand-concierge">
              Get a quote
            </LeadButton>
          </article>
        </div>
      </section>

      <GrantStrip intro="Finish each step, earn ₹25,000 back." />
    </main>
  );
}
