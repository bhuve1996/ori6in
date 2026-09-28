'use client';

import { COMPANY, formatInr, GRANT_MILESTONES, GRANT_SUMMARY, GRANT_TOTAL_INR } from '@ori6in/shared';
import { Kicker } from './GoldSix';

export function GrantStrip({ intro }: { intro: string }) {
  return (
    <section className="pub-section pub-grant">
      <Kicker>6RANT</Kicker>
      <h2>{intro}</h2>
      <p>
        {GRANT_SUMMARY} ({formatInr(GRANT_TOTAL_INR)} total as forex credit; amounts per the signed programme
        schedule). Not available on 6RAND.
      </p>
      <ul>
        {GRANT_MILESTONES.map((m) => (
          <li key={m.id}>
            {m.label} · {formatInr(m.amountInr)}
          </li>
        ))}
      </ul>
      <a href="/terms">Full T&Cs</a>
      <p className="pub-grant__phone">Questions: {COMPANY.phoneDisplay}</p>
    </section>
  );
}
