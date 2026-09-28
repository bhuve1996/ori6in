'use client';

import { COMPANY } from '@ori6in/shared';
import { BANNERS } from '../../lib/media';
import { LeadForm } from '../leads/LeadForm';
import { PublicHero } from './PublicHero';

export function ContactView() {
  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Contact"
        title="One line, one inbox."
        lead="Sales, payments and support all route through the central line and team inbox; counsellor personal numbers never appear anywhere."
        image={BANNERS.pricing}
      />
      <section className="pub-section">
        <div className="pub-cards pub-cards--4">
          <article>
            <h3>Central line</h3>
            <p>
              <a href={`tel:${COMPANY.phoneTel}`}>{COMPANY.phoneDisplay}</a>
            </p>
          </article>
          <article>
            <h3>WhatsApp</h3>
            <p>
              <a href={COMPANY.whatsappUrl} target="_blank" rel="noreferrer">
                Message us
              </a>
            </p>
          </article>
          <article>
            <h3>Email</h3>
            <p>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </p>
          </article>
          <article>
            <h3>Visit</h3>
            <p>{COMPANY.address}</p>
          </article>
        </div>
      </section>
      <section className="pub-section">
        <LeadForm kind="contact" />
      </section>
    </main>
  );
}
