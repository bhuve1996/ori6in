import type { CSSProperties } from 'react';
import type { Program } from '../../lib/api';
import { formatPrice } from '../../lib/format';
import { programImage } from '../../lib/media';

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
              <a
                key={p.id}
                href={`/programs/${p.slug}`}
                className="home-program-card reveal series"
                style={series(3 + i)}
              >
                <div className="home-program-card__media">
                  <img src={programImage(p.slug)} alt="" loading="lazy" />
                </div>
                <div className="home-program-card__body">
                  <h3>{p.title}</h3>
                  <p className="tile-sub">{p.summary}</p>
                  <div className="home-program-card__foot">
                    <span className="price">{formatPrice(p.priceCents, p.currency)}</span>
                    <span className="tile-cta">View</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
        <p className="reveal series" style={{ ...series(6), marginTop: '1.75rem' }}>
          <a className="btn secondary" href="/programs">
            View all programs
          </a>
        </p>
      </div>
    </section>
  );
}
