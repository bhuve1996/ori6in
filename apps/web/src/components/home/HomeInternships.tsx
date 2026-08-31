import type { CSSProperties } from 'react';

type Props = {
  sectionRef: (el: HTMLElement | null) => void;
};

const MICRO = [
  { label: 'Destinations', hint: 'USA · UK · Canada · more' },
  { label: 'Shortlist', hint: 'Safe · Target · Ambitious' },
  { label: 'Apply', hint: 'Essays, tests, tracking' },
] as const;

function series(n: number): CSSProperties {
  return { '--series': n } as CSSProperties;
}

export function HomeInternships({ sectionRef }: Props) {
  return (
    <section
      id="internships"
      ref={sectionRef}
      data-theme="internships"
      className="home-section home-internships"
    >
      <div className="home-section__inner">
        <div className="home-internships__panel">
          <p className="home-kicker reveal series" style={series(0)}>
            Destinations
          </p>
          <h2 className="home-title reveal series" style={series(1)}>
            From shortlist to admit
          </h2>
          <p className="home-lead reveal series" style={series(2)}>
            Study in the USA, UK, Canada, Australia, Germany, and more — with counsellor support.
          </p>
          <ul className="home-micro-steps">
            {MICRO.map((m, i) => (
              <li key={m.label} className="reveal series" style={series(3 + i)}>
                <strong>{m.label}</strong>
                <span>{m.hint}</span>
              </li>
            ))}
          </ul>
          <div className="reveal series" style={series(6)}>
              <a className="btn btn-accent" href="/programs">
                Explore study abroad
              </a>
          </div>
        </div>
      </div>
    </section>
  );
}
