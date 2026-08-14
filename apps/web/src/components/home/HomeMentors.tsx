import type { CSSProperties } from 'react';
import { Avatar } from '../Avatar';
import { FlowConnector } from '../FlowConnector';
import type { MentorCardData } from '../cards';

export type HomeMentor = Pick<MentorCardData, 'id' | 'fullName' | 'title'>;

type Props = {
  mentors: HomeMentor[];
  sectionRef: (el: HTMLElement | null) => void;
};

function series(n: number): CSSProperties {
  return { '--series': n } as CSSProperties;
}

export function HomeMentors({ mentors, sectionRef }: Props) {
  const faces = mentors.slice(0, 6);

  return (
    <section
      id="mentors"
      ref={sectionRef}
      data-theme="mentors"
      className="home-section home-mentors"
    >
      <div className="home-section__inner">
        <p className="home-kicker reveal series" style={series(0)}>
          Mentors
        </p>
        <h2 className="home-title reveal series" style={series(1)}>
          Faces behind the feedback
        </h2>
        <p className="home-lead reveal series" style={series(2)}>
          Real people review your work — not a faceless queue.
        </p>

        <div className="home-mentor-strip reveal series" style={series(3)}>
          <div className="home-mentor-strip__you" aria-hidden="true">
            <Avatar name="You" seed="home-student" kind="student" size="lg" decorative />
            <span>You</span>
          </div>

          <FlowConnector tone="dark" className="home-mentor-strip__connector" />

          {faces.length === 0 ? (
            <p className="home-empty">Mentors will appear here soon.</p>
          ) : (
            <ul className="home-mentor-faces">
              {faces.map((m, i) => (
                <li key={m.id} className="reveal series" style={series(4 + i)}>
                  <a href={`/mentors/${m.id}`} className="home-mentor-face">
                    <span className="home-mentor-face__avatar">
                      <Avatar name={m.fullName} seed={m.fullName} kind="mentor" size="lg" decorative />
                    </span>
                    <span className="home-mentor-face__name">{m.fullName}</span>
                    <span className="home-mentor-face__title">{m.title || 'Mentor'}</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className="reveal series"
          style={{ ...series(4 + Math.min(faces.length, 5)), marginTop: '1.75rem' }}
        >
          <a className="btn btn-accent" href="/mentors">
            Meet mentors
          </a>
        </div>
      </div>
    </section>
  );
}
