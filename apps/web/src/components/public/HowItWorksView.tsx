'use client';

import { useLead } from '../leads/LeadContext';
import { BANNERS, HOW_IT_WORKS_STEPS } from '../../lib/media';
import { goldSixNodes } from './GoldSix';
import { PublicHero } from './PublicHero';

const STEPS = [
  {
    n: '01',
    title: 'Discovery Session',
    body: 'Free, student and parents together — an honest profile audit.',
    image: HOW_IT_WORKS_STEPS.step1,
  },
  {
    n: '02',
    title: 'Personalised roadmap',
    body: 'Direction, milestones, and a term-by-term plan.',
    image: HOW_IT_WORKS_STEPS.step2,
  },
  {
    n: '03',
    title: 'Build',
    body: 'Projects, portfolio, exposure, skills, and communication.',
    image: HOW_IT_WORKS_STEPS.step3,
  },
  {
    n: '04',
    title: 'Progress, in writing',
    body: 'A monthly letter to parents plus a weekly counsellor cadence.',
    image: HOW_IT_WORKS_STEPS.step4,
  },
  {
    n: '05',
    title: 'Position',
    body: 'Applications, essays, tests, interviews.',
    image: HOW_IT_WORKS_STEPS.step5,
  },
  {
    n: '06',
    title: 'Admission',
    body: 'India or abroad — the right university.',
    image: HOW_IT_WORKS_STEPS.step6,
  },
] as const;

export function HowItWorksView() {
  const { openLead } = useLead();

  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="How it works"
        title="Six steps. One counsellor. No guesswork."
        lead="From the first complimentary session to the admission letter."
        image={BANNERS.howItWorks}
      />

      <section className="pub-section">
        <div className="pub-cards pub-cards--3">
          {STEPS.map((step) => (
            <article key={step.n}>
              <img className="pub-card-media" src={step.image} alt="" />
              <h3>
                {step.n} {step.title}
              </h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pub-section pub-note">
        <p>
          {goldSixNodes(
            'ED6E students continue into BRI6GE or straight into 6LOBAL study-abroad counselling under the same counsellor.',
          )}
        </p>
      </section>

      <section className="navy-cta">
        <h2>Step one is free — Start with a Discovery Session.</h2>
        <p>For student and parents together.</p>
        <button type="button" className="btn btn-accent" onClick={() => openLead({ kind: 'discovery' })}>
          Book a free Discovery Session
        </button>
      </section>
    </main>
  );
}
