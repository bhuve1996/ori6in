'use client';

import { useMemo, useState } from 'react';
import { DESTINATIONS, type DestinationKey } from '@ori6in/shared';

export function CostCalculatorTool() {
  const [country, setCountry] = useState<DestinationKey>('usa');
  const [years, setYears] = useState(2);
  const [lifestyle, setLifestyle] = useState<'frugal' | 'typical' | 'comfort'>('typical');

  const dest = DESTINATIONS.find((d) => d.key === country)!;

  const estimate = useMemo(() => {
    const tuitionMid = (dest.tuitionRangeUsd[0] + dest.tuitionRangeUsd[1]) / 2;
    const livingMid = (dest.livingMonthlyUsd[0] + dest.livingMonthlyUsd[1]) / 2;
    const livingFactor = lifestyle === 'frugal' ? 0.85 : lifestyle === 'comfort' ? 1.2 : 1;
    const livingYear = livingMid * 12 * livingFactor;
    const tuitionTotal = tuitionMid * years;
    const livingTotal = livingYear * years;
    const total = tuitionTotal + livingTotal;
    return { tuitionMid, livingYear, tuitionTotal, livingTotal, total };
  }, [dest, years, lifestyle]);

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
          <span>Program length (years) · {years}</span>
          <input
            type="range"
            min={1}
            max={4}
            step={1}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
          />
        </label>
        <label>
          <span>Lifestyle</span>
          <select
            value={lifestyle}
            onChange={(e) => setLifestyle(e.target.value as typeof lifestyle)}
          >
            <option value="frugal">Frugal</option>
            <option value="typical">Typical student</option>
            <option value="comfort">More comfort</option>
          </select>
        </label>
      </form>

      <div className="tool-results">
        <article className="tool-card tool-card--stat">
          <h3>
            {dest.flag} {dest.name} · {years}-year estimate
          </h3>
          <p>
            <strong>Tuition (mid):</strong> ~${Math.round(estimate.tuitionTotal).toLocaleString()}
          </p>
          <p>
            <strong>Living (est.):</strong> ~${Math.round(estimate.livingTotal).toLocaleString()}
          </p>
          <p className="tool-stat-total">
            Total ~ ${Math.round(estimate.total).toLocaleString()} USD
          </p>
          <p className="meta">
            Tuition band ${dest.tuitionRangeUsd[0].toLocaleString()}–$
            {dest.tuitionRangeUsd[1].toLocaleString()}/yr · Living $
            {dest.livingMonthlyUsd[0]}–${dest.livingMonthlyUsd[1]}/mo
          </p>
        </article>
        <p className="tool-footnote">
          Rough planning only — exchange rates and fees vary.{' '}
          <a href="/programs/ori6in-finance">ORI6IN Finance</a> can help with loans & forex, or{' '}
          <a href="/pricing">get a quote</a>.
        </p>
      </div>
    </div>
  );
}
