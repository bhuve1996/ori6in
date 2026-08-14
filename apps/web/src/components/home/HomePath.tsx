import type { CSSProperties } from 'react';
import { FlowConnector } from '../FlowConnector';
import { HOME } from '../../lib/media';

type Props = {
  sectionRef: (el: HTMLElement | null) => void;
};

const STEPS = [
  {
    key: 'programs',
    role: 'Student',
    title: 'Enroll & ship',
    caption: 'Join a track and build weekly milestones.',
    image: HOME.pathPrograms,
  },
  {
    key: 'mentors',
    role: 'Mentor',
    title: 'Get reviews',
    caption: 'Notes and grades that show what to fix next.',
    image: HOME.pathMentors,
  },
  {
    key: 'internships',
    role: 'Internship',
    title: 'Apply to roles',
    caption: 'Use your portfolio to apply and track status.',
    image: HOME.pathInternships,
  },
] as const;

function series(n: number): CSSProperties {
  return { '--series': n } as CSSProperties;
}

export function HomePath({ sectionRef }: Props) {
  return (
    <section
      id="path"
      ref={sectionRef}
      data-theme="path"
      className="home-section home-path"
    >
      <div className="home-section__inner">
        <p className="home-kicker reveal series" style={series(0)}>
          How it works
        </p>
        <h2 className="home-title reveal series" style={series(1)}>
          Student → mentor → role
        </h2>
        <p className="home-lead reveal series" style={series(2)}>
          One path. Three chapters.
        </p>

        <ol className="home-path-rail">
          {STEPS.map((step, i) => (
            <li
              key={step.key}
              className="home-path-rail__item reveal series"
              style={series(3 + i)}
            >
              {i > 0 && (
                <div className="home-path-rail__bridge" aria-hidden="true">
                  <FlowConnector />
                </div>
              )}
              <figure className="home-path-panel">
                <div className="home-path-panel__media">
                  <img src={step.image} alt="" loading="lazy" />
                  <span className="home-path-panel__role">{step.role}</span>
                  <span className="home-path-panel__num">0{i + 1}</span>
                </div>
                <figcaption>
                  <h3>{step.title}</h3>
                  <p>{step.caption}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
