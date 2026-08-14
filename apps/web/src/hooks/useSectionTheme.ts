'use client';

import { startTransition, useCallback, useEffect, useRef, useState } from 'react';

const DEFAULT_THRESHOLD = [0.2, 0.45, 0.7];
const DEFAULT_ROOT_MARGIN = '-18% 0px -32% 0px';

type ThemeConfig<T extends string> = {
  themes: readonly T[];
  initial: T;
  threshold?: number[];
  rootMargin?: string;
};

/**
 * Track which themed section is most visible and expose refs for each section.
 * Used by the homepage experience to drive backdrop/header tone.
 */
export function useSectionTheme<T extends string>({
  themes,
  initial,
  threshold = DEFAULT_THRESHOLD,
  rootMargin = DEFAULT_ROOT_MARGIN,
}: ThemeConfig<T>) {
  const [theme, setTheme] = useState<T>(initial);
  const [ready, setReady] = useState(false);
  const sectionRefs = useRef<Partial<Record<T, HTMLElement | null>>>({});
  const themeRef = useRef<T>(initial);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setReady(true);
      sectionRefs.current[initial]?.classList.add('is-inview');
    });
    return () => window.cancelAnimationFrame(id);
  }, [initial]);

  useEffect(() => {
    if (!ready) return;

    let observer: IntersectionObserver | null = null;
    let tries = 0;
    let timer: number | undefined;
    const ratios = new Map<T, number>();

    const attach = () => {
      const sections = themes
        .map((id) => sectionRefs.current[id])
        .filter((el): el is HTMLElement => Boolean(el));
      if (sections.length < themes.length) return false;

      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.getAttribute('data-theme') as T | null;
            if (!id) continue;
            ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
            if (entry.isIntersecting) {
              entry.target.classList.add('is-inview');
            }
          }

          let best = initial;
          let bestRatio = -1;
          for (const id of themes) {
            const r = ratios.get(id) ?? 0;
            if (r > bestRatio) {
              bestRatio = r;
              best = id;
            }
          }
          if (bestRatio > 0 && best !== themeRef.current) {
            themeRef.current = best;
            startTransition(() => setTheme(best));
          }
        },
        { threshold, rootMargin },
      );

      for (const section of sections) observer.observe(section);
      return true;
    };

    if (!attach()) {
      timer = window.setInterval(() => {
        tries += 1;
        if (attach() || tries > 40) {
          if (timer) window.clearInterval(timer);
        }
      }, 50);
    }

    return () => {
      if (timer) window.clearInterval(timer);
      observer?.disconnect();
    };
  }, [ready, themes, initial, threshold, rootMargin]);

  const setSectionRef = useCallback(
    (id: T) => (el: HTMLElement | null) => {
      sectionRefs.current[id] = el;
    },
    [],
  );

  return { theme, ready, setSectionRef };
}
