'use client';

import { COMPANY, ED6E_EXPANSION, ED6E_STAGES } from '@ori6in/shared';
import { HOME } from '../../lib/media';
import { useLead } from '../leads/LeadContext';
import { goldSixNodes, Kicker } from './GoldSix';
import { ReviewsGallery } from './ReviewsGallery';

export function PublicHome() {
  const { openLead } = useLead();

  return (
    <main id="main-content" className="pub">
      <section className="pub-hero">
        <div className="pub-hero__copy">
          <Kicker>ORI6IN Education</Kicker>
          <h1 className="type-display-lg">Find what you’re capable of. Then build on it.</h1>
          <p className="type-lead">
            A profile-building platform for students from Class 8 onwards — discover strengths, define
            direction, and arrive at the right university in India or abroad.
          </p>
          <div className="pub-actions">
            <button type="button" className="btn btn-accent" onClick={() => openLead({ kind: 'discovery' })}>
              Book a free Discovery Session
            </button>
            <a className="btn btn-secondary" href="/how-it-works">
              See how it works
            </a>
            <a className="btn btn-secondary" href="/study-abroad">
              Study abroad counselling
            </a>
            <a className="btn btn-secondary" href="/ed6e">
              The ED6E programme
            </a>
          </div>
        </div>
        <aside className="pub-journey">
          <img src={HOME.hero} alt="" className="pub-journey__photo" />
          <p className="type-kicker">The journey</p>
          <ol>
            <li>
              <span>01</span> Discover
            </li>
            <li>
              <span>02</span> Explore
            </li>
            <li>
              <span>03</span> Define
            </li>
            <li>
              <span>04</span> Differentiate
            </li>
            <li>
              <span>05</span> Position
            </li>
          </ol>
          <p className="pub-journey__next">After Class 12 → BRI6GE for the college years → 6LOBAL for the applications</p>
        </aside>
      </section>

      <section className="pub-section">
        <h2>Three things we believe</h2>
        <div className="pub-cards pub-cards--3">
          <article>
            <h3>01 Beyond the marksheet</h3>
            <p>Marks open doors. We build the rest of the evidence.</p>
          </article>
          <article>
            <h3>02 Start where you are</h3>
            <p>The plan begins from the child’s reality, not a template.</p>
          </article>
          <article>
            <h3>03 One counsellor, one plan</h3>
            <p>No hand-offs, no conflicting advice.</p>
          </article>
        </div>
      </section>

      <section className="pub-section">
        <p className="type-kicker">{goldSixNodes('Flagship')}</p>
        <h2>{goldSixNodes('ED6E — Class 8 to 12')}</h2>
        <p className="type-lead">{goldSixNodes(ED6E_EXPANSION)}</p>
        <p className="type-lead">
          A five-year programme you can join at the current class. Parents receive a monthly progress letter.
        </p>
        <div className="pub-table">
          <div className="pub-table__row pub-table__row--head">
            <span>Class</span>
            <span>Stage</span>
            <span>Focus</span>
          </div>
          {ED6E_STAGES.map((row) => (
            <div key={row.catalogueId} className="pub-table__row">
              <span>{row.entry}</span>
              <span>{row.stage}</span>
              <span>{row.focus}</span>
            </div>
          ))}
        </div>
        <div className="pub-actions">
          <button type="button" className="btn btn-accent" onClick={() => openLead({ kind: 'discovery' })}>
            Book a free Discovery Session
          </button>
          <a className="btn btn-secondary" href="/ed6e">
            Explore ED6E
          </a>
        </div>
      </section>

      <section className="pub-section">
        <h2>Where the journey lands</h2>
        <div className="pub-cards pub-cards--3">
          <article>
            <h3>{goldSixNodes('BRI6GE')}</h3>
            <p>
              For students already in an Indian UG degree who want a master’s abroad — the college-years runway.
            </p>
            <a href="/bri6ge">{goldSixNodes('Explore BRI6GE')}</a>
          </article>
          <article>
            <h3>{goldSixNodes('6LOBAL Study Abroad')}</h3>
            <p>
              UG, Master’s, MBA and PhD counselling across eight destinations — shortlists, essays, visas, post-offer
              journey.
            </p>
            <a href="/study-abroad">{goldSixNodes('Explore 6LOBAL')}</a>
          </article>
          <article>
            <h3>{goldSixNodes('6RIP Test Preparation')}</h3>
            <p>
              IELTS, TOEFL, GRE, GMAT Focus, SAT, German A1–B2, dMAT — small batches and one-to-one at Jayanagar and
              online.
            </p>
            <a href="/test-prep">{goldSixNodes('Explore 6RIP')}</a>
          </article>
        </div>
      </section>

      <ReviewsGallery />

      <section className="navy-cta">
        <h2>Everything starts here.</h2>
        <p>A complimentary Discovery Session for the student and parents together.</p>
        <div className="pub-actions">
          <button type="button" className="btn btn-accent" onClick={() => openLead({ kind: 'discovery' })}>
            Book a free Discovery Session
          </button>
          <a className="btn btn-secondary" href={`tel:${COMPANY.phoneTel}`}>
            Call {COMPANY.phoneDisplay}
          </a>
          <a className="btn btn-secondary" href={COMPANY.whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp us
          </a>
        </div>
      </section>
    </main>
  );
}
