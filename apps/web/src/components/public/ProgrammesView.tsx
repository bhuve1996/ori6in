import { BANNERS, HOME } from '../../lib/media';
import { PublicHero } from './PublicHero';

export function ProgrammesView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Programmes"
        title="Four product lines. One counsellor, one plan."
        lead="Profile building from Class 8 (ED6E), the college-years runway (BRI6GE), admission counselling for study abroad (6LOBAL), and every test the journey needs (6RIP) — quoted per family, never listed on a rate card."
        image={BANNERS.programs}
      />
      <section className="pub-section">
        <div className="pub-cards pub-cards--4">
          <article>
            <img className="pub-card-media" src={HOME.pathPrograms} alt="" />
            <h3>01 ED6E</h3>
            <p>Profile building, Class 8–12 — multi-year programme, monthly parent letter, compounding profile.</p>
            <a href="/ed6e">Explore ED6E</a>
          </article>
          <article>
            <img className="pub-card-media" src={HOME.internships} alt="" />
            <h3>02 BRI6GE</h3>
            <p>The college years, UG Year 1–3 — the bridge from an Indian UG degree to a global master’s.</p>
            <a href="/bri6ge">Explore BRI6GE</a>
          </article>
          <article>
            <img className="pub-card-media" src={BANNERS.programs} alt="" />
            <h3>03 6LOBAL</h3>
            <p>Admission counselling, UG/MS/MBA/PhD — one counsellor from first call to departure.</p>
            <a href="/study-abroad">Explore 6LOBAL</a>
          </article>
          <article>
            <img className="pub-card-media" src={BANNERS.blog} alt="" />
            <h3>04 6RIP</h3>
            <p>Test preparation — IELTS · TOEFL · GRE · GMAT · SAT · German · dMAT.</p>
            <a href="/test-prep">Explore 6RIP</a>
          </article>
        </div>
      </section>
      <section className="pub-note pub-section">
        <h2>Combinations — Bundles</h2>
        <p>Tests and counselling quoted together as one plan.</p>
        <a className="btn btn-accent" href="/test-prep#bundles">
          See bundles
        </a>
      </section>
    </main>
  );
}
