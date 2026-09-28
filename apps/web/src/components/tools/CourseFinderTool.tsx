'use client';

import { useMemo, useState } from 'react';
import { CAREER_PATHS, DESTINATIONS } from '@ori6in/shared';

export function CourseFinderTool() {
  const [interest, setInterest] = useState('');
  const [budgetMindset, setBudgetMindset] = useState<'value' | 'balanced' | 'premium'>('balanced');

  const matches = useMemo(() => {
    const q = interest.trim().toLowerCase();
    let paths = CAREER_PATHS;
    if (q) {
      paths = paths.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.courses.some((c) => c.toLowerCase().includes(q)) ||
          p.outlook.toLowerCase().includes(q),
      );
    }
    return paths.map((p) => {
      const countries = p.countries
        .map((k) => DESTINATIONS.find((d) => d.key === k))
        .filter(Boolean);
      const sorted = [...countries].sort((a, b) => {
        const mid = (d: (typeof DESTINATIONS)[number]) =>
          (d.tuitionRangeUsd[0] + d.tuitionRangeUsd[1]) / 2;
        if (budgetMindset === 'value') return mid(a!) - mid(b!);
        if (budgetMindset === 'premium') return mid(b!) - mid(a!);
        return 0;
      });
      return { ...p, destinations: sorted };
    });
  }, [interest, budgetMindset]);

  return (
    <div className="tool-panel">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>What do you want to study / become?</span>
          <input
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            placeholder="e.g. AI, MBA, design, biotech…"
          />
        </label>
        <label>
          <span>Budget mindset</span>
          <select
            value={budgetMindset}
            onChange={(e) => setBudgetMindset(e.target.value as typeof budgetMindset)}
          >
            <option value="value">Value / lower tuition first</option>
            <option value="balanced">Balanced</option>
            <option value="premium">Brand / premium first</option>
          </select>
        </label>
      </form>

      <div className="tool-results">
        <ul className="tool-result-list">
          {matches.map((p) => (
            <li key={p.id}>
              <article className="tool-card">
                <h3>{p.title}</h3>
                <p>
                  <strong>Courses:</strong> {p.courses.join(' · ')}
                </p>
                <p>
                  <strong>Countries:</strong>{' '}
                  {p.destinations.map((d) => `${d!.flag} ${d!.name}`).join(' · ')}
                </p>
                <p className="meta">{p.outlook}</p>
              </article>
            </li>
          ))}
        </ul>
        {matches.length === 0 ? <p className="meta">No pathway match — try a broader keyword.</p> : null}
        <p className="tool-footnote">
          Next step: a counsellor session via <a href="/eligibility">eligibility</a> or{' '}
          <a href="/contact">get a quote</a>.
        </p>
      </div>
    </div>
  );
}
