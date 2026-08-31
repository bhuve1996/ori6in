'use client';

import { useMemo, useState } from 'react';
import {
  DESTINATIONS,
  SAMPLE_UNIVERSITIES,
  type DestinationKey,
  type UniLevel,
} from '@ori6in/shared';
import { initialsFor, universityCampusImage } from '../../lib/media';

const LEVELS: Array<{ id: UniLevel; label: string }> = [
  { id: 'undergraduate', label: "Bachelor's" },
  { id: 'masters', label: "Master's" },
  { id: 'mba', label: 'MBA' },
  { id: 'phd', label: 'PhD' },
];

export function UniversityFinderTool() {
  const [country, setCountry] = useState<DestinationKey | ''>('');
  const [level, setLevel] = useState<UniLevel>('masters');
  const [field, setField] = useState('');
  const [budget, setBudget] = useState(40000);
  const [ielts, setIelts] = useState(6.5);

  const results = useMemo(() => {
    return SAMPLE_UNIVERSITIES.filter((u) => {
      if (country && u.country !== country) return false;
      if (!u.levels.includes(level) && !(level === 'mba' && u.levels.includes('masters'))) return false;
      if (field.trim()) {
        const q = field.trim().toLowerCase();
        if (!u.fields.some((f) => f.toLowerCase().includes(q))) return false;
      }
      if (u.tuitionUsd > budget + 5000) return false;
      if (ielts + 0.01 < u.ieltsMin - 0.5) return false;
      return true;
    }).sort((a, b) => {
      const order = { safe: 0, target: 1, ambitious: 2 };
      return order[a.selectivity] - order[b.selectivity] || a.tuitionUsd - b.tuitionUsd;
    });
  }, [country, level, field, budget, ielts]);

  return (
    <div className="tool-panel">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Preferred country</span>
          <select value={country} onChange={(e) => setCountry(e.target.value as DestinationKey | '')}>
            <option value="">Any</option>
            {DESTINATIONS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.flag} {d.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Degree level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value as UniLevel)}>
            {LEVELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Field / keyword</span>
          <input
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="CS, Business, Engineering…"
          />
        </label>
        <label>
          <span>Max tuition (USD / year) · ${budget.toLocaleString()}</span>
          <input
            type="range"
            min={5000}
            max={60000}
            step={1000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />
        </label>
        <label>
          <span>IELTS band (or equivalent) · {ielts.toFixed(1)}</span>
          <input
            type="range"
            min={5}
            max={8}
            step={0.5}
            value={ielts}
            onChange={(e) => setIelts(Number(e.target.value))}
          />
        </label>
      </form>

      <div className="tool-results">
        <p className="tool-results__meta">
          {results.length} university match{results.length === 1 ? '' : 'es'} · illustrative sample data
        </p>
        <ul className="tool-result-list">
          {results.map((u) => {
            const dest = DESTINATIONS.find((d) => d.key === u.country);
            const campus = universityCampusImage(u.id, u.country);
            return (
              <li key={u.id}>
                <article className="tool-card tool-card--media">
                  <div className="tool-card__media" aria-hidden="true">
                    <img src={campus} alt="" loading="lazy" />
                    <span className="tool-card__crest">{initialsFor(u.name)}</span>
                  </div>
                  <div className="tool-card__body">
                    <header>
                      <h3>{u.name}</h3>
                      <span className={`tool-pill tool-pill--${u.selectivity}`}>{u.selectivity}</span>
                    </header>
                    <p>
                      {dest?.flag} {dest?.name} · {u.city}
                    </p>
                    <p>
                      Tuition ~ ${u.tuitionUsd.toLocaleString()}/yr · IELTS {u.ieltsMin}+ ·{' '}
                      {u.fields.join(', ')}
                    </p>
                    <p className="meta">
                      {u.scholarshipLikely
                        ? 'Scholarship opportunities likely'
                        : 'Limited aid — plan funding early'}
                      {u.greOptional ? ' · GRE often optional' : ' · GRE often expected'}
                    </p>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        {results.length === 0 ? (
          <p className="meta">No matches — widen budget, country, or field, then request a counsellor quote.</p>
        ) : null}
        <p className="tool-footnote">
          Sample shortlist only. <a href="/pricing">Get a quote</a> for a profile-based Safe / Target / Ambitious list.
        </p>
      </div>
    </div>
  );
}
