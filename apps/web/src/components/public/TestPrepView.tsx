'use client';

import { BUNDLE_IDS, catalogueById, GRIP_FORMAT_LINE, GRIP_PARENT_REVIEWS, GRIP_TESTS } from '@ori6in/shared';
import { BANNERS } from '../../lib/media';
import { LeadButton } from '../leads/LeadButton';
import { goldSixNodes } from './GoldSix';
import { ParentReviewsSection } from './ParentReviewsSection';
import { PublicHero } from './PublicHero';

const VARIANT_DESCRIPTIONS: Record<string, string> = {
  // IELTS
  'ielts-regular': 'Comprehensive 4-module mastery with structured weekly diagnostic mock tests.',
  'ielts-fast': 'High-intensity crash course focusing on rapid score boosts and test techniques.',
  'ielts-weekend': 'Flexible weekend schedules tailored for working professionals and college students.',
  'ielts-121': 'Personalized 1-on-1 coaching targeting specific band score weaknesses.',

  // TOEFL
  'toefl-regular': 'Full syllabus coverage with AI-based computer speaking and writing evaluations.',
  'toefl-fast': 'Speed drills, exam simulation practice, and targeted section improvements.',
  'toefl-121': 'Dedicated private mentor for custom pace and focused module drills.',

  // GRE
  'gre-regular': 'In-depth Quant shortcuts, verbal vocabulary mastery, and timed section mocks.',
  'gre-intensive': 'Fast-paced advanced problem solving designed for ambitious 325+ scorers.',
  'gre-121': 'One-on-one customized syllabus targeted to your specific score gaps.',

  // GMAT Focus
  'gmat-regular': 'Complete Data Insights, Quant, and Verbal logic strategy for elite B-schools.',
  'gmat-intensive': 'Intensive adaptive mock sessions and high-difficulty reasoning review.',
  'gmat-121': 'Private guidance with top faculty on personalized timing and test strategy.',

  // Digital SAT
  'sat-regular': 'Desmos calculator tricks, reading evidence analysis, and adaptive modules.',
  'sat-intensive': 'Fast-track preparation with real past test papers and speed techniques.',
  'sat-121': 'Individualized mentoring dedicated to breaking the 1500+ score milestone.',

  // PTE
  'pte-regular': 'Complete computer-delivered test format coaching with voice accent training.',
  'pte-fast': 'Focused practice on scoring algorithms, templates, and high-frequency items.',
  'pte-121': 'Individual sessions focused on microphone technique and fluid oral fluency.',

  // DET
  'det-regular': 'Covers production subscores, adaptive difficulty questions, and video interviews.',
  'det-fast': 'Quick turnaround practice on question types, timing, and mock scoring.',
  'det-121': 'One-to-one simulation and real-time feedback on writing and speaking.',

  // German
  'german-a1': 'Foundational vocabulary, grammar essentials, and basic conversational German.',
  'german-a2': 'Everyday communication, elementary syntax, and practical dialogue practice.',
  'german-b1': 'Independent speaker proficiency required for university entrance and jobs.',
  'german-b2': 'Advanced academic German fluency needed for direct public university admits.',
  'german-121': 'Flexible personalized language training customized to your learning pace.',

  // French
  'french-a1': 'Beginner pronunciation, daily greetings, and fundamental grammatical bases.',
  'french-a2': 'Expanded vocabulary, past tenses, and situational conversation skills.',
  'french-b1': 'Intermediate fluency for academic study, DELF exams, and migration.',
  'french-121': 'Tailored private language coaching focusing on spoken confidence.',

  // Japanese
  'japanese-n5': 'Hiragana, Katakana, basic Kanji, and everyday conversational phrases.',
  'japanese-n4': 'Expanded grammar patterns, essential Kanji, and JLPT exam mock practice.',
  'japanese-121': 'One-on-one Japanese instruction paced to your exact timeline.',
};

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
          <div className="grip-test-header">
            <h2>{goldSixNodes(test.name)}</h2>
            <div className="grip-price-pill">
              <span className="grip-price-pill__sparkle">✦</span>
              <span>{test.badge || `Starts from ${test.startingPrice}`}</span>
            </div>
          </div>
          {test.summary ? <p className="grip-test-summary">{test.summary}</p> : null}
          <p className="type-meta">{GRIP_FORMAT_LINE}</p>
          <div className="pub-cards pub-cards--3">
            {test.variants.map((id) => {
              const item = catalogueById(id);
              if (!item) return null;
              return (
                <article key={id} className="grip-card">
                  <div className="grip-card__top">
                    <h3 className="grip-card__title">{item.label}</h3>
                    {VARIANT_DESCRIPTIONS[id] ? (
                      <p className="type-meta" style={{ margin: '0.45rem 0 0', lineHeight: 1.45, color: 'var(--muted)' }}>
                        {VARIANT_DESCRIPTIONS[id]}
                      </p>
                    ) : null}
                  </div>
                  <div className="grip-card__actions">
                    <LeadButton kind="quote" programmeId={id}>
                      Get a quote
                    </LeadButton>
                  </div>
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
