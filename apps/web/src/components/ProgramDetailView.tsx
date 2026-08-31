'use client';

import { useMemo, type CSSProperties, type ReactNode } from 'react';
import { FlowConnector } from './FlowConnector';
import { useInView } from '../hooks/useInView';
import { HOME } from '../lib/media';

export type ProgramCurriculumCourse = {
  slug: string;
  title: string;
  summary: string;
  sortOrder: number;
  lessons: Array<{ slug: string; title: string; content: string; sortOrder: number }>;
};

type Program = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  priceCents: number;
  currency: string;
};

type Props = {
  program: Program;
  image: string;
  curriculum: ProgramCurriculumCourse[];
};

const CHAPTERS = [
  {
    key: 'discover',
    label: 'Discover',
    title: 'Find your path',
    caption: 'Profile, course, and country fit with a counsellor.',
    image: HOME.pathPrograms,
  },
  {
    key: 'apply',
    label: 'Apply',
    title: 'Shortlist & submit',
    caption: 'Universities, essays, tests, and scholarships.',
    image: HOME.pathMentors,
  },
  {
    key: 'fly',
    label: 'Fly',
    title: 'Visa & depart',
    caption: 'Visa file, mocks, and pre-departure with ORI6IN Fly.',
    image: HOME.pathInternships,
  },
] as const;

function series(n: number): CSSProperties {
  return { '--series': n } as CSSProperties;
}

function RevealSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { ref, inView } = useInView<HTMLElement>({
    threshold: 0.12,
    rootMargin: '0px 0px -6% 0px',
  });

  return (
    <section
      ref={ref}
      className={`program-detail__section${inView ? ' is-inview' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </section>
  );
}

export function ProgramDetailView({ program, image, curriculum }: Props) {
  const courseCount = curriculum.length;
  const lessonCount = useMemo(
    () => curriculum.reduce((n, c) => n + c.lessons.length, 0),
    [curriculum],
  );
  const descriptionBlocks = useMemo(
    () => program.description.split(/\n\n+/).filter(Boolean),
    [program.description],
  );

  return (
    <div className="program-detail">
      <RevealSection className="program-detail__intro">
        <a className="back-link reveal series" style={series(0)} href="/programs">
          ← Programs
        </a>

        <div className="program-detail__intro-grid">
          <div className="program-detail__intro-copy">
            <p className="program-detail__kicker reveal series" style={series(1)}>
              What you get
            </p>
            <h2 className="program-detail__title reveal series" style={series(2)}>
              {program.summary}
            </h2>

            <ul className="program-detail__stats reveal series" style={series(3)}>
              <li>
                <strong>{courseCount || '—'}</strong>
                <span>Modules</span>
              </li>
              <li>
                <strong>{lessonCount || '—'}</strong>
                <span>Lessons</span>
              </li>
              <li>
                <strong>Custom</strong>
                <span>Quote</span>
              </li>
            </ul>

            <div className="cta-row reveal series" style={series(4)}>
              <a
                className="btn btn-accent"
                href={`/pricing?program=${encodeURIComponent(program.slug)}`}
              >
                Get a quote
              </a>
              <a className="btn btn-secondary" href="/register">
                Create account
              </a>
            </div>
          </div>

          <figure className="program-detail__poster reveal series" style={series(2)}>
            <img src={image} alt="" loading="eager" />
            <figcaption>Program studio still</figcaption>
          </figure>
        </div>
      </RevealSection>

      <RevealSection className="program-detail__about">
        <div className="program-detail__about-panel reveal series" style={series(0)}>
          <p className="program-detail__kicker">Inside the program</p>
          <div className="prose">
            {descriptionBlocks.map((block) => (
              <p key={block.slice(0, 48)}>{block}</p>
            ))}
          </div>
        </div>
      </RevealSection>

      {curriculum.length > 0 ? (
        <RevealSection className="program-detail__curriculum">
          <p className="program-detail__kicker reveal series" style={series(0)}>
            Curriculum
          </p>
          <h2 className="program-detail__title reveal series" style={series(1)}>
            Modules and lessons
          </h2>
          <p className="program-detail__lead reveal series" style={series(2)}>
            Full lesson content unlocks after you enroll. Here is the outline you will work through.
          </p>

          <ol className="program-detail__modules">
            {curriculum.map((course, i) => (
              <li key={course.slug} className="reveal series" style={series(3 + i)}>
                <article className="program-detail__module">
                  <header>
                    <span className="program-detail__module-num">Module 0{i + 1}</span>
                    <h3>{course.title}</h3>
                    <p>{course.summary}</p>
                  </header>
                  <ol className="program-detail__lessons">
                    {course.lessons.map((lesson, li) => (
                      <li key={lesson.slug}>
                        <span>{String(li + 1).padStart(2, '0')}</span>
                        <div>
                          <strong>{lesson.title}</strong>
                          <p>{lesson.content.split('\n\n')[0]}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </article>
              </li>
            ))}
          </ol>
        </RevealSection>
      ) : null}

      <RevealSection className="program-detail__flow">
        <p className="program-detail__kicker reveal series" style={series(0)}>
          The path
        </p>
        <h2 className="program-detail__title reveal series" style={series(1)}>
          Dream → Apply → Fly
        </h2>

        <div className="program-detail__flow-mini reveal series" style={series(2)} aria-hidden="true">
          <span className="mkt-flow-mini__node">Discover</span>
          <FlowConnector />
          <span className="mkt-flow-mini__node">Apply</span>
          <FlowConnector />
          <span className="mkt-flow-mini__node">Fly</span>
        </div>

        <ol className="program-detail__chapters">
          {CHAPTERS.map((chapter, i) => (
            <li key={chapter.key} className="reveal series" style={series(3 + i)}>
              <figure className="program-detail__chapter">
                <div className="program-detail__chapter-media">
                  <img src={chapter.image} alt="" loading="lazy" />
                  <span className="program-detail__chapter-num">0{i + 1}</span>
                  <span className="program-detail__chapter-label">{chapter.label}</span>
                </div>
                <figcaption>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.caption}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <div className="cta-row reveal series" style={series(7)}>
          <a
            className="btn btn-accent"
            href={`/pricing?program=${encodeURIComponent(program.slug)}`}
          >
            Get a quote
          </a>
          <a className="btn btn-secondary" href="/how-it-works">
            How it works
          </a>
        </div>
      </RevealSection>
    </div>
  );
}
