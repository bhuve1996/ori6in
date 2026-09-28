'use client';

import { useLead } from '../leads/LeadContext';
import { HOME } from '../../lib/media';
import { goldSixNodes } from './GoldSix';
import { PublicHero } from './PublicHero';

const STEPS = [
  {
    n: '01',
    title: 'Discovery Session',
    body: 'Free, student and parents together — an honest profile audit.',
    image: HOME.mentors,
  },
  {
    n: '02',
    title: 'Personalised roadmap',
    body: 'Direction, milestones, and a term-by-term plan.',
    image: HOME.pathPrograms,
  },
  {
    n: '03',
    title: 'Build',
    body: 'Projects, portfolio, exposure, skills, and communication.',
    image: HOME.outcomesPortfolio,
  },
  {
    n: '04',
    title: 'Progress, in writing',
    body: 'A monthly letter to parents plus a weekly counsellor cadence.',
    image: HOME.outcomesFeedback,
  },
  {
    n: '05',
    title: 'Position',
    body: 'Applications, essays, tests, interviews.',
    image: HOME.pathMentors,
  },
  {
    n: '06',
    title: 'Admission',
    body: 'India or abroad — the right university.',
    image: HOME.outcomesReady,
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
        image={HOME.pathInternships}
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
