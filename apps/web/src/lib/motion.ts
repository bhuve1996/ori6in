import type { Transition, Variants } from 'motion/react';

/** Brand ease — matches CSS `--ease-out`. */
export const easeOut = [0.22, 1, 0.36, 1] as const;

export const softSpring: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 32,
  mass: 0.85,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: easeOut },
  },
};

export const staggerChildren: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export function revealTransition(delay = 0): Transition {
  return { duration: 0.45, ease: easeOut, delay };
}
