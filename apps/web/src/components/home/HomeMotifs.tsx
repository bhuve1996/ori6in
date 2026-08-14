'use client';

import { memo } from 'react';

type Props = {
  theme: string;
};

/** Floating educational SVG motifs — never shown on hero. */
function HomeMotifsInner({ theme }: Props) {
  return (
    <div
      className="home-motifs"
      data-active={theme === 'hero' ? '' : theme}
      aria-hidden="true"
      hidden={theme === 'hero'}
    >
      <svg className="home-motif home-motif--pencil" viewBox="0 0 64 64" fill="none">
        <path
          d="M12 44 L40 16 L48 24 L20 52 L12 52 Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M36 20 L44 28" stroke="currentColor" strokeWidth="2.5" />
        <path d="M14 50 L18 46" stroke="currentColor" strokeWidth="2" />
      </svg>
      <svg className="home-motif home-motif--book" viewBox="0 0 64 64" fill="none">
        <path
          d="M12 14 H30 C34 14 36 16 36 20 V50 C36 46 34 44 30 44 H12 Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M52 14 H34 C30 14 28 16 28 20 V50 C28 46 30 44 34 44 H52 Z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="home-motif home-motif--laptop" viewBox="0 0 64 64" fill="none">
        <rect
          x="12"
          y="14"
          width="40"
          height="28"
          rx="2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path d="M8 46 H56 L50 42 H14 Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
      <svg className="home-motif home-motif--badge" viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="28" r="14" stroke="currentColor" strokeWidth="2.5" />
        <path
          d="M24 40 L20 54 L32 48 L44 54 L40 40"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M26 28 L30 32 L38 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export const HomeMotifs = memo(HomeMotifsInner);
