'use client';

import { memo, type ReactNode } from 'react';

type StatItem = {
  value: ReactNode;
  label: string;
};

function StatGridInner({ items }: { items: StatItem[] }) {
  return (
    <div className="stat-grid">
      {items.map((item) => (
        <div key={item.label} className="stat">
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export const StatGrid = memo(StatGridInner);
