'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeUp, revealTransition } from '../../lib/motion';

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function MotionReveal({ children, className, delay = 0 }: Props) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.22, margin: '0px 0px -8% 0px' }}
      transition={revealTransition(delay)}
    >
      {children}
    </motion.div>
  );
}
