import type { CSSProperties } from 'react';
import { Tooltip } from '../Tooltip';

type Props = {
  sectionRef: (el: HTMLElement | null) => void;
};

const MICRO = [
  { label: 'Portfolio', hint: 'Show real projects' },
  { label: 'Apply', hint: 'Pick open roles' },
  { label: 'Track', hint: 'Watch status update' },
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
            Internships
          </p>
          <h2 className="home-title reveal series" style={series(1)}>
            From portfolio to opportunity
          </h2>
          <p className="home-lead reveal series" style={series(2)}>
            Sign in, browse roles, and apply when your work is ready to show.
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
            <Tooltip label="Internships open after you sign in as a student">
              <a className="btn" href="/login?next=/student/internships">
                Sign in to explore
              </a>
            </Tooltip>
          </div>
        </div>
      </div>
    </section>
  );
}
