import type { CSSProperties } from 'react';
import { BRAND } from '../../lib/media';

type Props = {
  ready: boolean;
  sectionRef: (el: HTMLElement | null) => void;
};

function series(n: number): CSSProperties {
  return { '--series': n } as CSSProperties;
}

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
          <p className="home-hero__tag reveal series" style={series(0)}>
            {BRAND.tagline}
          </p>
          <h1 id="home-hero-brand" className="home-hero__brand">
            <span className="home-hero__word">
              ORI<span className="brand__six">6</span>IN
            </span>
          </h1>
          <p className="home-hero__headline reveal series" style={series(1)}>
            Learn with mentors. Build real work. Step into your next role.
          </p>
          <p className="home-hero__support reveal series" style={series(2)}>
            Programs, mentorship, and internships in one crisp path from skill to opportunity.
          </p>
          <div className="home-hero__cta reveal series" style={series(3)}>
            <a className="btn accent" href="/programs">
              Explore programs
            </a>
            <a className="btn ghost-light" href="/register">
              Get started
            </a>
          </div>
        </div>

        <figure className="home-hero__owl reveal series" style={series(2)}>
          <img src={BRAND.owl} alt="ORI6IN owl mascot" width={420} height={420} />
        </figure>
      </div>
    </section>
  );
}
