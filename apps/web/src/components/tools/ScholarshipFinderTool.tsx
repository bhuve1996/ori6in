'use client';

import { useMemo, useState } from 'react';
import {
  DESTINATIONS,
  SAMPLE_SCHOLARSHIPS,
  type DestinationKey,
  type UniLevel,
} from '@ori6in/shared';
import { initialsFor, scholarshipLeadImage } from '../../lib/media';

export function ScholarshipFinderTool() {
  const [country, setCountry] = useState<DestinationKey | 'multi' | ''>('');
  const [level, setLevel] = useState<UniLevel | 'any'>('masters');

  const results = useMemo(() => {
    return SAMPLE_SCHOLARSHIPS.filter((s) => {
      if (country && s.country !== country && s.country !== 'multi') return false;
      if (level !== 'any' && s.level !== 'any' && s.level !== level) return false;
      return true;
    });
  }, [country, level]);

  return (
    <div className="tool-panel">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Country</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value as DestinationKey | 'multi' | '')}
          >
            <option value="">Any / multi-country</option>
            {DESTINATIONS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.flag} {d.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value as UniLevel | 'any')}>
            <option value="any">Any</option>
            <option value="undergraduate">Bachelor&apos;s</option>
            <option value="masters">Master&apos;s</option>
            <option value="mba">MBA</option>
            <option value="phd">PhD</option>
          </select>
        </label>
      </form>

      <div className="tool-results">
        <p className="tool-results__meta">{results.length} funding leads · illustrative</p>
        <ul className="tool-result-list">
          {results.map((s) => {
            const dest =
              s.country === 'multi' ? null : DESTINATIONS.find((d) => d.key === s.country);
            const thumb = scholarshipLeadImage(s.type, s.id);
            return (
              <li key={s.id}>
                <article className="tool-card tool-card--media">
                  <div className="tool-card__media" aria-hidden="true">
                    <img src={thumb} alt="" loading="lazy" />
                    <span className="tool-card__crest">{initialsFor(s.name)}</span>
                  </div>
                  <div className="tool-card__body">
                    <header>
                      <h3>{s.name}</h3>
                      <span className="tool-pill">{s.type}</span>
                    </header>
                    <p>
                      {dest ? `${dest.flag} ${dest.name}` : '🌐 Multi-country'} ·{' '}
                      <strong>{s.amountHint}</strong>
                    </p>
                    <p className="meta">{s.eligibility}</p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        <p className="tool-footnote">
          Want a tailored shortlist? <a href="/study-abroad">6LOBAL counselling</a> or{' '}
          <a href="/contact">get a quote</a>.
        </p>
      </div>
    </div>
  );
}
