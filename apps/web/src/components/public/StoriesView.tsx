import { BANNERS, HOME } from '../../lib/media';
import { PublicHero } from './PublicHero';

type Story = { name: string; tag: string; line: string; image: string; quote?: string };

const STORIES: Story[] = [
  {
    name: 'Ananya S.',
    tag: 'Master’s · 2025',
    line: 'MSc Data Science, University of Edinburgh',
    image: HOME.outcomesReady,
  },
  {
    name: 'Rahul V.',
    tag: 'MS · 2025',
    line: 'MS CS, Arizona State University',
    image: HOME.pathPrograms,
  },
  {
    name: 'Ishita M.',
    tag: 'MBA · 2026',
    line: 'MBA, Georgetown McDonough',
    image: HOME.mentors,
  },
  {
    name: 'Aditi & Rohan K.',
    tag: 'ED6E · 2026',
    line: 'ED6E family, Class 9 and Class 11',
    image: BANNERS.parents,
  },
];

export function StoriesView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Success stories"
        title="Proof, in their words."
        lead="Names shortened for privacy."
        image={BANNERS.mentors}
      />
      <section className="pub-section">
        <div className="pub-cards pub-cards--3">
          {STORIES.map((s) => (
            <article key={s.name}>
              <img className="pub-card-media" src={s.image} alt="" />
              <p className="type-meta">{s.tag}</p>
              <h3>{s.name}</h3>
              <p>{s.line}</p>
              {s.quote ? <blockquote>{s.quote}</blockquote> : null}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
