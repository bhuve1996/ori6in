'use client';

import { useEffect, useRef, useState } from 'react';
import type { Program } from '../../lib/api';
import { HomeBlobs } from './HomeBlobs';
import { HomeClosing } from './HomeClosing';
import { HomeHero } from './HomeHero';
import { HomeInternships } from './HomeInternships';
import { HomeMentors, type HomeMentor } from './HomeMentors';
import { HomeMotifs } from './HomeMotifs';
import { HomeOutcomes } from './HomeOutcomes';
import { HomePath } from './HomePath';
import { HomePrograms } from './HomePrograms';

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
  const [theme, setTheme] = useState<Theme>('hero');
  const [ready, setReady] = useState(false);
  const sectionRefs = useRef<Partial<Record<Theme, HTMLElement | null>>>({});

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setReady(true);
      sectionRefs.current.hero?.classList.add('is-inview');
    });
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    document.body.dataset.homeTheme = theme;
    return () => {
      delete document.body.dataset.homeTheme;
    };
  }, [theme]);

  useEffect(() => {
    const sections = THEMES.map((id) => sectionRefs.current[id]).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    const ratios = new Map<Theme, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute('data-theme') as Theme | null;
          if (!id) continue;
          ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          }
        }

        let best: Theme = 'hero';
        let bestRatio = -1;
        for (const id of THEMES) {
          const r = ratios.get(id) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = id;
          }
        }
        if (bestRatio > 0) setTheme(best);
      },
      {
        threshold: [0.15, 0.35, 0.55, 0.75],
        rootMargin: '-20% 0px -35% 0px',
      },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  function setSectionRef(id: Theme) {
    return (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    };
  }

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

      <footer className="home-footer">
        <img src="/brand/owl.png" alt="" className="home-footer__owl" width={56} height={56} />
        <p>© {new Date().getFullYear()} ORI6IN · Everything starts here.</p>
        <nav className="home-footer__nav" aria-label="Footer">
          <a href="/programs">Programs</a>
          <a href="/mentors">Mentors</a>
          <a href="/how-it-works">How it works</a>
          <a href="/pricing">Pricing</a>
          <a href="/blog">Blog</a>
          <a href="/about">About</a>
          <a href="/login">Login</a>
          <a href="/register">Register</a>
        </nav>
      </footer>
    </main>
  );
}
