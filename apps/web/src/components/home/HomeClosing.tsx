import type { CSSProperties } from 'react';
import { BRAND } from '../../lib/media';

type Props = {
  sectionRef: (el: HTMLElement | null) => void;
};

function series(n: number): CSSProperties {
  return { '--series': n } as CSSProperties;
}

export function HomeClosing({ sectionRef }: Props) {
  return (
    <section
      id="closing"
      ref={sectionRef}
      data-theme="closing"
      className="home-section home-closing"
    >
      <div className="home-section__inner home-closing__layout">
        <figure className="home-closing__owl reveal series" style={series(0)}>
          <img src={BRAND.owl} alt="" width={280} height={280} />
        </figure>
        <div>
          <p className="home-kicker reveal series" style={series(0)}>
            Ready when you are
          </p>
          <h2 className="home-title reveal series" style={series(1)}>
            Start building your next chapter
          </h2>
          <p className="home-lead reveal series" style={series(2)}>
            Create an account, pick a program, and learn with a mentor beside you.
          </p>
          <div className="home-hero__cta reveal series" style={series(3)}>
            <a className="btn accent" href="/register">
              Create account
            </a>
            <a className="btn ghost-light" href="/programs">
              Explore programs
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
