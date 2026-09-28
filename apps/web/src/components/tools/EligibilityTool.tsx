'use client';

import { useMemo, useState } from 'react';
import { DESTINATIONS, type DestinationKey } from '@ori6in/shared';

export function EligibilityTool() {
  const [country, setCountry] = useState<DestinationKey>('usa');
  const [gpa, setGpa] = useState(7.5);
  const [ielts, setIelts] = useState(6.5);
  const [workYears, setWorkYears] = useState(0);
  const [level, setLevel] = useState<'undergraduate' | 'masters' | 'mba'>('masters');

  const dest = DESTINATIONS.find((d) => d.key === country)!;

  const verdict = useMemo(() => {
    const checks: Array<{ ok: boolean; label: string }> = [];
    checks.push({
      ok: gpa >= (level === 'undergraduate' ? 6.5 : 7),
      label: `Academics (GPA/percentage proxy ${gpa})`,
    });
    const needIelts = level === 'mba' ? 6.5 : 6.0;
    checks.push({
      ok: ielts >= needIelts,
      label: `English score (IELTS ${ielts} vs typical ${needIelts}+)`,
    });
    if (level === 'mba') {
      checks.push({
        ok: workYears >= 2,
        label: `Work experience (${workYears} yrs — MBA often wants 2+)`,
      });
    } else {
      checks.push({ ok: true, label: 'Work experience optional for this level' });
    }
    checks.push({
      ok: dest.englishTests.length > 0,
      label: `Accepted tests: ${dest.englishTests.join(', ')}`,
    });
    const score = checks.filter((c) => c.ok).length;
    const band = score >= 4 ? 'Ready to shortlist' : score >= 3 ? 'Almost ready' : 'Build profile first';
    return { checks, band };
  }, [country, gpa, ielts, workYears, level, dest]);

  return (
    <div className="tool-panel">
      <form className="tool-form" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Destination</span>
          <select value={country} onChange={(e) => setCountry(e.target.value as DestinationKey)}>
            {DESTINATIONS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.flag} {d.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Level</span>
          <select value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>
            <option value="undergraduate">Bachelor&apos;s</option>
            <option value="masters">Master&apos;s</option>
            <option value="mba">MBA</option>
          </select>
        </label>
        <label>
          <span>GPA / % proxy (out of 10) · {gpa.toFixed(1)}</span>
          <input
            type="range"
            min={5}
            max={10}
            step={0.1}
            value={gpa}
            onChange={(e) => setGpa(Number(e.target.value))}
          />
        </label>
        <label>
          <span>IELTS band · {ielts.toFixed(1)}</span>
          <input
            type="range"
            min={4.5}
            max={8}
            step={0.5}
            value={ielts}
            onChange={(e) => setIelts(Number(e.target.value))}
          />
        </label>
        <label>
          <span>Work experience (years) · {workYears}</span>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={workYears}
            onChange={(e) => setWorkYears(Number(e.target.value))}
          />
        </label>
      </form>

      <div className="tool-results">
        <article className="tool-card tool-card--stat">
          <h3>
            {dest.flag} {dest.name}: {verdict.band}
          </h3>
          <ul className="tool-check-list">
            {verdict.checks.map((c) => (
              <li key={c.label} data-ok={c.ok}>
                {c.ok ? '✓' : '○'} {c.label}
              </li>
            ))}
          </ul>
        </article>
        <p className="tool-footnote">
          Basic checker only — universities set their own bars.{' '}
          <a href="/tools/university-finder">University Finder</a> ·{' '}
          <a href="/contact">Get a quote</a>
        </p>
      </div>
    </div>
  );
}
