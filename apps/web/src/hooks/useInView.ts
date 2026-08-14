'use client';

import { useEffect, useRef, useState } from 'react';

type Options = IntersectionObserverInit & {
  /** Disconnect after the first intersection (default true). */
  once?: boolean;
};

/** Observe an element and flip `inView` when it enters the viewport. */
export function useInView<T extends Element = HTMLElement>(options: Options = {}) {
  const { once = true, root, rootMargin, threshold } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setInView(true);
        if (once) observer.disconnect();
      },
      { root, rootMargin, threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [inView, once, root, rootMargin, threshold]);

  return { ref, inView };
}
