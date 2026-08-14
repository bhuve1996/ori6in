'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import type { Program } from '../../lib/api';
import { useSectionTheme } from '../../hooks/useSectionTheme';
import { HomeBlobs } from './HomeBlobs';
import { HomeHero } from './HomeHero';
import type { HomeMentor } from './HomeMentors';
import { HomeMotifs } from './HomeMotifs';

const HomePath = dynamic(() => import('./HomePath').then((m) => m.HomePath), {
  loading: () => null,
});
const HomePrograms = dynamic(() => import('./HomePrograms').then((m) => m.HomePrograms), {
  loading: () => null,
});
const HomeMentors = dynamic(() => import('./HomeMentors').then((m) => m.HomeMentors), {
  loading: () => null,
});
const HomeInternships = dynamic(
  () => import('./HomeInternships').then((m) => m.HomeInternships),
  { loading: () => null },
);
const HomeOutcomes = dynamic(() => import('./HomeOutcomes').then((m) => m.HomeOutcomes), {
  loading: () => null,
});
const HomeClosing = dynamic(() => import('./HomeClosing').then((m) => m.HomeClosing), {
  loading: () => null,
});

const THEMES = [
  'hero',
  'path',
  'programs',
  'mentors',
  'internships',
  'outcomes',
  'closing',
] as const;

type Theme = (typeof THEMES)[number];

type Props = {
  programs: Program[];
  mentors: HomeMentor[];
};

export function HomeExperience({ programs, mentors }: Props) {
  const { theme, ready, setSectionRef } = useSectionTheme<Theme>({
    themes: THEMES,
    initial: 'hero',
  });

  useEffect(() => {
    document.body.dataset.homeTheme = theme;
    return () => {
      delete document.body.dataset.homeTheme;
    };
  }, [theme]);

  return (
    <main id="main-content" className={`home${ready ? ' is-ready' : ''}`} tabIndex={-1}>
      <div className="home-backdrop" aria-hidden="true">
        {THEMES.map((id) => (
          <div
            key={id}
            className={`home-backdrop__layer${theme === id ? ' is-active' : ''}`}
            data-theme={id}
          />
        ))}
      </div>

      <HomeBlobs />
      <HomeMotifs theme={theme} />

      <HomeHero ready={ready} sectionRef={setSectionRef('hero')} />
      <HomePath sectionRef={setSectionRef('path')} />
      <HomePrograms programs={programs} sectionRef={setSectionRef('programs')} />
      <HomeMentors mentors={mentors} sectionRef={setSectionRef('mentors')} />
      <HomeInternships sectionRef={setSectionRef('internships')} />
      <HomeOutcomes sectionRef={setSectionRef('outcomes')} />
      <HomeClosing sectionRef={setSectionRef('closing')} />
    </main>
  );
}
