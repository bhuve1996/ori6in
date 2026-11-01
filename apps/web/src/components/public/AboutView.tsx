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
        lead="ORI6IN Education Private Limited — formerly Haridhi Education Consultancy — is Bengaluru-based. Every product carries the 6: ED6E builds profiles from Class 8 upward, BRID6E carries college students toward a master’s abroad, and 6LOBAL (by Edumillenia) counsels students through the applications."
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

      <section className="pub-section">
        <h2>Leadership</h2>
        <div className="pub-cards pub-cards--2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <article>
            <p className="type-kicker">{COMPANY.founderTitle}</p>
            <h3>{COMPANY.founder}</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '0.35rem' }}>
              <a href={`tel:${COMPANY.founderPhoneTel}`}>{COMPANY.founderPhoneDisplay}</a> ·{' '}
              <a href={COMPANY.founderWhatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </p>
            <p>
              <a href={`mailto:${COMPANY.founderEmail}`}>{COMPANY.founderEmail}</a>
            </p>
          </article>
          <article>
            <p className="type-kicker">{COMPANY.executiveDirectorTitle}</p>
            <h3>{COMPANY.executiveDirector}</h3>
            <p style={{ marginTop: '0.5rem', marginBottom: '0.35rem' }}>
              <a href={`tel:${COMPANY.executiveDirectorPhoneTel}`}>{COMPANY.executiveDirectorPhoneDisplay}</a> ·{' '}
              <a href={COMPANY.executiveDirectorWhatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </p>
            <p>
              <a href={`mailto:${COMPANY.executiveDirectorEmail}`}>{COMPANY.executiveDirectorEmail}</a>
            </p>
          </article>
        </div>
      </section>

      <section className="navy-cta">
        <h2>{COMPANY.legalName}</h2>
        <p>{COMPANY.address}</p>
        <p style={{ margin: '0.75rem 0 0.5rem' }}>
          <strong>General inquiries:</strong> <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
          {' · '}
          <strong>Partnerships:</strong> <a href={`mailto:${COMPANY.partnershipsEmail}`}>{COMPANY.partnershipsEmail}</a>
        </p>
        <p style={{ margin: 0 }}>
          Central Desk: <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phoneDisplay}</a> ·{' '}
          <a href={COMPANY.whatsappUrl} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
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
