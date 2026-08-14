'use client';

import { motion } from 'motion/react';
import { easeOut, fadeUp, scaleIn } from '../lib/motion';

type Props = {
  image: string;
  title: string;
  lead?: string;
  kicker?: string;
  tone?: 'dark' | 'light';
};

export function PageBanner({ image, title, lead, kicker, tone = 'dark' }: Props) {
  return (
    <section className="page-banner" data-tone={tone} aria-label={title}>
      <motion.div
        className="page-banner__media"
        style={{ backgroundImage: `url(${image})` }}
        role="img"
        aria-hidden="true"
        initial={{ scale: 1.06, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.9, ease: easeOut }}
      />
      <motion.img
        className="page-banner__owl"
        src="/brand/owl.png"
        alt=""
        aria-hidden="true"
        width={160}
        height={160}
        variants={scaleIn}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.15, duration: 0.5, ease: easeOut }}
      />
      <div className="page-banner__inner">
        {kicker ? (
          <motion.p
            className="page-banner__kicker"
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.05, duration: 0.4, ease: easeOut }}
          >
            {kicker}
          </motion.p>
        ) : null}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.12, duration: 0.45, ease: easeOut }}
        >
          {title}
        </motion.h1>
        {lead ? (
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
          >
            {lead}
          </motion.p>
        ) : null}
      </div>
    </section>
  );
}
