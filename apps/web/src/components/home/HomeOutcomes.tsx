import type { CSSProperties } from 'react';
import { HOME } from '../../lib/media';

type Props = {
  sectionRef: (el: HTMLElement | null) => void;
};

const TILES = [
  {
    title: 'A portfolio project',
    line: 'Ship something you can demo in interviews.',
    image: HOME.outcomesPortfolio,
  },
  {
    title: 'Mentor feedback trail',
    line: 'Reviews and notes that show how you improved.',
    image: HOME.outcomesFeedback,
  },
  {
    title: 'Internship-ready profile',
    line: 'Skills, projects, and proof — ready to apply.',
    image: HOME.outcomesReady,
  },
] as const;

function series(n: number): CSSProperties {
  return { '--series': n } as CSSProperties;
}

export function HomeOutcomes({ sectionRef }: Props) {
  return (
    <section
      id="outcomes"
      ref={sectionRef}
      data-theme="outcomes"
      className="home-section home-outcomes"
    >
      <div className="home-section__inner">
        <p className="home-kicker reveal series" style={series(0)}>
          What you leave with
        </p>
        <h2 className="home-title reveal series" style={series(1)}>
          Proof, not just progress bars
        </h2>
        <p className="home-lead reveal series" style={series(2)}>
          Finish with work and feedback you can show — not only completed lessons.
        </p>
        <div className="home-outcome-tiles">
          {TILES.map((t, i) => (
            <figure
              key={t.title}
              className="home-outcome-tile reveal series"
              style={series(3 + i)}
            >
              <div className="home-outcome-tile__media">
                <img src={t.image} alt="" loading="lazy" />
              </div>
              <figcaption>
                <h3>{t.title}</h3>
                <p>{t.line}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
