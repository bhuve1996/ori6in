'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeUp, staggerChildren } from '../../lib/motion';

type Props = {
  children: ReactNode;
  className?: string;
};

/** Parent for staggered motion children using shared fadeUp variants. */
export function MotionStagger({ children, className }: Props) {
  return (
    <motion.div
      className={className}
      variants={staggerChildren}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}
