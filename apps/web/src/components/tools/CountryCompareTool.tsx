'use client';

import { useMemo, useState } from 'react';
import { DESTINATIONS, type DestinationKey } from '@ori6in/shared';

export function CountryCompareTool() {
  const [a, setA] = useState<DestinationKey>('usa');
  const [b, setB] = useState<DestinationKey>('uk');

  const left = DESTINATIONS.find((d) => d.key === a)!;
  const right = DESTINATIONS.find((d) => d.key === b)!;

  const rows = useMemo(
    () => [
      {
        label: 'Tuition (USD / yr)',
        left: `$${left.tuitionRangeUsd[0].toLocaleString()}–$${left.tuitionRangeUsd[1].toLocaleString()}`,
        right: `$${right.tuitionRangeUsd[0].toLocaleString()}–$${right.tuitionRangeUsd[1].toLocaleString()}`,
      },
      {
        label: 'Living (USD / mo)',
        left: `$${left.livingMonthlyUsd[0]}–$${left.livingMonthlyUsd[1]}`,
        right: `$${right.livingMonthlyUsd[0]}–$${right.livingMonthlyUsd[1]}`,
      },
      { label: 'Work while studying', left: left.workWhileStudy, right: right.workWhileStudy },
      { label: 'Post-study', left: left.postStudy, right: right.postStudy },
      {
        label: 'English tests',
        left: left.englishTests.join(', '),
        right: right.englishTests.join(', '),
      },
      {
        label: 'Highlights',
        left: left.highlights.join(' · '),
        right: right.highlights.join(' · '),
      },
    ],
    [left, right],
  );

  return (
    <div className="tool-panel">
      <form className="tool-form tool-form--split" onSubmit={(e) => e.preventDefault()}>
        <label>
          <span>Country A</span>
          <select value={a} onChange={(e) => setA(e.target.value as DestinationKey)}>
            {DESTINATIONS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.flag} {d.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Country B</span>
          <select value={b} onChange={(e) => setB(e.target.value as DestinationKey)}>
            {DESTINATIONS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.flag} {d.name}
              </option>
            ))}
          </select>
        </label>
      </form>

      <div className="tool-results">
        <div className="compare-table" role="table" aria-label="Country comparison">
          <div className="compare-table__head" role="row">
            <span role="columnheader">Factor</span>
            <span role="columnheader">
              {left.flag} {left.name}
            </span>
            <span role="columnheader">
              {right.flag} {right.name}
            </span>
          </div>
          {rows.map((row) => (
            <div className="compare-table__row" role="row" key={row.label}>
              <span role="rowheader">{row.label}</span>
              <span role="cell">{row.left}</span>
              <span role="cell">{row.right}</span>
            </div>
          ))}
        </div>
        <p className="tool-footnote">
          Rules change — verify before you apply. Continue with{' '}
          <a href="/tools/cost-calculator">Cost Calculator</a> or <a href="/contact">get a quote</a>.
        </p>
      </div>
    </div>
  );
}
