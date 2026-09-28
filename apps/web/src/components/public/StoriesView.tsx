import { BANNERS, HOME } from '../../lib/media';
import { PublicHero } from './PublicHero';

const STORIES = [
  {
    name: 'Ananya S.',
    tag: 'Master’s · 2025',
    line: 'MSc Data Science, University of Edinburgh',
    quote: 'Placeholder quote pending family approval.',
    image: HOME.outcomesReady,
  },
  {
    name: 'Rahul V.',
    tag: 'MS · 2025',
    line: 'MS CS, Arizona State University',
    quote: 'Placeholder quote pending family approval.',
    image: HOME.pathPrograms,
  },
  {
    name: 'Ishita M.',
    tag: 'MBA · 2026',
    line: 'MBA, Georgetown McDonough',
    quote: 'Placeholder quote pending family approval.',
    image: HOME.mentors,
  },
  {
    name: 'Aditi & Rohan K.',
    tag: 'ED6E · 2026',
    line: 'ED6E family, Class 9 and Class 11',
    quote: 'Placeholder quote pending family approval.',
    image: BANNERS.parents,
  },
] as const;

export function StoriesView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Success stories"
        title="Proof, in their words."
        lead="Names abbreviated for privacy; admits verified against platform records."
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
              <blockquote>{s.quote}</blockquote>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
