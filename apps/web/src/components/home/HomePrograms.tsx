import type { CSSProperties } from 'react';
import { Button } from '@ori6in/ui';
import { ProgramCard } from '../cards';
import type { Program } from '../../lib/api';

type Props = {
  programs: Program[];
  sectionRef: (el: HTMLElement | null) => void;
};

function series(n: number): CSSProperties {
  return { '--series': n } as CSSProperties;
}

export function HomePrograms({ programs, sectionRef }: Props) {
  const featured = programs.slice(0, 3);

  return (
    <section
      id="programs"
      ref={sectionRef}
      data-theme="programs"
      className="home-section home-programs"
    >
      <div className="home-section__inner">
        <p className="home-kicker reveal series" style={series(0)}>
          Programs
        </p>
        <h2 className="home-title reveal series" style={series(1)}>
          Pick a track. Start building.
        </h2>
        <p className="home-lead reveal series" style={series(2)}>
          ORI6IN own programs — buy directly and begin the same day.
        </p>
        {featured.length === 0 ? (
          <p className="home-empty reveal series" style={series(3)}>
            Programs will appear here once published.
          </p>
        ) : (
          <div className="home-program-strip">
            {featured.map((p, i) => (
              <ProgramCard
                key={p.id}
                program={p}
                surface="home"
                cta="View"
                summaryLines={2}
                titleAs="h3"
                index={i}
              />
            ))}
          </div>
        )}
        <p className="reveal series" style={{ ...series(6), marginTop: '1.75rem' }}>
          <Button href="/programs" variant="secondary">
            View all programs
          </Button>
        </p>
      </div>
    </section>
  );
}
