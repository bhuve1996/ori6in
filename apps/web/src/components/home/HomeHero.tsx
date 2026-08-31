'use client';

import { Button } from '@ori6in/ui';
import { motion } from 'motion/react';
import { BRAND } from '../../lib/media';
import { easeOut, fadeUp, scaleIn } from '../../lib/motion';

type Props = {
  ready: boolean;
  sectionRef: (el: HTMLElement | null) => void;
};

export function HomeHero({ ready, sectionRef }: Props) {
  return (
    <section
      id="hero"
      ref={sectionRef}
      data-theme="hero"
      className={`home-section home-hero${ready ? ' is-ready' : ''}`}
      aria-labelledby="home-hero-brand"
    >
      <div className="home-hero__stage" aria-hidden="true">
        <video
          className="home-hero__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={BRAND.owl}
        >
          <source src={BRAND.introVideo} type="video/mp4" />
        </video>
        <div className="home-hero__veil" />
      </div>

      <div className="home-section__inner home-hero__layout">
        <div className="home-hero__copy">
          <motion.h1
            id="home-hero-brand"
            className="home-hero__brand"
            variants={scaleIn}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.08, duration: 0.5, ease: easeOut }}
          >
            <img
              className="home-hero__logo"
              src={BRAND.logoDark}
              alt="ORI6IN"
              width={420}
              height={168}
            />
          </motion.h1>
          <motion.p
            className="home-hero__headline"
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.18, duration: 0.45, ease: easeOut }}
          >
            Study abroad with counsellor-led clarity.
          </motion.p>
          <motion.p
            className="home-hero__support"
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.26, duration: 0.45, ease: easeOut }}
          >
            Counselling, test prep, applications, scholarships, visas — one clear journey.
          </motion.p>
          <motion.div
            className="home-hero__cta"
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.34, duration: 0.45, ease: easeOut }}
          >
            <Button href="/programs" variant="accent">
              Explore programs
            </Button>
            <Button href="/pricing" variant="ghost">
              Get a quote
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
