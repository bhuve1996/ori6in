'use client';

import { COMPANY, OFFICE_LOCATIONS, SOCIAL_LINKS } from '@ori6in/shared';
import { BANNERS, GALLERY } from '../../lib/media';
import { LeadForm } from '../leads/LeadForm';
import { PublicHero } from './PublicHero';

export function ContactView() {
  const hq = OFFICE_LOCATIONS.find((o) => o.kind === 'headquarters') ?? OFFICE_LOCATIONS[0];
  const satellites = OFFICE_LOCATIONS.filter((o) => o.kind === 'satellite');

  return (
    <main id="main-content" className="pub">
      <PublicHero
        kicker="Contact"
        title="One line, one inbox."
        lead="One number for bookings, admissions, and guidance — every call and message reaches the team."
        image={BANNERS.pricing}
      />

      {/* Quick Contact Methods */}
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
            <h3>Visit HQ</h3>
            <p>{hq.cityShort ?? 'Jayanagar, Bengaluru'}</p>
          </article>
        </div>

        {/* Social Media Row */}
        <div className="contact-socials-bar">
          <span className="contact-socials-bar__label">Connect on social:</span>
          <div className="contact-socials-bar__links">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="contact-social-pill"
                title={`${s.name} (${s.handle})`}
              >
                <span className="contact-social-pill__icon">
                  {s.icon === 'instagram' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  )}
                  {s.icon === 'linkedin' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect x="2" y="9" width="4" height="12"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  )}
                  {s.icon === 'whatsapp' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                    </svg>
                  )}
                  {s.icon === 'youtube' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                    </svg>
                  )}
                  {s.icon === 'x' && (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                    </svg>
                  )}
                </span>
                <span className="contact-social-pill__name">{s.name}</span>
                <span className="contact-social-pill__handle">{s.handle}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Find Us Section */}
      <section className="pub-section contact-location-section">
        <div className="contact-location-header">
          <p className="type-kicker">Find us</p>
          <h2>Visit our office & centres</h2>
          <p className="type-lead">
            Drop in for a walk-in consultation, profile audit, or test prep diagnostic session.
          </p>
        </div>

        <div className="contact-location-grid">
          {/* Main Headquarters Detail Card */}
          <div className="office-card office-card--hq">
            <div className="office-card__photo">
              <img
                src={GALLERY.office}
                alt="ORI6IN Education Flagship Campus, Jayanagar Bengaluru"
                loading="lazy"
              />
              <span className="office-card__photo-badge">✦ Jayanagar 9th Block Centre</span>
            </div>
            <div className="office-card__badge">Flagship Campus & HQ</div>
            <h3>{hq.name}</h3>
            <p className="office-card__address">{hq.address}</p>

            <div className="office-card__meta">
              <div>
                <strong>Hours:</strong> {hq.hours}
              </div>
              <div>
                <strong>Direct phone:</strong>{' '}
                <a href={`tel:${hq.phone}`}>{hq.phone}</a>
              </div>
              <div>
                <strong>Direct email:</strong>{' '}
                <a href={`mailto:${hq.email}`}>{hq.email}</a>
              </div>
            </div>

            <div className="office-card__actions">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                  hq.address,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-accent"
              >
                Get Directions →
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  hq.address,
                )}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* Interactive Map Embed */}
          <div className="contact-map-wrapper">
            <iframe
              title="ORI6IN Education Headquarters Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                'Ori6in Education, 1315, 25th Main Rd, Kottapalya, Jayanagara 9th Block, Bengaluru, Karnataka 560041',
              )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '340px' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* Satellite Offices Section */}
      <section className="pub-section contact-satellites-section">
        <div className="contact-location-header">
          <p className="type-kicker">Regional Network</p>
          <h2>Satellite offices & regional desks</h2>
          <p className="type-lead">
            Students and families outside Bengaluru can connect with our dedicated regional desks for local appointments and offline counselling.
          </p>
        </div>

        <div className="satellite-grid">
          {satellites.map((sat) => (
            <article key={sat.id} className="satellite-card">
              <div className="satellite-card__top">
                <span className="satellite-card__city">{sat.city}</span>
                <span className="satellite-card__state">{sat.state}</span>
              </div>
              <h3>{sat.name}</h3>
              <p className="satellite-card__address">{sat.address}</p>

              <div className="satellite-card__meta">
                <p>
                  <strong>Timings:</strong> {sat.hours}
                </p>
                <p>
                  <strong>Desk Email:</strong>{' '}
                  <a href={`mailto:${sat.email}`}>{sat.email}</a>
                </p>
                <p>
                  <strong>Helpline:</strong>{' '}
                  <a href={`tel:${sat.phone}`}>{sat.phone}</a>
                </p>
              </div>

              <div className="satellite-card__actions">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${sat.name} ${sat.city}`,
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Locate on Map
                </a>
              </div>
            </article>
          ))}

          {/* Incoming Satellite Desks Note */}
          <div className="satellite-card satellite-card--upcoming">
            <div className="satellite-card__top">
              <span className="satellite-card__city">Pan-India Expansion</span>
              <span className="satellite-card__state">Coming Soon</span>
            </div>
            <h3>More regional desks opening soon</h3>
            <p className="satellite-card__address">
              Consultation pop-ups and satellite counselling desks scheduled for Mumbai, Delhi-NCR, Hyderabad, and Pune.
            </p>
            <p className="type-meta" style={{ marginTop: 'auto' }}>
              Online counselling sessions are available across all Indian time zones daily.
            </p>
          </div>
        </div>
      </section>

      {/* Photopedia / Campus Gallery Showcase */}
      <section className="pub-section contact-gallery-section" id="photopedia">
        <div className="contact-location-header">
          <p className="type-kicker">Photopedia · Campus Life</p>
          <h2>Inside our centres & student spaces</h2>
          <p className="type-lead">
            Modern, student-first consultation suites, test preparation diagnostic labs, and dedicated mentor spaces.
          </p>
        </div>

        <div className="contact-gallery-grid">
          {/* Main Featured Office Image */}
          <div className="gallery-featured-card">
            <img
              src={GALLERY.office}
              alt="ORI6IN Education Flagship Campus, Jayanagar Bengaluru"
              className="gallery-featured-card__img"
              loading="lazy"
            />
            <div className="gallery-featured-card__overlay">
              <span className="gallery-featured-card__badge">✦ Flagship Campus & Headquarters</span>
              <h3 className="gallery-featured-card__title">ORI6IN Education Flagship Campus</h3>
              <p className="gallery-featured-card__desc">
                1315, 25th Main Road, 9th Block Jayanagar, Bengaluru. Open 6 days a week for in-person profile reviews, test prep coaching, and parent sessions.
              </p>
            </div>
          </div>

          {/* Side Cards: Space Highlights & Events Ready */}
          <div className="gallery-side-col">
            <div className="gallery-info-card">
              <span className="gallery-info-card__tag">Spaces & Facilities</span>
              <h4>Diagnostic Labs & 1-on-1 Suites</h4>
              <p>
                Acoustically treated diagnostic testing cabins for IELTS, TOEFL, and GRE mocks, paired with private breakout rooms for confidential family counselling.
              </p>
            </div>

            <div className="gallery-info-card">
              <span className="gallery-info-card__tag">Events & Workshops</span>
              <h4>University Roundtables & Masterclasses</h4>
              <p>
                Hosting regular university delegation meets, alumni admit panels, and Visa Day preparation workshops throughout the year.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="pub-section">
        <div className="contact-location-header" style={{ marginBottom: '1.25rem' }}>
          <p className="type-kicker">Direct Inquiry</p>
          <h2>Send us a message</h2>
        </div>
        <LeadForm kind="contact" />
      </section>
    </main>
  );
}
