'use client';

import { useMemo, useState } from 'react';
import {
  PROGRAM_CATEGORY_LABELS,
  categoryForSlug,
  type ProgramCategory,
} from '@ori6in/shared';
import { ProgramCard } from './cards';
import type { Program } from '../lib/api';

const FILTERS: Array<{ id: 'all' | ProgramCategory; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'flagship', label: PROGRAM_CATEGORY_LABELS.flagship },
  { id: 'packages', label: PROGRAM_CATEGORY_LABELS.packages },
  { id: 'test-prep', label: PROGRAM_CATEGORY_LABELS['test-prep'] },
  { id: 'admissions', label: PROGRAM_CATEGORY_LABELS.admissions },
  { id: 'combos', label: PROGRAM_CATEGORY_LABELS.combos },
  { id: 'premium', label: PROGRAM_CATEGORY_LABELS.premium },
];

type Props = { programs: Program[] };

export function ProgramsCatalog({ programs }: Props) {
  const [filter, setFilter] = useState<'all' | ProgramCategory>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return programs;
    return programs.filter((p) => categoryForSlug(p.slug) === filter);
  }, [programs, filter]);

  return (
    <div className="programs-catalog">
      <div className="programs-catalog__filters" role="tablist" aria-label="Program categories">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`programs-catalog__chip${filter === f.id ? ' is-active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="meta">No programs in this category yet.</p>
      ) : (
        <ul className="mkt-program-grid">
          {filtered.map((p, i) => (
            <li key={p.id}>
              <ProgramCard program={p} index={i} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
