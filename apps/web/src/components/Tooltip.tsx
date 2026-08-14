'use client';

import type { ReactNode } from 'react';

type Props = {
  label: string;
  children: ReactNode;
  /** Prefer bottom on dense UI near the header */
  side?: 'top' | 'bottom';
  className?: string;
};

/** Accessible hover/focus tooltip. Prefer short labels. */
export function Tooltip({ label, children, side = 'top', className }: Props) {
  return (
    <span
      className={`tip${className ? ` ${className}` : ''}`}
      data-side={side}
      data-tip={label}
    >
      {children}
    </span>
  );
}
