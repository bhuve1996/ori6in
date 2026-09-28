'use client';

import { useMemo, useState } from 'react';
import {
  ELIGIBILITY_QUESTIONS,
  ELIGIBILITY_VERDICTS,
  eligibilitySuggestsBri6ge,
  eligibilityVerdict,
  type EligibilityAnswers,
} from '@ori6in/shared';
import { BANNERS } from '../../lib/media';
import { LeadForm } from '../leads/LeadForm';
import { PublicHero } from './PublicHero';

export function EligibilityView() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<EligibilityAnswers>>({});
  const done = step >= ELIGIBILITY_QUESTIONS.length;
  const q = ELIGIBILITY_QUESTIONS[step];
  const verdict = useMemo(() => eligibilityVerdict(answers), [answers]);
  const bri6ge = eligibilitySuggestsBri6ge(answers);

  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Eligibility"
        title="A six-question read."
        lead={`Progress ${Math.min(step + 1, 6)} / 6`}
        image={BANNERS.auth}
      >
        <div className="pub-progress" aria-hidden="true">
          <span style={{ width: `${(Math.min(step, 6) / 6) * 100}%` }} />
        </div>
      </PublicHero>

      {!done && q ? (
        <section className="pub-section">
          <h2>{q.prompt}</h2>
          <div className="pub-actions">
            {q.options.map((opt) => (
              <button
                key={opt}
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setAnswers((prev) => ({ ...prev, [q.id]: opt }));
                  setStep((s) => s + 1);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="pub-section">
          <h2>{ELIGIBILITY_VERDICTS[verdict].title}</h2>
          <p>{ELIGIBILITY_VERDICTS[verdict].body}</p>
          {bri6ge ? (
            <p>
              You are in the BRI6GE window: a master’s from an Indian bachelor’s. We will route your read toward the
              college-years programme.
            </p>
          ) : null}
          <LeadForm
            kind="eligibility"
            interest={bri6ge ? 'BRI6GE (UG Year 1–3)' : undefined}
            eligibility={answers as Record<string, string>}
          />
        </section>
      )}
    </main>
  );
}
