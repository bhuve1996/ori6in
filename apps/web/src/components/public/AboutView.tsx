'use client';

import { COMPANY } from '@ori6in/shared';
import { BANNERS } from '../../lib/media';
import { PublicHero } from './PublicHero';

export function AboutView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="About ORI6IN"
        title={COMPANY.tagline}
        lead="ORI6IN Education Private Limited — formerly Haridhi Education Consultancy — is Bengaluru-based. Every product carries the 6: ED6E builds profiles from Class 8 upward, BRI6GE carries college students toward a master’s abroad, and 6LOBAL (by Edumillenia) counsels students through the applications."
        image={BANNERS.about}
      >
        <p className="type-lead" style={{ marginTop: '0.85rem' }}>
          Every student has one record with one counsellor. Commission and partner arrangements never shape the
          advice.
        </p>
        <p className="type-lead" style={{ marginTop: '0.85rem' }}>
          Technology makes counsellors faster, never replaces them. Every automated output passes through a human
          first.
        </p>
      </PublicHero>

      <section className="navy-cta">
        <h2>{COMPANY.legalName}</h2>
        <p>{COMPANY.address}</p>
        <p>
          {COMPANY.founderTitle}: {COMPANY.founder}
        </p>
        <p>
          <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phoneDisplay}</a> ·{' '}
          <a href={COMPANY.whatsappUrl}>WhatsApp</a> · <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
        </p>
      </section>

      <section className="pub-section">
        <h2>What we will not do</h2>
        <div className="pub-cards pub-cards--3">
          <article>
            <h3>No hidden incentives</h3>
            <p>Commission and partner arrangements never influence which university we recommend.</p>
          </article>
          <article>
            <h3>No outcome promises</h3>
            <p>No one — human or AI — promises a visa or an admit.</p>
          </article>
          <article>
            <h3>No personal spreadsheets</h3>
            <p>Your details stay with ORI6IN — counsellors cannot take student lists with them.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
