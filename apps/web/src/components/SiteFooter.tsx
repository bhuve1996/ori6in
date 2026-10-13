'use client';

import { COMPANY, FOOTER_ACCOUNTS, FOOTER_COMPANY, FOOTER_PROGRAMMES, SOCIAL_LINKS } from '@ori6in/shared';
import { usePathname } from 'next/navigation';
import { BRAND } from '../lib/media';
import { isPortalChromePath } from '../lib/routes';
import { useLead } from './leads/LeadContext';
import { goldSixNodes } from './public/GoldSix';

export function SiteFooter() {
  const pathname = usePathname();
  const { openLead } = useLead();
  const compact = isPortalChromePath(pathname);

  if (compact) {
    return (
      <footer className="site-footer">
        <div className="site-footer__inner">
          <p className="site-footer__copy">
            © {COMPANY.copyrightYear} {COMPANY.legalName}
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__col">
          <div className="site-footer__brand-block">
            <img src={BRAND.owl} alt="" width={40} height={40} className="site-footer__owl" />
            <p className="site-footer__name">
              <img
                className="site-footer__logo"
                src={BRAND.logoDark}
                alt="ORI6IN"
                width={160}
                height={40}
              />
            </p>
          </div>
          <p className="site-footer__tagline">{COMPANY.tagline}</p>

          <div className="site-footer__connect-section">
            <span className="site-footer__connect-title">Direct Contact</span>
            <div className="site-footer__direct-links">
              <a
                href={`tel:${COMPANY.phoneTel}`}
                className="site-footer__direct-pill"
                title="Call our desk"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{COMPANY.phoneDisplay}</span>
              </a>

              <a
                href={`mailto:${COMPANY.email}`}
                className="site-footer__direct-pill"
                title="Send us an email"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>{COMPANY.email}</span>
              </a>
            </div>

            <span className="site-footer__connect-title" style={{ marginTop: '0.65rem' }}>
              Connect & Follow
            </span>
            <div className="site-footer__socials" aria-label="Social media channels">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="site-footer__social-pill"
                  title={`${item.name} (${item.handle})`}
                >
                  <span className="site-footer__social-icon">
                    {item.icon === 'whatsapp' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                      </svg>
                    )}
                    {item.icon === 'instagram' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                      </svg>
                    )}
                    {item.icon === 'linkedin' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                        <rect x="2" y="9" width="4" height="12"/>
                        <circle cx="4" cy="4" r="2"/>
                      </svg>
                    )}
                    {item.icon === 'youtube' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                      </svg>
                    )}
                    {item.icon === 'x' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                      </svg>
                    )}
                  </span>
                  <span className="site-footer__social-name">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <nav className="site-footer__col" aria-label="Programmes">
          <h2>Programmes</h2>
          {FOOTER_PROGRAMMES.map((link) => (
            <a key={link.href} href={link.href}>
              {goldSixNodes(link.label)}
            </a>
          ))}
        </nav>
        <nav className="site-footer__col" aria-label="Company">
          <h2>Company</h2>
          {FOOTER_COMPANY.map((link) => (
            <a key={link.href} href={link.href}>
              {goldSixNodes(link.label)}
            </a>
          ))}
        </nav>
        <nav className="site-footer__col" aria-label="Accounts">
          <h2>Accounts</h2>
          {FOOTER_ACCOUNTS.map((link) => (
            <a key={link.label} href={link.href}>
              {goldSixNodes(link.label)}
            </a>
          ))}
        </nav>
      </div>
      <p className="site-footer__legal">
        © {COMPANY.copyrightYear} {COMPANY.legalName} (formerly {COMPANY.formerName}) · {COMPANY.address}{' '}
        · {goldSixNodes(COMPANY.brandsLegal)} · CIN {COMPANY.cin}
      </p>
    </footer>
  );
}
