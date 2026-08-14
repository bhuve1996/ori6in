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
          <motion.p
            className="home-hero__tag"
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.05, duration: 0.4, ease: easeOut }}
          >
            {BRAND.tagline}
          </motion.p>
          <motion.h1
            id="home-hero-brand"
            className="home-hero__brand"
            variants={scaleIn}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.12, duration: 0.5, ease: easeOut }}
          >
            <span className="home-hero__word">
              ORI<span className="brand__six">6</span>IN
            </span>
          </motion.h1>
          <motion.p
            className="home-hero__headline"
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.2, duration: 0.45, ease: easeOut }}
          >
            Learn with mentors. Build real work. Step into your next role.
          </motion.p>
          <motion.p
            className="home-hero__support"
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.28, duration: 0.45, ease: easeOut }}
          >
            Programs, mentorship, and internships in one crisp path from skill to opportunity.
          </motion.p>
          <motion.div
            className="home-hero__cta"
            variants={fadeUp}
            initial="hidden"
            animate={ready ? 'show' : 'hidden'}
            transition={{ delay: 0.36, duration: 0.45, ease: easeOut }}
          >
            <Button href="/programs" variant="accent">
              Explore programs
            </Button>
            <Button href="/register" variant="ghost">
              Get started
            </Button>
          </motion.div>
        </div>

        <motion.figure
          className="home-hero__owl"
          variants={scaleIn}
          initial="hidden"
          animate={ready ? 'show' : 'hidden'}
          transition={{ delay: 0.22, duration: 0.55, ease: easeOut }}
        >
          <img src={BRAND.owl} alt="ORI6IN owl mascot" width={420} height={420} />
        </motion.figure>
      </div>
    </section>
  );
}
